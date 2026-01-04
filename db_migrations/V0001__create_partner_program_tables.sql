CREATE TABLE IF NOT EXISTS partners (
    id SERIAL PRIMARY KEY,
    partner_id VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    balance DECIMAL(18, 2) DEFAULT 0,
    total_earned DECIMAL(18, 2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS partner_clicks (
    id SERIAL PRIMARY KEY,
    partner_id VARCHAR(100) NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    exchange_direction VARCHAR(100),
    city VARCHAR(100),
    language VARCHAR(10) DEFAULT 'ru',
    clicked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS exchanges (
    id SERIAL PRIMARY KEY,
    order_id VARCHAR(100) UNIQUE NOT NULL,
    partner_id VARCHAR(100),
    user_cookie VARCHAR(255),
    from_currency VARCHAR(50) NOT NULL,
    to_currency VARCHAR(50) NOT NULL,
    give_amount DECIMAL(18, 8) NOT NULL,
    receive_amount DECIMAL(18, 8) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    commission DECIMAL(18, 2) DEFAULT 0,
    partner_reward DECIMAL(18, 2) DEFAULT 0,
    contact_data JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS partner_payouts (
    id SERIAL PRIMARY KEY,
    partner_id VARCHAR(100) NOT NULL,
    amount DECIMAL(18, 2) NOT NULL,
    payment_method VARCHAR(100),
    payment_details TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    paid_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_exchanges_partner ON exchanges(partner_id);
CREATE INDEX IF NOT EXISTS idx_exchanges_status ON exchanges(status);
CREATE INDEX IF NOT EXISTS idx_partner_clicks_partner ON partner_clicks(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_payouts_partner ON partner_payouts(partner_id);
