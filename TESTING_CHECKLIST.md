# 🧪 CHECKLIST DE TESTES - AUTENTICAÇÃO & PRODUTOS

## 🎯 Objetivo
Validar que o fluxo de autenticação e produtos funciona end-to-end após refatoração.

---

## 📋 TESTES LOCAIS (Docker)

### Pré-requisito
```bash
# Terminal 1
docker-compose up --build

# Terminal 2 (Frontend)
npm run dev

# Aguardar:
# - Backend respondendo em http://localhost:4000/health (ou similar)
# - Frontend em http://localhost:5173
# - Database pronto
```

---

## 1️⃣ APP LOAD - Sem Quebrar

- [ ] Abrir https://localhost:5173 (ou http://localhost:5173)
- [ ] Verificar console: **NÃO** deve ter erro 401
- [ ] Verificar console: **NÃO** deve ter warning "expected array"
- [ ] Página deve carregar normalmente
- [ ] Usuário deve estar `null` ou não autenticado
- [ ] Deve ir para LoginPage automaticamente

**Esperado**: Página carrega, usuário vê login form.  
**Status**: _____ (✅ / ❌ / ⚠️ )

---

## 2️⃣ LOGIN - Criar Sessão

### Login Correto
- [ ] Digitar email: `matheuzinho0@icloud.com`
- [ ] Digitar senha: `aninha123`
- [ ] Clicar "Login"
- [ ] Verificar console: **NÃO** deve ter erro
- [ ] Aguardar redirecionamento (2-3 segundos)
- [ ] Deve ser redirecionado para HomePage ou AdminDashboard
- [ ] Verificar localStorage/cookies: deve ter token JWT

**Esperado**: Login bem-sucedido, redirecionado para dashboard/home.  
**Status**: _____ (✅ / ❌ / ⚠️ )

### Login Incorreto
- [ ] Voltar para login (Logout first)
- [ ] Digitar email: `teste@incorreto.com`
- [ ] Digitar senha: `senhaErrada123`
- [ ] Clicar "Login"
- [ ] Verificar: Toast de erro deve aparecer (ou mensagem de erro)
- [ ] Verificar console: **NÃO** deve ter exceção não tratada
- [ ] Deve permanecer na LoginPage

**Esperado**: Erro exibido gentilmente, página não quebra.  
**Status**: _____ (✅ / ❌ / ⚠️ )

---

## 3️⃣ AUTENTICAÇÃO - Session Recovery

### Após Login
- [ ] Fazer login novamente (se fez logout nao passo anterior)
- [ ] Abrir Dev Tools → Application → Cookies
- [ ] Verificar presença de `token` (httpOnly)
- [ ] Verificar `httpOnly` flag
- [ ] Verificar `Secure` flag (localhost: pode estar ausente)
- [ ] Verificar `SameSite` flag

**Esperado**: Cookie com JWT presente.  
**Status**: _____ (✅ / ❌ / ⚠️ )

### Page Reload (Restaurar Sessão)
- [ ] Estar logado
- [ ] Pressionar F5 (refresh page)
- [ ] Aguardar 1-2 segundos
- [ ] Verificar console: **NÃO** deve ter erro 401
- [ ] Verificar console: **NÃO** deve ter warning "expected array"
- [ ] Deve permanecer logado
- [ ] Deve permanecer na mesma página (ou voltar para home)

**Esperado**: Sessão restaurada silenciosamente, usuário permanece logado.  
**Status**: _____ (✅ / ❌ / ⚠️ )

---

## 4️⃣ PRODUCTS - CRUD Operations

### Admin Dashboard Access
- [ ] Estar logado como admin
- [ ] Navegar para Admin Dashboard (ou Painel de Controle)
- [ ] Verificar: deve abrir sem erro
- [ ] Verificar console: **NÃO** deve ter erro 401
- [ ] Verificar console: **NÃO** deve ter "expected array but got"

**Esperado**: Dashboard carrega, sem erros.  
**Status**: _____ (✅ / ❌ / ⚠️ )

### List Products on Dashboard
- [ ] Dashboard deve exibir lista de produtos
- [ ] Se lista vazia: deve mostrar "No products"
- [ ] Se produtos existem: deve listar todos
- [ ] Verificar console: **NÃO** deve ter warning de tipo

**Esperado**: Produtos aparecem ou "No products" aparece (sem erro).  
**Status**: _____ (✅ / ❌ / ⚠️ )

### Create Product
- [ ] Clicar novo produto ou "Add Product"
- [ ] Preencher formulário:
  - [ ] Nome: "Produto Teste XYZ"
  - [ ] Descrição: "Uma descrição qualquer"
  - [ ] Preço: "99.99"
  - [ ] Estoque: "10"
- [ ] Clicar "Salvar" ou "Criar"
- [ ] Verificar console: **NÃO** deve ter erro
- [ ] Verificar: "Success" toast deve aparecer (ou similar)
- [ ] Verificar: Formulário deve fechar ou limpar
- [ ] Verificar: Novo produto deve aparecer **imediatamente** na lista

**Esperado**: Produto criado, aparece na lista, sem erro.  
**Status**: _____ (✅ / ❌ / ⚠️ )

### View on Homepage
- [ ] Navegar para Homepage
- [ ] Verificar: Novo produto deve aparecer na homepage
- [ ] Verificar: Nome e preço devem estar corretos
- [ ] Verificar console: **NÃO** deve ter erro

**Esperado**: Produto visível na home imediatamente.  
**Status**: _____ (✅ / ❌ / ⚠️ )

### Edit Product
- [ ] Voltar para AdminDashboard
- [ ] Encontrar produto criado
- [ ] Clicar "Editar" ou pen icon
- [ ] Modificar um campo (ex: preço para "150.00")
- [ ] Clicar "Salvar"
- [ ] Verificar console: **NÃO** deve ter erro
- [ ] Verificar: "Success" toast deve aparecer
- [ ] Verificar: Lista deve atualizar imediatamente

**Esperado**: Edição salva, lista atualizada.  
**Status**: _____ (✅ / ❌ / ⚠️ )

### Delete Product
- [ ] Localizar produto editado
- [ ] Clicar "Deletar" ou trash icon
- [ ] Confirmar delete (se houver dialog)
- [ ] Verificar console: **NÃO** deve ter erro
- [ ] Verificar: "Success" toast deve aparecer
- [ ] Verificar: Produto deve desaparecer **imediatamente** da lista

**Esperado**: Produto deletado, lista atualizada.  
**Status**: _____ (✅ / ❌ / ⚠️ )

### Verify Delete on Homepage
- [ ] Navegar para Homepage
- [ ] Verificar: Produto deletado **não** deve aparecer

**Esperado**: Produto ausente da home.  
**Status**: _____ (✅ / ❌ / ⚠️ )

---

## 5️⃣ LOGOUT - Limpar Sessão

- [ ] Estar logado
- [ ] Clicar "Logout" (ou perfil → logout)
- [ ] Verificar console: **NÃO** deve ter erro
- [ ] Verificar: Deve ser redirecionado para LoginPage
- [ ] Abrir Dev Tools → Application → Cookies
- [ ] Verificar: Cookie `token` deve estar ausente (ou expirado)
- [ ] Verificar localStorage: deve estar limpo

**Esperado**: Logout completo, sessão destruída.  
**Status**: _____ (✅ / ❌ / ⚠️ )

### After Logout
- [ ] Pressionar back button
- [ ] Verificar: Deve ir para LoginPage (não voltar para dashboard)

**Esperado**: ProtectedRoute funciona, redireciona para login.  
**Status**: _____ (✅ / ❌ / ⚠️ )

---

## 🖥️ CONSOLE CHECK

Abrir Dev Tools (F12) → Console e verificar:

- [ ] **NÃO** deve haver erro vermelho tipo:
  - "Cannot read property 'user' of undefined"
  - "Cannot read property 'data' of undefined"
  - "Expected array but got object"
- [ ] **NÃO** deve haver warning tipo:
  - "fetchProducts: data is not array"
  - "401 Unauthorized"
- [ ] Deve haver apenas logs estruturados (se houver)
- [ ] Pode haver `console.debug` (é normal)

**Status**: _____ (✅ / ❌ / ⚠️ )

---

## 🌐 NETWORK CHECK

Abrir Dev Tools → Network tab e verificar:

### Login Request
- [ ] POST `/auth/login` → Status 200
- [ ] Response: `{ success: true, data: user, message: '...' }`
- [ ] Set-Cookie header presente (com token)

### Get Product List
- [ ] GET `/products` → Status 200
- [ ] Response: `{ success: true, data: [...] }`
- [ ] Não deve ser array direto: deve ser objeto

### Create Product
- [ ] POST `/products` → Status 201 ou 200
- [ ] Response: `{ success: true, data: {...}, message: '...' }`

### All Requests
- [ ] **NÃO** deve haver 401 no /auth/me durante app load
- [ ] **NÃO** deve haver CORS error
- [ ] Todos os erros devem vir com `{ success: false, message: '...' }`

**Status**: _____ (✅ / ❌ / ⚠️ )

---

## 📊 RESULTADO FINAL

### Checklist Summary
- [x] Total de Testes: **19 categorias**
- [ ] Todos Passando (21/21): **PRONTO PARA PRODUÇÃO** ✅
- [ ] Alguns Falhando: **REVISAR ANTES DE DEPLOY** ⚠️
- [ ] Críticos Falhando: **NÃO DEPLOYAR** ❌

### Bloqueadores para Produção
Se algum destes falhar, **NÃO FAZER DEPLOY**:
- [ ] App load sem 401 error
- [ ] Login funciona
- [ ] Produtos criam e aparecem
- [ ] Logout funciona
- [ ] Console limpo (sem erros vermelhos)

---

## 🚀 Próximos Passos

### Se Tudo OK (✅ x19)
```bash
# Deployar para Render
git push
# Render faz deploy automaticamente
# Verificar em produção com testes similares
```

### Se Algum Falhar (⚠️)
```bash
# Revisar log específico
# Verificar console/network
# Ver seção de Debugging abaixo
```

---

## 🐛 Debugging

### Erro: "Cannot read property 'user' of undefined"
**Provável causa**: AuthContext tentando acessar `data.user` mas API retorna `data` (user).  
**Solução**: Verificar src/contexts/AuthContext.jsx linha ~35

### Erro: "expected array but got object"  
**Provável causa**: fetchProducts esperando array mas recebendo `{ success, data }`.  
**Solução**: Verificar src/services/products.js linha ~5, deve extrair `response?.data`

### Erro: "401 Unauthorized" no /auth/me
**Provável causa**: Cookie não está sendo enviado ou JWT expirou.  
**Solução**: 
- Verificar CORS (withCredentials: true em axios)
- Verificar cookie no browser
- Re-fazer login

### Erro: Produtos não aparecem no dashboard
**Provável causa**: fetchProducts retornando `undefined` ou erro não capturado.  
**Solução**:
- Abrir Network tab
- Verificar resposta de GET /products
- Revisar console para error

---

## 📝 Notas

- Testes locais devem levar **~15 minutos**
- Após produção, repetir testes com URL real (ex: https://seu-app.render.com)
- Se usar HTTPS local, criar certificado com `mkcert`
- Cookies devem ter `Secure` flag em HTTPS (automático em prod)

