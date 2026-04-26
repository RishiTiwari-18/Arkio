export const verificationEmailTemplate = ({ name, verificationUrl, expiryHours = 24 }) => {
  const loginUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/login`

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <meta name="color-scheme" content="light dark" />
  <meta name="supported-color-schemes" content="light dark" />
  <title>Verify your email — Arkio.</title>
  <style>
    :root {
      color-scheme: light dark;
      supported-color-schemes: light dark;
    }

    @media only screen and (max-width: 600px) {
      body, .page-shell {
        padding: 0 !important;
      }

      .page-shell {
        width: 100% !important;
        padding: 18px 0 !important;
      }

      .card {
        width: 100% !important;
        max-width: 100% !important;
        border-radius: 0 !important;
      }

      .hero,
      .body-cell,
      .footer {
        padding-left: 20px !important;
        padding-right: 20px !important;
      }

      .hero {
        padding-top: 22px !important;
        padding-bottom: 22px !important;
      }

      .headline {
        font-size: 20px !important;
        line-height: 1.35 !important;
      }

      .body-text {
        font-size: 15px !important;
      }

      .badge {
        display: inline-block !important;
        margin-top: 10px !important;
      }

      .stack-on-mobile,
      .cta-wrap,
      .link-cell,
      .expiry-cell {
        display: block !important;
        width: 100% !important;
      }

      .link-box,
      .expiry-box {
        padding: 14px !important;
      }

      .cta {
        padding: 16px 20px !important;
        font-size: 15px !important;
      }

      .fine-print,
      .footer-text,
      .footer-secondary {
        font-size: 12px !important;
        line-height: 1.6 !important;
      }
    }

    @media (prefers-color-scheme: dark) {
      body, .page-shell {
        background-color: #0f131a !important;
        color: #e7ecf3 !important;
      }

      .card {
        background-color: #161b22 !important;
        border-color: #2a3240 !important;
        box-shadow: 0 10px 28px rgba(0, 0, 0, 0.35) !important;
      }

      .hero {
        background: linear-gradient(135deg, #1c2b26 0%, #263a33 100%) !important;
      }

      .brand, .badge, .headline, .body-text, .footer-text, .fine-print, .link-box, .expiry-box, .login-link {
        color: #e7ecf3 !important;
      }

      .badge {
        background-color: rgba(255, 255, 255, 0.08) !important;
        border-color: rgba(255, 255, 255, 0.14) !important;
      }

      .body-text, .fine-print, .footer-secondary {
        color: #b3becd !important;
      }

      .link-box {
        background-color: #11161d !important;
        border-color: #2a3240 !important;
      }

      .cta {
        background-color: #8da694 !important;
        color: #0f131a !important;
      }

      .expiry-box {
        background-color: #1a2018 !important;
        border-color: #33402f !important;
        color: #d9e4ce !important;
      }

      .footer {
        background-color: #11161d !important;
        border-top-color: #2a3240 !important;
      }

      .login-link {
        color: #a8beae !important;
      }
    }
  </style>
</head>
<body class="page-shell" style="margin:0;padding:0;background-color:#f8f7f4;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;color:#1a1f2e;">

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="page-shell" style="background-color:#f8f7f4;padding:40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="card" style="max-width:560px;background-color:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e8e6e1;box-shadow:0 10px 28px rgba(26,31,46,0.08);">

          <!-- HEADER -->
          <tr>
            <td class="hero" style="padding:28px 36px;background:linear-gradient(135deg,#7c9082 0%,#6d8274 100%);">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td class="stack-on-mobile" valign="top">
                    <table role="presentation" cellpadding="0" cellspacing="0">
                      <tr>
                        <td>
                          <span class="brand" style="font-size:18px;font-weight:700;letter-spacing:0.2px;color:#ffffff;">Arkio.</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                  <td class="stack-on-mobile" align="right" valign="top">
                    <span class="badge" style="font-size:10px;font-family:monospace;color:#ffffff;background-color:rgba(255,255,255,0.16);border:1px solid rgba(255,255,255,0.3);border-radius:999px;padding:5px 10px;">Email verification</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- BODY -->
          <tr>
            <td class="body-cell" style="padding:36px 36px 28px;">
              <p class="headline" style="font-size:22px;font-weight:700;color:#1a1f2e;margin:0 0 8px 0;">
                Hey, <span style="color:#7c9082;">${name}</span>
              </p>
              <p class="body-text" style="font-size:14px;color:#4b5565;line-height:1.7;margin:0 0 24px 0;">
                Welcome to Arkio. Click below to verify your email and activate your account.
                This link expires in ${expiryHours} hours.
              </p>

              <!-- Link pill -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                  <td class="link-cell">
                    <div class="link-box" style="background-color:#f6f6f3;border:1px solid #e8e6e1;border-radius:10px;padding:14px 16px;font-size:11px;font-family:monospace;color:#7c9082;word-break:break-all;">
                    <a href="${verificationUrl}" class="login-link" style="color:#7c9082;text-decoration:none;word-break:break-all;">${verificationUrl}</a>
                    </div>
                  </td>
                </tr>
              </table>

              <!-- CTA -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                  <td align="center" class="cta-wrap">
                    <a href="${verificationUrl}" class="cta"
                      style="display:block;background-color:#7c9082;color:#ffffff;text-decoration:none;border-radius:10px;padding:14px 28px;font-size:14px;font-weight:600;text-align:center;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
                      Verify my email address →
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Expiry warning -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                  <td class="expiry-cell">
                    <div class="expiry-box" style="background-color:#fcfaf4;border:1px solid #ece5cf;border-radius:8px;padding:12px 14px;font-size:12px;color:#665a35;line-height:1.6;">
                    <strong style="color:#5f542f;">This link expires in ${expiryHours} hours.</strong>
                    If it expires, you can request a new one from the <a href="${loginUrl}" class="login-link" style="color:#7c9082;text-decoration:none;font-weight:600;">login page</a>.
                    </div>
                  </td>
                </tr>
              </table>

              <p class="fine-print" style="font-size:12px;color:#6b7280;line-height:1.65;margin:0;">
                <strong style="color:#4b5565;">Didn\'t create an Arkio. account?</strong>
                You can safely ignore this email. Never share this link with anyone.
              </p>
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td class="footer" style="background-color:#f6f6f3;padding:20px 36px;border-top:1px solid #eceae4;">
              <p class="footer-text" style="font-size:11px;color:#6b7280;margin:0;">© 2025 Arkio. · All rights reserved</p>
              <p class="footer-secondary" style="font-size:10px;color:#9ba3b2;margin:4px 0 0;font-family:monospace;">Built by Rishi Tiwari · Ujjain, India</p>
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