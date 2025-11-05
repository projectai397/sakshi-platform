export function sevaTokenTemplate(data: {
  userName: string;
  amount: number;
  type: "earned" | "spent";
  balance: number;
  description: string;
}): string {
  const isEarned = data.type === "earned";
  const icon = isEarned ? "🎉" : "✨";
  const color = isEarned ? "#4CAF50" : "#FF6B35";
  const title = isEarned ? "Seva Tokens Earned!" : "Seva Tokens Spent";
  const message = isEarned
    ? `Congratulations! You've earned ${data.amount} Seva Tokens.`
    : `You've used ${data.amount} Seva Tokens.`;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, ${color} 0%, ${isEarned ? "#66BB6A" : "#F7931E"} 100%); padding: 40px 30px; text-align: center;">
              <div style="font-size: 64px; margin-bottom: 10px;">${icon}</div>
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">${title}</h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              
              <!-- Greeting -->
              <h2 style="margin: 0 0 20px 0; color: #333; font-size: 24px;">
                Namaste, ${data.userName}! 🙏
              </h2>
              
              <p style="margin: 0 0 30px 0; color: #666; font-size: 16px; line-height: 1.6;">
                ${message}
              </p>

              <!-- Token Amount -->
              <div style="background: linear-gradient(135deg, #f9f9f9 0%, #ffffff 100%); border: 2px solid ${color}; border-radius: 12px; padding: 30px; text-align: center; margin: 30px 0;">
                <div style="color: #999; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px;">
                  ${isEarned ? "Earned" : "Spent"}
                </div>
                <div style="color: ${color}; font-size: 48px; font-weight: bold; margin: 10px 0;">
                  ${data.amount}
                </div>
                <div style="color: #666; font-size: 16px;">
                  Seva Tokens
                </div>
              </div>

              <!-- Description -->
              <div style="background-color: #f9f9f9; border-left: 4px solid ${color}; border-radius: 6px; padding: 20px; margin: 30px 0;">
                <p style="margin: 0; color: #666; font-size: 14px; line-height: 1.6;">
                  <strong style="color: #333;">Description:</strong><br>
                  ${data.description}
                </p>
              </div>

              <!-- Balance -->
              <div style="text-align: center; margin: 30px 0;">
                <p style="margin: 0 0 10px 0; color: #999; font-size: 14px;">
                  Your Current Balance
                </p>
                <p style="margin: 0; color: #333; font-size: 32px; font-weight: bold;">
                  ${data.balance} <span style="font-size: 16px; color: #999; font-weight: normal;">Seva Tokens</span>
                </p>
              </div>

              <!-- Info Box -->
              <div style="background-color: #FFF9E6; border-radius: 6px; padding: 20px; margin: 30px 0;">
                <p style="margin: 0; color: #856404; font-size: 14px; line-height: 1.6;">
                  <strong>💡 About Seva Tokens:</strong><br>
                  Seva Tokens are earned through acts of service and can be used to access products and services on the Sakshi Platform. They represent the spirit of selfless service (Seva) in our community.
                </p>
              </div>

              <!-- CTA Button -->
              <div style="text-align: center; margin: 40px 0;">
                <a href="${process.env.VITE_BASE_URL || "http://localhost:3000"}/seva-wallet" 
                   style="display: inline-block; background-color: ${color}; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-weight: 600; font-size: 16px;">
                  View Seva Wallet
                </a>
              </div>

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
