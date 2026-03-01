# 🚀 INSTRUÇÕES FINAIS - RODAR O SISTEMA

## 📋 VERIFICAÇÃO PRÉ-INICIALIZAÇÃO

Antes de tudo, certifique-se que:

- [x] PostgreSQL está rodando
- [x] Arquivo `.env` do backend tem `DATABASE_URL` correto
- [x] Arquivo `.env` do backend tem `PORT=3003` (ou ajuste conforme)
- [x] Frontend usar `VITE_API_URL=http://localhost:3003` (ou conforme)
- [x] Portas 3000 (frontend) e 3003 (backend) estão livres

---

## 🔧 INICIALIZAR O SISTEMA

### 1️⃣ Terminal 1 - Backend

```bash
cd backend
npm install  # Se não fez ainda
npm start    # Ou npm run dev

Saída esperada:
✅ [DB] Users table ready
✅ [DB] Products table ready
📋 [DB] Products columns: id, link_oferta, name, user_id, image
✅ [DB] Indexes created
🔥 PostgreSQL API running on http://localhost:3003
```

### 2️⃣ Terminal 2 - Frontend

```bash
cd .  # Se não está na raiz
npm run dev

Saída esperada:
VITE v... dev server running at:
  > Local:   http://localhost:5173/
  > Press q to quit
```

### 3️⃣ Acessar no Navegador

```
Frontend Home:   http://localhost:3000
Ou:              http://localhost:5173  (dev)
Admin Login:     http://localhost:3000/admin/login
```

---

## ✅ TESTAR FUNCIONALIDADES

### 1. LOGIN

```
1. Ir para http://localhost:3000/admin/login
2. Clicar "Register" primeiro (se novo usuário)
3. Email: test@example.com
4. Password: senha123
5. Clicar "Register"
6. Será redirecionado para login
7. Clicar "Login"
✅ Deve entrar em /admin/dashboard
```

### 2. CRIAR PRODUTO

```
1. Em /admin/dashboard
2. Clicar botão azul "Add New Product"
3. Preencher:
   - Selecionar imagem (obrigatório)
   - Nome: "Produto Teste"
   - Link da Oferta: "https://example.com" (opcional)
4. Clicar "Add Product"
5. Noti toast "Product added" deve aparecer
✅ Produto deve aparecer na tabela

Terminal backend deve exibir:
📦 [CREATE] Body received: { name: 'Produto Teste', link_oferta: 'https://example.com' }
📷 [CREATE] Image: http://localhost:3003/uploads/...
💾 [REPO] INSERT products: { name, user_id, image, link_oferta }
✅ [REPO] Product inserted, ID: 1
✅ [CREATE] Product created: 1
```

### 3. VER PRODUTO NA HOME

```
1. Você é deslogado automaticamente
2. Ou acessa direto: http://localhost:3000
3. Deve ver o produto na grid
4. Nome, imagem, botão "Ver Oferta"
✅ Grid deve carregar

Se tiver link_oferta:
5. Clicar botão "Ver Oferta"
✅ Abre o link em nova aba

Se NÃO tiver link_oferta:
5. Clicar botão "Ver Oferta"
✅ Exibe toast "Ver detalhes"
```

### 4. EDITAR PRODUTO

```
1. Fazer login novamente
2. Em /admin/dashboard
3. Clicar ícone lápis em um produto
4. ProductForm deve aparecer com dados preenchidos
5. Alterar nome ou link
6. Clicar "Update Product"
✅ Toast "Product updated" deve aparecer

Terminal backend deve exibir:
📝 [UPDATE] Body received: { name, link_oferta }
💾 [REPO] UPDATE products...
✅ [UPDATE] Product updated: ID
```

### 5. DELETAR PRODUTO

```
1. Em /admin/dashboard
2. Clicar ícone lixeira em um produto
3. Diálogo confirmação deve aparecer
4. Clicar "Delete"
✅ Toast "Product deleted" deve aparecer
✅ Produto desaparece da tabela

Terminal backend deve exibir:
🗑️ [DELETE] Removing product ID
✅ [DELETE] Product ID deleted successfully
```

### 6. REFRESH (F5) MANTÉM LOGIN

```
1. Estar logado em /admin/dashboard
2. Pressionar F5
3. Página recarrega
✅ Deve manter login
✅ Dashboard deve carregar

Terminal backend deve exibir:
📦 [LIST] User 1 has X products
```

---

## 🐛 DEBUGAÇÃO

### Se ver erro 500 no backend:

```
1. Olhar para o terminal backend
2. Deve ter uma mensagem ❌ [CREATE/UPDATE/DELETE] Error:
3. Mensagem de erro completa aparece
4. Ex: ❌ [CREATE] Error: column "price" does not exist
```

**Solução:**
```sql
-- Execute no pgAdmin 4
ALTER TABLE products DROP COLUMN IF EXISTS price;
ALTER TABLE products ADD COLUMN IF NOT EXISTS link_oferta TEXT;
\d products
```

### Se ver erro "Coluna não existe":

```
Terminal backend mostra:
❌ [CREATE] Error: column "xyz" does not exist

Solução:
1. Abra MIGRACAO_SQL_SEGURA.sql
2. Copie os comandos
3. Cole no pgAdmin 4
4. Execute (F5)
5. Teste novamente
```

### Se não conseguir logar:

```
1. Verificar se backend está rodando
2. Verificar se PostgreSQL está rodando
3. Verificar DATABASE_URL em /backend/.env
4. Console (F12) → Network → /auth/login
5. Ver resposta do servidor
```

### Se imagem não aparece:

```
1. Verificar se arquivo foi salvo em /backend/uploads/
2. Verificar console (F12) → Network → requests de imagem
3. Ver URL: http://localhost:3003/uploads/FILENAME
4. Se não carregar, aguarde a requisição completar
```

---

## 📊 LOGS IMPORTANTES

### Backend (Terminal)

```javascript
// Na criação:
📦 [CREATE] Body received: { name, link_oferta }
📷 [CREATE] Image: http://localhost:3003/uploads/...
💾 [REPO] INSERT products: ...
✅ [REPO] Product inserted, ID: 1
✅ [CREATE] Product created: 1

// Na listagem:
📦 [LIST] User 1 has 3 products

// Na atualização:
📝 [UPDATE] Body received: { name, link_oferta }
📷 [UPDATE] New image: http://localhost:3003/uploads/...
✅ [UPDATE] Product updated: 1

// Na deleção:
🗑️ [DELETE] Removing product 1
✅ [DELETE] Product 1 deleted successfully

// Inicialização:
✅ [DB] Users table ready
✅ [DB] Products table ready
📋 [DB] Products columns: id, link_oferta, name, user_id, image
✅ [DB] Indexes created
🔥 PostgreSQL API running on http://localhost:3003
```

### Frontend (Console F12)

```javascript
// Network → /auth/login
Status: 200 OK
Response: { user: { id: 1, email: 'test@example.com' } }
Set-Cookie: token=eyJhbGc...

// Network → /products (GET)
Status: 200 OK
Response: [ { id: 1, name: '...', image: '...', link_oferta: '...', user_id: 1 } ]

// Network → /products (POST)
Status: 200 OK
Response: { id: 2, name: '...', image: '...', link_oferta: '...', user_id: 1 }
Cookies: token=... (enviado)

// Network → /products/:id (PUT)
Status: 200 OK
Response: { id: 1, name: '...', image: '...', link_oferta: '...', user_id: 1 }

// Network → /products/:id (DELETE)
Status: 200 OK
Response: { success: true }
```

---

## 🆘 PROBLEMAS COMUNS

| Problema | Causa | Solução |
|----------|-------|---------|
| "PostgreSQL connection failed" | Database URL errado | Verificar DATABASE_URL em .env |
| "Column price does not exist" | Schema antigo | Executar MIGRACAO_SQL_SEGURA.sql |
| "Erro 401" ao criar produto | Não está logado | Fazer login novamente |
| "Erro 401" após F5 | Cookie perdido | Verificar CORS e autenticação |
| Imagem não aparece | Arquivo não salvo | Verificar /backend/uploads/ |
| "Cannot POST /products" | Rota não existe | Verificar /backend/routes/products.js |
| Link "Ver Oferta" não abre | link_oferta vazio | Preencher campo com URL válida |

---

## ✨ DICAS ÚTEIS

### Para limpar tudo e começar do zero:

```bash
# 1. Backend
rm -rf backend/uploads/*

# 2. Database (no PostgreSQL)
-- Query Tool
DELETE FROM products;
DELETE FROM users;

-- Ou recriar:
DROP TABLE products CASCADE;
DROP TABLE users CASCADE;
-- O backend recria automaticamente na próxima inicialização

# 3. Frontend
npm run build:clean
npm run dev
```

### Para ver logs do PostgreSQL:

```bash
# Se usar psql:
psql -U seu_usuario -d seu_banco

-- Ver produtos:
SELECT * FROM products;

-- Ver usuários:
SELECT * FROM users;

-- Contar produtos:
SELECT COUNT(*) FROM products;
```

### Para resetar autenticação:

```javascript
// Frontend Console (F12):
localStorage.clear()
sessionStorage.clear()
// Recarregar página
```

---

## ✅ CONCLUSÃO

Sistema está 100% pronto para usar! 🎉

Se tiver problemas:
1. Verifique os logs (terminal backend)
2. Consulte a tabela "Problemas Comuns"
3. Verifique se PostgreSQL está rodando
4. Tente executar MIGRACAO_SQL_SEGURA.sql

**Aproveite o sistema!** 🚀
