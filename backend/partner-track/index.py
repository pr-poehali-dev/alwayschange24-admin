import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime

def get_db_connection():
    return psycopg2.connect(os.environ['DATABASE_URL'])

def handler(event: dict, context) -> dict:
    '''API для отслеживания партнёрских переходов и установки cookies'''
    
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Credentials': 'true'
            },
            'body': ''
        }
    
    if method == 'GET':
        params = event.get('queryStringParameters', {}) or {}
        partner_id = params.get('ref', '')
        exchange_direction = params.get('direction', '')
        city = params.get('city', '')
        language = params.get('lang', 'ru')
        
        if not partner_id:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Partner ID is required'})
            }
        
        request_context = event.get('requestContext', {})
        identity = request_context.get('identity', {})
        ip_address = identity.get('sourceIp', '')
        user_agent = event.get('headers', {}).get('user-agent', '')
        
        conn = get_db_connection()
        try:
            with conn.cursor() as cur:
                schema = os.environ.get('MAIN_DB_SCHEMA', 'public')
                cur.execute(f'''
                    INSERT INTO {schema}.partner_clicks 
                    (partner_id, ip_address, user_agent, exchange_direction, city, language, clicked_at)
                    VALUES (%s, %s, %s, %s, %s, %s, %s)
                ''', (partner_id, ip_address, user_agent, exchange_direction, city, language, datetime.utcnow()))
                conn.commit()
            
            cookie_value = f'partner_id={partner_id}; Max-Age=31536000; Path=/; SameSite=Lax'
            
            response_body = {
                'success': True,
                'partnerId': partner_id,
                'direction': exchange_direction,
                'city': city,
                'language': language
            }
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': 'true',
                    'X-Set-Cookie': cookie_value
                },
                'body': json.dumps(response_body, ensure_ascii=False)
            }
        
        except Exception as e:
            conn.rollback()
            return {
                'statusCode': 500,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': str(e)})
            }
        finally:
            conn.close()
    
    return {
        'statusCode': 405,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({'error': 'Method not allowed'})
    }
