-- Categories Table
CREATE TABLE IF NOT EXISTS categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(20) NOT NULL, -- 'INCOME' or 'EXPENSE'
    color VARCHAR(20) DEFAULT '#6366f1',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_category_name_type UNIQUE (name, type)
);

-- Payment Methods Table
CREATE TABLE IF NOT EXISTS payment_methods (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Income Table
CREATE TABLE IF NOT EXISTS income (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    amount NUMERIC(15, 2) NOT NULL,
    category_id BIGINT REFERENCES categories(id) ON DELETE SET NULL,
    date DATE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Expenses Table
CREATE TABLE IF NOT EXISTS expenses (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    amount NUMERIC(15, 2) NOT NULL,
    category_id BIGINT REFERENCES categories(id) ON DELETE SET NULL,
    payment_method_id BIGINT REFERENCES payment_methods(id) ON DELETE SET NULL,
    date DATE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_income_date ON income(date);
CREATE INDEX IF NOT EXISTS idx_income_category ON income(category_id);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date);
CREATE INDEX IF NOT EXISTS idx_expenses_category ON expenses(category_id);

-- Seed Payment Methods
INSERT INTO payment_methods (name) VALUES
    ('UPI'),
    ('Cash'),
    ('Debit Card'),
    ('Credit Card'),
    ('Bank Transfer')
ON CONFLICT (name) DO NOTHING;

-- Seed Default Expense Categories
INSERT INTO categories (name, type, color) VALUES
    ('Food', 'EXPENSE', '#f87171'),
    ('Groceries', 'EXPENSE', '#fb923c'),
    ('Rent', 'EXPENSE', '#fbbf24'),
    ('Shopping', 'EXPENSE', '#f43f5e'),
    ('Transportation', 'EXPENSE', '#38bdf8'),
    ('Entertainment', 'EXPENSE', '#a855f7'),
    ('Utilities', 'EXPENSE', '#eab308'),
    ('Healthcare', 'EXPENSE', '#ec4899'),
    ('Travel', 'EXPENSE', '#06b6d4'),
    ('Other', 'EXPENSE', '#94a3b8')
ON CONFLICT (name, type) DO NOTHING;

-- Seed Default Income Categories
INSERT INTO categories (name, type, color) VALUES
    ('Salary', 'INCOME', '#22c55e'),
    ('Freelancing', 'INCOME', '#10b981'),
    ('Business', 'INCOME', '#14b8a6'),
    ('Investments', 'INCOME', '#3b82f6'),
    ('Other', 'INCOME', '#64748b')
ON CONFLICT (name, type) DO NOTHING;

