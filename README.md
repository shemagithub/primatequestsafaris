# primatequestsafaris

Website and admin for [Primate Quest Safaris](https://primatequestsafaris.com/) — gorilla trekking and wildlife safaris in Rwanda.

- Public site: https://primatequestsafaris.com/
- API + admin: https://backend.primatequestsafaris.com/
- Admin login: https://backend.primatequestsafaris.com/admin

## Local development

Use two terminals.

**1. Backend** (API, admin, MySQL)

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

API: http://localhost:4000/api  
Admin: http://localhost:4000/admin

**2. Frontend** (from the repo root)

```bash
cp .env.example .env
npm install
npm run dev
```

Website: http://localhost:5173  
Vite proxies `/api`, `/uploads`, and `/admin` to the backend.

Do not commit `backend/.env` or a root `.env`. Those hold database and mailbox passwords.

## Production

| Piece | Where it lives |
| --- | --- |
| Frontend build | `public_html` of primatequestsafaris.com |
| Node API | Application root `backend.primatequestsafaris.com`, startup `server.js` |

Upload steps: `deploy/CPANEL-SETUP.txt`.

```bash
npm run build
```

Production API origin is set in `.env.production`:

```
VITE_SITE_URL=https://primatequestsafaris.com
VITE_API_URL=https://backend.primatequestsafaris.com
```

## Repo layout

```
src/                 Public React site
backend/             Express + MySQL API and admin panel
public/              Favicons, robots, sitemap, .htaccess
deploy/              cPanel setup notes (zips are not in git)
```
