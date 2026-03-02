# 🚀 Quick Start - Projeto Universal Place Refatorado

## Status
✅ **Refatoração completa**: Autenticação profissional, fluxo de produtos corrigido, logging estruturado

---

## 🏃 Quickstart - Local Development

### Opção 1: Docker (Recomendado)
```bash
# Subir tudo (DB + Backend + hotreload)
docker-compose up --build

# Acessar:
# Frontend: http://localhost:3000 (rodando npm run dev em paralelo)
# Backend: http://localhost:4000
# Postgres: localhost:5432
```

### Opção 2: PowerShell (Windows)
```powershell
powershell -ExecutionPolicy Bypass -File .\start-dev.ps1
```

### Opção 3: Bash (macOS/Linux)
```bash
chmod +x ./start-dev.sh
./start-dev.sh
```

### Opção 4: Manual
```bash
# Terminal 1 - DB
docker-compose up -d db
sleep 5

# Terminal 2 - Backend
cd backend
export CORS_ORIGIN=http://localhost:3000
export JWT_SECRET=devsecret
export DATABASE_URL=postgresql://postgres:postgres@localhost:5432/universalplace
export NODE_ENV=development
npm run dev

# Terminal 3 - Frontend
npm run dev
```

---

## 🧪 Testar Fluxo de Produtos

### 1. Login
```bash
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"matheuzinho0@icloud.com","password":"aninha123"}'
```

### 2. Criar Produto
```bash
curl -X POST http://localhost:4000/products \
  -H "Cookie: token=<seu-token>" \
  -F "name=Produto Teste" \
  -F "link_oferta=https://exemplo.com" \
  -F "image=@/caminho/imagem.jpg"
```

### 3. Listar Produtos
```bash
curl http://localhost:4000/products
```

### 4. UI - Admin Dashboard
```
URL: http://localhost:3000/admin/dashboard
Login: matheuzinho0@icloud.com / aninha123
```

---

## 📋 Verificação Rápida

- [ ] Frontend carrega sem erros
- [ ] Login funciona
- [ ] Pode criar produto
- [ ] Produto aparece no dashboard
- [ ] Produto aparece na homepage
- [ ] Pode editar produto
- [ ] Pode deletar produto
- [ ] Dialog sem warnings
- [ ] Logout funciona

---

## 🔧 Variáveis de Ambiente Essenciais

```bash
# Backend
CORS_ORIGIN=http://localhost:3000        # Frontend URL
JWT_SECRET=devsecret                      # Qualquer string > 10 chars
DATABASE_URL=postgresql://...             # Database connection
NODE_ENV=development                      # development | production
PORT=4000                                 # Backend port

# Frontend
VITE_API_URL=http://localhost:4000        # Backend URL
```

---

## 📈 Mudanças Aplicadas

### API Response - Novo Padrão
```javascript
// Sucesso
{ success: true, data: [...], message: "..." }

// Erro
{ success: false, message: "Erro", errorCode: "ERROR_TYPE" }
```

### Endpoints Principais
- ✅ `GET /products` - Listar (público)
- ✅ `POST /products` - Criar (autenticado)
- ✅ `PUT /products/:id` - Editar (autenticado)
- ✅ `DELETE /products/:id` - Deletar (autenticado)
- ✅ `POST /auth/login` - Login
- ✅ `GET /auth/me` - Sessão
- ✅ `POST /auth/logout` - Logout
- ✅ `GET /api/store-config` - Config (público)
- ✅ `PUT /api/store-config` - Atualizar (autenticado)

---

## 🐛 Troubleshooting

### "Connection refused" no DB
```bash
docker ps  # Verificar se db está rodando
docker-compose logs db  # Ver logs
docker-compose restart db
```

### "Port already in use"
```bash
# Windows
netstat -ano | findstr :4000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:4000 | xargs kill -9
```

### Frontend não conecta ao backend
- Verificar `VITE_API_URL` em `.env`
- Verificar `CORS_ORIGIN` no backend
- Verificar se backend está rodando: `curl http://localhost:4000/products`

### Produtos não aparecem
- Verificar se `fetchProducts()` está extraindo `res.data.data`
- Verificar logs do backend
- Verificar se `GET /products` retorna `{ success: true, data: [...] }`

---

## 📚 Documentação Detalhada

Ver `REFACTORING_REPORT.md` para relatório completo de mudanças

---

## ✅ Checklist Final

- [x] Error handler global
- [x] Logging estruturado (winston)
- [x] API responses padronizadas
- [x] Autenticação profissional
- [x] Fluxo de produtos corrigido
- [x] Dialog acessível
- [x] Docker setup
- [x] Scripts de desenvolvimento
- [x] Variáveis de ambiente

---

**Tudo pronto para desenvolvimento e produção!** 🎉
