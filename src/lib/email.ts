export interface SendOrderEmailParams {
  toEmail: string;
  customerPhone?: string | undefined;
  orderId: string;
  paymentId: string;
  invoiceToken?: string | undefined;
  productName: string;
  variantName?: string | undefined;
  amount: number;
  keys: string[];
}

export async function sendOrderConfirmationEmail(params: SendOrderEmailParams): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const apiKey = process.env["RESEND_API_KEY"] || "re_VwTiUkCF_6f11JmYMjumXd4C873uKKDi5";

    if (!params.toEmail || !params.toEmail.includes("@")) {
      return { success: false, error: "Invalid customer email" };
    }

    const fromAddress = process.env["EMAIL_FROM"] || "GurfMarket <onboarding@resend.dev>";
    const credentialsHtml =
      params.keys && params.keys.length > 0
        ? params.keys
            .map(
              (k) =>
                `<div style="background:#000000;border:1px solid #22c55e;border-radius:8px;padding:12px 16px;font-family:monospace;font-size:14px;color:#4ade80;margin-bottom:8px;word-break:break-all;">${k}</div>`
            )
            .join("")
        : `<div style="background:#18181b;border:1px solid #3f3f46;border-radius:8px;padding:12px;font-size:13px;color:#a1a1aa;">Your digital order has been reserved. If keys do not appear shortly, contact support with your Payment ID.</div>`;

    const emailHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Your GurfMarket Order Confirmation</title>
</head>
<body style="margin:0;padding:0;background-color:#07090b;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#f4f4f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#07090b;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:580px;background-color:#0c0e12;border:1px solid rgba(255,255,255,0.1);border-radius:20px;overflow:hidden;box-shadow:0 12px 40px rgba(0,0,0,0.6);">
          
          <!-- Header with GurfMarket Crown Branding -->
          <tr>
            <td style="padding:32px 32px 24px;border-bottom:1px solid rgba(255,255,255,0.06);background:linear-gradient(180deg, rgba(34,197,94,0.12) 0%, rgba(12,14,18,0) 100%);">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <table cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="vertical-align:middle;padding-right:12px;">
                          <div style="width:44px;height:44px;background:#0d1f14;border:1px solid rgba(34,197,94,0.4);border-radius:10px;text-align:center;line-height:44px;overflow:hidden;box-shadow:0 0 12px rgba(34,197,94,0.3);">
                            <img src="https://iili.io/nWmWy7e.png" width="44" height="44" alt="👑" style="display:block;width:44px;height:44px;border:0;outline:none;" />
                          </div>
                        </td>
                        <td style="vertical-align:middle;">
                          <div style="font-size:22px;font-weight:900;letter-spacing:-0.5px;color:#ffffff;line-height:1.1;">
                            Gurf<span style="color:#22c55e;">Market</span>
                          </div>
                          <div style="font-size:10px;font-weight:700;color:#22c55e;text-transform:uppercase;letter-spacing:1.5px;margin-top:3px;">
                            Verified Digital Dispatch
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                  <td align="right">
                    <span style="display:inline-block;background:rgba(34,197,94,0.15);border:1px solid rgba(34,197,94,0.3);color:#22c55e;font-size:11px;font-weight:700;padding:6px 12px;border-radius:999px;">
                      ● Payment Confirmed
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Body -->
          <tr>
            <td style="padding:32px;">
              <h1 style="margin:0 0 8px;font-size:22px;font-weight:800;color:#ffffff;line-height:1.3;">
                Thank you for your order!
              </h1>
              <p style="margin:0 0 24px;font-size:14px;color:#a1a1aa;line-height:1.5;">
                Your digital subscription access for <strong>${params.productName}</strong> has been issued and verified.
              </p>

              <!-- Credentials Box -->
              <div style="background-color:#11151b;border:1px solid rgba(34,197,94,0.3);border-radius:14px;padding:20px;margin-bottom:28px;">
                <div style="font-size:12px;font-weight:700;color:#22c55e;text-transform:uppercase;letter-spacing:1px;margin-bottom:12px;">
                  🔑 Your Delivered Access Credentials / Key:
                </div>
                ${credentialsHtml}
                <div style="font-size:11px;color:#71717a;margin-top:8px;">
                  💡 Tip: Copy the credentials above exactly as shown to activate your account.
                </div>
              </div>

              <!-- Order Summary Table -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-radius:12px;margin-bottom:24px;">
                <tr>
                  <td style="padding:14px 18px;border-bottom:1px solid rgba(255,255,255,0.06);font-size:12px;color:#71717a;">Order ID</td>
                  <td style="padding:14px 18px;border-bottom:1px solid rgba(255,255,255,0.06);font-size:12px;font-weight:800;font-family:monospace;color:#ffffff;text-align:right;">
                    ${params.orderId || params.paymentId}
                  </td>
                </tr>
                <tr>
                  <td style="padding:14px 18px;border-bottom:1px solid rgba(255,255,255,0.06);font-size:12px;color:#71717a;">Product</td>
                  <td style="padding:14px 18px;border-bottom:1px solid rgba(255,255,255,0.06);font-size:12px;font-weight:700;color:#ffffff;text-align:right;">
                    ${params.productName} ${params.variantName ? `<span style="color:#22c55e;">(${params.variantName})</span>` : ""}
                  </td>
                </tr>
                <tr>
                  <td style="padding:14px 18px;border-bottom:1px solid rgba(255,255,255,0.06);font-size:12px;color:#71717a;">Total Amount</td>
                  <td style="padding:14px 18px;border-bottom:1px solid rgba(255,255,255,0.06);font-size:15px;font-weight:900;color:#22c55e;text-align:right;font-family:monospace;">
                    ₹${params.amount.toLocaleString("en-IN")}
                  </td>
                </tr>
                <tr>
                  <td style="padding:14px 18px;border-bottom:1px solid rgba(255,255,255,0.06);font-size:12px;color:#71717a;">Payment Reference</td>
                  <td style="padding:14px 18px;border-bottom:1px solid rgba(255,255,255,0.06);font-size:11px;font-family:monospace;color:#a1a1aa;text-align:right;">
                    ${params.paymentId}
                  </td>
                </tr>
                <tr>
                  <td style="padding:14px 18px;font-size:12px;color:#71717a;">Customer Email</td>
                  <td style="padding:14px 18px;font-size:12px;color:#ffffff;text-align:right;">
                    ${params.toEmail}
                  </td>
                </tr>
              </table>

              <!-- Big View Invoice Button matching user request -->
              <div style="text-align:center;margin:28px 0 24px;">
                <a href="${(process.env['APP_URL'] || 'http://localhost:8080')}/invoice/${params.invoiceToken || params.orderId || params.paymentId}" target="_blank" style="display:inline-block;background:#22c55e;color:#000000;font-size:14px;font-weight:900;text-decoration:none;padding:15px 34px;border-radius:12px;box-shadow:0 6px 22px rgba(34,197,94,0.35);letter-spacing:0.2px;">
                  📄 View Official Invoice & Download Keys →
                </a>
                <div style="font-size:11px;color:#71717a;margin-top:8px;">
                  Open your invoice to print, download credentials text file, or save PDF.
                </div>
              </div>

              <!-- Guarantee Note -->
              <div style="background:rgba(34,197,94,0.05);border-left:3px solid #22c55e;padding:12px 16px;border-radius:0 8px 8px 0;margin-bottom:20px;">
                <p style="margin:0;font-size:12px;color:#d4d4d8;line-height:1.5;">
                  <strong>24/7 Replacement Warranty:</strong> If you face any issues with your subscription, contact our live support anytime with your Order ID.
                </p>
              </div>

              <!-- Support Button -->
              <div style="text-align:center;margin-bottom:16px;">
                <a href="https://t.me/gurfmarket" target="_blank" style="display:inline-block;background:rgba(255,255,255,0.08);color:#ffffff;border:1px solid rgba(255,255,255,0.15);font-size:12px;font-weight:700;text-decoration:none;padding:10px 24px;border-radius:10px;">
                  Contact 24/7 Support on Telegram
                </a>
              </div>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 32px;background-color:#080a0d;border-top:1px solid rgba(255,255,255,0.06);text-align:center;font-size:11px;color:#71717a;line-height:1.6;">
              <p style="margin:0 0 6px;">This email was sent automatically by <strong>GurfMarket</strong> upon confirmed Razorpay transaction.</p>
              <p style="margin:0;">&copy; ${new Date().getFullYear()} GurfMarket • Instant Delivery & Verified Subscriptions</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    const appUrl = process.env["APP_URL"] || "http://localhost:8080";
    const invoiceUrl = `${appUrl}/invoice/${params.invoiceToken || params.orderId || params.paymentId}`;

    const plainText = `GurfMarket — Order Confirmation & Digital Receipt

Thank you for your order!
Your digital subscription access for ${params.productName} ${params.variantName ? `(${params.variantName})` : ""} has been verified.

Order ID: ${params.orderId || params.paymentId}
Amount Paid: ₹${params.amount.toLocaleString("en-IN")}
Payment Reference: ${params.paymentId}

DELIVERED CREDENTIALS / ACCESS KEYS:
${params.keys && params.keys.length > 0 ? params.keys.join("\n") : "Your digital license has been issued."}

View Your Official Invoice & Download Keys:
${invoiceUrl}

Need Help? 24/7 Replacement Warranty Guarantee
Official Telegram: https://t.me/gurfmarket

© ${new Date().getFullYear()} GurfMarket — Instant Verified Subscriptions`;

    let attachments: Array<{ filename: string; content: string; content_id: string }> | undefined = undefined;
    try {
      const fs = await import("node:fs");
      const path = await import("node:path");
      const logoPath = path.join(process.cwd(), "public", "email-logo.png");
      if (fs.existsSync(logoPath)) {
        const logoBuffer = fs.readFileSync(logoPath);
        attachments = [
          {
            filename: "logo.png",
            content: logoBuffer.toString("base64"),
            content_id: "gurfmarket-logo",
          },
        ];
      }
    } catch {
      // ignore
    }

    const payload: Record<string, any> = {
      from: fromAddress,
      to: [params.toEmail],
      reply_to: "fatehxgames12@gmail.com",
      subject: `Your GurfMarket Order Receipt #${params.orderId || params.paymentId}`,
      html: emailHtml,
      text: plainText,
    };
    if (attachments && attachments.length > 0) {
      payload["attachments"] = attachments;
    }

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const resJson = await response.json();
    if (!response.ok) {
      console.error("Resend API error:", resJson);
      return { success: false, error: resJson.message || "Failed to send email via Resend" };
    }

    return { success: true, id: resJson.id };
  } catch (err: any) {
    console.error("sendOrderConfirmationEmail exception:", err);
    return { success: false, error: err.message };
  }
}
