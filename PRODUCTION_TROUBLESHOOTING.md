# 🔧 Troubleshooting - Erros em Produção (Render)

## ❌ Erro: "404 ao fazer login"

### Causa Raiz
A variável `VITE_API_URL` não está configurada no Vercel, então frontend não sabe para onde enviar requisições.

### Solução

#### 1. Verificar se `VITE_API_URL` está no Vercel
```
Vercel Dashboard → Seu projeto → Settings → Environment Variables
```

Procurar por `VITE_API_URL`. Se não estiver:

#### 2. Adicionar `VITE_API_URL`
```
Name: VITE_API_URL
Value: https://seu-backend.onrender.com
```

#### 3. Fazer Redeploy
```
Vercel Dashboard → seu projeto → Deployments
Clicar no último deploy → "Redeploy"
```

#### 4. Aguardar 2-3 min e testar

---

## ❌ Erro: "/auth/me retorna 401"

### Esperado Quando
- Usuário não está logado
- Token expirou
- Cookie não está sendo enviado

### Verificar

1. **Cookie está sendo enviado?**
   - F12 → Network → qualquer requisição
   - Procurar por "Cookie" header
   - Deve ter `token=...`

2. **Se não tem cookie:**
   - Fazer login novamente
   - Verificar se login foi bem-sucedido (sem erro 404)
   - Verificar se cookie tem `Secure` flag (HTTPS)

3. **Se tem cookie mas ainda recebe 401:**
   - Token pode estar expirado (15 min)
   - Fazer logout/login novamente

---

## ❌ Erro: "fetchProducts expected array but got Object"

### Causa
Backend retorna `{ success: true, data: [...] }` mas frontend esperava formato diferente.

### Verificação

#### 1. Verificar resposta do backend
```
F12 → Network → GET /products
Response → deve ser:
{
  "success": true,
  "data": [
    { "id": 1, "name": "...", "price": ... },
    ...
  ]
}
```

#### 2. Se response é diferente
Seu backend pode estar retornando formato antigo. Atualizar `/products` controller.

#### 3. Se response é correto
Frontend deve estar extraindo `response?.data` corretamente.

**Verificar em `src/services/products.js`:**
```javascript
const { data: response } = await api.get('/products');
const products = response?.data;  // ← deve ser isso
```

---

## ❌ Erro: "Store config falha ao carregar"

### Verificar

#### 1. `/api/store-config` existe?
```
F12 → Network → GET /api/store-config
Status: 200 ✅ ou 404 ❌?
```

#### 2. Se 404
Backend não tem rota stock config. Verificar se `backend/routes/storeConfig.js` está montado em `server.js`:

```javascript
app.use("/api/store-config", require("./routes/storeConfig"))
```

#### 3. Se 200 mas erro persiste
Response pode estar em formato incorreto. Verificar se backend retorna:

```javascript
{ success: true, data: { name: "...", logo: "..." } }
```

Não:
```javascript
{ config: { ... } }  // ❌ errado
```

---

## ❌ Erro: CORS bloqueado

### Sintoma
```
Access to XMLHttpRequest at 'https://...' from origin 'https://...' 
has been blocked by CORS policy
```

### Verificar

#### 1. URLs exatas
- Frontend: `https://seu-app.vercel.app`
- Backend: `https://seu-backend.onrender.com`

#### 2. CORS_ORIGIN no backend
```
Render Dashboard → seu backend → Environment
CORS_ORIGIN=https://seu-app.vercel.app
```

Deve ser EXATAMENTE a URL do frontend.

#### 3. Redeploy se mudou
Se mudou `CORS_ORIGIN`, Render faz redeploy automático.

#### 4. Testar depois
```
F12 → Network → qualquer requisição POST/PUT/DELETE
Headers → "Access-Control-Allow-Origin" deve estar presente
```

---

## ✅ Checklist de Diagnóstico

- [ ] `VITE_API_URL` existe em Vercel
- [ ] `VITE_API_URL=https://seu-backend.onrender.com` (exato)
- [ ] `CORS_ORIGIN` em Render backend
- [ ] `CORS_ORIGIN=https://seu-app.vercel.app` (exato)
- [ ] Vercel fez redeploy após adicionar `VITE_API_URL`
- [ ] F12 Network mostra status 200 em `/auth/login`
- [ ] F12 Network mostra `{ success: true, data: ... }`
- [ ] Cookies estão sendo enviados
- [ ] Console limpo (sem erros vermelhos)

---

## 🔍Ferramentas de Debug

### Network Tab (F12)
```
POST /auth/login
Status: 200 ✅
Response: { success: true, data: { id: ..., email: ..., role: ... } }
Headers (response): Set-Cookie: token=...
```

### Console (F12)
```
Deve se r silencioso (exceto logs informativos)
NÃO deve ter:
- XMLHttpRequest errors
- 404 errors
- CORS errors
- "expected array but got Object"
```

### Cookies (F12)
```
Application → Cookies → seu-app.vercel.app
token cookie deve estar presente
httpOnly: ✅
Secure: ✅ (em HTTPS)
SameSite: ✅ (Lax ou None)
```

---

## 📞 Se Nada Funcionar

1. Verificar logs do backend:
   ```
   Render Dashboard → seu Web Service → Logs
   Procurar por erros de compilação ou runtime
   ```

2. Verificar logs do database:
   ```
   Render Dashboard → seu Database → Logs
   Procurar por erros de conexão
   ```

3. Testar API diretamente:
   ```bash
   curl -X POST https://seu-backend.onrender.com/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"matheuzinho0@icloud.com","password":"aninha123"}'
   ```

   Deve retornar:
   ```json
   { "success": true, "data": { "id": 1, "email": "...", "role": "..." } }
   ```

---

## 🚀 Após Resolver

1. Fazer login
2. Criar um produto
3. Verificar que aparece na homepage
4. Editar produto
5. Deletar produto
6. Logout

Se tudo funcionar → **Sistema pronto!** ✅

