import nodemailer from "nodemailer";
import type { InsertContactMessage } from "@shared/schema";

// Check if email configuration is available
const isEmailConfigured = process.env.EMAIL_USER && process.env.EMAIL_PASS;

// Email transporter configuration (only if configuration is available)
const transporter = isEmailConfigured
  ? nodemailer.createTransport({
      service: "gmail", // Or other service you use
      auth: {
        user: process.env.EMAIL_USER, // Your email
        pass: process.env.EMAIL_PASS, // App password (not regular password)
      },
    })
  : null;

export async function sendContactEmail(messageData: InsertContactMessage) {
  if (!isEmailConfigured) {
    console.log("Email not configured, skipping email sending");
    return true;
  }

  if (!transporter) {
    console.log("Email transporter not available");
    return false;
  }

  const { firstName, lastName, email, subject, message } = messageData;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER, // Your email will receive the message
    subject: `[Portfolio Contact] ${subject}`,
    html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333; text-align: center; margin-bottom: 30px;">
        New Message from Portfolio Website
      </h2>
      
      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #007bff; margin-top: 0;">Sender Information:</h3>
        <p><strong>Name:</strong> ${firstName} ${lastName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
      </div>
      
      <div style="background: #fff; padding: 20px; border: 1px solid #dee2e6; border-radius: 8px;">
        <h3 style="color: #333; margin-top: 0;">Message:</h3>
        <p style="line-height: 1.6; margin: 0;">${message}</p>
      </div>
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6; text-align: center; color: #6c757d; font-size: 14px;">
        <p>This message was sent from your portfolio website contact form.</p>
        <p>Time: ${new Date().toLocaleString("en-US")}</p>
      </div>
    </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Contact email sent successfully");
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
}

// Function to send automatic reply email
export async function sendAutoReply(toEmail: string, senderName: string) {
  if (!isEmailConfigured) {
    console.log("Email not configured, skipping auto-reply");
    return true;
  }

  if (!transporter) {
    console.log("Email transporter not available");
    return false;
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: toEmail,
    subject: "Thank you for your message - Portfolio Website",
    html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333; text-align: center; margin-bottom: 30px;">
        Thank You For Your Message
      </h2>
      
      <p>Dear ${senderName},</p>
      
      <p>Thank you for contacting me through my portfolio website. I have received your message and will respond soon.</p>
      
      <p>I usually respond within 24-48 business hours.</p>
      
      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #007bff; margin-top: 0;">While waiting, you can:</h3>
        <ul style="margin: 0; padding-left: 20px;">
          <li>View my projects and portfolio</li>
          <li>Read my articles and blog</li>
          <li>Check out my skills and experience</li>
        </ul>
      </div>
      
      <p>Best regards,<br>M. Bintang Alffajry</p>
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6; text-align: center; color: #6c757d; font-size: 12px;">
        <p>This email was sent automatically. Please do not reply to this email.</p>
      </div>
    </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Auto-reply email sent successfully");
    return true;
  } catch (error) {
    console.error("Error sending auto-reply:", error);
    return false;
  }
}
