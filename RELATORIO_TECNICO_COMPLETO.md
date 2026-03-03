# 📊 RELATÓRIO TÉCNICO COMPLETO - UNIVERSAL PLACE

**Data:** 1 de março de 2026  
**Projeto:** Universal Place - Agregador de Ofertas  
**Status:** Arquitetura hybrid (Frontend + Backend separados)

---

## 1️⃣ ESTRUTURA DO PROJETO

### 📁 Árvore de Pastas Completa

```
universalplace/
│
├── 📄 package.json (Frontend + Scripts)
├── 📄 vite.config.js (Vite + Plugins customizados)
├── 📄 index.html
├── 📄 jsconfig.json (Config paths alias @/)
├── 📄 tailwind.config.js (Tailwind CSS)
├── 📄 postcss.config.js
├── 📄 eslint.config.mjs
├── 📄 components.json (Shadcn UI)
├── 📄 README.md (Documentação geral)
├── 📄 GUIA_EXECUCAO.md (Guia de execução)
├── 📄 RELATORIO_TECNICO_COMPLETO.md (Este arquivo)
│
├── 📂 /public (Assets estáticos)
│
├── 📂 /src (Frontend - React/Vite)
│   ├── 📄 main.jsx (Entry point)
│   ├── 📄 App.jsx (Router principal)
│   ├── 📄 index.css (Tailwind)
│   │
│   ├── 📂 /pages (7 páginas)
│   │   ├── HomePage.jsx (Home pública)
│   │   ├── AdminDashboard.jsx (Dashboard admin - protegido)
│   │   ├── LoginPage.jsx (Login admin)
│   │   ├── RegisterPage.jsx (Registrar admin)
│   │   ├── QuemSomos.jsx (About)
│   │   ├── PrivacyPolicy.jsx (Política privacidade)
│   │   └── TermsOfUse.jsx (Termos de uso)
│   │
│   ├── 📂 /components (5 principais + UI library)
│   │   ├── Layout.jsx (Header, Footer, Sidebar)
│   │   ├── ProtectedRoute.jsx (Higher-order component)
│   │   ├── ProductForm.jsx (Criar/editar produto + upload)
│   │   ├── StoreSettingsForm.jsx (Config loja)
│   │   ├── ScrollToTop.jsx (Utility)
│   │   └── /ui (Shadcn UI components - 9 arquivos)
│   │       ├── button.jsx, card.jsx, input.jsx, label.jsx
│   │       ├── textarea.jsx, dialog.jsx, alert-dialog.jsx
│   │       ├── tabs.jsx, table.jsx, toast.jsx, toaster.jsx
│   │
│   ├── 📂 /services (3 arquivos)
│   │   ├── api.js (Axios instance com interceptor)
│   │   ├── products.js (Product API calls)
│   │   └── storeConfig.js (Store config API calls)
│   │
│   ├── 📂 /contexts
│   │   └── AuthContext.jsx (Auth state management)
│   │
│   ├── 📂 /hooks
│   │   └── use-toast.js (Toast hook)
│   │
│   ├── 📂 /utils
│   │   └── config.js (Local storage helpers)
│   │
│   └── 📂 /lib
│       └── utils.js (Utility functions)
│
├── 📂 /backend (API Express + PostgreSQL)
│   ├── 📄 package.json (Backend dependencies)
│   ├── 📄 server.js (Entry point)
│   ├── 📄 database.js (Pool + Init schema + Ensure admin)
│   ├── 📄 setup-db.js (Script migrate)
│   ├── 📄 .env (Variáveis ambiente)
│   │
│   ├── 📂 /config
│   │   └── index.js (Env loader + validation)
│   │
│   ├── 📂 /routes (3 rotas)
│   │   ├── auth.js (Login, getMe, logout)
│   │   ├── products.js (CRUD + upload)
│   │   └── storeConfig.js (Get/update store config)
│   │
│   ├── 📂 /controllers (3 controllers)
│   │   ├── authController.js (Login, logout, getCurrentUser)
│   │   ├── productController.js (Create, list, update, remove)
│   │   └── storeConfigController.js (Get, update)
│   │
│   ├── 📂 /services (3 services)
│   │   ├── authService.js (Login - bcrypt + JWT)
│   │   ├── productService.js (Business logic produtos)
│   │   └── storeConfigService.js (Business logic config)
│   │
│   ├── 📂 /repositories (3 repos)
│   │   ├── userRepository.js (User queries)
│   │   ├── productRepository.js (Product queries)
│   │   └── storeConfigRepository.js (Store config queries)
│   │
│   ├── 📂 /middleware (5 middlewares)
│   │   ├── authMiddleware.js (JWT verify)
│   │   ├── errorHandler.js (Error handling)
│   │   ├── validators.js (Express-validator rules)
│   │   ├── rateLimiter.js (Express-rate-limit)
│   │   └── (implícito) CORS, Helmet, Morgan
│   │
│   ├── 📂 /utils
│   │   └── fileUtils.js (Delete uploaded files)
│   │
│   └── 📂 /uploads (Local storage for images)
│       └── [uploadedFiles...] (e.g., 1709000123-logo.png)
│
├── 📂 /plugins (Vite + Visual editor plugins)
│   ├── vite-plugin-iframe-route-restoration.js
│   ├── /selection-mode (2 files)
│   ├── /visual-editor (4 files)
│   └── /utils
│       └── ast-utils.js
│
└── 📂 /tools (Build tools)
    ├── generate-llms.js
    └── install-missing-components.js
```

### 🏗️ Separação Frontend/Backend

| Aspecto | Frontend | Backend |
|---------|----------|---------|
| **Framework** | React 18.3 + Vite | Express 4.18 |
| **Porta Dev** | 3000 (ou 5173 com Vite) | 3003 |
| **Linguagem** | ES6+ (JSX) | Node.js (CommonJS) |
| **Dependências** | Radix UI, Tailwind, Axios | PostgreSQL, bcrypt, JWT |
| **Build** | `npm run build` via Vite | Node.js direto |
| **Deploy** | Vercel/Netlify/Azure | Render/Railway/Heroku |

---

## 2️⃣ BACKEND - EXPRESS + POSTGRESQL

### 📌 Linguagem & Framework

- **Linguagem:** Node.js v18.x
- **Framework:** Express 4.18.2
- **Runtime:** CommonJS (require/module.exports)
- **Motor HTTP:** Default Express server (não clustering)

### 📄 Arquivo Principal

```
backend/server.js
```

**Responsabilidades:**
1. Carrega configuração (config/index.js)
2. Valida env vars (JWT_SECRET, DATABASE_URL, CORS_ORIGIN)
3. Setup Express (Helmet, CORS, Morgan, Rate limit)
4. Load routes (/auth, /products, /api/store-config)
5. Inicia DB e cria admin user
6. Startup e graceful shutdown (SIGTERM/SIGINT)

**Trust proxy:** Habilitado apenas em produção (`NODE_ENV === 'production'`)

### 🛣️ Rotas Existentes

#### **POST /auth/login** (public)
- Rate limited (authLimiter: 10 req/15min)
- Valida email + senha via bcrypt
- Gera JWT (validade 1d)
- Retorna httpOnly cookie + user { id, email }
- Status: 200 (sucesso) | 401 (invalid credentials)

#### **GET /auth/me** (protegido)
- Requer authMiddleware (JWT token em cookie)
- Retorna user { id, email }
- Status: 200 | 401 (token ausente/expirado)

#### **POST /auth/logout** (protegido)
- Limpa cookie token
- Status: 200

#### **GET /products** (public)
- Lista produtos:
  - Se autenticado: retorna produtos do user
  - Se anônimo: retorna TODOS os produtos
- Status: 200 | 500 (DB error)

#### **POST /products** (protegido)
- Rate limited (authLimiter)
- Upload de imagem via multer (diskStorage)
- Cria produto { name, image, link_oferta, user_id }
- Status: 200 (created) | 400 (validation) | 401 (not auth)

#### **PUT /products/:id** (protegido)
- Update produto (mesmo user ou admin)
- Suporta novo upload de imagem (remove antigo)
- Status: 200 | 404 (not found/not authorized) | 400 (validation)

#### **DELETE /products/:id** (protegido)
- Remove produto + imagem associada
- Status: 200 | 404 (not found/not authorized)

#### **GET /api/store-config** (public)
- Retorna config única { name, logo, banner, socialMedia }
- Status: 200 | 500

#### **PUT /api/store-config** (protegido)
- Atualiza config (logo, banner, socialMedia, etc.)
- Status: 200 | 404 | 401

### 🔐 Configuração CORS

**Arquivo:** `backend/server.js` (linhas ~32-44)

```javascript
const origins = config.corsOrigin.split(',').map(s => s.trim()).filter(Boolean);
app.use(
  cors({
    origin: origins.length > 1 ? origins : origins[0],
    credentials: true,  // Allow cookies
  })
);
```

**Requisito:** variável `CORS_ORIGIN` obrigatória  
**Formato:** URL única ou lista separada por vírgula  
**Ex .env:**
```
CORS_ORIGIN=http://localhost:3000,https://universalplace.com
```

**Behavior:**
- Se vazio na inicialização → **FALHA no startup**
- Se múltiplas origens → array de strings
- Se origem única → string direta
- `withCredentials` habilitada (requer credenciais nas requisições)

### 📸 Imagens — URLs externas

O sistema foi refatorado para **não aceitar uploads de arquivos locais**. Em vez disso as imagens (produto, logo, banner)
devem ser fornecidas como URLs externas no payload JSON.

Padrão das chamadas:
- `POST /products` — body JSON: `{ name, image, description, product_link }`
- `PUT /products/:id` — body JSON: `{ name, image, description, product_link }`
- `GET /api/store-config` — retorna `logo_url` e `banner_url` (strings)
- `PUT /api/store-config` — body JSON: `{ name, logo_url, banner_url, socialMedia }`

Não existe mais armazenamento local em `/backend/uploads`; qualquer lógica de arquivo local foi removida.
**Convenção filename:** `{timestamp}-{sanitized-name}`  
**Exemplo:** `1709000456-product_photo.jpg`

**URL pública gerada:**
```
backend baseUrl + "/uploads/" + filename
```

**Ex:**
- Local dev: `http://localhost:3003/uploads/1709000456-product_photo.jpg`
- Produção: `https://api.universalplace.com/uploads/...` (se BASE_URL definido) ou derivado de `req.protocol` + `req.get('host')`

**Limpeza de imagens:**
- Ao **UPDATE**: remove imagem antiga automaticamente (async, non-blocking)
- Ao **DELETE**: remove imagem associada
- Utilitário: `backend/utils/fileUtils.js`

### 🗄️ Banco de Dados - PostgreSQL

**Driver:** `pg` (^8.11.3)

**Connection String:**
```
postgresql://[user]:[password]@[host]:[port]/[database]
```

**Obfuscado do .env:**
```
postgresql://postgres:****@localhost:5432/universalplace
```

**Pool Config:**
```javascript
{
  max: 20,                          // Max connections
  idleTimeoutMillis: 30000,         // 30s idle timeout
  connectionTimeoutMillis: 10000,   // 10s connection timeout
  ssl: rejectUnauthorized: false    // Only in production
}
```

### 📊 Schema Principal

#### **TABELA: users**
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT DEFAULT 'user'
);
```

- Coluna `role` adicionada automaticamente se não existir (migração)
- Admin user criado no startup se não existir:
  - email: `matheuzinho0@icloud.com`
  - password: hash bcrypt (pré-determinado)
  - role: `admin`

#### **TABELA: products**
```sql
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  image TEXT,
  link_oferta TEXT,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE
);
```

- Foreign key `user_id` → CASCADE DELETE
- Index: `idx_products_user`

#### **TABELA: store_config**
```sql
CREATE TABLE store_config (
  id SERIAL PRIMARY KEY,
  config JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

- Single-row config (id=1) criada no init
- Armazena JSON com logo, banner, socialMedia, etc.

### 🔑 Autenticação & Segurança

#### **Password Hashing:** bcrypt
- Plain password → hash bcrypt (cost factor 10+)
- `bcrypt.hash(password, 10)`
- Login: `bcrypt.compare(plainPassword, hash)`

#### **JWT (JSON Web Token)**
- Algoritmo: HS256
- Secret: `process.env.JWT_SECRET` (obrigatório)
- Expiração: 1 dia
- Payload: `{ id: userId }`
- Verificação: `jwt.verify(token, secret, { algorithms: ['HS256'] })`

#### **Cookie JWT (httpOnly)**
```javascript
{
  httpOnly: true,                                    // Não acessível via JS
  secure: NODE_ENV === 'production',                // Apenas HTTPS em prod
  sameSite: NODE_ENV === 'production' ? 'strict' : 'lax',
  path: '/',
  maxAge: 24 * 60 * 60 * 1000                       // 1 dia
}
```

#### **Rate Limiting (express-rate-limit)**
- Global: 100 req/15min
- Auth endpoints: 10 req/15min
- Key generator: `req.ip` (com trust proxy habilitado)

### 📝 Variáveis de Ambiente (Backend)

**Obrigatórias:**
```env
PORT=3003
DATABASE_URL=postgresql://user:pass@host:5432/db
JWT_SECRET=your-secret-key-here
CORS_ORIGIN=http://localhost:3000
```

**Opcionais:**
```env
BASE_URL=https://api.universalplace.com  # Para URLs de upload em produção
NODE_ENV=production                      # Define comportamento (SSL, trust proxy)
```

**Validação no startup:**
```
Se falta alguma obrigatória → console.error + process.exit(1)
```

### 🚀 Estrutura em Camadas

```
Routes
  ↓
Controllers (Request/Response)
  ↓
Services (Business logic)
  ↓
Repositories (DB queries)
  ↓
Database (Pool)
```

**Exemplo fluxo POST /products:**
1. `routes/products.js` - valida, aplica auth
2. `controllers/productController.js` - gera URL de imagem
3. `services/productService.js` - valida, prepara dados
4. `repositories/productRepository.js` - executa INSERT
5. Retorna produto criado

---

## 3️⃣ FRONTEND - REACT + VITE

### 🎯 Framework & Entry Point

- **Framework:** React 18.3.1 (JSX)
- **Bundler:** Vite 5.x
- **Node:** 18.x
- **Entry point:** `src/main.jsx`

### 🌐 Configuração de API

**Arquivo:** `src/services/api.js`

```javascript
const API_URL = import.meta.env.VITE_API_URL;
if (!API_URL) {
  throw new Error('VITE_API_URL environment variable is required');
}

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,  // Include cookies
})
```

**Base URL definida por:** `VITE_API_URL` (env var injetada no build)

**Exemplo:**
```
Dev:  VITE_API_URL=http://localhost:3003
Prod: VITE_API_URL=https://api.universalplace.com
```

### 📍 URLs da API (Default)

Todas requisições usam base URL acima + endpoints:

```
POST /auth/login
GET  /auth/me
POST /auth/logout
GET  /products
POST /products (com upload)
PUT  /products/:id (com upload)
DELETE /products/:id
GET  /api/store-config
PUT  /api/store-config
```

### 📡 Requisições HTTP - Axios

**Arquivo:** `src/services/api.js` + `src/services/products.js`, `storeConfig.js`

**Classe:** `api` (Axios instance)

**Interceptor de resposta:**
```javascript
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      console.warn("API 401 response", err.config?.url);
    }
    return Promise.reject(err)
  }
)
```

**Serviços wrapper:**
- `fetchProducts()` - GET /products
- `createProduct(data, file)` - POST /products (FormData + file)
- `updateProductApi(id, data, file)` - PUT /products/:id
- `deleteProductApi(id)` - DELETE /products/:id
- `fetchStoreConfig()` - GET /api/store-config

### 🏠 Páginas Principais

#### **HomePage** (`/`)
- Listagem pública de produtos
- Paginação (12 por página)
- Banner dinâmico (store config)
- Status: público, sem auth

#### **AdminDashboard** (`/admin/dashboard`)
- CRUD de produtos (tabela + forms)
- Upload de imagens
- Gerenciamento de store config
- Status: protegido (ProtectedRoute)

#### **LoginPage** (`/admin/login`)
- Form login admin
- Valida email/senha
- Rota para register
- Status: público

#### **RegisterPage** (`/admin/register`)
- Form registro novo user
- Valida email + confirmação senha
- Status: público (⚠️ Será removido - sistema 1 admin)

#### **Páginas Estáticas**
- QuemSomos
- PrivacyPolicy
- TermsOfUse

### 📦 Como Produtos São Listados

**HomePage.jsx** (linhas ~31-40):
```javascript
const fetchData = async () => {
  try {
    const prods = await fetchProducts();
    setProducts(Array.isArray(prods) ? prods : []);
  } catch (err) {
    toast({ message: err.message });
  }
}
```

**Renderização (Grid):**
```jsx
{currentProducts.map(product => (
  <ProductCard 
    key={product.id} 
    product={product}
  />
))}
```

**Cada card exibe:**
- Imagem (ou placeholder)
- Nome do produto
- Link da oferta (botão clicável)
- Badge admin (se autenticado)

### 📋 Como Produtos São Criados

**AdminDashboard.jsx** (handleProductSubmit):
1. Abre modal `ProductForm`
2. Form coleta: file (image), name, link_oferta
3. Valida (image obrigatória)
4. Envia via `createProduct()`
5. POST /products com `FormData` (multipart)
6. Backend processa e retorna produto

**ProductForm.jsx:**
```jsx
const handleSubmit = async (e) => {
  e.preventDefault();
  const formData = new FormData();
  if (file) formData.append('image', file);
  formData.append('name', values.name);
  formData.append('link_oferta', values.link_oferta);
  
  await createProduct(formData);
}
```

### 🖼️ Como Imagens São Enviadas (atualizado)

Fluxo atual (após refactor):
1. Formulário aceita **URL da imagem** em um campo de texto (ex.: `image` ou `logo_url`).
2. No submit, o frontend envia JSON com `image` (string URL) — não usa FormData/multipart.
3. O backend grava a string no banco (`products.image`, `store_config.logo_url`, `store_config.banner_url`).
4. As imagens são carregadas no frontend diretamente pelo `src` do `img` com a URL fornecida.

Validações recomendadas:
- Verificar que `image`/`logo_url` são URLs válidas no frontend e backend.
- Fornecer fallback visual caso a URL não carregue.

### 🎨 UI & Estilização

- **CSS Framework:** Tailwind CSS 3.4.2
- **Component Library:** Shadcn UI (Radix + Tailwind)
- **Animações:** Framer Motion 11.15
- **Icons:** Lucide React 0.469

**Componentes Shadcn customizados:**
- Button, Input, Label
- Card, Dialog, AlertDialog
- Tabs, Table
- Toast (notificações)

### 🔐 Proteção de Rotas

**ProtectedRoute.jsx:**
```jsx
function ProtectedRoute({ children }) {
  const { currentUser } = useAuth();
  if (!currentUser) return <Navigate to="/admin/login" />;
  return children;
}
```

Uso:
```jsx
<Route 
  path="/admin/dashboard" 
  element={
    <ProtectedRoute>
      <AdminDashboard />
    </ProtectedRoute>
  } 
/>
```

### 🔄 State Management

- **Auth:** Context + Hooks (`AuthContext.jsx`)
- **UI State:** useState + useCallback (local component state)
- **Async State:** useState + useEffect (data fetching)
- ❌ Redux não usado

**AuthContext providencia:**
- `currentUser` (id, email)
- `login(email, password)`
- `logout()`

---

## 4️⃣ DEPLOY

### 📋 Arquivos & Scripts Deploy

**Frontend (Vercel/Netlify):**
```bash
npm run build  # Vite build → /dist
npm run preview
```

**Backend (Render/Railway):**
```bash
npm install
npm start  # Node backend/server.js
```

### 📝 Scripts package.json (Raiz)

```json
{
  "scripts": {
    "dev": "vite --host :: --port 3000",        // Frontend dev
    "build": "node tools/generate-llms.js || true && vite build",  // Build frontend
    "preview": "vite preview --host :: --port 3000",  // Preview built frontend
    "start:backend": "node backend/server.js",  // Start backend
    "dev:backend": "cd backend && nodemon server.js", // Dev backend
    "start": "npm run start:backend"             // Main start (backend)
  }
}
```

**Backend package.json:**
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

### 🌍 Variáveis de Ambiente para Deploy

#### **Backend (Render/Railway/Heroku)**

Obrigatórias:
```env
DATABASE_URL=postgresql://...
JWT_SECRET=sua-chave-secreta-forte
CORS_ORIGIN=https://seu-frontend.com
NODE_ENV=production
PORT=3003
```

Opcionais:
```env
BASE_URL=https://api.seu-dominio.com
```

#### **Frontend (Vercel/Netlify)**

Obrigatórias:
```env
VITE_API_URL=https://api.seu-backend.com
```

### 🚀 Configuração Específica para Render

**Backend em Render:**

1. **Conectar repositório GitHub**
2. **Environment variables:**
   - DATABASE_URL (Supabase ou similar)
   - JWT_SECRET (qualquer string forte)
   - CORS_ORIGIN (domínio frontend)
   - NODE_ENV=production
3. **Build command:** `npm install`
4. **Start command:** `npm start`
5. **Plans:** Web Service (Node) + PostgreSQL (Supabase)

**Frontend em Render:**
- Similar a Vercel (não recomendado)
- Melhor usar Vercel ou Netlify

### 📋 Processamento Deploy

**Backend startup em produção:**
1. Carrega env vars
2. Valida (JWT_SECRET, DATABASE_URL, CORS_ORIGIN)
3. Testa conexão PostgreSQL
4. Cria schema (users, products, store_config)
5. Migra coluna `role` se necessário
6. **Cria admin user (matheuzinho0@icloud.com)** ← Auto-created
7. Inicia servidor
8. Logs mostram portas e status

**Frontend build em produção:**
1. Vite injeta `VITE_API_URL`
2. Minifica bundle React
3. Otimiza imagens/assets
4. Gera `/dist` para deploy
5. Deploy simples (static files)

---

## 5️⃣ POSSÍVEIS PROBLEMAS EM PRODUÇÃO (RENDER)

### ⚠️ CRÍTICOS

#### **1. Upload Local Não Persistirá**
**Problema:** Render usa filesystem efêmero.  
**Impacto:** Imagens deletadas após deploy/restart.  
**Solução:** Migrar para S3/Cloudinary/Supabase Storage
```javascript
// Future: Em vez de diskStorage, use S3 upload
// const s3Upload = multerS3({
//   s3: new AWS.S3(),
//   bucket: process.env.S3_BUCKET,
//   key: (req, file, cb) => cb(null, `uploads/${Date.now()}-${file.originalname}`)
// })
```

#### **2. Conexão PostgreSQL SSL/TLS**
**Status:** ✅ Já configurado em `database.js`
```javascript
ssl: config.nodeEnv === 'production' ? { rejectUnauthorized: false } : false
```
**Verificar:** DATABASE_URL do provider deve suportar SSL (Render/Supabase sim)

#### **3. Variável CORS_ORIGIN Obrigatória**
**Status:** ✅ Já validada em `config/index.js`
**Risco:** Se vazio no deploy → **FALHA IMEDIATA**
**Fix:** Configurar em Render environment:
```
CORS_ORIGIN=https://seu-frontend.vercel.app
```

#### **4. JWT_SECRET Exposto**
**Status:** ✅ Obrigatório (config valida)
**Risco:** Se usar default/fraco → brecha segurança
**Fix:** Usar valor forte via `openssl rand -base64 32`

### ⚠️ ALTOS

#### **5. BASE_URL Não Definido**
**Problema:** URLs de imagem geradas com `req.protocol + req.get('host')`  
**Risco:** Em produção pode gerar URLs com IP interno (Render)  
**Solução:** Definir `BASE_URL` no env:
```env
BASE_URL=https://api.seu-dominio.com
```

#### **6. Domain Mispatch CORS**
**Problema:** Frontend em `https://app.com`, backend em `api.app.com`  
**Risco:** Se CORS_ORIGIN não é exata → 403 no browser  
**Fix:** Debugar com `console.log` no CORS setup

#### **7. Rate Limiting Muito Restritivo**
**Config atual:** 100 req/15min global, 10 req/15min auth  
**Risco:** Pode bloquear usuários legítimos sous carga  
**Monitor:** Verificar logs de 429 em produção

### ⚠️ MÉDIOS

#### **8. Frontend URL Hardcoded**
**Status:** ✅ Usando VITE_API_URL (dinâmico)  
**Antigo problema:** Se alguém usar `http://localhost:3003` → falha em production

#### **9. Banco Offline/Backup**
**Risco:** Sem backup automático PostgreSQL  
**Solução:** Render fornece daily backups (verificar plano)

#### **10. Timeout Conexão DB**
**Current:** 10s connection timeout  
**Risco:** Render PaaS pode ter latência variável  
**Monitor:** Ver logs de "connection timeout"

### ℹ️ INFORMATIVOS

#### **11. Node Version Mismatch**
**Requerido:** Node 18.x (especificado em package.json)  
**Render suporta:** Sim  
**Verificar:** Em Deploy, confirmar está usando Node 18.x

#### **12. Morgan Logging em Produção**
**Status:** Habilitado (não desabilitável)  
**Log volume:** ~200-500 MB/mês em usage normal  
**Monitor:** Via Render logs

#### **13. Admin User Auto-Created**
**Status:** ✅ Implementado  
**Log esperado:** `✅ [DB] Admin user created successfully` (primeira vez)  
**Posterior:** `✅ [DB] Admin user already exists`

---

## 📊 RESUMO TÉCNICO

| Componente | Tecnologia | Status | Risk |
|-----------|------------|--------|------|
| **Frontend** | React 18 + Vite + Tailwind | ✅ | Baixo |
| **Backend** | Express 4 + PostgreSQL | ✅ | Médio |
| **Auth** | JWT + bcrypt + httpOnly | ✅ | Baixo |
| **Images** | External URLs (no local storage) | ✅ | Baixo |
| **Deploy** | Render (Backend) + Vercel (Frontend) | ✅ | Médio |
| **CORS** | Dynamic baseado env var | ✅ | Médio |
| **SSL/TLS** | Postgres SSL produção | ✅ | Baixo |
| **Rate Limit** | express-rate-limit | ✅ | Médio |
| **Monitoring** | Logs Morgan + console | ⚠️ | Alto |

---

## 🎯 RECOMENDAÇÕES PRIORITÁRIAS

1. **[IMEDIATO]** Migrar uploads para S3/Cloudinary
2. **[IMEDIATO]** Definir JWT_SECRET forte em produção
3. **[IMEDIATO]** Configurar BASE_URL em Render
4. **[CURTO PRAZO]** Adicionar health check endpoint (`GET /health`)
5. **[CURTO PRAZO]** Implementar logging centralizado (Sentry/DataDog)
6. **[MÉDIO PRAZO]** Adicionar testes automatizados (Jest)
7. **[MÉDIO PRAZO]** Implementar rate limit por endpoint específico
8. **[LONGO PRAZO]** Migrar para TypeScript

---

**Análise Completa: ✅ CONCLUÍDA**  
**Pronto para produção:** ⚠️ Com melhorias em storage de images
