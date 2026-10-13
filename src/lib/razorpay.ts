import { createServerFn } from "@tanstack/react-start";
import { executeResellerOrderInternal } from "./reseller-api";
import crypto from "node:crypto";

export interface CreateRazorpayOrderInput {
  amount: number; // in INR
  productName: string;
  productId: string;
  variantId?: string | undefined;
  quantity?: number | undefined;
  customerEmail?: string | undefined;
  customerPhone?: string | undefined;
}

export interface RazorpayOrderResult {
  success: boolean;
  orderId?: string | undefined;
  amount?: number | undefined; // in paise
  currency?: string | undefined;
  keyId?: string | undefined;
  error?: string | undefined;
}

export interface VerifyPaymentInput {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  productId: string;
  variantId?: string | undefined;
  quantity?: number | undefined;
  customerEmail?: string | undefined;
  customerPhone?: string | undefined;
  amount?: number | undefined;
  productName?: string | undefined;
}

export interface PaymentVerificationResult {
  success: boolean;
  paymentId?: string | undefined;
  orderId?: string | undefined;
  invoiceToken?: string | undefined;
  keys?: string[] | undefined;
  status?: string | undefined;
  notice?: string | undefined;
  error?: string | undefined;
}

function getRazorpayCredentials(): { keyId: string; keySecret: string } {
  const keyId = process.env["RAZORPAY_KEY_ID"] || "rzp_live_TnLnd26KFDEfoU";
  const keySecret = process.env["RAZORPAY_KEY_SECRET"] || "tHr0xnFLmtsWJPdrue3r6YYK";
  return { keyId, keySecret };
}

/**
 * Server Function: Create Razorpay Order
 */
export const createRazorpayOrder = createServerFn({ method: "POST" })
  .validator((data: CreateRazorpayOrderInput) => data)
  .handler(async ({ data }): Promise<RazorpayOrderResult> => {
    try {
      const { keyId, keySecret } = getRazorpayCredentials();

      // Razorpay expects integer amount in paise (1 INR = 100 paise)
      // Minimum is 100 paise (₹1.00)
      const amountInPaise = Math.max(100, Math.round(data.amount * 100));

      const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
      const receipt = `gurf_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

      const res = await fetch("https://api.razorpay.com/v1/orders", {
        method: "POST",
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          amount: amountInPaise,
          currency: "INR",
          receipt,
          notes: {
            productName: (data.productName || "Digital Product").slice(0, 40),
            productId: data.productId,
            variantId: data.variantId || "",
            quantity: String(data.quantity || 1),
          },
        }),
      });

      const resData = await res.json();

      if (!res.ok) {
        return {
          success: false,
          error: resData.error?.description || resData.message || "Failed to create Razorpay order.",
        };
      }

      // Record initiated order (defaults to abandoned until verified/paid)
      try {
        const { recordOrderInitiated } = await import("./store-config");
        await recordOrderInitiated({
          orderId: resData.id,
          productName: data.productName || "Digital Product",
          variantName: data.variantId,
          amount: data.amount,
          quantity: data.quantity || 1,
          customerEmail: data.customerEmail,
          customerPhone: data.customerPhone,
        });
      } catch (logErr) {
        console.error("Non-blocking order logging error:", logErr);
      }

      return {
        success: true,
        orderId: resData.id,
        amount: resData.amount,
        currency: resData.currency,
        keyId,
      };
    } catch (err: any) {
      return {
        success: false,
        error: err.message || "Could not connect to Razorpay server.",
      };
    }
  });

/**
 * Server Function: Verify Razorpay Payment Signature & Fulfill Digital Order
 */
export const verifyRazorpayPayment = createServerFn({ method: "POST" })
  .validator((data: VerifyPaymentInput) => data)
  .handler(async ({ data }): Promise<PaymentVerificationResult> => {
    try {
      const { keySecret } = getRazorpayCredentials();

      // Signature verification: HMAC SHA256 of "order_id|payment_id" with key_secret
      const body = `${data.razorpay_order_id}|${data.razorpay_payment_id}`;
      const expectedSignature = crypto
        .createHmac("sha256", keySecret)
        .update(body)
        .digest("hex");

      if (expectedSignature !== data.razorpay_signature) {
        return {
          success: false,
          error: "Payment verification failed. Invalid signature.",
        };
      }

      // Payment is verified! Now fulfill digital credentials from Wholesale Reseller API
      let keys: string[] = [];
      let status = "paid";
      let notice: string | undefined;

      try {
        const resellerRes = await executeResellerOrderInternal({
          productId: data.productId,
          variantId: data.variantId,
          quantity: data.quantity || 1,
        });

        if (resellerRes.success && resellerRes.keys && resellerRes.keys.length > 0) {
          keys = resellerRes.keys;
          status = "fulfilled";
        } else if (resellerRes.error) {
          notice = resellerRes.error;
        }
      } catch (err: any) {
        notice = err.message || "Wholesale fulfillment pending.";
      }

      // Record order in admin panel as paid and retrieve high-security invoice token
      let invoiceToken = "";
      try {
        const { recordSuccessfulOrder } = await import("./store-config");
        const recRes = await recordSuccessfulOrder({
          paymentId: data.razorpay_payment_id,
          orderId: data.razorpay_order_id,
          productName: data.productName || data.productId,
          variantName: data.variantId,
          amount: data.amount || 0,
          customerEmail: data.customerEmail,
          customerPhone: data.customerPhone,
          keysDelivered: keys,
        });
        if (recRes && recRes.invoiceToken) {
          invoiceToken = recRes.invoiceToken;
        }
      } catch {
        // non-blocking
      }

      // Automatically dispatch branded GurfMarket email with credentials via Resend
      if (data.customerEmail && data.customerEmail.includes("@")) {
        try {
          const { sendOrderConfirmationEmail } = await import("./email");
          sendOrderConfirmationEmail({
            toEmail: data.customerEmail,
            customerPhone: data.customerPhone,
            orderId: data.razorpay_order_id,
            paymentId: data.razorpay_payment_id,
            invoiceToken,
            productName: data.productName || data.productId,
            variantName: data.variantId,
            amount: data.amount || 0,
            keys,
          });
        } catch (emailErr) {
          console.error("Non-blocking email dispatch error:", emailErr);
        }
      }

      return {
        success: true,
        paymentId: data.razorpay_payment_id,
        orderId: data.razorpay_order_id,
        invoiceToken,
        keys,
        status,
        notice,
      };

    } catch (err: any) {
      return {
        success: false,
        error: err.message || "Error during payment verification.",
      };
    }
  });

/**
 * Client Helper: Dynamically load Razorpay standard checkout script
 */
export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(false);
      return;
    }
    if ((window as any).Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}
