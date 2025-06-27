<<<<<<< HEAD

# Setup Email untuk Contact Form

## Konfigurasi Gmail Pribadi

### 1. Untuk Email Pribadi (mbintangal05@gmail.com)

#### A. Aktifkan 2-Factor Authentication

1. Buka [Google Account Settings](https://myaccount.google.com/)
2. Login dengan `mbintangal05@gmail.com`
3. Pilih "Security"
4. Aktifkan "2-Step Verification"

#### B. Buat App Password

1. Setelah 2FA aktif, kembali ke "Security"
2. Cari "App passwords" (di bawah 2-Step Verification)
3. Pilih "Mail" dan "Other (Custom name)"
4. Beri nama: "Portfolio Website"
5. Klik "Generate"
6. **Copy password yang muncul** (16 karakter)

#### C. Update File .env

Edit file `.env` dan ganti dengan konfigurasi yang benar:

```env
DATABASE_URL="mysql://root:010304@localhost:3306/portfolio_db"
NODE_ENV=development
PORT=3000

# Email Configuration (untuk Gmail)
EMAIL_USER="mbintangal05@gmail.com"
EMAIL_PASS="your-16-character-app-password"
```

### 2. Restart Aplikasi

```bash
npm run dev
```

## Cara Kerja

1. **User mengisi form contact** → Data disimpan ke database
2. **Email dikirim ke Anda** → Notifikasi pesan baru ke mbintangal05@gmail.com
3. **Auto-reply dikirim ke user** → Konfirmasi pesan diterima

## Test Email

Setelah setup, test dengan mengirim pesan dari form contact di website. Cek:

1. Console log aplikasi untuk status email
2. Inbox `mbintangal05@gmail.com` untuk pesan contact
3. Email pengirim untuk auto-reply

## Status Saat Ini

✅ **Contact form berfungsi** - Data tersimpan ke database  
⚠️ **Email belum dikonfigurasi** - Perlu setup App Password untuk mbintangal05@gmail.com  
✅ **Error handling** - Aplikasi tidak crash jika email gagal

## Cara Kerja

1. **User mengisi form contact** → Data disimpan ke database
2. **Email dikirim ke Anda** → Notifikasi pesan baru
3. **Auto-reply dikirim ke user** → Konfirmasi pesan diterima

## Troubleshooting

### Error: "Invalid login"

- Pastikan menggunakan App Password, bukan password biasa
- Pastikan 2FA sudah aktif

### Error: "Less secure app access"

- Gmail tidak lagi mendukung "less secure apps"
- Harus menggunakan App Password

### Email tidak terkirim

- Cek console log untuk error detail
- Pastikan EMAIL_USER dan EMAIL_PASS sudah benar
- Cek folder Spam di Gmail

## Alternatif Email Service

Jika tidak ingin pakai Gmail, bisa ganti di `server/email.ts`:

### Outlook/Hotmail

```typescript
const transporter = nodemailer.createTransporter({
  service: "outlook",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
```

### Custom SMTP

```typescript
const transporter = nodemailer.createTransporter({
  host: "smtp.your-provider.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
```

=======

# Setup Email untuk Contact Form

## Konfigurasi Gmail Pribadi

### 1. Untuk Email Pribadi (mbintangal05@gmail.com)

#### A. Aktifkan 2-Factor Authentication

1. Buka [Google Account Settings](https://myaccount.google.com/)
2. Login dengan `mbintangal05@gmail.com`
3. Pilih "Security"
4. Aktifkan "2-Step Verification"

#### B. Buat App Password

1. Setelah 2FA aktif, kembali ke "Security"
2. Cari "App passwords" (di bawah 2-Step Verification)
3. Pilih "Mail" dan "Other (Custom name)"
4. Beri nama: "Portfolio Website"
5. Klik "Generate"
6. **Copy password yang muncul** (16 karakter)

#### C. Update File .env

Edit file `.env` dan ganti dengan konfigurasi yang benar:

```env
DATABASE_URL="mysql://root:010304@localhost:3306/portfolio_db"
NODE_ENV=development
PORT=3000

# Email Configuration (untuk Gmail)
EMAIL_USER="mbintangal05@gmail.com"
EMAIL_PASS="your-16-character-app-password"
```

### 2. Restart Aplikasi

```bash
npm run dev
```

## Cara Kerja

1. **User mengisi form contact** → Data disimpan ke database
2. **Email dikirim ke Anda** → Notifikasi pesan baru ke mbintangal05@gmail.com
3. **Auto-reply dikirim ke user** → Konfirmasi pesan diterima

## Test Email

Setelah setup, test dengan mengirim pesan dari form contact di website. Cek:

1. Console log aplikasi untuk status email
2. Inbox `mbintangal05@gmail.com` untuk pesan contact
3. Email pengirim untuk auto-reply

## Status Saat Ini

✅ **Contact form berfungsi** - Data tersimpan ke database  
⚠️ **Email belum dikonfigurasi** - Perlu setup App Password untuk mbintangal05@gmail.com  
✅ **Error handling** - Aplikasi tidak crash jika email gagal

## Cara Kerja

1. **User mengisi form contact** → Data disimpan ke database
2. **Email dikirim ke Anda** → Notifikasi pesan baru
3. **Auto-reply dikirim ke user** → Konfirmasi pesan diterima

## Troubleshooting

### Error: "Invalid login"

- Pastikan menggunakan App Password, bukan password biasa
- Pastikan 2FA sudah aktif

### Error: "Less secure app access"

- Gmail tidak lagi mendukung "less secure apps"
- Harus menggunakan App Password

### Email tidak terkirim

- Cek console log untuk error detail
- Pastikan EMAIL_USER dan EMAIL_PASS sudah benar
- Cek folder Spam di Gmail

## Alternatif Email Service

Jika tidak ingin pakai Gmail, bisa ganti di `server/email.ts`:

### Outlook/Hotmail

```typescript
const transporter = nodemailer.createTransporter({
  service: "outlook",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
```

### Custom SMTP

```typescript
const transporter = nodemailer.createTransporter({
  host: "smtp.your-provider.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
```

> > > > > > > 04b1e09d799b127dd979fa8563885b054cc5e0e0
