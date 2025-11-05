export function orderConfirmationTemplate(data: {
  orderId: number;
  customerName: string;
  items: Array<{ name: string; quantity: number; price: number }>;
  total: number;
  paymentMethod: string;
}): string {
  const itemsHtml = data.items
    .map(
      (item) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #eee;">${item.name}</td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">₹${item.price.toFixed(2)}</td>
    </tr>
  `
    )
    .join("");

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmation</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: bold;">Sakshi</h1>
              <p style="margin: 10px 0 0 0; color: #ffffff; font-size: 16px; opacity: 0.9;">साक्षी - Witness</p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              
              <!-- Greeting -->
              <h2 style="margin: 0 0 20px 0; color: #333; font-size: 24px;">
                Thank you, ${data.customerName}! 🙏
              </h2>
              
              <p style="margin: 0 0 20px 0; color: #666; font-size: 16px; line-height: 1.6;">
                Your order has been confirmed and is being processed. We'll notify you when it ships.
              </p>

              <!-- Order Info -->
              <div style="background-color: #f9f9f9; border-radius: 6px; padding: 20px; margin: 30px 0;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding-bottom: 10px;">
                      <strong style="color: #333;">Order Number:</strong>
                      <span style="color: #FF6B35; font-size: 18px; font-weight: bold;">#${data.orderId}</span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong style="color: #333;">Payment Method:</strong>
                      <span style="color: #666;">${data.paymentMethod}</span>
                    </td>
                  </tr>
                </table>
              </div>

              <!-- Order Items -->
              <h3 style="margin: 30px 0 15px 0; color: #333; font-size: 18px;">Order Details</h3>
              
              <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #eee; border-radius: 6px; overflow: hidden;">
                <thead>
                  <tr style="background-color: #f9f9f9;">
                    <th style="padding: 12px; text-align: left; color: #333; font-weight: 600;">Item</th>
                    <th style="padding: 12px; text-align: center; color: #333; font-weight: 600;">Qty</th>
                    <th style="padding: 12px; text-align: right; color: #333; font-weight: 600;">Price</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                  <tr style="background-color: #f9f9f9;">
                    <td colspan="2" style="padding: 15px; text-align: right; font-weight: bold; color: #333;">Total:</td>
                    <td style="padding: 15px; text-align: right; font-weight: bold; color: #FF6B35; font-size: 18px;">₹${data.total.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>

              <!-- CTA Button -->
              <div style="text-align: center; margin: 40px 0;">
                <a href="${process.env.VITE_BASE_URL || "http://localhost:3000"}/orders/${data.orderId}" 
                   style="display: inline-block; background-color: #FF6B35; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-weight: 600; font-size: 16px;">
                  View Order Details
                </a>
              </div>

              <!-- Help Text -->
              <p style="margin: 30px 0 0 0; color: #999; font-size: 14px; line-height: 1.6;">
                If you have any questions about your order, please don't hesitate to contact our support team.
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
