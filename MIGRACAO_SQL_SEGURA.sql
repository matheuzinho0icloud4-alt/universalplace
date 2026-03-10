-- ===================================
-- MIGRAÇÃO SEGURA - UniversalPlace
-- ===================================

-- REMOVER COLUNAS ANTIGAS (retrocompatibilidade)

ALTER TABLE products DROP COLUMN IF EXISTS price CASCADE;
ALTER TABLE products DROP COLUMN IF EXISTS preco CASCADE;
ALTER TABLE products DROP COLUMN IF EXISTS descricao CASCADE;
ALTER TABLE products DROP COLUMN IF EXISTS imagem CASCADE;

-- GARANTIR COLUNAS NECESSÁRIAS

ALTER TABLE products ADD COLUMN IF NOT EXISTS name TEXT NOT NULL DEFAULT '';
ALTER TABLE products ADD COLUMN IF NOT EXISTS image TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS link_oferta TEXT;

-- VALIDAR DADOS

SELECT COUNT(*) as total_produtos FROM products;

-- ÍNDICES

CREATE INDEX IF NOT EXISTS idx_products_user ON products(user_id);
CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);

-- ===================================
-- MIGRAÇÕES PARA HOMEPAGE MARKETPLACE
-- ===================================

-- CRIAR TABELA CATEGORIES

CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    show_home BOOLEAN DEFAULT false,
    home_order INTEGER DEFAULT 0
);

-- ADICIONAR COLUNAS EM PRODUCTS

ALTER TABLE products ADD COLUMN IF NOT EXISTS category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL;
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;
ALTER TABLE products ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT NOW();

-- ÍNDICES

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_categories_show_home ON categories(show_home, home_order);
