# 🚀 DEPLOYMENT GUIDE - RENDER + PostgreSQL

## 📋 Pre-requisito
- [ ] GitHub repo com código atualizado (pushado)
- [ ] Conta no Render (www.render.com)
- [ ] Conta no Discord para notifications (opcional)
- [ ] Testes locais passando (TESTING_CHECKLIST.md)

---

## 🗄️ PASSO 1: Criar Database PostgreSQL no Render

### 1.1 - Acessar Render Dashboard
1. Ir para https://dashboard.render.com
2. Login com GitHub account
3. Clicar "New +" → "PostgreSQL"

### 1.2 - Configurar Database
```
Name: universalplace-db    [qualquer nome, vai ser prefix]
Instance Type: Free       [está bom]
PostgreSQL Version: 15    [padrão]
Data Persistence: On      [importante!]
```

3. Clicar "Create Database"
4. Aguardar 2-3 minutos (status vai virar "Available")

### 1.3 - Guardar Informações
Ao database ficar pronto, guardar:
```
Database Name: [nome da DB]
Username: [usuário postgres]
Password: [gerada automaticamente]
Host: [ex: dpg-xxxxx...................render.com]
Port: 5432
External Database URL: [COPIAR COMPLETA]
```

Exemplo:
```
postgresql://user:password@dpg-xxxxx.render.com:5432/dbname
```

---

## 🎨 PASSO 2: Fazer Build para Produção

### 2.1 - Frontend Build
```bash
# Na raiz do projeto
npm run build

# Isso cria `dist/` com HTML/CSS/JS otimizado
# Render vai servir esses arquivos
```

### 2.2 - Verificar Build
```bash
# Verificar que dist/ foi criado
ls dist/

# Deve ter:
# - index.html
# - assets/
# - etc.
```

### 2.3 - Stage e Push para Git
```bash
# Staged todos os arquivos (incluindo dist/)
git add -A

# Se dist/ está em .gitignore, fazer:
git add -f dist/

# Commit
git commit -m "Build para produção"

# Push
git push origin main

# Verificar no GitHub que tudo foi pushado
```

---

## 🔧 PASSO 3: Deploy Backend no Render

### 3.1 - Criar Web Service
1. Ir para https://dashboard.render.com
2. Clicar "New +" → "Web Service"
3. Conectar repositório GitHub

### 3.2 - Configurar Web Service
```
Name: universalplace-api           [ou seu nome]
Environment: Node
Build Command: npm install
Start Command: npm start            [ou node backend/server.js]
Instance Type: Free               [está bom para começo]
```

3. Clicar "Create Web Service"
4. Render vai começar build automaticamente

### 3.3 - Aguardar Deploy
- Build leva ~2-3 minutos
- Status vai passar por: Building → Deploying → Live
- Quando ficar "Live", URL ficará disponível (ex: https://universalplace-api.onrender.com)

---

## 🔐 PASSO 4: Configurar Environment Variables

### 4.1 - No Render Dashboard
1. Ir para Web Service criado
2. Clicar "Environment"
3. Adicionar cada variável:

```
DATABASE_URL = postgresql://user:password@host:5432/db
NODE_ENV = production
JWT_SECRET = seu-secret-super-seguro-aqui
CORS_ORIGIN = https://seu-frontend-url.vercel.app
PORT = não precisa (Render usa automaticamente)
```

### 4.2 - Salvar
- Render vai fazer deploy automático com as novas vars

### 4.3 - Verificar
```bash
# Testar  backend diretamente
curl -X GET https://seu-api.onrender.com/health

# Deve retornar algo como:
# { "status": "ok", "timestamp": "..." }
```

---

## 🎨 PASSO 5: Deploy Frontend no Vercel (Recomendado)

### 5.1 - Usar Vercel (mais fácil)
Vercel é free para frontend estático.

**Opção A: Manual via CLI**
```bash
# Instalar Vercel CLI
npm i -g vercel

# Na raiz do projeto
vercel

# Seguir instruções (conectar GitHub, etc.)
# Vai fazer deploy automático
```

**Opção B: Conectar GitHub**
1. Ir para https://vercel.com
2. Clicar "Import Project"
3. Selecionar repositório GitHub
4. Deixar configurações default
5. Clicar "Deploy"

### 5.2 - Guardar URL Frontend
```
https://seu-app.vercel.app
```

---

## 🔗 PASSO 6: Atualizar CORS_ORIGIN

### 6.1 - No backend (Render)
1. Ir para Environment do Web Service
2. Atualizar `CORS_ORIGIN`:
```
https://seu-app.vercel.app
```

3. Salvar (Render faz deploy automático)

---

## 🧪 PASSO 7: Testar em Produção

### 7.1 - Abrir Frontend
```
https://seu-app.vercel.app
```

### 7.2 - Fazer Login
```
Email: matheuzinho0@icloud.com
Senha: aninha123
```

### 7.3 - Verificar Checklist
- [ ] App carrega
- [ ] Login funciona
- [ ] Produtos aparecem
- [ ] Criar produto funciona
- [ ] Editar produto funciona
- [ ] Deletar produto funciona
- [ ] Logout funciona
- [ ] Console limpo (sem erros)

### 7.4 - Verificar Cookies
Dev Tools → Application → Cookies → seu-app.vercel.app
```
✓ token (httpOnly, Secure, SameSite)
```

---

## 🚨 Troubleshooting

### Problema: CORS Error
```
Access to XMLHttpRequest from origin 'https://seu-app.vercel.app' 
has been blocked by CORS policy
```
**Solução**: 
- Atualizar `CORS_ORIGIN` no backend para URL correta do frontend
- Esperar ~1 minuto para Render fazer redeploy
- Verificar que frontend está conseguindo ler a variável

### Problema: 401 ao fazer login
```
POST /auth/login → 401 Unauthorized
```
**Solução**:
- Verificar node_modules estão instalados (`npm install`)
- Verificar DATABASE_URL está correto
- Verificar JWT_SECRET está definido
- Checar logs: Render → Service → Logs

### Problema: Database não conecta
```
Error: connect ECONNREFUSED
```
**Solução**:
- Verificar DATABASE_URL está completo (ex: postgresql://user:pass@host:5432/db)
- Aguardar database ficar "Available"
- Renderizar schema (backend/database.js vai fazer auto-migration)

### Problema: Frontend não consegue chamar backend
```
XMLHttpRequest to 'https://api.onrender.com' failed
```
**Solução**:
- Verificar que API está respondendo: `curl https://api.onrender.com/health`
- Verificar URL no src/services/api.js apontando para backend correto
- Fazer rebuild frontend: `npm run build && git add dist/ && git commit && git push`

---

## 📊 Monitoramento em Produção

### Logs
```
Render Dashboard → Service → Logs
```
- Monitore para erros de compilação ou runtime

### Database
```
Render Dashboard → Database → Logs
```
- Monitore para queries lentas ou conexões perdidas

### Performance
- Abrir frontend em https://seu-app.vercel.app
- Abrir Dev Tools → Performance
- Gravar ações (login, criar produto, etc.)
- Analisar tempo de resposta

---

## 🔄 Atualizações Futuras

### Para fazer deploy de novo código:

**Frontend**
```bash
# Na raiz
npm run build
git add -A
git commit -m "Update: [descrição]"
git push

# Vercel faz deploy automático (2-3 min)
```

**Backend**
```bash
# Backend code já está versionado
git add backend/
git commit -m "Backend update: [descrição]"
git push

# Render faz deploy automático (2-3 min)
```

---

## 📋 Checklist Final

- [ ] Database PostgreSQL criada no Render
- [ ] DATABASE_URL guardada
- [ ] Backend forçado no Render
- [ ] Frontend forçado no Vercel
- [ ] CORS_ORIGIN atualizado
- [ ] Testes em produção passados
- [ ] Logs monitorados
- [ ] Backup de DATABASE_URL em lugar seguro
- [ ] JWT_SECRET guardado em lugar seguro

---

## 💰 Custo (Free Tier)
- **Render Database (PostgreSQL)**: Free (com limite 1 MB dados)
- **Render Web Service (Backend)**: Free (com limite CPU/RAM, sem SLA)
- **Vercel (Frontend)**: Free
- **Total**: $0/mês

⚠️ **Nota**: Free tier vai dormir após 15 min inatividade. Para produção real, usar plano pago.

---

## 📞 Suporte

Se tiver problema:
1. Clicar em "Logs" no Render
2. Procurar mensagens de erro
3. Copiar erro completo
4. Procurar solução no Troubleshooting acima
5. Se não achar, procurar no Google: "render.com [erro específico]"

