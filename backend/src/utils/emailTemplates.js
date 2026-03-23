export const verificationEmailTemplate = ({ name, verificationUrl, expiryHours = 24 }) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Verify your email — Arkio.</title>
</head>
<body style="margin:0;padding:0;background-color:#f5f7f6;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f7f6;padding:40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background-color:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e8f0ed;">

          <!-- HEADER -->
          <tr>
            <td style="background-color:#0c1a16;padding:28px 36px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <table role="presentation" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="background-color:#1d9e75;border-radius:9px;width:32px;height:32px;text-align:center;vertical-align:middle;">
                          <span style="display:inline-block;width:11px;height:11px;border-radius:50%;border:2.5px solid #ffffff;"></span>
                        </td>
                        <td style="padding-left:10px;">
                          <span style="font-size:16px;font-weight:700;color:#eefaf6;">Arkio.</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                  <td align="right">
                    <span style="font-size:10px;font-family:monospace;color:#1d9e75;background-color:rgba(29,158,117,0.12);border:1px solid rgba(29,158,117,0.2);border-radius:4px;padding:3px 8px;">Email verification</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- BODY -->
          <tr>
            <td style="padding:40px 36px 32px;">
              <p style="font-size:22px;font-weight:700;color:#0c1a16;margin:0 0 8px 0;">
                Hey, <span style="color:#1d9e75;">${name}</span> 👋
              </p>
              <p style="font-size:14px;color:#4a6a65;line-height:1.7;margin:0 0 24px 0;">
                Welcome to Arkio.. Click below to verify your email and activate your account.
                This link expires in ${expiryHours} hours.
              </p>

              <!-- Link pill -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                  <td style="background-color:#f0faf6;border:1.5px solid #c8ede0;border-radius:10px;padding:14px 16px;font-size:11px;font-family:monospace;color:#1d9e75;word-break:break-all;">
                    ${verificationUrl}
                  </td>
                </tr>
              </table>

              <!-- CTA -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                  <td align="center">
                    <a href="${verificationUrl}"
                      style="display:block;background-color:#1d9e75;color:#ffffff;text-decoration:none;border-radius:10px;padding:14px 28px;font-size:14px;font-weight:600;text-align:center;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
                      Verify my email address →
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Expiry warning -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                  <td style="background-color:#f6fbf8;border:1.5px solid #d3ebdf;border-radius:8px;padding:12px 14px;font-size:12px;color:#446a61;line-height:1.6;">
                    <strong style="color:#1b5f4a;">This link expires in ${expiryHours} hours.</strong>
                    If it expires, you can request a new one from the login page.
                  </td>
                </tr>
              </table>

              <p style="font-size:12px;color:#7a9a95;line-height:1.65;margin:0;">
                <strong style="color:#4a6a65;">Didn't create a Arkio. account?</strong>
                You can safely ignore this email. Never share this link with anyone.
              </p>
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="background-color:#f0faf6;padding:20px 36px;border-top:1px solid #e8f0ed;">
              <p style="font-size:11px;color:#7a9a95;margin:0;">© 2025 Arkio. · All rights reserved</p>
              <p style="font-size:10px;color:#aabab6;margin:4px 0 0;font-family:monospace;">Built by Rishi Tiwari · Ujjain, India</p>
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