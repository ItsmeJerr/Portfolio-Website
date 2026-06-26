# Portfolio-Website

## Deployment Setup

### Frontend (Vercel)
- Vercel akan membangun output static dari `client`.
- Script build yang dipakai: `npm run vercel-build`
- Output directory: `dist/public`
- File konfigurasi: `vercel.json`

### Backend (Render)
- Backend Express akan dideploy ke Render sebagai web service.
- Render build command: `npm install && npm run build`
- Render start command: `npm start`
- Pastikan environment variable di Render:
  - `DATABASE_URL`
  - `PORT` (default 10000 jika ingin override)
  - `EMAIL_USER`
  - `EMAIL_PASS`

### Database (Supabase)
- Supabase menyediakan database Postgres gratis di tier small.
- Pasang `DATABASE_URL` dari Supabase ke Render environment vars.
- Untuk local development, tetap gunakan `.env` dengan `DATABASE_URL` Postgres.
