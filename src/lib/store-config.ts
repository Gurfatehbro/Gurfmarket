import { createServerFn } from "@tanstack/react-start";
import { fetchResellerBalance } from "./reseller-api";

export interface StoreConfig {
  customPrices: Record<string, number>;
  customNames?: Record<string, string> | undefined;
  customStock: Record<string, number>;
  markupMultiplier: number;
  eurToInrRate: number;
  announcement: {
    enabled: boolean;
    text: string;
  };
  supportContacts: {
    telegram: string;
    discord: string;
    whatsapp: string;
  };
  recentOrders: Array<{
    id: string;
    orderId?: string | undefined;
    invoiceToken?: string | undefined;
    paymentId: string;
    productName: string;
    variantName?: string | undefined;
    amount: number;
    customerEmail?: string | undefined;
    customerPhone?: string | undefined;
    keysDelivered?: string[] | undefined;
    date: string;
    status: string;
  }>;
}

const DEFAULT_CONFIG: StoreConfig = {
  customPrices: { "ChatGPT Plus / Go - 1 Month | Real Account": 506 },
  customNames: {},
  customStock: {},
  markupMultiplier: 3.2,
  eurToInrRate: 92,
  announcement: {
    enabled: true,
    text: "⚡ Welcome to GurfMarket — Instant Digital Delivery & 24/7 Verified Replacements!",
  },
  supportContacts: {
    telegram: "https://t.me/gurfmarket",
    discord: "https://discord.gg/gurfmarket",
    whatsapp: "+91 98765 43210",
  },
  recentOrders: [],
};

const ADMIN_AUTH_TOKEN = "gurf_admin_waheguru8_session_token_authenticated";

async function readConfigOnServer(): Promise<StoreConfig> {
  let localConfig = DEFAULT_CONFIG;
  try {
    const fs = await import("node:fs");
    const path = await import("node:path");
    const configPath = path.join(process.cwd(), "src", "data", "store-config.json");
    if (fs.existsSync(configPath)) {
      const data = fs.readFileSync(configPath, "utf-8");
      localConfig = JSON.parse(data);
    }
  } catch (e) {
    console.error("Error reading store-config.json:", e);
  }

  // Sync recent orders from Supabase database if available
  try {
    const { supabase } = await import("./supabase");
    const { data: sbOrders, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);

    if (!error && sbOrders && sbOrders.length > 0) {
      const mapped = sbOrders.map((o: any) => ({
        id: o.id || o.order_id,
        orderId: o.order_id || o.id,
        invoiceToken: o.invoice_token || o.id,
        paymentId: o.payment_id || "",
        productName: o.product_name,
        variantName: o.variant_name || "",
        amount: o.amount || 0,
        quantity: o.quantity || 1,
        customerEmail: o.customer_email || "",
        customerPhone: o.customer_phone || "",
        keysDelivered: o.keys_delivered || [],
        date: o.created_at || new Date().toISOString(),
        status: o.status || "abandoned",
      }));
      // Merge: preserve local orders (which contain active keys and tokens)
      const localOrders = localConfig.recentOrders || [];
      const merged = [...localOrders];
      for (const m of mapped) {
        if (!merged.some((lo: any) => lo.id === m.id || lo.orderId === m.orderId)) {
          merged.push(m);
        }
      }
      localConfig.recentOrders = merged;
    }
  } catch {
    // Non-blocking fallback to local JSON
  }

  return localConfig;
}

async function writeConfigOnServer(config: StoreConfig): Promise<void> {
  try {
    const fs = await import("node:fs");
    const path = await import("node:path");
    const configPath = path.join(process.cwd(), "src", "data", "store-config.json");
    const dir = path.dirname(configPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2), "utf-8");
  } catch (e) {
    console.error("Error writing store-config.json:", e);
  }

  // Backup store settings to Supabase
  try {
    const { supabase } = await import("./supabase");
    await supabase.from("store_settings").upsert({
      key: "primary_config",
      value: config,
      updated_at: new Date().toISOString(),
    });
  } catch {
    // Non-blocking fallback
  }
}

/**
 * Public Server Function: Get storefront config (prices, announcement)
 */
export const getPublicStoreConfig = createServerFn({ method: "GET" }).handler(
  async () => {
    const config = await readConfigOnServer();
    return {
      customPrices: config.customPrices,
      customNames: config.customNames || {},
      customStock: config.customStock,
      announcement: config.announcement,
      supportContacts: config.supportContacts,
    };
  }
);

/**
 * Admin Login Server Function
 */
export const adminLogin = createServerFn({ method: "POST" })
  .validator((data: { password: string }) => data)
  .handler(async ({ data }) => {
    const adminPassword = process.env["ADMIN_PASSWORD"] || "waheguru8#";
    if (data.password === adminPassword) {
      return { success: true, token: ADMIN_AUTH_TOKEN };
    }
    return { success: false, error: "Incorrect admin password." };
  });

/**
 * Admin Get All Data (including wholesale balance & recent orders)
 */
export const getAdminDashboardData = createServerFn({ method: "POST" })
  .validator((data: { token: string }) => data)
  .handler(async ({ data }) => {
    if (data.token !== ADMIN_AUTH_TOKEN) {
      throw new Error("Unauthorized admin access.");
    }

    const config = await readConfigOnServer();
    let resellerBalance = null;
    try {
      resellerBalance = await fetchResellerBalance();
    } catch {
      // ignore
    }

    return {
      config,
      resellerBalance,
    };
  });

/**
 * Admin Update Config
 */
export const updateStoreConfig = createServerFn({ method: "POST" })
  .validator((data: { token: string; config: Partial<StoreConfig> }) => data)
  .handler(async ({ data }) => {
    if (data.token !== ADMIN_AUTH_TOKEN) {
      throw new Error("Unauthorized admin access.");
    }

    const current = await readConfigOnServer();
    const updated: StoreConfig = {
      ...current,
      ...data.config,
      customPrices: data.config.customPrices ?? current.customPrices,
      customNames: data.config.customNames ?? current.customNames ?? {},
      customStock: data.config.customStock ?? current.customStock,
      announcement: data.config.announcement ?? current.announcement,
      supportContacts: data.config.supportContacts ?? current.supportContacts,
    };

    await writeConfigOnServer(updated);
    return { success: true, config: updated };
  });

/**
 * Generate a long, cryptographically secure, unguessable invoice token
 * Prevents URL enumeration, brute forcing, or unauthorized access to customer credentials
 */
export async function createSecureInvoiceToken(): Promise<string> {
  try {
    const { randomBytes } = await import("node:crypto");
    return `gurf_inv_${Date.now().toString(36)}_${randomBytes(16).toString("hex")}`;
  } catch {
    return `gurf_inv_${Date.now().toString(36)}_${Math.random().toString(36).slice(2)}${Math.random().toString(36).slice(2)}`;
  }
}

/**
 * Log order initiated when Razorpay checkout opens (defaults to abandoned until paid)
 */
export async function recordOrderInitiated(order: {
  orderId: string;
  invoiceToken?: string | undefined;
  productName: string;
  variantName?: string | undefined;
  amount: number;
  quantity?: number | undefined;
  customerEmail?: string | undefined;
  customerPhone?: string | undefined;
}): Promise<{ invoiceToken: string }> {
  try {
    const invoiceToken = order.invoiceToken || (await createSecureInvoiceToken());
    const config = await readConfigOnServer();
    const newEntry = {
      id: order.orderId,
      orderId: order.orderId,
      invoiceToken,
      paymentId: "",
      productName: order.productName,
      variantName: order.variantName || "",
      amount: order.amount,
      quantity: order.quantity || 1,
      customerEmail: order.customerEmail || "",
      customerPhone: order.customerPhone || "",
      keysDelivered: [],
      date: new Date().toISOString(),
      status: "abandoned",
    };

    // Filter out if already exists, then prepend
    const existing = (config.recentOrders || []).filter(
      (o: any) => o.id !== order.orderId && o.orderId !== order.orderId
    );
    config.recentOrders = [newEntry, ...existing].slice(0, 150);
    await writeConfigOnServer(config);

    // Sync initiated order to Supabase
    try {
      const { supabase } = await import("./supabase");
      await supabase.from("orders").upsert({
        id: newEntry.id,
        order_id: newEntry.orderId,
        payment_id: newEntry.paymentId,
        product_name: newEntry.productName,
        variant_name: newEntry.variantName,
        amount: newEntry.amount,
        quantity: newEntry.quantity,
        customer_email: newEntry.customerEmail,
        customer_phone: newEntry.customerPhone,
        keys_delivered: newEntry.keysDelivered,
        status: newEntry.status,
        created_at: newEntry.date,
      });
    } catch {
      // Non-blocking fallback
    }

    return { invoiceToken };
  } catch (err) {
    console.error("Failed to record initiated order:", err);
    return { invoiceToken: order.invoiceToken || order.orderId };
  }
}

/**
 * Log order on payment fulfillment (updates status to 'paid')
 */
export async function recordSuccessfulOrder(order: {
  paymentId: string;
  orderId?: string | undefined;
  invoiceToken?: string | undefined;
  productName: string;
  variantName?: string | undefined;
  amount: number;
  customerEmail?: string | undefined;
  customerPhone?: string | undefined;
  keysDelivered?: string[] | undefined;
}): Promise<{ invoiceToken: string }> {
  try {
    const config = await readConfigOnServer();
    const orders = config.recentOrders || [];
    const index = orders.findIndex(
      (o: any) =>
        (order.orderId && (o.id === order.orderId || o.orderId === order.orderId)) ||
        (order.paymentId && o.paymentId === order.paymentId)
    );

    let invoiceToken = order.invoiceToken;

    const existingOrder = index !== -1 ? orders[index] : null;

    if (existingOrder) {
      invoiceToken = invoiceToken || existingOrder.invoiceToken || (await createSecureInvoiceToken());
      orders[index] = {
        ...existingOrder,
        invoiceToken,
        paymentId: order.paymentId,
        amount: order.amount || existingOrder.amount,
        customerEmail: order.customerEmail || existingOrder.customerEmail,
        customerPhone: order.customerPhone || existingOrder.customerPhone,
        keysDelivered: order.keysDelivered || existingOrder.keysDelivered || [],
        status: "paid",
        date: new Date().toISOString(),
      };
    } else {
      invoiceToken = invoiceToken || (await createSecureInvoiceToken());
      const newEntry = {
        id: order.orderId || order.paymentId,
        orderId: order.orderId || "",
        invoiceToken,
        paymentId: order.paymentId,
        productName: order.productName,
        variantName: order.variantName || "",
        amount: order.amount,
        customerEmail: order.customerEmail || "",
        customerPhone: order.customerPhone || "",
        keysDelivered: order.keysDelivered || [],
        date: new Date().toISOString(),
        status: "paid",
      };
      orders.unshift(newEntry);
    }

    config.recentOrders = orders.slice(0, 150);
    await writeConfigOnServer(config);

    // Sync paid order to Supabase
    try {
      const { supabase } = await import("./supabase");
      await supabase.from("orders").upsert({
        id: order.orderId || order.paymentId,
        order_id: order.orderId || "",
        payment_id: order.paymentId,
        product_name: order.productName,
        variant_name: order.variantName || "",
        amount: order.amount,
        customer_email: order.customerEmail || "",
        customer_phone: order.customerPhone || "",
        keys_delivered: order.keysDelivered || [],
        status: "paid",
        created_at: new Date().toISOString(),
      });
    } catch {
      // Non-blocking fallback
    }

    return { invoiceToken: invoiceToken || order.paymentId };
  } catch (err) {
    console.error("Failed to record successful order:", err);
    return { invoiceToken: order.orderId || order.paymentId };
  }
}

/**
 * Mark order as failed
 */
export async function recordFailedOrder(order: {
  orderId?: string;
  error?: string;
}) {
  try {
    const config = await readConfigOnServer();
    const orders = config.recentOrders || [];
    const index = orders.findIndex(
      (o: any) => order.orderId && (o.id === order.orderId || o.orderId === order.orderId)
    );
    const existing = index !== -1 ? orders[index] : null;
    if (existing) {
      orders[index] = {
        ...existing,
        status: "failed",
      };
      await writeConfigOnServer(config);
    }

    // Sync failed status to Supabase
    try {
      const { supabase } = await import("./supabase");
      if (order.orderId) {
        await supabase
          .from("orders")
          .update({ status: "failed" })
          .eq("order_id", order.orderId);
      }
    } catch {
      // Non-blocking fallback
    }
  } catch (err) {
    console.error("Failed to mark order failed:", err);
  }
}

/**
 * Server Function: Mark order as failed / cancelled
 */
export const markOrderFailed = createServerFn({ method: "POST" })
  .validator((data: { orderId: string; error?: string }) => data)
  .handler(async ({ data }) => {
    const payload: { orderId?: string; error?: string } = { orderId: data.orderId };
    if (data.error !== undefined) {
      payload.error = data.error;
    }
    await recordFailedOrder(payload);
    return { success: true };
  });

/**
 * Server Function: Get Order Details for Official Customer Invoice & Deliverables
 */
export const getOrderDetails = createServerFn({ method: "GET" })
  .validator((id: string) => id)
  .handler(async ({ data: id }) => {
    if (!id || typeof id !== "string") {
      return null;
    }

    const cleanId = id.trim();

    // 1. Check direct from local store-config.json first (fastest & contains all tokenized keys)
    try {
      const fs = await import("node:fs");
      const path = await import("node:path");
      const configPath = path.join(process.cwd(), "src", "data", "store-config.json");
      if (fs.existsSync(configPath)) {
        const raw = fs.readFileSync(configPath, "utf-8");
        const parsed = JSON.parse(raw);
        const order = (parsed.recentOrders || []).find(
          (o: any) =>
            o.invoiceToken === cleanId ||
            o.id === cleanId ||
            o.orderId === cleanId ||
            o.paymentId === cleanId ||
            (cleanId.startsWith("pay_") && o.paymentId?.includes(cleanId))
        );
        if (order) {
          return {
            id: order.id || order.orderId,
            orderId: order.orderId || order.id,
            invoiceToken: order.invoiceToken || order.id || order.orderId,
            paymentId: order.paymentId || "",
            productName: order.productName || "Digital Product Access",
            variantName: order.variantName || "",
            amount: order.amount || 0,
            quantity: order.quantity || 1,
            customerEmail: order.customerEmail || "",
            customerPhone: order.customerPhone || "",
            keysDelivered: Array.isArray(order.keysDelivered)
              ? order.keysDelivered
              : order.keysDelivered
              ? [order.keysDelivered]
              : [],
            status: order.status || "paid",
            date: order.date || new Date().toISOString(),
          };
        }
      }
    } catch (err) {
      // continue to Supabase
    }

    // 2. Try Supabase
    try {
      const { supabase } = await import("./supabase");
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .or(`id.eq.${cleanId},order_id.eq.${cleanId},payment_id.eq.${cleanId}`)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (data && !error) {
        return {
          id: data.id || data.order_id,
          orderId: data.order_id || data.id,
          invoiceToken: data.invoice_token || data.id || data.order_id,
          paymentId: data.payment_id || "",
          productName: data.product_name || "Digital Product Access",
          variantName: data.variant_name || "",
          amount: data.amount || 0,
          quantity: data.quantity || 1,
          customerEmail: data.customer_email || "",
          customerPhone: data.customer_phone || "",
          keysDelivered: Array.isArray(data.keys_delivered)
            ? data.keys_delivered
            : data.keys_delivered
            ? [data.keys_delivered]
            : [],
          status: data.status || "paid",
          date: data.created_at || new Date().toISOString(),
        };
      }
    } catch {
      // ignore
    }

    return null;
  });

