import json

EXCHANGE_RATES = {
    'USDTRUB': 97.5,
    'USDTUAH': 41.2,
    'USDTEUR': 0.92,
    'USDTUSD': 1.0,
    'USDTKZT': 465.0,
    'BTCUSDT': 98500.0,
    'ETHUSDT': 3420.0,
    'TRXUSDT': 0.22,
    'USDCUSDT': 1.0,
    'XRPUSDT': 2.45,
    'TONUSDT': 5.8,
}

RESERVES = {
    'USDT_TRC20': 1000000,
    'USDT_BEP20': 500000,
    'USDT_ERC20': 300000,
    'USDT_ARBITRUM': 200000,
    'USDT_TON': 150000,
    'USDT_POLYGON': 100000,
    'BTC': 50,
    'ETH': 500,
    'ETH_ARBITRUM': 300,
    'ETH_BEP20': 200,
    'TRX': 5000000,
    'USDC_ERC20': 500000,
    'USDC_SOL': 300000,
    'USDC_POLYGON': 200000,
    'XRP': 1000000,
    'TON': 500000,
    'SBP_RUB': 10000000,
    'TINKOFF_RUB': 5000000,
    'VTB_RUB': 5000000,
    'PSB_RUB': 3000000,
    'SBER_RUB': 8000000,
    'ALFA_RUB': 4000000,
    'RAIF_RUB': 3000000,
    'POCHTA_RUB': 2000000,
    'MTS_RUB': 2000000,
    'GAZPROM_RUB': 4000000,
}

MIN_AMOUNTS = {
    'USDT': 10,
    'BTC': 0.001,
    'ETH': 0.01,
    'TRX': 100,
    'USDC': 10,
    'XRP': 10,
    'TON': 10,
    'RUB': 1000,
    'UAH': 500,
    'EUR': 10,
    'USD': 10,
    'KZT': 5000,
}

MAX_AMOUNTS = {
    'USDT': 100000,
    'BTC': 10,
    'ETH': 100,
    'TRX': 1000000,
    'USDC': 100000,
    'XRP': 100000,
    'TON': 50000,
    'RUB': 5000000,
    'UAH': 1000000,
    'EUR': 50000,
    'USD': 50000,
    'KZT': 20000000,
}

def handler(event: dict, context) -> dict:
    '''API для получения курсов обмена валют и криптовалют'''
    
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': ''
        }
    
    if method == 'GET':
        response_data = {
            'rates': EXCHANGE_RATES,
            'reserves': RESERVES,
            'minAmounts': MIN_AMOUNTS,
            'maxAmounts': MAX_AMOUNTS,
            'timestamp': context.request_id
        }
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps(response_data, ensure_ascii=False)
        }
    
    return {
        'statusCode': 405,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({'error': 'Method not allowed'})
    }
