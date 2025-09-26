// api/sendEmail.js
const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).send('Method not allowed');
    }

    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ error: 'Missing fields' });
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.MY_EMAIL_USER,
            pass: process.env.MY_EMAIL_PASS
        }
    });

    try {
        await transporter.sendMail({
            from: `"Portfolio Contact" <${process.env.MY_EMAIL_USER}>`,
            to: process.env.MY_TARGET_EMAIL,
            subject: `New message from ${name}`,
            text: `From: ${name} (${email})\n\n${message}`
        });

        return res.status(200).json({ success: true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error sending email' });
    }
};