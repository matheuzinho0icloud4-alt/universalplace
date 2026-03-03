# Universal Place

Este repositório contém um agregador de ofertas com frontend em React/Vite e backend em Express/PostgreSQL.

## Estrutura

- `src/` → código do frontend (Vite + React)
- `backend/` → API Express, banco PostgreSQL
- Imagens: o sistema passou a usar **URLs externas** para imagens (produto, logo, banner); não há mais armazenamento local de uploads.

## Variáveis de ambiente

Crie um arquivo `.env` na raiz para desenvolvimento e configure os valores conforme `.env.example`.
Nunca comite `.env` no repositório; ele está listado em `.gitignore`.

**Backend**

```
PORT=3000
DATABASE_URL=postgres://user:pass@host:5432/db
JWT_SECRET=...
CORS_ORIGIN=https://seu-frontend.com
# opcional: BASE_URL=https://seu-backend.com
```

**Frontend**

```
VITE_API_URL=https://seu-backend.com
```

O front-end injeta a variável `VITE_API_URL` em tempo de build. A API deve responder no URL configurado. As imagens são fornecidas como URLs externas e não dependem de arquivos locais.

## Scripts

No nível raiz:

- `npm run dev` – inicia apenas o frontend em modo dev
- `npm run build` – gera a versão de produção do frontend
- `npm run start:backend` – inicia o servidor de API (usado por Render)
- `npm run dev:backend` – inicia o backend com nodemon
- `npm run start` – inicia o backend (produção)

No diretório `backend/` há também um `package.json` próprio para instalar dependências lá se desejar.

## Deploy

- **Backend**: pode ser hospedado no [Render](https://render.com) ou qualquer serviço Node. Configure as variáveis de ambiente (PORT, DATABASE_URL, JWT_SECRET, CORS_ORIGIN, etc.) e execute `npm install && npm start`.
- **Banco**: use Supabase ou outro PostgreSQL. Ajuste `DATABASE_URL`.
- **Frontend**: suba no [Vercel](https://vercel.com). Configure `VITE_API_URL` apontando para o backend. O site será construído com `npm run build` automaticamente.

### Observações de produção

- Nenhum `localhost` fica no código; todas as URLs são derivadas de variáveis/requests.
- CORS aceita origens configuradas via `CORS_ORIGIN` (pode ser lista separada por vírgulas).
- O sistema usa apenas URLs externas para imagens — não existe mais `/uploads` servido pelo backend.
- Cookies JWT usam `secure` e `sameSite` apropriados para produção.

## Melhoria futura

- O sistema já foi refatorado para usar URLs externas para imagens (nenhum upload local).
- Adicionar testes end‑to‑end para validar fluxo de uploads e autenticação.

---

O projeto está pronto para ser levado ao ambiente de produção com as instruções acima.