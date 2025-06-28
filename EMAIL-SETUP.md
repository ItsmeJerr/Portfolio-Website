# Email Setup Guide

This guide will help you set up email functionality for the contact form in your portfolio website.

## Overview

The contact form will:

1. Save message data to database
2. Send notification email to you
3. Send auto-reply to the sender

## Setup Steps

### 1. Enable 2-Factor Authentication (2FA)

1. Go to your Google Account settings
2. Navigate to "Security"
3. Enable "2-Step Verification"
4. After 2FA is active, go back to "Security"
5. Find "App passwords" (appears after 2FA is enabled)
6. Generate a new app password for "Mail"
7. Copy the generated password (16 characters)

### 2. Configure Environment Variables

Edit the `.env` file and replace with the correct configuration:

```env
DATABASE_URL="mysql://root:010304@localhost:3306/portfolio_db"
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-password-here"
```

Replace:

- `your-email@gmail.com` with your actual Gmail address
- `your-app-password-here` with the app password you generated

### 3. How It Works

1. **User fills contact form** → Data saved to database
2. **Email sent to you** → New message notification to your-email@gmail.com
3. **Auto-reply sent to user** → Confirmation message received

## Testing

After setup, test by sending a message from the contact form on the website. Check:

1. Database for saved message
2. Inbox `your-email@gmail.com` for contact message
3. Sender's email for auto-reply

## Troubleshooting

### Email not sending

**Common issues:**

- Gmail no longer supports "less secure apps"
- App password not generated correctly
- 2FA not enabled

**Solution:**
Follow the setup steps above to generate an app password.

### Alternative Email Providers

If you don't want to use Gmail, you can change it in `server/email.ts`:

```typescript
const transporter = nodemailer.createTransporter({
  service: "outlook", // or "yahoo", "hotmail", etc.
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
```

## Security Notes

- Never commit your `.env` file to version control
- Use app passwords, not your regular password
- App passwords are 16 characters long
- Each app password can only be viewed once

## Complete Setup Example

### 1. Enable 2FA and Generate App Password

1. Go to Google Account → Security
2. Enable 2-Step Verification
3. Go back to Security → App passwords
4. Generate password for "Mail"
5. Copy the 16-character password

### 2. Configure Environment Variables

Edit file `.env` and replace with correct configuration:

```env
DATABASE_URL="mysql://root:010304@localhost:3306/portfolio_db"
EMAIL_USER="mbintangal05@gmail.com"
EMAIL_PASS="abcd efgh ijkl mnop"
```

### 3. Test the Setup

1. Start the server: `npm run dev`
2. Go to contact page
3. Send a test message
4. Check your email inbox
5. Check sender's email for auto-reply

## Status Check

✅ **Contact form working** - Data saved to database  
⚠️ **Email not configured** - Need to setup App Password for mbintangal05@gmail.com  
✅ **Error handling** - App doesn't crash if email fails

## How It Works (Detailed)

1. **User fills contact form** → Data saved to database
2. **Email sent to you** → New message notification
3. **Auto-reply sent to user** → Confirmation message received

## Email Templates

The system uses two email templates:

### 1. Notification Email (to you)

- Subject: `[Portfolio Contact] {subject}`
- Contains: Sender info, message content, timestamp

### 2. Auto-reply Email (to sender)

- Subject: `Thank you for your message - Portfolio Website`
- Contains: Thank you message, response time, portfolio links

## Troubleshooting Common Issues

### "Invalid login" error

- Make sure you're using app password, not regular password
- Verify 2FA is enabled
- Check email address is correct

### "Less secure app" error

- Gmail no longer supports "less secure apps"
- You must use app passwords with 2FA enabled

### Email not received

- Check spam folder
- Verify app password is correct
- Check server logs for errors

### Auto-reply not sent

- Check if sender email is valid
- Verify email configuration
- Check server logs for errors
