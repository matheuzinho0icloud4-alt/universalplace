# 🚀 Configuração de Produção - UniversalPlace

## ⚠️ CRÍTICO: Configurar VITE_API_URL no Vercel

Se você está recebendo **erro 404 ao fazer login**, é porque `VITE_API_URL` não está configurado.

---

## 1️⃣ Configurar Backend no Render

### Passo 1: Criar Web Service
1. Ir para https://dashboard.render.com
2. Clicar "New +" → "Web Service"
3. Conectar seu repositório GitHub

### Passo 2: Configurar Build
```
Name: universalplace-api
Environment: Node
Build Command: npm install
Start Command: npm start
Instance Type: Free
```

### Passo 3: Adicionar Environment Variables
No Render Dashboard → Web Service → Environment:

```
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@host:5432/dbname
JWT_SECRET=seu-secret-super-seguro-aleatorio-aqui
CORS_ORIGIN=https://seu-frontend.vercel.app
```

⚠️ **Guardar a URL do Backend que aparece após deploy** (ex: `https://universalplace-api.onrender.com`)

---

## 2️⃣ Configurar Frontend no Vercel

### Passo 1: Conectar Repositório
1. Ir para https://vercel.com
2. Clicar "Add New" → "Project"
3. Selecionar seu repositório GitHub

### Passo 2: Configurar Build (automático)
Vercel detecta Vite automaticamente. Apenas confirmar.

### Passo 3: ⚠️ Adicionar Environment Variable CRÍTICA

**NO VERCEL DASHBOARD:**

Settings → Environment Variables

Adicionar:
```
VITE_API_URL=https://universalplace-api.onrender.com
```

❌ **ISSO É CRÍTICO!** Sem isso, frontend não consegue encontrar o backend.

### Passo 4: Fazer Deploy
Clicar "Deploy"

Após deploy (2-3 min), Vercel mostrará URL do frontend (ex: `https://seu-app.vercel.app`)

---

## 3️⃣ Atualizar CORS no Backend

Agora que sabe a URL do frontend, atualizar `CORS_ORIGIN`:

1. Ir para https://dashboard.render.com
2. Clicar no Web Service
3. Clicar "Environment"
4. Editar `CORS_ORIGIN`:
```
CORS_ORIGIN=https://seu-app.vercel.app
```
5. Salvar

Render vai fazer **redeploy automático**.

---

## ✅ Checklist de Configuração

- [ ] Database PostgreSQL criada no Render
- [ ] Backend deployado no Render
- [ ] Frontend deployado no Vercel
- [ ] `VITE_API_URL` configurado no Vercel
- [ ] `CORS_ORIGIN` configurado no Render backend
- [ ] URLs testadas em produção

---

## 🧪 Testar Depois de Deploy

### 1. Testar Frontend
```
https://seu-app.vercel.app
```
- Deve carreguer sem erros
- Deve ir para login

### 2. Testar Login
```
Email: matheuzinho0@icloud.com
Senha: aninha123
```
- Não deve ter erro 404
- Deve fazer login com sucesso

### 3. Verificar Network (Dev Tools F12)
POST /auth/login → **Status 200** ✅ (não 404)

### 4. Testar Produtos
- Criar produto
- Deve aparecer imediatamente
- Sem erro "expected array but got Object"

---

## 🔍 Se Tiver 404 em Login

### Causa Comum: VITE_API_URL incorreto

**Como verificar:**
1. Vercel Dashboard → seu projeto → Deployments
2. Clcar em "Environment"
3. Ver se `VITE_API_URL` está lá

**Solução:**
```
VITE_API_URL=https://universalplace-api.onrender.com
```

Depois:
1. Vercel → Redeploy (clitar em último deploy → "Redeploy")
2. Aguardar 2-3 min
3. Tentar login de novo

---

## 🔍 Se Tiver Erro de CORS

**Sintoma:** XMLHttpRequest refused by CORS policy

**Verificar:**
1. Frontend URL no Vercel: `https://seu-app.vercel.app`
2. Backend `CORS_ORIGIN` no Render deve ser exatamente isso

**Solução:**
```bash
# No Render backend environment
CORS_ORIGIN=https://seu-app.vercel.app
```

---

## 📝 Variáveis de Ambiente Necessárias

### Backend (Render)
```
NODE_ENV=production
DATABASE_URL=postgresql://...
JWT_SECRET=seu-secret
CORS_ORIGIN=https://seu-frontend.vercel.app
```

### Frontend (Vercel)
```
VITE_API_URL=https://seu-backend.onrender.com
```

---

## 🎯 URLs Finais Após Deploy

- **Frontend**: `https://seu-app.vercel.app`
- **Backend**: `https://universalplace-api.onrender.com`
- **Database**: `postgresql://...` (Render managed)

Frontend faz requisições para Backend usando `VITE_API_URL`.

---

## ✅ Deploy Checklist Final

```
Antes de ir pro ar:

LOCAL:
- [] npm run build funciona sem erros
- [] Não há console.error durante build
- [] dist/ foi criado

RENDER (Backend):
- [] Web Service criada
- [] Environment vars configuradas
- [] Deploy completo (status "Live")
- [] DB conectada

VERCEL (Frontend):
- [] Projeto importado
- [] VITE_API_URL configurado
- [] Deploy completo

TESTES:
- [] http://seu-app.vercel.app carrega
- [] Login funciona (sem 404)
- [] Produtos carregam
- [] Criar produto funciona
- [] Console limpo (sem erros)
```

---

**Se tudo acima está ok, seu sistema está pronto para produção!** 🎉

