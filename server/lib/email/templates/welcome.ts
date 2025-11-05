export function welcomeTemplate(data: { userName: string }): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Sakshi</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          
          <!-- Header with Adiyogi-inspired design -->
          <tr>
            <td style="background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%); padding: 60px 30px; text-align: center; position: relative;">
              <div style="font-size: 72px; margin-bottom: 20px;">🙏</div>
              <h1 style="margin: 0; color: #ffffff; font-size: 36px; font-weight: bold;">Welcome to Sakshi</h1>
              <p style="margin: 15px 0 0 0; color: #ffffff; font-size: 18px; opacity: 0.95;">साक्षी - The Witness</p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 50px 30px;">
              
              <!-- Greeting -->
              <h2 style="margin: 0 0 20px 0; color: #333; font-size: 28px; text-align: center;">
                Namaste, ${data.userName}! 🙏
              </h2>
              
              <p style="margin: 0 0 25px 0; color: #666; font-size: 16px; line-height: 1.8; text-align: center;">
                We're delighted to have you join our community. Sakshi is more than a platform—it's a space for conscious living, sustainable choices, and spiritual growth.
              </p>

              <!-- Features Grid -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 40px 0;">
                <tr>
                  <td width="50%" style="padding: 20px; vertical-align: top;">
                    <div style="text-align: center;">
                      <div style="font-size: 48px; margin-bottom: 15px;">🛍️</div>
                      <h3 style="margin: 0 0 10px 0; color: #333; font-size: 18px;">Thrift Store</h3>
                      <p style="margin: 0; color: #666; font-size: 14px; line-height: 1.6;">
                        Discover pre-loved treasures and embrace sustainable shopping
                      </p>
                    </div>
                  </td>
                  <td width="50%" style="padding: 20px; vertical-align: top;">
                    <div style="text-align: center;">
                      <div style="font-size: 48px; margin-bottom: 15px;">🪙</div>
                      <h3 style="margin: 0 0 10px 0; color: #333; font-size: 18px;">Seva Tokens</h3>
                      <p style="margin: 0; color: #666; font-size: 14px; line-height: 1.6;">
                        Earn tokens through service and use them across the platform
                      </p>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td width="50%" style="padding: 20px; vertical-align: top;">
                    <div style="text-align: center;">
                      <div style="font-size: 48px; margin-bottom: 15px;">☕</div>
                      <h3 style="margin: 0 0 10px 0; color: #333; font-size: 18px;">Isha Cafés</h3>
                      <p style="margin: 0; color: #666; font-size: 14px; line-height: 1.6;">
                        Find and visit Isha Cafés for conscious dining experiences
                      </p>
                    </div>
                  </td>
                  <td width="50%" style="padding: 20px; vertical-align: top;">
                    <div style="text-align: center;">
                      <div style="font-size: 48px; margin-bottom: 15px;">🧘</div>
                      <h3 style="margin: 0 0 10px 0; color: #333; font-size: 18px;">Retreats</h3>
                      <p style="margin: 0; color: #666; font-size: 14px; line-height: 1.6;">
                        Explore spiritual retreats and deepen your practice
                      </p>
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Getting Started -->
              <div style="background: linear-gradient(135deg, #f9f9f9 0%, #ffffff 100%); border-radius: 12px; padding: 30px; margin: 40px 0;">
                <h3 style="margin: 0 0 20px 0; color: #333; font-size: 20px; text-align: center;">
                  Getting Started
                </h3>
                <ol style="margin: 0; padding-left: 20px; color: #666; font-size: 15px; line-height: 2;">
                  <li><strong>Explore the Store:</strong> Browse our collection of pre-loved items</li>
                  <li><strong>Earn Seva Tokens:</strong> Volunteer and contribute to earn tokens</li>
                  <li><strong>Make Your First Purchase:</strong> Use money, tokens, or get items free</li>
                  <li><strong>Join the Community:</strong> Connect with like-minded souls</li>
                </ol>
              </div>

              <!-- Quote -->
              <div style="border-left: 4px solid #FF6B35; padding: 20px; margin: 40px 0; background-color: #FFF9E6;">
                <p style="margin: 0; color: #856404; font-size: 16px; line-height: 1.8; font-style: italic;">
                  "The one who is a witness to life, untouched by its happenings, is Sakshi—the eternal observer."
                </p>
              </div>

              <!-- CTA Buttons -->
              <div style="text-align: center; margin: 40px 0;">
                <a href="${process.env.VITE_BASE_URL || "http://localhost:3000"}/shop" 
                   style="display: inline-block; background-color: #FF6B35; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-weight: 600; font-size: 16px; margin: 0 10px 10px 0;">
                  Start Shopping
                </a>
                <a href="${process.env.VITE_BASE_URL || "http://localhost:3000"}/volunteer" 
                   style="display: inline-block; background-color: #4CAF50; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-weight: 600; font-size: 16px; margin: 0 0 10px 10px;">
                  Become a Volunteer
                </a>
              </div>

              <!-- Help -->
              <p style="margin: 40px 0 0 0; color: #999; font-size: 14px; line-height: 1.6; text-align: center;">
                Need help getting started? Visit our <a href="${process.env.VITE_BASE_URL || "http://localhost:3000"}/help" style="color: #FF6B35; text-decoration: none;">Help Center</a> or reach out to our support team.
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
              <div style="margin: 20px 0;">
                <a href="#" style="color: #999; text-decoration: none; margin: 0 10px; font-size: 12px;">About</a>
                <a href="#" style="color: #999; text-decoration: none; margin: 0 10px; font-size: 12px;">Help</a>
                <a href="#" style="color: #999; text-decoration: none; margin: 0 10px; font-size: 12px;">Contact</a>
              </div>
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
