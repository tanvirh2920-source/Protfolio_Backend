const nodemailer = require('nodemailer');

/**
 * Escape HTML entities to prevent XSS in email templates.
 */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Send a contact form email notification.
 * Fails silently so form submission is never blocked by email issues.
 */
async function sendContactEmail(name, email, message) {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || 
        process.env.EMAIL_USER === 'your.email@gmail.com') {
      console.log('Email not configured — skipping notification.');
      return;
    }

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT, 10) || 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const safeName    = escapeHtml(name);
    const safeEmail   = escapeHtml(email);
    const safeMessage = escapeHtml(message).replace(/\n/g, '<br>');

    const htmlBody = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #1a1a2e; border-radius: 12px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #6366f1, #8b5cf6); padding: 24px 32px;">
          <h1 style="color: #ffffff; margin: 0; font-size: 22px;">📬 New Portfolio Message</h1>
        </div>
        <div style="padding: 32px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 12px 0; color: #94a3b8; font-size: 14px; width: 80px; vertical-align: top;">Name</td>
              <td style="padding: 12px 0; color: #f1f5f9; font-size: 16px;">${safeName}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; color: #94a3b8; font-size: 14px; vertical-align: top;">Email</td>
              <td style="padding: 12px 0;"><a href="mailto:${safeEmail}" style="color: #818cf8; text-decoration: none;">${safeEmail}</a></td>
            </tr>
            <tr>
              <td style="padding: 12px 0; color: #94a3b8; font-size: 14px; vertical-align: top;">Message</td>
              <td style="padding: 12px 0; color: #f1f5f9; font-size: 15px; line-height: 1.6;">${safeMessage}</td>
            </tr>
          </table>
        </div>
        <div style="padding: 16px 32px; background: rgba(255,255,255,0.03); border-top: 1px solid rgba(255,255,255,0.08);">
          <p style="color: #64748b; font-size: 12px; margin: 0;">Sent from your Portfolio contact form</p>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO || process.env.EMAIL_USER,
      subject: `Portfolio Contact: ${name}`,
      html: htmlBody,
      replyTo: email,
    });

    console.log(`Contact email sent for message from ${name} <${email}>`);
  } catch (error) {
    console.error('Failed to send contact email:', error.message);
  }
}

module.exports = { sendContactEmail };
