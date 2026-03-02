# 🗺️ FLUXO DA APLICAÇÃO - MAPA VISUAL

## 🚀 Visão Geral do Sistema

```
┌─────────────────────────────────────────────────────────────────┐
│                    UNIVERSALPLACE STACK                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Frontend (React 18 + Vite)  ←→  Backend (Node.js + Express)  │
│  http://localhost:5173           http://localhost:4000         │
│                                                                 │
│  └─────────→ Database (PostgreSQL)                            │
│              postgresql://localhost:5432                       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔐 FLUXO DE AUTENTICAÇÃO

```
┌─────────────────────────────────────────────────────────────────┐
│                     1. APP LOAD                                 │
│  browser loads → React App monta → AuthContext inicia          │
└──────────────────────────┬──────────────────────────────────────┘
                            │
                            ↓
         ┌──────────────────────────────────────────┐
         │  AuthContext.checkAuth() useEffect       │
         │  → api.get('/auth/me')                   │
         └────────────┬─────────────────────────────┘
                      │
        ┌─────────────┴─────────────┐
        │                           │
        ↓ 200 OK ✅               ↓ 401 ❌
     
    { success: true,        (catch silencioso)
      data: user }          setCurrentUser(null)
      ↓                     setLoading(false)
   setCurrentUser(user)     ↓
   setLoading(false)     Ir para LoginPage
        │                   │
        ↓                   ↓
    Ir para Home        LoginPage pronta
```

---

## 📝 FLUXO DE LOGIN

```
┌─────────────────────────────────────────────────────────────────┐
│                     USER SUBMITS LOGIN                          │
│  email: matheuzinho0@icloud.com                                │
│  password: aninha123                                            │
└──────────────────────────┬──────────────────────────────────────┘
                            │
                            ↓
         ┌──────────────────────────────────────────┐
         │  authService.login(email, password)      │
         │  → api.post('/auth/login')               │
         └────────────┬─────────────────────────────┘
                      │
        ┌─────────────┴─────────────────────────────┐
        │                                           │
        ↓ Backend: /auth/login                     
        
   1. Buscar user por email (userRepository)
   2. Verificar password com bcrypt (match?)
   3. Gerar JWT token (HS256, 15min)
   4. Setar cookie httpOnly
   5. Retornar response
        
        ↓
     { success: true,
       data: { id, email, role },
       message: "Login successful" }
        │
        ├─ Set-Cookie: token=[JWT] ✅
        │              httpOnly=true
        │              Secure=true (prod)
        │              SameSite=none
        │
        ↓ Frontend recebe
        
   1. Salvar em AuthContext (setCurrentUser)
   2. Limpar erro anterior (se houver)
   3. Redirecionar para Home/Dashboard

        ↓ Sucesso! ✅
        
   Browser mostra Home com usuário logado
```

---

## 📦 FLUXO DE PRODUTOS - LISTAR

```
┌─────────────────────────────────────────────────────────────────┐
│                   USER OPEN DASHBOARD                           │
│              AdminDashboard component monta                      │
└──────────────────────────┬──────────────────────────────────────┘
                            │
                            ↓
         ┌──────────────────────────────────────────┐
         │  useEffect → fetchProducts()             │
         │  → api.get('/products')                  │
         └────────────┬─────────────────────────────┘
                      │
        ┌─────────────┴─────────────────────────────┐
        │                                           │
        ↓ Backend: /products (protected)
        
   1. authMiddleware verifica JWT no cookie
   2. Decodifica JWT (HS256)
   3. Verifica user_id no JWT válido
   4. Busca produtos por user_id (productRepository)
   5. Retorna todos ou []
        
        ↓
     { success: true,
       data: [
         { id: 1, name: "Product", price: 99.99, stock: 10 },
         { id: 2, name: "Product 2", price: 49.99, stock: 5 }
       ] }
        │
        ├─ Cookie incluído automaticamente (withCredentials)
        │
        ↓ Frontend recebe
        
   1. Destructure: const { data: response } = res
   2. Extract: const products = response?.data
   3. Validar: if (!Array.isArray(products)) return []
   4. setState(products)

        ↓ Sucesso! ✅
        
   Dashboard mostra lista de produtos em tabela
```

---

## ➕ FLUXO DE PRODUTOS - CRIAR

```
┌─────────────────────────────────────────────────────────────────┐
│                  USER CLICA "NEW PRODUCT"                       │
│              ProductForm dialog abre                             │
└──────────────────────────┬──────────────────────────────────────┘
                            │
                     ┌──────┴────────┐
                     │               │
                ✓ Form            ✗ Cancel
                preenchido         → Dialog fecha
                     │
                     ↓ User clica SAVE
                     
         ┌──────────────────────────────────────────┐
         │  createProduct(formData)                  │
         │  → api.post('/products', formData)       │
         └────────────┬─────────────────────────────┘
                      │
        ┌─────────────┴─────────────────────────────┐
        │                                           │
        ↓ Backend: POST /products (protected)
        
   1. authMiddleware verifica JWT
   2. validators.js valida body (Zod schema)
      → name: string
      → price: number > 0
      → stock: number >= 0
   3. Se invalid → return { success: false, message: '...' }
   4. Se valid:
      - productService.createProduct()
      - INSERT INTO products (user_id, name, price, ...)
      - Retorna produto criado
      
        ↓
     { success: true,
       data: { id: 3, name: "New", price: 99.99, ... },
       message: "Product created successfully" }
        │
        ├─ Status: 201 Created
        ├─ Cookie incluído
        │
        ↓ Frontend recebe
        
   1. Destructure: const { data: response } = res
   2. Extract: return response?.data
   3. Mostrar toast: "Success!"
   4. Refetch produtos (GET /products novamente)
   5. Fechar dialog

        ↓ Sucesso! ✅
        
   Dashboard atualiza, novo produto aparece imediatamente
```

---

## ✏️ FLUXO DE PRODUTOS - EDITAR

```
┌─────────────────────────────────────────────────────────────────┐
│                USER CLICA EDIT (pen icon)                       │
│              ProductForm dialog abre com dados preenchidos      │
└──────────────────────────┬──────────────────────────────────────┘
                            │
                     ┌──────┴────────┐
                     │               │
                ✓ Form            ✗ Cancel
                modificado         → Dialog fecha
                     │
                     ↓ User clica SAVE
                     
         ┌──────────────────────────────────────────┐
         │  updateProductApi(id, formData)          │
         │  → api.put('/products/:id', formData)    │
         └────────────┬─────────────────────────────┘
                      │
        ┌─────────────┴─────────────────────────────┐
        │                                           │
        ↓ Backend: PUT /products/:id (protected)
        
   1. authMiddleware verifica JWT
   2. validators.js valida body (Zod schema)
   3. Verificar product_id existe
   4. Verificar belongs_to user (segurança)
   5. UPDATE products SET ... WHERE id = :id
   6. Retorna produto atualizado

        ↓
     { success: true,
       data: { id: 3, name: "Updated", price: 149.99, ... } }
        │
        ↓ Frontend recebe
        
   1. Destructure + extract: response?.data
   2. Mostrar toast: "Success!"
   3. Refetch produtos
   4. Fechar dialog

        ↓ Sucesso! ✅
        
   Dashboard atualiza, preço agora é 149.99
```

---

## 🗑️ FLUXO DE PRODUTOS - DELETAR

```
┌─────────────────────────────────────────────────────────────────┐
│                USER CLICA DELETE (trash icon)                   │
│              Confirmation dialog aparece                         │
└──────────────────────────┬──────────────────────────────────────┘
                            │
                     ┌──────┴────────┐
                     │               │
                ✓ Confirma      ✗ Cancela
                     │               (dialog fecha)
                     ↓
         ┌──────────────────────────────────────────┐
         │  deleteProductApi(id)                    │
         │  → api.delete('/products/:id')           │
         └────────────┬─────────────────────────────┘
                      │
        ┌─────────────┴─────────────────────────────┐
        │                                           │
        ↓ Backend: DELETE /products/:id (protected)
        
   1. authMiddleware verifica JWT
   2. Verificar product_id existe
   3. Verificar belongs_to user (segurança)
   4. DELETE FROM products WHERE id = :id
   5. Retorna null ou deleted product

        ↓
     { success: true,
       data: null,
       message: "Product deleted successfully" }
        │
        ↓ Frontend recebe
        
   1. Destructure + extract: response?.data
   2. Mostrar toast: "Success!"
   3. Refetch produtos (GET /products novamente)
   4. Fechar dialog

        ↓ Sucesso! ✅
        
   Dashboard atualiza, produto desaparece da lista
```

---

## 🚪 FLUXO DE LOGOUT

```
┌─────────────────────────────────────────────────────────────────┐
│                USER CLICA LOGOUT                                │
│              Navbar → Profile → Logout botão                    │
└──────────────────────────┬──────────────────────────────────────┘
                            │
                            ↓
         ┌──────────────────────────────────────────┐
         │  authService.logout()                    │
         │  → api.post('/auth/logout')              │
         └────────────┬─────────────────────────────┘
                      │
        ┌─────────────┴─────────────────────────────┐
        │                                           │
        ↓ Backend: POST /auth/logout
        
   1. authMiddleware verifica JWT (verificar user)
   2. Nenhuma ação no DB necessária
   3. Retornar response

        ↓
     { success: true,
       message: "Logged out successfully" }
        │
        ├─ Set-Cookie: token="" (limpar)
        │   Max-Age: 0
        │
        ↓ Frontend recebe
        
   1. Limpar AuthContext:
      - setCurrentUser(null)
      - setLoading(false)
   2. Redirecionar para LoginPage
   3. Limpar localStorage (se houver)

        ↓ Sucesso! ✅
        
   Browser redireciona para login
   Cookie deletado no browser
```

---

## 🔄 ERROR HANDLING

```
QUALQUER REQUEST PODE FALHAR:

       Request
          │
          ↓
   ┌──────────────────┐
   │ Network Error?   │
   └──────┬───────────┘
          │
      Sim ↓ Não
      │    └─→ Server Response?
      │        │
      │        ├─ 200-299: ✅ Sucesso
      │        ├─ 400-499: ⚠️ Client Error (validação?)
      │        ├─ 401: 🔐 Não autorizado (re-login?)
      │        └─ 500-599: ❌ Server Error (retry?)
      │
      └─→ Frontend: catch error
          1. Verificar tipo de erro
          2. Se auth: pode redirecionar login
          3. Se 400: mostrar mensagem de validação
          4. Se 500: mostrar "Server error, try again"
          5. Nunca deixar quebrar a UI
```

---

## 📱 HTTP REQUESTS - SEQUENCE

```
LOGIN:
1. POST /auth/login (email, password)
   ← 200 { success: true, data: user }
   ← Set-Cookie: token=[JWT]

2. GET /auth/me (verificar sessão)
   → Cookie: token=[JWT]
   ← 200 { success: true, data: user }

PRODUCTS (com autenticação):
3. GET /products
   → Cookie: token=[JWT]
   ← 200 { success: true, data: [...] }

4. POST /products (criar)
   → Cookie: token=[JWT]
   → Body: { name, price, stock }
   ← 201 { success: true, data: newProduct }

5. PUT /products/:id (editar)
   → Cookie: token=[JWT]
   → Body: { name?, price?, stock? }
   ← 200 { success: true, data: updatedProduct }

6. DELETE /products/:id (deletar)
   → Cookie: token=[JWT]
   ← 200 { success: true, data: null }

LOGOUT:
7. POST /auth/logout
   → Cookie: token=[JWT]
   ← 200 { success: true }
   ← Set-Cookie: token="" (limpar)
```

---

## 🛡️ MIDDLEWARES - ORDEM DE EXECUÇÃO

```
Express Request Pipeline:

Request chega
    ↓
1. bodyParser (parse JSON)
    ↓
2. cors (verificar uma origem)
    ↓
3. cookie-parser (ler cookies)
    ↓
4. logger (log request)
    ↓
5. Para routes que precisam auth:
   authMiddleware (verificar JWT no cookie)
    ↓
6. Para criar/editar:
   validators (validar body com Zod)
    ↓
7. Route handler (controller)
    ↓
8. Erro durante processamento?
   → errorHandler middleware
    ↓
Response
```

---

## 💾 DATABASE - SCHEMA

```
┌──────────────────────────────────────────────────────────────┐
│                  POSTGRESQL DATABASE                         │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  TABLE: users                                                │
│  ├─ id (PK)                                                  │
│  ├─ email (UNIQUE, INDEX)                                   │
│  ├─ password (hashed + salt bcrypt)                         │
│  ├─ role (admin | user)                                     │
│  └─ created_at (timestamp)                                  │
│                                                              │
│  TABLE: products                                             │
│  ├─ id (PK)                                                  │
│  ├─ user_id (FK → users.id, INDEX)                         │
│  ├─ name                                                     │
│  ├─ description                                              │
│  ├─ price                                                    │
│  ├─ stock                                                    │
│  ├─ created_at (timestamp)                                  │
│  └─ updated_at (timestamp)                                  │
│                                                              │
│  TABLE: store_config                                         │
│  ├─ id (PK)                                                  │
│  ├─ user_id (FK → users.id, UNIQUE)                        │
│  ├─ store_name                                              │
│  ├─ settings (JSONB)                                        │
│  └─ created_at (timestamp)                                  │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## 🎨 SECURITY LAYERS

```
┌─────────────────────────────────────────────────────────────────┐
│                      SECURITY STACK                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Layer 1: NETWORK                                             │
│  ├─ HTTPS only (Secure flag em cookies)                       │
│  ├─ SameSite=none (prevent CSRF)                              │
│  ├─ HttpOnly cookies (no JS access)                           │
│  └─ CORS whitelist (origin validation)                        │
│                                                                │
│  Layer 2: AUTHENTICATION                                      │
│  ├─ Bcrypt password hashing (10 rounds)                       │
│  ├─ JWT HS256 (15 min expiry)                                 │
│  ├─ Token in cookie (não localStorage)                        │
│  └─ Session verification (/auth/me)                           │
│                                                                │
│  Layer 3: AUTHORIZATION                                       │
│  ├─ authMiddleware (verify JWT)                               │
│  ├─ Role-based access (admin vs user)                         │
│  ├─ User isolation (user_id validation)                       │
│  └─ ProtectedRoute (frontend guards)                          │
│                                                                │
│  Layer 4: VALIDATION                                          │
│  ├─ Zod schemas (input validation)                            │
│  ├─ Type checking                                             │
│  ├─ Range validation (price > 0)                              │
│  └─ Length validation (name max 255)                          │
│                                                                │
│  Layer 5: ERROR HANDLING                                      │
│  ├─ Global error handler                                      │
│  ├─ No stack traces in prod                                   │
│  ├─ Structured logging                                        │
│  └─ Silent failures (no UI breaks)                            │
│                                                                │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🌐 DEPLOYMENT ARCHITECTURE

```
┌──────────────────────────────┐
│    Browser (HTTPS)           │
│  https://seu-app.vercel.app  │
│  [React Frontend - Vercel]   │
└────────────┬─────────────────┘
             │
             │ fetch/axios
             ↓
┌──────────────────────────────┐
│   Backend (HTTPS)            │
│ https://api.onrender.com     │
│ [Node.js API - Render]       │
│                              │
│  ├─ Express routes           │
│  ├─ Controllers              │
│  ├─ Services                 │
│  └─ Middlewares              │
└────────────┬─────────────────┘
             │
             │ SQL
             ↓
┌──────────────────────────────┐
│   Database (HTTPS)           │
│   PostgreSQL 15              │
│   [Managed - Render]         │
│                              │
│  ├─ users table              │
│  ├─ products table           │
│  └─ store_config table       │
└──────────────────────────────┘
```

---

## ✅ FLOW Summary

1. **User abre app** → AuthContext verifica /auth/me → login ou home
2. **User faz login** → POST /auth/me → cookie set → redirect home
3. **User view produtos** → GET /products (cookie enviado) → lista
4. **User cria produto** → POST /products → refetch → novo aparece
5. **User edita produto** → PUT /products/:id → refetch → atualiza
6. **User deleta produto** → DELETE /products/:id → refetch → remove
7. **User faz logout** → POST /logout → cookie limpo → redirect login

**Tudo funciona com:**
- ✅ Responses padronizadas
- ✅ Middleware de auth
- ✅ Error handling global
- ✅ Logging estruturado
- ✅ Segurança em layers

