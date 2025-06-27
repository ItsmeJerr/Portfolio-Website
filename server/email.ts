import nodemailer from "nodemailer";
import type { InsertContactMessage } from "@shared/schema";

// Cek apakah konfigurasi email tersedia
const isEmailConfigured = process.env.EMAIL_USER && process.env.EMAIL_PASS;

// Konfigurasi transporter email (hanya jika konfigurasi tersedia)
const transporter = isEmailConfigured
  ? nodemailer.createTransport({
      service: "gmail", // Atau service lain yang Anda gunakan
      auth: {
        user: process.env.EMAIL_USER, // Email Anda
        pass: process.env.EMAIL_PASS, // Password aplikasi (bukan password biasa)
      },
    })
  : null;

export async function sendContactEmail(messageData: InsertContactMessage) {
  if (!isEmailConfigured) {
    console.log("Email tidak dikonfigurasi, skip mengirim email");
    return true;
  }

  if (!transporter) {
    console.log("Transporter email tidak tersedia");
    return false;
  }

  const { firstName, lastName, email, subject, message } = messageData;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER, // Email Anda akan menerima pesan
    subject: `[Portfolio Contact] ${subject}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
          Pesan Baru dari Portfolio Website
        </h2>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #007bff; margin-top: 0;">Informasi Pengirim:</h3>
          <p><strong>Nama:</strong> ${firstName} ${lastName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
        </div>
        
        <div style="background: #fff; padding: 20px; border: 1px solid #dee2e6; border-radius: 8px;">
          <h3 style="color: #333; margin-top: 0;">Pesan:</h3>
          <p style="line-height: 1.6; color: #555;">${message.replace(
            /\n/g,
            "<br>"
          )}</p>
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6; text-align: center; color: #6c757d; font-size: 14px;">
          <p>Pesan ini dikirim dari form contact portfolio website Anda.</p>
          <p>Waktu: ${new Date().toLocaleString("id-ID")}</p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email contact berhasil dikirim");
    return true;
  } catch (error) {
    console.error("Error mengirim email:", error);
    return false;
  }
}

// Fungsi untuk mengirim email balasan otomatis
export async function sendAutoReply(toEmail: string, senderName: string) {
  if (!isEmailConfigured) {
    console.log("Email tidak dikonfigurasi, skip mengirim auto-reply");
    return true;
  }

  if (!transporter) {
    console.log("Transporter email tidak tersedia");
    return false;
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: toEmail,
    subject: "Terima kasih atas pesan Anda - Portfolio Website",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
          Terima Kasih Atas Pesan Anda
        </h2>
        
        <p>Halo ${senderName},</p>
        
        <p>Terima kasih telah menghubungi saya melalui portfolio website. Saya telah menerima pesan Anda dan akan segera membalasnya.</p>
        
        <p>Biasanya saya akan membalas dalam waktu 24-48 jam kerja.</p>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #007bff; margin-top: 0;">Sementara itu, Anda bisa:</h3>
          <ul style="color: #555;">
            <li>Melihat portfolio dan project saya di website</li>
            <li>Mengikuti saya di social media</li>
            <li>Melihat artikel dan blog saya</li>
          </ul>
        </div>
        
        <p>Best regards,<br>
        <strong>John Doe Developer</strong><br>
        Senior Full Stack Developer</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6; text-align: center; color: #6c757d; font-size: 12px;">
          <p>Email ini dikirim secara otomatis. Mohon tidak membalas email ini.</p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Auto-reply email berhasil dikirim");
    return true;
  } catch (error) {
    console.error("Error mengirim auto-reply:", error);
    return false;
  }
}
