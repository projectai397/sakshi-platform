export function shippingUpdateTemplate(data: {
  orderId: number;
  customerName: string;
  status: string;
  trackingNumber?: string;
  trackingUrl?: string;
  estimatedDelivery?: string;
}): string {
  const statusConfig: Record<string, { icon: string; color: string; title: string; message: string }> = {
    processing: {
      icon: "📦",
      color: "#2196F3",
      title: "Order is Being Prepared",
      message: "We're carefully preparing your order for shipment.",
    },
    shipped: {
      icon: "🚚",
      color: "#FF9800",
      title: "Your Order Has Shipped!",
      message: "Your order is on its way to you.",
    },
    in_transit: {
      icon: "🛣️",
      color: "#9C27B0",
      title: "Order In Transit",
      message: "Your package is traveling to your location.",
    },
    out_for_delivery: {
      icon: "🚗",
      color: "#4CAF50",
      title: "Out for Delivery",
      message: "Your package will be delivered today!",
    },
    delivered: {
      icon: "✅",
      color: "#4CAF50",
      title: "Order Delivered!",
      message: "Your order has been successfully delivered.",
    },
  };

  const config = statusConfig[data.status] || statusConfig.processing;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Shipping Update</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, ${config.color} 0%, ${config.color}dd 100%); padding: 40px 30px; text-align: center;">
              <div style="font-size: 64px; margin-bottom: 10px;">${config.icon}</div>
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">${config.title}</h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              
              <!-- Greeting -->
              <h2 style="margin: 0 0 20px 0; color: #333; font-size: 24px;">
                Hello, ${data.customerName}! 👋
              </h2>
              
              <p style="margin: 0 0 30px 0; color: #666; font-size: 16px; line-height: 1.6;">
                ${config.message}
              </p>

              <!-- Order Info -->
              <div style="background-color: #f9f9f9; border-radius: 6px; padding: 25px; margin: 30px 0;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding-bottom: 15px;">
                      <strong style="color: #333; font-size: 14px;">Order Number:</strong><br>
                      <span style="color: #FF6B35; font-size: 20px; font-weight: bold;">#${data.orderId}</span>
                    </td>
                  </tr>
                  ${
                    data.trackingNumber
                      ? `
                  <tr>
                    <td style="padding-bottom: 15px;">
                      <strong style="color: #333; font-size: 14px;">Tracking Number:</strong><br>
                      <span style="color: #666; font-size: 16px; font-family: 'Courier New', monospace;">${data.trackingNumber}</span>
                    </td>
                  </tr>
                  `
                      : ""
                  }
                  ${
                    data.estimatedDelivery
                      ? `
                  <tr>
                    <td>
                      <strong style="color: #333; font-size: 14px;">Estimated Delivery:</strong><br>
                      <span style="color: #4CAF50; font-size: 16px; font-weight: 600;">${data.estimatedDelivery}</span>
                    </td>
                  </tr>
                  `
                      : ""
                  }
                </table>
              </div>

              ${
                data.trackingUrl
                  ? `
              <!-- Track Button -->
              <div style="text-align: center; margin: 40px 0;">
                <a href="${data.trackingUrl}" 
                   style="display: inline-block; background-color: ${config.color}; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-weight: 600; font-size: 16px;">
                  Track Your Package
                </a>
              </div>
              `
                  : ""
              }

              <!-- Timeline -->
              <div style="margin: 40px 0;">
                <h3 style="margin: 0 0 20px 0; color: #333; font-size: 18px;">Delivery Timeline</h3>
                
                <div style="position: relative; padding-left: 40px;">
                  ${["processing", "shipped", "in_transit", "out_for_delivery", "delivered"]
                    .map((step, index) => {
                      const stepConfig = statusConfig[step];
                      const isCompleted = Object.keys(statusConfig).indexOf(data.status) >= index;
                      const isCurrent = step === data.status;
                      
                      return `
                  <div style="position: relative; padding-bottom: ${index < 4 ? "30px" : "0"};">
                    <div style="position: absolute; left: -40px; width: 24px; height: 24px; border-radius: 50%; background-color: ${
                      isCompleted ? stepConfig.color : "#e0e0e0"
                    }; border: 3px solid ${isCurrent ? "#ffffff" : "transparent"}; box-shadow: ${
                      isCurrent ? `0 0 0 3px ${stepConfig.color}` : "none"
                    };"></div>
                    ${
                      index < 4
                        ? `<div style="position: absolute; left: -29px; top: 24px; width: 2px; height: 30px; background-color: ${
                            isCompleted ? stepConfig.color : "#e0e0e0"
                          };"></div>`
                        : ""
                    }
                    <div>
                      <strong style="color: ${isCompleted ? "#333" : "#999"}; font-size: 14px;">
                        ${stepConfig.icon} ${stepConfig.title}
                      </strong>
                    </div>
                  </div>
                  `;
                    })
                    .join("")}
                </div>
              </div>

              <!-- Help Text -->
              <div style="background-color: #FFF9E6; border-radius: 6px; padding: 20px; margin: 30px 0;">
                <p style="margin: 0; color: #856404; font-size: 14px; line-height: 1.6;">
                  <strong>💡 Tip:</strong> Make sure someone is available to receive the package. If you're not home, the courier may leave a delivery attempt notice.
                </p>
              </div>

              <!-- Order Details Link -->
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.VITE_BASE_URL || "http://localhost:3000"}/orders/${data.orderId}" 
                   style="color: #FF6B35; text-decoration: none; font-size: 14px;">
                  View Full Order Details →
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
