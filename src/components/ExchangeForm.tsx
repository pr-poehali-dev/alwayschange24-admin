import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';

const CRYPTO_CURRENCIES = [
  { value: 'USDT_TRC20', label: 'Tether TRC20 (USDT)', icon: '₮' },
  { value: 'USDT_BEP20', label: 'Tether BEP20 (USDT)', icon: '₮' },
  { value: 'USDT_ERC20', label: 'Tether ERC20 (USDT)', icon: '₮' },
  { value: 'USDT_ARBITRUM', label: 'Tether ARBITRUM (USDT)', icon: '₮' },
  { value: 'USDT_TON', label: 'Tether TON (USDT)', icon: '₮' },
  { value: 'USDT_POLYGON', label: 'Tether POLYGON (USDT)', icon: '₮' },
  { value: 'BTC', label: 'Bitcoin (BTC)', icon: '₿' },
  { value: 'ETH', label: 'Ethereum (ETH)', icon: 'Ξ' },
  { value: 'ETH_ARBITRUM', label: 'Ethereum ARBITRUM (ETH)', icon: 'Ξ' },
  { value: 'ETH_BEP20', label: 'Ethereum BEP20 (ETH)', icon: 'Ξ' },
  { value: 'TRX', label: 'Tron (TRX)', icon: 'T' },
  { value: 'USDC_ERC20', label: 'USDC ERC20 (USDC)', icon: 'Ⓤ' },
  { value: 'USDC_SOL', label: 'USDC SOL (USDC)', icon: 'Ⓤ' },
  { value: 'USDC_POLYGON', label: 'USDC POLYGON (USDC)', icon: 'Ⓤ' },
  { value: 'XRP', label: 'Ripple (XRP)', icon: '✕' },
  { value: 'TON', label: 'Toncoin (TON)', icon: '💎' },
];

const FIAT_CURRENCIES = {
  RUB: [
    { value: 'SBP_RUB', label: 'СБП (RUB)', icon: '🇷🇺' },
    { value: 'TINKOFF_RUB', label: 'Тинькофф (RUB)', icon: '🇷🇺' },
    { value: 'VTB_RUB', label: 'ВТБ (RUB)', icon: '🇷🇺' },
    { value: 'PSB_RUB', label: 'Промсвязьбанк (RUB)', icon: '🇷🇺' },
    { value: 'SBER_RUB', label: 'Сбербанк (RUB)', icon: '🇷🇺' },
    { value: 'ALFA_RUB', label: 'Альфа-банк (RUB)', icon: '🇷🇺' },
    { value: 'RAIF_RUB', label: 'Райффайзенбанк (RUB)', icon: '🇷🇺' },
    { value: 'POCHTA_RUB', label: 'Почта Банк (RUB)', icon: '🇷🇺' },
    { value: 'MTS_RUB', label: 'МТС Банк (RUB)', icon: '🇷🇺' },
    { value: 'GAZPROM_RUB', label: 'Газпромбанк (RUB)', icon: '🇷🇺' },
  ],
  UAH: [
    { value: 'MONO_UAH', label: 'Монобанк (UAH)', icon: '🇺🇦' },
    { value: 'PRIVAT_UAH', label: 'Приват24 (UAH)', icon: '🇺🇦' },
    { value: 'ABANK_UAH', label: 'А-Банк (UAH)', icon: '🇺🇦' },
    { value: 'PUMB_UAH', label: 'Пумб (UAH)', icon: '🇺🇦' },
    { value: 'IZI_UAH', label: 'Izibank (UAH)', icon: '🇺🇦' },
    { value: 'SENSE_UAH', label: 'Sense (UAH)', icon: '🇺🇦' },
    { value: 'TRANSFER_UAH', label: 'Bank Transfer (UAH)', icon: '🇺🇦' },
  ],
  EUR: [
    { value: 'CARD_EUR', label: 'Visa/MasterCard (EUR)', icon: '🇪🇺' },
    { value: 'REVOLUT_EUR', label: 'Revolut (EUR)', icon: '🇪🇺' },
    { value: 'WISE_EUR', label: 'Wise (EUR)', icon: '🇪🇺' },
    { value: 'PAYSERA_EUR', label: 'Paysera (EUR)', icon: '🇪🇺' },
    { value: 'SEPA_EUR', label: 'SEPA (EUR)', icon: '🇪🇺' },
  ],
  USD: [
    { value: 'REVOLUT_USD', label: 'Revolut (USD)', icon: '🇺🇸' },
    { value: 'WISE_USD', label: 'Wise (USD)', icon: '🇺🇸' },
    { value: 'CARD_USD', label: 'Visa/MasterCard (USD)', icon: '🇺🇸' },
  ],
  KZT: [
    { value: 'KASPI_KZT', label: 'Kaspi Bank (KZT)', icon: '🇰🇿' },
    { value: 'HALYK_KZT', label: 'Halyk Bank (KZT)', icon: '🇰🇿' },
    { value: 'JUSAN_KZT', label: 'Jusan Bank (KZT)', icon: '🇰🇿' },
    { value: 'ALTYN_KZT', label: 'Altyn Bank (KZT)', icon: '🇰🇿' },
    { value: 'FREEDOM_KZT', label: 'Freedom Bank (KZT)', icon: '🇰🇿' },
  ],
};

const EXCHANGE_RATES: { [key: string]: number } = {
  USDT_TRC20: 1.0,
  USDT_BEP20: 1.0,
  USDT_ERC20: 1.0,
  USDT_ARBITRUM: 1.0,
  USDT_TON: 1.0,
  USDT_POLYGON: 1.0,
  BTC: 98500,
  ETH: 3420,
  ETH_ARBITRUM: 3420,
  ETH_BEP20: 3420,
  TRX: 0.22,
  USDC_ERC20: 1.0,
  USDC_SOL: 1.0,
  USDC_POLYGON: 1.0,
  XRP: 2.45,
  TON: 5.8,
  SBP_RUB: 0.01,
  TINKOFF_RUB: 0.01,
  VTB_RUB: 0.01,
  PSB_RUB: 0.01,
  SBER_RUB: 0.01,
  ALFA_RUB: 0.01,
  RAIF_RUB: 0.01,
  POCHTA_RUB: 0.01,
  MTS_RUB: 0.01,
  GAZPROM_RUB: 0.01,
  MONO_UAH: 0.025,
  PRIVAT_UAH: 0.025,
  ABANK_UAH: 0.025,
  PUMB_UAH: 0.025,
  IZI_UAH: 0.025,
  SENSE_UAH: 0.025,
  TRANSFER_UAH: 0.025,
  CARD_EUR: 1.1,
  REVOLUT_EUR: 1.1,
  WISE_EUR: 1.1,
  PAYSERA_EUR: 1.1,
  SEPA_EUR: 1.1,
  REVOLUT_USD: 1.0,
  WISE_USD: 1.0,
  CARD_USD: 1.0,
  KASPI_KZT: 0.0022,
  HALYK_KZT: 0.0022,
  JUSAN_KZT: 0.0022,
  ALTYN_KZT: 0.0022,
  FREEDOM_KZT: 0.0022,
};

interface ExchangeFormProps {
  onSubmit: (formData: any) => void;
}

export default function ExchangeForm({ onSubmit }: ExchangeFormProps) {
  const [fromCurrency, setFromCurrency] = useState('');
  const [toCurrency, setToCurrency] = useState('');
  const [giveAmount, setGiveAmount] = useState('');
  const [receiveAmount, setReceiveAmount] = useState('');
  const [contactData, setContactData] = useState({
    phone: '',
    cardNumber: '',
    fullName: '',
    telegram: '',
    email: '',
    tagIban: '',
  });

  const allFiat = Object.values(FIAT_CURRENCIES).flat();

  const isCryptoToFiat = CRYPTO_CURRENCIES.some(c => c.value === fromCurrency) && allFiat.some(f => f.value === toCurrency);
  const isFiatToCrypto = allFiat.some(f => f.value === fromCurrency) && CRYPTO_CURRENCIES.some(c => c.value === toCurrency);

  const getFiatCurrency = (value: string) => {
    if (value.includes('RUB')) return 'RUB';
    if (value.includes('UAH')) return 'UAH';
    if (value.includes('EUR')) return 'EUR';
    if (value.includes('USD')) return 'USD';
    if (value.includes('KZT')) return 'KZT';
    return '';
  };

  const fiatCurrency = isCryptoToFiat ? getFiatCurrency(toCurrency) : '';

  const calculateExchange = (amount: string, from: string, to: string) => {
    const num = parseFloat(amount);
    if (isNaN(num) || !from || !to) return '';
    
    const fromRate = EXCHANGE_RATES[from] || 1;
    const toRate = EXCHANGE_RATES[to] || 1;
    const result = (num * fromRate) / toRate;
    
    return result.toFixed(2);
  };

  const handleGiveAmountChange = (value: string) => {
    setGiveAmount(value);
    if (fromCurrency && toCurrency) {
      setReceiveAmount(calculateExchange(value, fromCurrency, toCurrency));
    }
  };

  const handleReceiveAmountChange = (value: string) => {
    setReceiveAmount(value);
    if (fromCurrency && toCurrency) {
      setGiveAmount(calculateExchange(value, toCurrency, fromCurrency));
    }
  };

  const handleSubmit = () => {
    onSubmit({
      fromCurrency,
      toCurrency,
      giveAmount,
      receiveAmount,
      contactData,
      isCryptoToFiat,
      isFiatToCrypto,
    });
  };

  return (
    <Card className="p-8 glass-effect border-2 border-primary/20 animate-fade-in">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label className="text-lg font-semibold">Отдаёте</Label>
            <Select value={fromCurrency} onValueChange={setFromCurrency}>
              <SelectTrigger className="h-14 text-lg bg-background/50">
                <SelectValue placeholder="Выберите валюту" />
              </SelectTrigger>
              <SelectContent>
                <div className="font-semibold px-2 py-2 text-primary">Криптовалюты</div>
                {CRYPTO_CURRENCIES.map((currency) => (
                  <SelectItem key={currency.value} value={currency.value}>
                    <span className="flex items-center gap-2">
                      <span>{currency.icon}</span>
                      <span>{currency.label}</span>
                    </span>
                  </SelectItem>
                ))}
                <div className="font-semibold px-2 py-2 text-secondary mt-2">Фиат</div>
                {allFiat.map((currency) => (
                  <SelectItem key={currency.value} value={currency.value}>
                    <span className="flex items-center gap-2">
                      <span>{currency.icon}</span>
                      <span>{currency.label}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="number"
              placeholder="0.00"
              value={giveAmount}
              onChange={(e) => handleGiveAmountChange(e.target.value)}
              className="h-14 text-2xl font-bold bg-background/50"
            />
          </div>

          <div className="space-y-3">
            <Label className="text-lg font-semibold">Получаете</Label>
            <Select value={toCurrency} onValueChange={setToCurrency}>
              <SelectTrigger className="h-14 text-lg bg-background/50">
                <SelectValue placeholder="Выберите валюту" />
              </SelectTrigger>
              <SelectContent>
                <div className="font-semibold px-2 py-2 text-primary">Криптовалюты</div>
                {CRYPTO_CURRENCIES.map((currency) => (
                  <SelectItem key={currency.value} value={currency.value}>
                    <span className="flex items-center gap-2">
                      <span>{currency.icon}</span>
                      <span>{currency.label}</span>
                    </span>
                  </SelectItem>
                ))}
                <div className="font-semibold px-2 py-2 text-secondary mt-2">Фиат</div>
                {allFiat.map((currency) => (
                  <SelectItem key={currency.value} value={currency.value}>
                    <span className="flex items-center gap-2">
                      <span>{currency.icon}</span>
                      <span>{currency.label}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="number"
              placeholder="0.00"
              value={receiveAmount}
              onChange={(e) => handleReceiveAmountChange(e.target.value)}
              className="h-14 text-2xl font-bold bg-background/50"
            />
          </div>
        </div>

        {isCryptoToFiat && (
          <div className="space-y-4 animate-slide-up">
            <div className="h-px bg-gradient-primary w-full" />
            <h3 className="text-xl font-bold">Контактные данные</h3>
            
            {fiatCurrency === 'RUB' && (
              <>
                <div className="space-y-2">
                  <Label>Номер телефона СБП</Label>
                  <Input
                    placeholder="+7 (999) 123-45-67"
                    value={contactData.phone}
                    onChange={(e) => setContactData({ ...contactData, phone: e.target.value })}
                    className="bg-background/50"
                  />
                </div>
              </>
            )}

            {fiatCurrency === 'UAH' && (
              <>
                <div className="space-y-2">
                  <Label>Номер карты / Счёт получения</Label>
                  <Input
                    placeholder="5168 7555 1234 5678"
                    value={contactData.cardNumber}
                    onChange={(e) => setContactData({ ...contactData, cardNumber: e.target.value })}
                    className="bg-background/50"
                  />
                </div>
              </>
            )}

            {fiatCurrency === 'KZT' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Номер карты</Label>
                    <Input
                      placeholder="1234 5678 9012 3456"
                      value={contactData.cardNumber}
                      onChange={(e) => setContactData({ ...contactData, cardNumber: e.target.value })}
                      className="bg-background/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Номер телефона</Label>
                    <Input
                      placeholder="+7 (700) 123-45-67"
                      value={contactData.phone}
                      onChange={(e) => setContactData({ ...contactData, phone: e.target.value })}
                      className="bg-background/50"
                    />
                  </div>
                </div>
              </>
            )}

            {(fiatCurrency === 'EUR' || fiatCurrency === 'USD') && (
              <>
                <div className="space-y-2">
                  <Label>TAG / IBAN / Email</Label>
                  <Input
                    placeholder="DE89370400440532013000"
                    value={contactData.tagIban}
                    onChange={(e) => setContactData({ ...contactData, tagIban: e.target.value })}
                    className="bg-background/50"
                  />
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label>ФИО</Label>
              <Input
                placeholder="Иванов Иван Иванович"
                value={contactData.fullName}
                onChange={(e) => setContactData({ ...contactData, fullName: e.target.value })}
                className="bg-background/50"
              />
            </div>

            <div className="space-y-2">
              <Label>Ваш Telegram</Label>
              <Input
                placeholder="@username"
                value={contactData.telegram}
                onChange={(e) => setContactData({ ...contactData, telegram: e.target.value })}
                className="bg-background/50"
              />
            </div>

            <div className="space-y-2">
              <Label>Ваша почта</Label>
              <Input
                type="email"
                placeholder="example@mail.com"
                value={contactData.email}
                onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                className="bg-background/50"
              />
            </div>
          </div>
        )}

        <Button 
          onClick={handleSubmit}
          className="w-full h-16 text-xl font-bold gradient-primary animate-gradient hover:scale-105 transition-transform"
          disabled={!fromCurrency || !toCurrency || !giveAmount}
        >
          <Icon name="ArrowRightLeft" className="mr-2" size={24} />
          Обменять
        </Button>
      </div>
    </Card>
  );
}
