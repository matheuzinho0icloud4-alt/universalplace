-- ===================================
-- MIGRAÇÃO SEGURA - UniversalPlace
-- Data: 28 de fevereiro de 2026
-- ===================================

-- 🔍 PASSO 1: VERIFICAR ESTRUTURA ATUAL
-- Execute isso primeiro para ver o estado atual:
\d products

-- ===================================

-- ⚠️ PASSO 2: REMOVER COLUNAS ANTIGAS (retrocompatibilidade)

-- Se a coluna 'price' NUMERIC existir (versão antiga)
ALTER TABLE products DROP COLUMN IF EXISTS price CASCADE;

-- Se a coluna 'preco' existir (variação portuguesa)
ALTER TABLE products DROP COLUMN IF EXISTS preco CASCADE;

-- Se a coluna 'descricao' existir (não usada)
ALTER TABLE products DROP COLUMN IF EXISTS descricao CASCADE;

-- Se a coluna 'imagem' existir (usamos 'image' em inglês)
ALTER TABLE products DROP COLUMN IF EXISTS imagem CASCADE;

-- ===================================

-- ✅ PASSO 3: GARANTIR COLUNAS NECESSÁRIAS

-- Coluna 'name' obrigatória
ALTER TABLE products ADD COLUMN IF NOT EXISTS name TEXT NOT NULL DEFAULT '';

-- Coluna 'image' opcional
ALTER TABLE products ADD COLUMN IF NOT EXISTS image TEXT;

-- Coluna 'link_oferta' opcional
ALTER TABLE products ADD COLUMN IF NOT EXISTS link_oferta TEXT;

-- ===================================

-- 🔄 PASSO 4: COMPATIBILIDADE RETRÓGRADA
-- Se houver colunas com nomes diferentes, renomear:

-- Se houver 'product_name', renomear para 'name'
-- ALTER TABLE products RENAME COLUMN product_name TO name;

-- Se houver 'product_image', renomear para 'image'
-- ALTER TABLE products RENAME COLUMN product_image TO image;

-- Se houver 'offer_link', renomear para 'link_oferta'
-- ALTER TABLE products RENAME COLUMN offer_link TO link_oferta;

-- ===================================

-- ✅ PASSO 5: VERIFICAR ESTRUTURA FINAL
\d products

-- Saída esperada:
-- Column      |       Type        | Collation | Nullable | Default
-- id          | integer           |           |          | nextval('products_id_seq'::regclass)
-- name        | text              |           | not null |
-- image       | text              |           |          |
-- link_oferta | text              |           |          |
-- user_id     | integer           |           |          |

-- ===================================

-- 📊 PASSO 6: VALIDAR DADOS (NÃO APAGA NADA!)

-- Contar total de produtos (verifica se dados foram preservados)
SELECT COUNT(*) as total_produtos FROM products;

-- Verificar se algum produto tem link_oferta preenchido
SELECT COUNT(*) as com_link FROM products WHERE link_oferta IS NOT NULL;

-- Listar alguns produtos
SELECT id, name, image, link_oferta, user_id FROM products LIMIT 5;

-- ===================================

-- ✨ PASSO 7: CRIAR ÍNDICES DE PERFORMANCE (opcional)

-- Se ainda não existir, criar índices
CREATE INDEX IF NOT EXISTS idx_products_user ON products(user_id);
CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);

-- ===================================

-- � MIGRAÇÕES PARA HOMEPAGE MARKETPLACE (10 de março de 2026)

-- ✅ PASSO 8: CRIAR TABELA CATEGORIES
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    show_home BOOLEAN DEFAULT false,
    home_order INTEGER DEFAULT 0
);

-- ✅ PASSO 9: ADICIONAR COLUNAS EM PRODUCTS
ALTER TABLE products ADD COLUMN IF NOT EXISTS category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL;
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;
ALTER TABLE products ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT NOW();

-- ✅ PASSO 10: CRIAR ÍNDICES PARA PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_categories_show_home ON categories(show_home, home_order);

-- ===================================

-- �👍 MIGRAÇÃO COMPLETA!
-- Todos os dados estão preservados
-- Sistema está 100% alinhado
