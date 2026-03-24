import nodemailer from 'nodemailer'
import { verificationEmailTemplate } from '../utils/emailTemplates.js'

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: process.env.GOOGLE_USER,
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
    },
});

transporter.verify()
    .then(() => console.error('Email server is ready to send messages'))
    .catch((err) => console.log('Error connecting to email server:', err))

export const sendVerificationEmail = async ({ name, email, token}) => {
    const verificationUrl = `http://localhost:3000/api/auth/verify-email?token=${token}`

    const html = verificationEmailTemplate({ name, verificationUrl, expiryHours: 1 })

    await transporter.sendMail({
        from: `"Arkio. " <${process.env.GOOGLE_USER}>`,
        to: email,
        subject: 'Verify your email address — Arkio.',
        html,
    })
}