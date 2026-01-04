import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
import hashlib
from datetime import datetime

def get_db_connection():
    return psycopg2.connect(os.environ['DATABASE_URL'])

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def handler(event: dict, context) -> dict:
    '''API для управления партнёрским кабинетом'''
    
    method = event.get('httpMethod', 'GET')
    path_params = event.get('pathParams', {}) or {}
    action = path_params.get('action', '')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Authorization'
            },
            'body': ''
        }
    
    conn = get_db_connection()
    schema = os.environ.get('MAIN_DB_SCHEMA', 'public')
    
    try:
        if method == 'POST' and action == 'register':
            data = json.loads(event.get('body', '{}'))
            partner_id = data.get('partnerId')
            email = data.get('email')
            password = data.get('password')
            
            if not all([partner_id, email, password]):
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Missing required fields'})
                }
            
            password_hash = hash_password(password)
            
            with conn.cursor() as cur:
                cur.execute(f'''
                    INSERT INTO {schema}.partners (partner_id, email, password_hash)
                    VALUES (%s, %s, %s)
                    RETURNING id, partner_id, email, balance, total_earned, created_at
                ''', (partner_id, email, password_hash))
                result = cur.fetchone()
                conn.commit()
                
                return {
                    'statusCode': 201,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({
                        'id': result[0],
                        'partnerId': result[1],
                        'email': result[2],
                        'balance': float(result[3]),
                        'totalEarned': float(result[4]),
                        'createdAt': result[5].isoformat()
                    }, ensure_ascii=False)
                }
        
        elif method == 'POST' and action == 'login':
            data = json.loads(event.get('body', '{}'))
            partner_id = data.get('partnerId')
            password = data.get('password')
            
            if not all([partner_id, password]):
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Missing credentials'})
                }
            
            password_hash = hash_password(password)
            
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute(f'''
                    SELECT id, partner_id, email, balance, total_earned, created_at
                    FROM {schema}.partners
                    WHERE partner_id = %s AND password_hash = %s
                ''', (partner_id, password_hash))
                partner = cur.fetchone()
                
                if not partner:
                    return {
                        'statusCode': 401,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Invalid credentials'})
                    }
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({
                        'id': partner['id'],
                        'partnerId': partner['partner_id'],
                        'email': partner['email'],
                        'balance': float(partner['balance']),
                        'totalEarned': float(partner['total_earned']),
                        'createdAt': partner['created_at'].isoformat()
                    }, ensure_ascii=False)
                }
        
        elif method == 'GET' and action == 'stats':
            params = event.get('queryStringParameters', {}) or {}
            partner_id = params.get('partnerId')
            
            if not partner_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Partner ID required'})
                }
            
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute(f'''
                    SELECT COUNT(*) as total_clicks
                    FROM {schema}.partner_clicks
                    WHERE partner_id = %s
                ''', (partner_id,))
                clicks_data = cur.fetchone()
                
                cur.execute(f'''
                    SELECT 
                        COUNT(*) as total_exchanges,
                        COALESCE(SUM(partner_reward), 0) as total_rewards,
                        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_exchanges
                    FROM {schema}.exchanges
                    WHERE partner_id = %s
                ''', (partner_id,))
                exchanges_data = cur.fetchone()
                
                cur.execute(f'''
                    SELECT 
                        COUNT(*) as total_payouts,
                        COALESCE(SUM(amount), 0) as total_paid
                    FROM {schema}.partner_payouts
                    WHERE partner_id = %s AND status = 'completed'
                ''', (partner_id,))
                payouts_data = cur.fetchone()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({
                        'totalClicks': clicks_data['total_clicks'],
                        'totalExchanges': exchanges_data['total_exchanges'],
                        'completedExchanges': exchanges_data['completed_exchanges'],
                        'totalRewards': float(exchanges_data['total_rewards']),
                        'totalPayouts': payouts_data['total_payouts'],
                        'totalPaid': float(payouts_data['total_paid'])
                    }, ensure_ascii=False)
                }
        
        elif method == 'GET' and action == 'earnings':
            params = event.get('queryStringParameters', {}) or {}
            partner_id = params.get('partnerId')
            
            if not partner_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Partner ID required'})
                }
            
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute(f'''
                    SELECT 
                        order_id, from_currency, to_currency, 
                        give_amount, receive_amount, partner_reward,
                        status, completed_at
                    FROM {schema}.exchanges
                    WHERE partner_id = %s
                    ORDER BY created_at DESC
                    LIMIT 100
                ''', (partner_id,))
                earnings = cur.fetchall()
                
                earnings_list = [{
                    'orderId': e['order_id'],
                    'fromCurrency': e['from_currency'],
                    'toCurrency': e['to_currency'],
                    'giveAmount': float(e['give_amount']),
                    'receiveAmount': float(e['receive_amount']),
                    'reward': float(e['partner_reward']),
                    'status': e['status'],
                    'completedAt': e['completed_at'].isoformat() if e['completed_at'] else None
                } for e in earnings]
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'earnings': earnings_list}, ensure_ascii=False)
                }
        
        elif method == 'POST' and action == 'payout':
            data = json.loads(event.get('body', '{}'))
            partner_id = data.get('partnerId')
            amount = data.get('amount')
            payment_method = data.get('paymentMethod')
            payment_details = data.get('paymentDetails')
            
            if not all([partner_id, amount]):
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Missing required fields'})
                }
            
            with conn.cursor() as cur:
                cur.execute(f'''
                    SELECT balance FROM {schema}.partners WHERE partner_id = %s
                ''', (partner_id,))
                result = cur.fetchone()
                
                if not result or float(result[0]) < float(amount):
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Insufficient balance'})
                    }
                
                cur.execute(f'''
                    INSERT INTO {schema}.partner_payouts 
                    (partner_id, amount, payment_method, payment_details, status, requested_at)
                    VALUES (%s, %s, %s, %s, %s, %s)
                    RETURNING id
                ''', (partner_id, amount, payment_method, payment_details, 'pending', datetime.utcnow()))
                payout_id = cur.fetchone()[0]
                
                cur.execute(f'''
                    UPDATE {schema}.partners 
                    SET balance = balance - %s
                    WHERE partner_id = %s
                ''', (amount, partner_id))
                
                conn.commit()
                
                return {
                    'statusCode': 201,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'payoutId': payout_id, 'status': 'pending'}, ensure_ascii=False)
                }
        
        return {
            'statusCode': 404,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Endpoint not found'})
        }
    
    except Exception as e:
        conn.rollback()
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)})
        }
    finally:
        conn.close()
