import { useState } from 'react';
import ExchangeForm from '@/components/ExchangeForm';
import LiveChat from '@/components/LiveChat';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

export default function Index() {
  const [orderData, setOrderData] = useState<any>(null);

  const handleExchangeSubmit = (data: any) => {
    const orderId = 'ORD-' + Date.now();
    setOrderData({ ...data, orderId, status: 'pending' });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-primary/20 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
                <Icon name="Repeat" size={24} className="text-white" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                ALWAYSCHANGE24
              </h1>
            </div>
            
            <nav className="hidden md:flex items-center gap-6">
              <a href="#exchange" className="text-foreground/80 hover:text-primary transition-colors">
                Обмен
              </a>
              <a href="#partner" className="text-foreground/80 hover:text-primary transition-colors">
                Партнёрская программа
              </a>
              <a href="#rules" className="text-foreground/80 hover:text-primary transition-colors">
                Правила
              </a>
              <a href="#contacts" className="text-foreground/80 hover:text-primary transition-colors">
                Контакты
              </a>
              <a href="#reviews" className="text-foreground/80 hover:text-primary transition-colors">
                Отзывы
              </a>
              <Button variant="outline" className="border-primary/50 hover:bg-primary/10">
                <Icon name="User" size={18} className="mr-2" />
                Профиль
              </Button>
            </nav>

            <Button variant="ghost" size="icon" className="md:hidden">
              <Icon name="Menu" size={24} />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <section id="exchange" className="mb-16">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Быстрый обмен криптовалют
            </h2>
            <p className="text-xl text-muted-foreground">
              Безопасно • Выгодно • Круглосуточно
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <ExchangeForm onSubmit={handleExchangeSubmit} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-4xl mx-auto">
            <div className="glass-effect p-6 rounded-xl animate-slide-up">
              <div className="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center mb-4">
                <Icon name="Zap" size={24} className="text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Моментально</h3>
              <p className="text-muted-foreground">Обмен за 5-15 минут</p>
            </div>

            <div className="glass-effect p-6 rounded-xl animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <div className="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center mb-4">
                <Icon name="Shield" size={24} className="text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Безопасно</h3>
              <p className="text-muted-foreground">SSL шифрование данных</p>
            </div>

            <div className="glass-effect p-6 rounded-xl animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center mb-4">
                <Icon name="Clock" size={24} className="text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">24/7</h3>
              <p className="text-muted-foreground">Работаем круглосуточно</p>
            </div>
          </div>
        </section>

        {orderData && (
          <section className="max-w-4xl mx-auto mb-16 animate-scale-in">
            <div className="glass-effect p-8 rounded-xl border-2 border-primary/30">
              <div className="flex items-center gap-3 mb-6">
                <Icon name="CheckCircle" size={32} className="text-primary" />
                <h3 className="text-2xl font-bold">Заявка создана!</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-border">
                  <span className="text-muted-foreground">Номер заявки:</span>
                  <span className="font-bold text-lg">{orderData.orderId}</span>
                </div>
                
                <div className="flex justify-between items-center py-3 border-b border-border">
                  <span className="text-muted-foreground">Отдаёте:</span>
                  <span className="font-semibold">{orderData.giveAmount} {orderData.fromCurrency}</span>
                </div>
                
                <div className="flex justify-between items-center py-3 border-b border-border">
                  <span className="text-muted-foreground">Получаете:</span>
                  <span className="font-semibold">{orderData.receiveAmount} {orderData.toCurrency}</span>
                </div>

                <div className="flex justify-between items-center py-3">
                  <span className="text-muted-foreground">Статус:</span>
                  <span className="px-4 py-2 rounded-full bg-primary/20 text-primary font-semibold">
                    Ожидает оплаты
                  </span>
                </div>

                <div className="flex gap-4 mt-6">
                  <Button 
                    className="flex-1 gradient-primary animate-gradient"
                    size="lg"
                  >
                    <Icon name="CreditCard" className="mr-2" />
                    Перейти к оплате
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-destructive/50 text-destructive hover:bg-destructive/10"
                    onClick={() => setOrderData(null)}
                  >
                    <Icon name="X" className="mr-2" />
                    Отменить
                  </Button>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      <footer className="border-t border-primary/20 mt-20 py-12 bg-card/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Icon name="Repeat" size={24} className="text-primary" />
                ALWAYSCHANGE24
              </h3>
              <p className="text-muted-foreground mb-4">
                Надёжный обменник криптовалют с 2024 года
              </p>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Icon name="Mail" size={18} />
                <a href="mailto:support@alwayschange24.com" className="hover:text-primary transition-colors">
                  support@alwayschange24.com
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Полезные ссылки</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#aml" className="text-muted-foreground hover:text-primary transition-colors">
                    Политика AML
                  </a>
                </li>
                <li>
                  <a href="#articles" className="text-muted-foreground hover:text-primary transition-colors">
                    Статьи
                  </a>
                </li>
                <li>
                  <a href="#catalog" className="text-muted-foreground hover:text-primary transition-colors">
                    Каталог направлений
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Наши партнёры</h4>
              <p className="text-muted-foreground">
                BestChange • Мониторинг обменников
              </p>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-primary/20 text-center text-muted-foreground">
            <p>© 2024 ALWAYSCHANGE24. Все права защищены.</p>
          </div>
        </div>
      </footer>

      <LiveChat />
    </div>
  );
}
