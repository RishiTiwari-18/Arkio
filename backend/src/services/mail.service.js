import nodemailer from 'nodemailer'
import { verificationEmailTemplate } from '../utils/emailTemplates.js'

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    family: 4,

    auth: {
        user: process.env.GOOGLE_USER,
        pass: process.env.GOOGLE_APP_PASSWORD,
    },

    tls: {
        rejectUnauthorized: false
    }
})

transporter.verify()
    .then(() => console.error('Email server is ready to send messages'))
    .catch((err) => console.log('Error connecting to email server:', err))

export const sendVerificationEmail = async ({ name, email, token}) => {
    const baseUrl = process.env.SERVER_URL || `http://localhost:${process.env.PORT || 3000}`
    const verificationUrl = `${baseUrl}/api/auth/verify-email?token=${token}`

    const html = verificationEmailTemplate({ name, verificationUrl, expiryHours: 1 })

    await transporter.sendMail({
        from: `"Arkio. " <${process.env.GOOGLE_USER}>`,
        to: email,
        subject: 'Verify your email address — Arkio.',
        html,
    })
}