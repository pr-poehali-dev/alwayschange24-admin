import xml.etree.ElementTree as ET
from xml.dom import minidom

CURRENCY_CODES = {
    'USDT_TRC20': 'USDTTRC',
    'USDT_BEP20': 'USDTBEP',
    'USDT_ERC20': 'USDTERC',
    'USDT_ARBITRUM': 'USDTARB',
    'USDT_TON': 'USDTTON',
    'USDT_POLYGON': 'USDTMATIC',
    'BTC': 'BTC',
    'ETH': 'ETH',
    'ETH_ARBITRUM': 'ETHARB',
    'ETH_BEP20': 'ETHBSC',
    'TRX': 'TRX',
    'USDC_ERC20': 'USDCERC',
    'USDC_SOL': 'USDCSOL',
    'USDC_POLYGON': 'USDCMATIC',
    'XRP': 'XRP',
    'TON': 'TON',
    'SBP_RUB': 'SBRFR',
    'TINKOFF_RUB': 'TCSBRUB',
    'VTB_RUB': 'VTBRUB',
    'PSB_RUB': 'PSBRUB',
    'SBER_RUB': 'SBERRUB',
    'ALFA_RUB': 'ALFABRUB',
    'RAIF_RUB': 'RFBRUB',
    'POCHTA_RUB': 'POCHTARUB',
    'MTS_RUB': 'MTSRUB',
    'GAZPROM_RUB': 'GAZPRUB',
    'MONO_UAH': 'MONOUAH',
    'PRIVAT_UAH': 'PRIVAT24',
    'ABANK_UAH': 'ABUAH',
    'PUMB_UAH': 'PUMBUAH',
    'IZI_UAH': 'IZIUAH',
    'SENSE_UAH': 'SENSEUAH',
    'TRANSFER_UAH': 'BTRUAH',
    'CARD_EUR': 'CAREUR',
    'REVOLUT_EUR': 'REVOLUCEUR',
    'WISE_EUR': 'WISEEUR',
    'PAYSERA_EUR': 'PAYSERAEUR',
    'SEPA_EUR': 'SEPA',
    'REVOLUT_USD': 'REVOLUTUSD',
    'WISE_USD': 'WISEUSD',
    'CARD_USD': 'CARUSD',
    'KASPI_KZT': 'KASPIKZT',
    'HALYK_KZT': 'HALYKKZT',
    'JUSAN_KZT': 'JUSANKZT',
    'ALTYN_KZT': 'ALTYNKZT',
    'FREEDOM_KZT': 'FREEDOMKZT',
}

EXCHANGE_RATES = {
    'USDT_TRC20': 1.0,
    'BTC': 98500.0,
    'ETH': 3420.0,
    'TRX': 0.22,
    'XRP': 2.45,
    'TON': 5.8,
    'SBP_RUB': 0.01,
    'TINKOFF_RUB': 0.01,
    'MONO_UAH': 0.025,
    'CARD_EUR': 1.1,
    'REVOLUT_USD': 1.0,
    'KASPI_KZT': 0.0022,
}

RESERVES = {
    'USDT_TRC20': 1000000,
    'BTC': 50,
    'ETH': 500,
    'SBP_RUB': 10000000,
    'TINKOFF_RUB': 5000000,
}

MIN_AMOUNTS = {
    'USDT_TRC20': 10,
    'BTC': 0.001,
    'ETH': 0.01,
    'SBP_RUB': 1000,
}

MAX_AMOUNTS = {
    'USDT_TRC20': 100000,
    'BTC': 10,
    'ETH': 100,
    'SBP_RUB': 5000000,
}

def create_exchange_item(from_curr: str, to_curr: str) -> ET.Element:
    item = ET.Element('item')
    
    from_code = CURRENCY_CODES.get(from_curr, from_curr)
    to_code = CURRENCY_CODES.get(to_curr, to_curr)
    
    from_rate = EXCHANGE_RATES.get(from_curr, 1.0)
    to_rate = EXCHANGE_RATES.get(to_curr, 1.0)
    
    ET.SubElement(item, 'from').text = from_code
    ET.SubElement(item, 'to').text = to_code
    ET.SubElement(item, 'in').text = '1'
    ET.SubElement(item, 'out').text = str(round(from_rate / to_rate, 8))
    ET.SubElement(item, 'amount').text = str(RESERVES.get(to_curr, 100000))
    ET.SubElement(item, 'minamount').text = str(MIN_AMOUNTS.get(from_curr, 10))
    ET.SubElement(item, 'maxamount').text = str(MAX_AMOUNTS.get(from_curr, 100000))
    
    return item

def handler(event: dict, context) -> dict:
    '''API для экспорта курсов обмена в XML-формате'''
    
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
        root = ET.Element('rates')
        
        crypto_currencies = ['USDT_TRC20', 'USDT_BEP20', 'BTC', 'ETH', 'TRX', 'XRP', 'TON']
        fiat_methods = ['SBP_RUB', 'TINKOFF_RUB', 'VTB_RUB', 'MONO_UAH', 'PRIVAT_UAH', 'CARD_EUR', 'REVOLUT_USD', 'KASPI_KZT']
        
        for crypto in crypto_currencies:
            for fiat in fiat_methods:
                root.append(create_exchange_item(crypto, fiat))
                root.append(create_exchange_item(fiat, crypto))
        
        xml_string = ET.tostring(root, encoding='unicode')
        pretty_xml = minidom.parseString(xml_string).toprettyxml(indent="  ")
        
        lines = [line for line in pretty_xml.split('\n') if line.strip()]
        formatted_xml = '\n'.join(lines)
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/xml',
                'Access-Control-Allow-Origin': '*',
                'Content-Disposition': 'attachment; filename="rates.xml"'
            },
            'body': formatted_xml
        }
    
    return {
        'statusCode': 405,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': '{"error": "Method not allowed"}'
    }
