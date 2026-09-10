# Primate Quest Backend

MySQL API and admin panel for Primate Quest Safaris.

## What it manages

- Tours (itinerary, highlights, inclusions, gallery, featured/published)
- Booking inquiries from the contact form
- Website gallery
- Testimonials, FAQs, newsletter subscribers
- Site content (hero, about, contact, social, stats)

## Quick start

1. Start MySQL (local install, or Docker):

```bash
cd backend
docker compose up -d
```

2. Configure environment:

```bash
cp .env.example .env
```

If you used Docker, set:

```
DB_USER=root
DB_PASSWORD=root
```

3. Install and run:

```bash
npm install
npm run dev
```

Tables are created automatically on startup if they are missing. You can still run `npm run setup` manually if you want.

- API: http://localhost:4000/api
- Admin: http://localhost:4000/admin
- Or via the website: http://localhost:5173/admin

- API: http://localhost:4000/api
- Admin: http://localhost:4000/admin

Default login:

- Email: `admin@primatesquest.com`
- Password: `Admin@12345`

Change this password from **Settings** after first login.

## Frontend

The website talks to this API. In the project root, run `npm run dev` (Vite proxies `/api` and `/uploads` to port 4000).

## Email

Inquiries and newsletter signups send branded messages through the mailbox in `.env`:

```
SMTP_HOST=primatequestsafaris.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=info@primatequestsafaris.com
SMTP_PASS=your-mailbox-password
MAIL_NOTIFY=info@primatequestsafaris.com
```

- Guests receive a confirmation
- `MAIL_NOTIFY` receives the inquiry (reply goes to the guest)
- New subscribers receive a Wild Circle welcome

A failed email does not block the form from saving.
