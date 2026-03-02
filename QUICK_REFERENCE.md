# 📚 GUIA DE REFERÊNCIA RÁPIDA - UniversalPlace

## 🚀 Start Local

### Option 1: Docker (Recomendado)
```bash
docker-compose up --build
# Backend em http://localhost:4000
# Database em postgres://localhost:5432
```

### Option 2: Manual
```bash
# Terminal 1 - Backend
cd backend
npm install
npm start

# Terminal 2 - Frontend (raiz)
npm install
npm run dev
```

### Credenciais Padrão
```
Email: matheuzinho0@icloud.com
Senha: aninha123
```

---

## 📁 Estrutura do Projeto

```
├── backend/                    # API Node.js + Express
│   ├── server.js              # Inicialização do servidor
│   ├── database.js            # Pool PostgreSQL + migrations
│   ├── controllers/           # Lógica dos endpoints
│   ├── services/              # Lógica de negócio
│   ├── repositories/          # Acesso ao banco
│   ├── middleware/            # Auth, logging, error handling
│   ├── routes/                # Rotas da API
│   └── utils/logger.js        # Winston logging
│
├── src/                       # Frontend React
│   ├── App.jsx
│   ├── main.jsx
│   ├── components/            # React components
│   ├── contexts/AuthContext   # Estado global de auth
│   ├── pages/                 # Páginas (login, dashboard, etc)
│   ├── services/              # Calls para API
│   └── utils/                 # Utilidades
│
└── Database                   # PostgreSQL
    ├── users (id, email, password, role)
    ├── products (id, user_id, name, price, stock)
    └── store_config (id, user_id, ...)
```

---

## 🔐 Autenticação

### Fluxo
```
1. User faz login → POST /auth/login
2. Backend cria JWT e seta cookie httpOnly
3. Backend retorna { success: true, data: user }
4. Frontend salva estado em AuthContext
5. Frontend envia cookie automaticamente em all requests (withCredentials)
```

### Response Format
```javascript
// /auth/login
{ success: true, data: { id, email, role }, message: "Login successful" }

// /auth/me
{ success: true, data: { id, email, role } }

// Erro
{ success: false, message: "Invalid credentials", errorCode: "AUTH_ERROR" }
```

---

## 📦 Products API

### GET /products
```javascript
Request: GET /products
Response: { 
  success: true, 
  data: [
    { id: 1, name: "Product", price: 99.99, stock: 10, ... },
    ...
  ]
}
```

### POST /products
```javascript
Request: POST /products
Body: { name, description, price, stock, ... }
Response: {
  success: true,
  data: { id: 1, name, price, ... },
  message: "Product created successfully"
}
```

### PUT /products/:id
```javascript
Request: PUT /products/:id
Body: { name?, price?, stock?, ... }
Response: { success: true, data: updatedProduct }
```

### DELETE /products/:id
```javascript
Request: DELETE /products/:id
Response: { success: true, data: null, message: "Product deleted" }
```

---

## 🎯 Frontend Patterns

### 1. Consumir API
```javascript
// ✅ CERTO
import { api } from '@/services/api'

const { data: response } = await api.get('/products')
const products = response?.data            // Extract array
if (!Array.isArray(products)) return []

// ❌ ERRADO
const { data } = await api.get('/products')
const products = data?.products  // ❌ Products não retorna em "products"
```

### 2. Estado de Auth
```javascript
// ✅ CERTO
import { useAuth } from '@/contexts/AuthContext'

const { currentUser, login, logout } = useAuth()
if (currentUser?.role === 'admin') { ... }

// ❌ ERRADO
const user = localStorage.getItem('user')  // ❌ Não use localStorage direto
```

### 3. Protected Routes
```javascript
// ✅ CERTO
import ProtectedRoute from '@/components/ProtectedRoute'

<Route path="/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />

// ❌ ERRADO
<Route path="/dashboard" element={<AdminDashboard />} />  // Sem proteção
```

---

## ⚙️ Backend Patterns

### 1. Response Format
```javascript
// ✅ CERTO
res.status(200).json({ 
  success: true, 
  data: user,
  message: "User retrieved"
})

// ❌ ERRADO
res.status(200).json({ user })  // Sem padronização
```

### 2. Error Handling
```javascript
// ✅ CERTO (use try/catch + error middleware)
try {
  const user = await userRepository.findById(id)
  if (!user) throw new Error('User not found')
  return { success: true, data: user }
} catch (error) {
  return { success: false, message: error.message }
}

// ❌ ERRADO
res.status(500).json({ error: 'Something went wrong' })
```

### 3. Logging
```javascript
// ✅ CERTO
const logger = require('@/utils/logger')
logger.info('Product created', { productId: id, userId })

// ❌ ERRADO
console.log('Product created')  // Use logger sempre
```

---

## 🗄️ Database

### Schemas
```sql
-- Users
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Products
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  name VARCHAR(255) NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  stock INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Store Config
CREATE TABLE store_config (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  store_name VARCHAR(255),
  settings JSONB
);
```

### Auto-Migrations
Backend faz auto-migration se faltar coluna:
```javascript
// database.js: ensureColumnExists()
// Automatically adds: role, link_oferta, etc if missing
```

---

## 📡 Environment Variables

### Backend (.env)
```
NODE_ENV=development|production
DATABASE_URL=postgresql://user:pass@localhost:5432/dbname
JWT_SECRET=seu-secret-seguro
CORS_ORIGIN=http://localhost:5173|https://seu-app.vercel.app
PORT=4000
```

### Frontend (.env.local ou em api.js)
```javascript
// src/services/api.js
const API_URL = process.env.VITE_API_URL || 'http://localhost:4000'
```

---

## 🐛 Problemas Comuns

### "Cannot read property 'data' of undefined"
**Causa**: Tentando acessar resposta sem verificar   
**Solução**:
```javascript
const { data: response } = await api.get(...)
const result = response?.data  // sempre use optional chaining
```

### "expected array but got object"
**Causa**: Frontend recebe `{ success, data }` mas espera array direto  
**Solução**:
```javascript
// ✅ CERTO
const products = response?.data  // extract array
if (!Array.isArray(products)) return []
```

### "401 Unauthorized"
**Causa**: Cookie JWT expirado ou não enviado  
**Solução**:
- Fazer login novamente
- Verificar cookie no browser
- Verificar CORS permite credentials

### Products não aparecem no dashboard
**Causa**: fetchProducts retorna undefined  
**Solução**:
- Abrir Network tab
- Verificar GET /products retorna `{ success, data: [...] }`
- Verificar que fetchProducts faz `response?.data`

---

## 🧪 Testing Rápido

```bash
# Login
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"matheuzinho0@icloud.com","password":"aninha123"}'

# Listar produtos
curl -X GET http://localhost:4000/products \
  -H "Cookie: token=[JWT_TOKEN]"

# Criar produto
curl -X POST http://localhost:4000/products \
  -H "Cookie: token=[JWT_TOKEN]" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","price":99.99,"stock":10}'
```

---

## 📊 Logs e Debugging

### Ver logs do backend
```bash
# Docker
docker-compose logs backend -f

# Manual
npm start  # stdout mostra logs
```

### Ver logs do frontend
Dev Tools → Console (F12)

### Estrutura de log (Winston)
```javascript
{
  level: 'info',
  message: 'Product created',
  timestamp: '2024-03-02T10:30:45.123Z',
  productId: 1,
  userId: 1
}
```

---

## 🚀 Deploy

### Ver: DEPLOYMENT_RENDER_GUIDE.md

**Resumido**:
1. Criar DB PostgreSQL no Render
2. Fazer `npm run build` (frontend)
3. Deploy backend no Render
4. Deploy frontend no Vercel
5. Atualizar CORS_ORIGIN no backend
6. Testar em produção

---

## 📝 Commitando Código

```bash
# Add arquivos
git add .

# Commit com mensagem descritiva
git commit -m "feat: add product creation feature"

# Push
git push origin main

# Render/Vercel fazem deploy automático
```

---

## 🔧 Comandos Úteis

```bash
# Instalar dependências
npm install
cd backend && npm install

# Build frontend
npm run build

# Dev (local)
npm run dev

# Verificar database
psql postgresql://user:pass@localhost:5432/dbname

# Ver processos
docker ps
# ou
lsof -i :4000  # port 4000
lsof -i :5173  # port 5173

# Matar processo
kill -9 <PID>
```

---

## 📬 Notas Importantes

- ✅ Sempre use `response?.data` no frontend
- ✅ Sempre retorne `{ success: true, data: ... }`no backend
- ✅ Use middleware de erro global (é automático)
- ✅ Use logger (não console.log)
- ✅ Sempre teste localmente antes de push
- ✅ Guarde JWT_SECRET em lugar seguro
- ✅ Nunca commite .env (use .env.example)

---

## 📞 Links Úteis

- [Render Docs](https://render.com/docs)
- [Vercel Docs](https://vercel.com/docs)
- [Express Docs](https://expressjs.com)
- [React Docs](https://react.dev)
- [PostgreSQL Docs](https://www.postgresql.org/docs)

---

**Última atualização**: 2 de março de 2026  
**Versão**: 2.0 (Refactoring completo)  
**Status**: ✅ Pronto para Produção

