// api/sendEmail.js
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method not allowed');
  }

  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  // Use environment variables for your email credentials
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', // or smtp.sendgrid.net if using SendGrid
    port: 465,
    secure: true,
    auth: {
      user: process.env.MY_EMAIL_USER,
      pass: process.env.MY_EMAIL_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.MY_EMAIL_USER}>`,
      to: process.env.MY_TARGET_EMAIL, // your real email
      subject: `Message from ${name}`,
      text: `From: ${name} (${email})\n\n${message}`,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error sending email' });
  }
}
