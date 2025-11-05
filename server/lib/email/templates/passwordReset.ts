export function passwordResetTemplate(data: {
  userName: string;
  resetLink: string;
  expiresIn: string;
}): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Reset</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%); padding: 40px 30px; text-align: center;">
              <div style="font-size: 64px; margin-bottom: 10px;">🔐</div>
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">Password Reset Request</h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              
              <!-- Greeting -->
              <h2 style="margin: 0 0 20px 0; color: #333; font-size: 24px;">
                Hello, ${data.userName}
              </h2>
              
              <p style="margin: 0 0 20px 0; color: #666; font-size: 16px; line-height: 1.6;">
                We received a request to reset your password for your Sakshi Platform account. Click the button below to create a new password.
              </p>

              <!-- Reset Button -->
              <div style="text-align: center; margin: 40px 0;">
                <a href="${data.resetLink}" 
                   style="display: inline-block; background-color: #FF6B35; color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 6px; font-weight: 600; font-size: 18px;">
                  Reset Password
                </a>
              </div>

              <!-- Expiry Notice -->
              <div style="background-color: #FFF3E0; border-left: 4px solid #FF9800; border-radius: 6px; padding: 20px; margin: 30px 0;">
                <p style="margin: 0; color: #E65100; font-size: 14px; line-height: 1.6;">
                  <strong>⏰ Important:</strong> This password reset link will expire in <strong>${data.expiresIn}</strong>. If you don't reset your password within this time, you'll need to request a new link.
                </p>
              </div>

              <!-- Alternative Link -->
              <div style="background-color: #f9f9f9; border-radius: 6px; padding: 20px; margin: 30px 0;">
                <p style="margin: 0 0 10px 0; color: #333; font-size: 14px;">
                  <strong>Button not working?</strong>
                </p>
                <p style="margin: 0; color: #666; font-size: 13px; line-height: 1.6; word-break: break-all;">
                  Copy and paste this link into your browser:<br>
                  <a href="${data.resetLink}" style="color: #FF6B35; text-decoration: none;">${data.resetLink}</a>
                </p>
              </div>

              <!-- Security Notice -->
              <div style="background-color: #FFEBEE; border-left: 4px solid #F44336; border-radius: 6px; padding: 20px; margin: 30px 0;">
                <p style="margin: 0 0 10px 0; color: #C62828; font-size: 14px; line-height: 1.6;">
                  <strong>🛡️ Didn't request this?</strong>
                </p>
                <p style="margin: 0; color: #C62828; font-size: 13px; line-height: 1.6;">
                  If you didn't request a password reset, please ignore this email. Your password will remain unchanged. For security, we recommend changing your password if you suspect unauthorized access to your account.
                </p>
              </div>

              <!-- Security Tips -->
              <div style="margin: 40px 0;">
                <h3 style="margin: 0 0 15px 0; color: #333; font-size: 16px;">
                  Password Security Tips:
                </h3>
                <ul style="margin: 0; padding-left: 20px; color: #666; font-size: 14px; line-height: 1.8;">
                  <li>Use a unique password for your Sakshi account</li>
                  <li>Make it at least 8 characters long</li>
                  <li>Include uppercase, lowercase, numbers, and symbols</li>
                  <li>Don't share your password with anyone</li>
                  <li>Consider using a password manager</li>
                </ul>
              </div>

              <!-- Help -->
              <p style="margin: 40px 0 0 0; color: #999; font-size: 14px; line-height: 1.6; text-align: center;">
                Need help? Contact our support team at 
                <a href="mailto:support@sakshi.com" style="color: #FF6B35; text-decoration: none;">support@sakshi.com</a>
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9f9f9; padding: 30px; text-align: center; border-top: 1px solid #eee;">
              <p style="margin: 0 0 10px 0; color: #666; font-size: 14px;">
                <strong>Sakshi Platform</strong>
              </p>
              <p style="margin: 0 0 10px 0; color: #999; font-size: 12px;">
                Witnessing every journey, supporting every soul 🙏
              </p>
              <p style="margin: 0; color: #999; font-size: 12px;">
                © ${new Date().getFullYear()} Sakshi Platform. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}
