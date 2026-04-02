export const verificationEmailTemplate = ({ name, verificationUrl, expiryHours = 24 }) => {
  const loginUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/login`

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Verify your email — Arkio.</title>
</head>
<body style="margin:0;padding:0;background-color:#f8f7f4;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;color:#1a1f2e;">

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8f7f4;padding:40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background-color:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e8e6e1;box-shadow:0 10px 28px rgba(26,31,46,0.08);">

          <!-- HEADER -->
          <tr>
            <td style="padding:28px 36px;background:linear-gradient(135deg,#7c9082 0%,#6d8274 100%);">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <table role="presentation" cellpadding="0" cellspacing="0">
                      <tr>
                        <td>
                          <span style="font-size:18px;font-weight:700;letter-spacing:0.2px;color:#ffffff;">Arkio.</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                  <td align="right">
                    <span style="font-size:10px;font-family:monospace;color:#ffffff;background-color:rgba(255,255,255,0.16);border:1px solid rgba(255,255,255,0.3);border-radius:999px;padding:5px 10px;">Email verification</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- BODY -->
          <tr>
            <td style="padding:36px 36px 28px;">
              <p style="font-size:22px;font-weight:700;color:#1a1f2e;margin:0 0 8px 0;">
                Hey, <span style="color:#7c9082;">${name}</span>
              </p>
              <p style="font-size:14px;color:#4b5565;line-height:1.7;margin:0 0 24px 0;">
                Welcome to Arkio. Click below to verify your email and activate your account.
                This link expires in ${expiryHours} hours.
              </p>

              <!-- Link pill -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                  <td style="background-color:#f6f6f3;border:1px solid #e8e6e1;border-radius:10px;padding:14px 16px;font-size:11px;font-family:monospace;color:#7c9082;word-break:break-all;">
                    <a href="${verificationUrl}" style="color:#7c9082;text-decoration:none;word-break:break-all;">${verificationUrl}</a>
                  </td>
                </tr>
              </table>

              <!-- CTA -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                  <td align="center">
                    <a href="${verificationUrl}"
                      style="display:block;background-color:#7c9082;color:#ffffff;text-decoration:none;border-radius:10px;padding:14px 28px;font-size:14px;font-weight:600;text-align:center;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
                      Verify my email address →
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Expiry warning -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                  <td style="background-color:#fcfaf4;border:1px solid #ece5cf;border-radius:8px;padding:12px 14px;font-size:12px;color:#665a35;line-height:1.6;">
                    <strong style="color:#5f542f;">This link expires in ${expiryHours} hours.</strong>
                    If it expires, you can request a new one from the <a href="${loginUrl}" style="color:#7c9082;text-decoration:none;font-weight:600;">login page</a>.
                  </td>
                </tr>
              </table>

              <p style="font-size:12px;color:#6b7280;line-height:1.65;margin:0;">
                <strong style="color:#4b5565;">Didn\'t create an Arkio. account?</strong>
                You can safely ignore this email. Never share this link with anyone.
              </p>
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="background-color:#f6f6f3;padding:20px 36px;border-top:1px solid #eceae4;">
              <p style="font-size:11px;color:#6b7280;margin:0;">© 2025 Arkio. · All rights reserved</p>
              <p style="font-size:10px;color:#9ba3b2;margin:4px 0 0;font-family:monospace;">Built by Rishi Tiwari · Ujjain, India</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim()
}