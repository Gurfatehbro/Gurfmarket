import { createServerFn } from "@tanstack/react-start";
import supremeCatalogMeta from "./supreme-catalog-meta.json";
import productsFallback from "./products-fallback.json";

export interface ResellerVariant {
  id: string;
  rawProductId: string;
  variantId?: string | undefined;
  name: string;
  cost_price: number;
  retail_price: number;
  retailPrice?: number | undefined;
  stock: number | null;
}

export interface ResellerProduct {
  id: string;
  name: string;
  slug: string;
  allSlugs?: string[] | undefined;
  allIds?: string[] | undefined;
  delivery_type: string;
  category: StoreCategory;
  cost_price: number;
  retail_price: number;
  retailPrice?: number | undefined;
  lowestRetailPrice?: number | undefined;
  currency: string;
  stock: number | null;
  inStock: boolean;
  totalStockCount: number;
  variants: ResellerVariant[];
  badge?: string | undefined;
  image?: string | undefined;
}

export interface ResellerBalanceData {
  email?: string;
  balance: number;
  currency: string;
  tier?: {
    percent: number;
    sales_this_month: number;
    next_tier_at: number;
  };
}

export const STORE_CATEGORIES = [
  "Streaming",
  "AI Tools",
  "VPN & Security",
  "Music & Education",
  "Software",
  "Food & Discounts",
  "Gaming",
  "Discord",
  "Others",
] as const;

export type StoreCategory = (typeof STORE_CATEGORIES)[number];

const CATEGORY_MAP: Record<string, StoreCategory> = {
  streaming: "Streaming",
  "ai-tools": "AI Tools",
  "vpn-security": "VPN & Security",
  "music-education": "Music & Education",
  software: "Software",
  "food-discounts": "Food & Discounts",
  gaming: "Gaming",
  discord: "Discord",
  others: "Others",
};

const MARKUP_MULTIPLIER = Number(process.env["RETAIL_MARKUP_MULTIPLIER"]) || 3.2;
const EUR_TO_INR_RATE = Number(process.env["EUR_TO_INR_RATE"]) || 92;
const API_BASE_URL = "https://suprememarket.cc/api/reseller/v1";

function getApiKey(): string | null {
  return process.env["SUPREME_MARKET_API_KEY"] || null;
}

function normalizeProductName(p: { id: string; name: string; slug?: string; variants?: any[] }): string {
  // Handle specific product disambiguation
  if (p.id === "cmur3p1jx005y10889z0j970c") {
    return "Discord Nitro Token FA [1 Month]";
  }
  if (p.id === "cmuh0gble00ac503edfpcc7ry") {
    return "Discord 14x Server Boosts [1 Month]";
  }

  const meta = (supremeCatalogMeta as Record<string, any>)[p.id];
  if (meta && meta.name) {
    if (meta.tagline && meta.tagline !== meta.name && !meta.name.includes(meta.tagline)) {
      const cleanTagline = meta.tagline.replace(/€\s*[\d.]+/g, "").replace(/\(\s*\)/g, "").trim();
      return cleanTagline ? `${meta.name} — ${cleanTagline}` : meta.name;
    }
    return meta.name;
  }

  let name = (p.name || "").trim();
  const slug = (p.slug || "").toLowerCase();
  const variantName = p.variants?.length === 1 ? (p.variants[0].name || "").trim() : "";

  // Handle generic names from slug
  if (slug.includes("netflix")) {
    if (slug.includes("full-access-premium-4k")) return "Netflix Premium 4K [Full Access]";
    if (slug.includes("no-ads")) return "Netflix [No Ads, Lifetime]";
    if (slug.includes("lifetime-2")) return "Netflix [Lifetime Links]";
    if (slug.includes("lifetime-1")) return "Netflix Account [Lifetime]";
    return `Netflix — ${name}`;
  }

  if (name === "USA" && slug.includes("usa")) {
    return "Paramount+ [USA Region, Lifetime]";
  }

  if (name === "1 Month" && slug.includes("atresplayer")) {
    return "Atresplayer [1 Month]";
  }

  if (name === "Lifetime" || name === "[LIFETIME]") {
    const cleaned = slug
      .split("-")
      .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
      .join(" ");
    return cleaned;
  }

  if (variantName && variantName !== name && !name.toLowerCase().includes(variantName.toLowerCase())) {
    return `${name} — ${variantName}`;
  }

  return name;
}

function determineCategory(productId: string, name: string, slug: string): StoreCategory {
  const meta = (supremeCatalogMeta as Record<string, any>)[productId];
  if (meta?.category && CATEGORY_MAP[meta.category]) {
    return CATEGORY_MAP[meta.category] as StoreCategory;
  }

  const text = `${name} ${slug}`.toLowerCase();
  if (
    text.includes("netflix") ||
    text.includes("disney") ||
    text.includes("prime video") ||
    text.includes("crunchyroll") ||
    text.includes("max") ||
    text.includes("paramount") ||
    text.includes("dazn") ||
    text.includes("apple tv") ||
    text.includes("youtube") ||
    text.includes("iptv") ||
    text.includes("movistar") ||
    text.includes("amc") ||
    text.includes("atresplayer") ||
    text.includes("nba")
  ) {
    return "Streaming";
  }

  if (
    text.includes("chatgpt") ||
    text.includes("claude") ||
    text.includes("deepseek") ||
    text.includes("gemini") ||
    text.includes("elevenlabs")
  ) {
    return "AI Tools";
  }

  if (
    text.includes("vpn") ||
    text.includes("nord") ||
    text.includes("mullvad") ||
    text.includes("ipvanish") ||
    text.includes("expressvpn")
  ) {
    return "VPN & Security";
  }

  if (text.includes("spotify") || text.includes("deezer") || text.includes("duolingo")) {
    return "Music & Education";
  }

  if (
    text.includes("adobe") ||
    text.includes("canva") ||
    text.includes("capcut") ||
    text.includes("wondershare") ||
    text.includes("filmora")
  ) {
    return "Software";
  }

  if (text.includes("uber") || text.includes("eats") || text.includes("food")) {
    return "Food & Discounts";
  }

  if (
    text.includes("fortnite") ||
    text.includes("v-bucks") ||
    text.includes("valorant") ||
    text.includes("apex") ||
    text.includes("roblox") ||
    text.includes("robux") ||
    text.includes("minecraft") ||
    text.includes("steam") ||
    text.includes("fivem") ||
    text.includes("clash") ||
    text.includes("epic games")
  ) {
    return "Gaming";
  }

  if (text.includes("discord") || text.includes("nitro")) {
    return "Discord";
  }

  return "Others";
}

const CUSTOM_PRICE_OVERRIDES: Record<string, number> = {
  // ChatGPT Plus / Go - 1 Month | Real Account
  "cmuh0gc2500ix503e2bvx3bik": 506,
  "cmur3p1ll006s10886h2rvkp6_cmuh0gc2500ix503e2bvx3bik": 506,
  "ChatGPT Plus / Go - 1 Month | Real Account": 506,
};

function calculateRetailPrice(costEur: number, overrideKey?: string, name?: string): number {
  if (overrideKey && CUSTOM_PRICE_OVERRIDES[overrideKey] !== undefined) {
    return CUSTOM_PRICE_OVERRIDES[overrideKey]!;
  }
  if (name && CUSTOM_PRICE_OVERRIDES[name] !== undefined) {
    return CUSTOM_PRICE_OVERRIDES[name]!;
  }
  const inrPrice = costEur * MARKUP_MULTIPLIER * EUR_TO_INR_RATE;
  return Math.round(inrPrice);
}

export const fetchResellerProducts = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ products: ResellerProduct[]; categories: string[]; lastUpdated: string }> => {
    try {
      // Load dynamic store configuration (admin custom overrides & multipliers)
      let customPrices: Record<string, number> = { ...CUSTOM_PRICE_OVERRIDES };
      let customNames: Record<string, string> = {};
      let customStock: Record<string, number> = {};
      let activeMarkup = MARKUP_MULTIPLIER;
      let activeEurRate = EUR_TO_INR_RATE;

      try {
        const fs = await import("node:fs");
        const path = await import("node:path");
        const configPath = path.join(process.cwd(), "src", "data", "store-config.json");
        if (fs.existsSync(configPath)) {
          const cfgData = JSON.parse(fs.readFileSync(configPath, "utf-8"));
          if (cfgData.customPrices) customPrices = { ...customPrices, ...cfgData.customPrices };
          if (cfgData.customNames) customNames = { ...cfgData.customNames };
          if (cfgData.customStock) customStock = { ...cfgData.customStock };
          if (cfgData.markupMultiplier) activeMarkup = Number(cfgData.markupMultiplier);
          if (cfgData.eurToInrRate) activeEurRate = Number(cfgData.eurToInrRate);
        }
      } catch (err) {
        // Fallback to default constants if file reading fails
      }

      const mapWithCustomOverrides = (catalog: ResellerProduct[]): ResellerProduct[] => {
        return catalog.map((p) => {
          const customName = customNames[p.id] || customNames[p.name];
          const resolvedName = customName || p.name;
          const customP = customPrices[p.id] || customPrices[p.name];
          const resolvedPrice = customP !== undefined ? customP : p.retail_price;
          const mappedVariants = (p.variants || []).map((v) => {
            const vCustomP = customPrices[v.id] || customPrices[v.name];
            return {
              ...v,
              retail_price: vCustomP !== undefined ? vCustomP : v.retail_price,
            };
          });
          return {
            ...p,
            name: resolvedName,
            retail_price: resolvedPrice,
            variants: mappedVariants,
          };
        });
      };

      const apiKey = getApiKey();
      if (!apiKey) {
        return {
          products: mapWithCustomOverrides(productsFallback as unknown as ResellerProduct[]),
          categories: [...STORE_CATEGORIES],
          lastUpdated: new Date().toISOString(),
        };
      }
      const res = await fetch(`${API_BASE_URL}/products`, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          Accept: "application/json",
        },
      });

      if (!res.ok) {
        throw new Error(`Reseller API error: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();
      const rawProducts: any[] = data.products || [];

      const getResolvedPrice = (costEur: number, key?: string, name?: string) => {
        if (key && customPrices[key] !== undefined) return customPrices[key]!;
        if (name && customPrices[name] !== undefined) return customPrices[name]!;
        return Math.round(costEur * activeMarkup * activeEurRate);
      };

      const getResolvedStock = (apiStock: number | null | undefined, key?: string, name?: string) => {
        if (name && customStock[name] !== undefined) return customStock[name]!;
        if (key && customStock[key] !== undefined) return customStock[key]!;
        return apiStock !== undefined ? apiStock : null;
      };

      // Group raw items into master products by brand/name from metadata
      const groupMap = new Map<
        string,
        {
          id: string;
          name: string;
          slug: string;
          allSlugs: string[];
          allIds: string[];
          category: StoreCategory;
          image?: string;
          delivery_type: string;
          variants: ResellerVariant[];
        }
      >();

      for (const p of rawProducts) {
        const meta = (supremeCatalogMeta as Record<string, any>)[p.id] || {};
        let brandName = (meta.brand || meta.name || p.name || "").replace(/\\u0026/g, "&").trim();
        if (customNames[p.id]) {
          brandName = customNames[p.id];
        } else if (customNames[brandName]) {
          brandName = customNames[brandName];
        }
        const brandSlug = meta.brandSlug || meta.slug || p.slug || p.id;
        const heuristicCategory = determineCategory(p.id, brandName, brandSlug);
        const category: StoreCategory =
          heuristicCategory !== "Others"
            ? heuristicCategory
            : meta.category && CATEGORY_MAP[meta.category]
            ? (CATEGORY_MAP[meta.category] as StoreCategory)
            : "Others";

        if (!groupMap.has(brandName)) {
          groupMap.set(brandName, {
            id: p.id,
            name: brandName,
            slug: brandSlug,
            allSlugs: [],
            allIds: [],
            category,
            image: meta.image || undefined,
            delivery_type: p.delivery_type || "keys",
            variants: [],
          });
        }

        const group = groupMap.get(brandName)!;
        if (group.category === "Others" && category !== "Others") {
          group.category = category;
        }
        if (p.id) group.allIds.push(p.id);
        if (p.slug) group.allSlugs.push(p.slug);
        if (meta.slug) group.allSlugs.push(meta.slug);
        if (!group.image && meta.image) group.image = meta.image;

        // If p has internal variants (e.g. ChatGPT Pro & Plus)
        if (p.variants && p.variants.length > 0) {
          for (const v of p.variants) {
            const vCost = Number(v.price) || Number(p.price) || 0;
            const cleanName = (v.name || meta.tagline || p.name || "Standard")
              .replace(/€\s*[\d.]+/g, "")
              .replace(/\(\s*\)/g, "")
              .replace(/\\u0026/g, "&")
              .trim();
            const variantStock = v.stock !== undefined ? v.stock : p.stock;
            group.variants.push({
              id: `${p.id}_${v.id}`,
              rawProductId: p.id,
              variantId: v.id,
              name: cleanName || "Standard",
              cost_price: vCost,
              retail_price: getResolvedPrice(vCost, v.id, cleanName),
              stock: getResolvedStock(variantStock, v.id, cleanName),
            });
          }
        } else {
          const pCost = Number(p.price) || 0;
          let cleanName = (meta.tagline || p.name || "Standard")
            .replace(/€\s*[\d.]+/g, "")
            .replace(/\(\s*\)/g, "")
            .replace(/\\u0026/g, "&")
            .trim();
          if (!cleanName || cleanName === brandName) {
            cleanName = (p.name || "Standard")
              .replace(/€\s*[\d.]+/g, "")
              .replace(/\\u0026/g, "&")
              .trim();
          }
          group.variants.push({
            id: p.id,
            rawProductId: p.id,
            variantId: undefined,
            name: cleanName || "Standard",
            cost_price: pCost,
            retail_price: getResolvedPrice(pCost, p.id, cleanName),
            stock: getResolvedStock(p.stock, p.id, cleanName),
          });
        }
      }

      // Convert groups to ResellerProduct array
      const products: ResellerProduct[] = Array.from(groupMap.values()).map((g) => {
        let totalStock = 0;
        let isUnlimited = false;

        for (const v of g.variants) {
          if (v.stock === null) isUnlimited = true;
          else if (typeof v.stock === "number") totalStock += v.stock;
        }

        const inStock = isUnlimited || totalStock > 0;
        const retailPrices = g.variants.map((v) => v.retail_price);
        const costPrices = g.variants.map((v) => v.cost_price);
        const minRetailPrice = retailPrices.length > 0 ? Math.min(...retailPrices) : 0;
        const minCostPrice = costPrices.length > 0 ? Math.min(...costPrices) : 0;

        let badge: string | undefined;
        if (g.variants.length > 1) {
          badge = `${g.variants.length} versions`;
        } else if (g.delivery_type === "keys") {
          badge = "Instant Key";
        } else {
          badge = "Auto-Delivery";
        }

        return {
          id: g.id,
          name: g.name,
          slug: g.slug,
          allSlugs: [...new Set(g.allSlugs)],
          allIds: [...new Set(g.allIds)],
          delivery_type: g.delivery_type,
          category: g.category,
          cost_price: minCostPrice,
          retail_price: minRetailPrice,
          currency: "INR",
          stock: isUnlimited ? null : totalStock,
          inStock,
          totalStockCount: isUnlimited ? 999 : totalStock,
          variants: g.variants,
          badge,
          image: g.image,
        };
      });

      const resolvedProducts = (
        products && products.length > 0
          ? products
          : (productsFallback as unknown as ResellerProduct[])
      ).map((p) => {
        const customName = customNames[p.id] || customNames[p.name];
        return customName ? { ...p, name: customName } : p;
      });

      return {
        products: resolvedProducts,
        categories: [...STORE_CATEGORIES],
        lastUpdated: new Date().toISOString(),
      };
    } catch (err: any) {
      console.error("Failed to fetch reseller products, serving fallback catalog:", err);
      let customNames: Record<string, string> = {};
      try {
        const fs = await import("node:fs");
        const path = await import("node:path");
        const configPath = path.join(process.cwd(), "src", "data", "store-config.json");
        if (fs.existsSync(configPath)) {
          const cfgData = JSON.parse(fs.readFileSync(configPath, "utf-8"));
          if (cfgData.customNames) customNames = cfgData.customNames;
        }
      } catch {}
      const fallbackList = (productsFallback as unknown as ResellerProduct[]).map((p) => {
        const customName = customNames[p.id] || customNames[p.name];
        return customName ? { ...p, name: customName } : p;
      });
      return {
        products: fallbackList,
        categories: [...STORE_CATEGORIES],
        lastUpdated: new Date().toISOString(),
      };
    }
  }
);

export const fetchResellerBalance = createServerFn({ method: "GET" }).handler(
  async (): Promise<ResellerBalanceData | null> => {
    try {
      const apiKey = getApiKey();
      const res = await fetch(`${API_BASE_URL}/balance`, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          Accept: "application/json",
        },
      });

      if (!res.ok) {
        return null;
      }

      return await res.json();
    } catch (err) {
      console.error("Failed to fetch reseller balance:", err);
      return null;
    }
  }
);

export interface CreateOrderParams {
  productId: string;
  variantId?: string | undefined;
  quantity?: number | undefined;
}

export interface OrderResult {
  success: boolean;
  status?: string | undefined;
  keys?: string[] | undefined;
  orderId?: string | undefined;
  paymentId?: string | undefined;
  invoiceToken?: string | undefined;
  notice?: string | undefined;
  error?: string | undefined;
}


export async function executeResellerOrderInternal(data: CreateOrderParams): Promise<OrderResult> {
  try {
    const apiKey = getApiKey();
    if (!apiKey) {
      throw new Error("SUPREME_MARKET_API_KEY is not configured on the server.");
    }
    const payload: any = {
      items: [
        {
          product_id: data.productId,
          quantity: data.quantity || 1,
          ...(data.variantId ? { variant_id: data.variantId } : {}),
        },
      ],
    };

    const res = await fetch(`${API_BASE_URL}/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    const resData = await res.json();

    if (!res.ok) {
      return {
        success: false,
        error:
          resData.message ||
          resData.error ||
          "Insufficient reseller balance or stock unavailable",
      };
    }

    const extractedKeys =
      (Array.isArray(resData.keys) && resData.keys.length > 0 ? resData.keys : null) ||
      (Array.isArray(resData.order?.keys) ? resData.order.keys : null) ||
      (Array.isArray(resData.items) ? resData.items.flatMap((i: any) => (Array.isArray(i.keys) ? i.keys : [i.key || i.code].filter(Boolean))) : null) ||
      (resData.key ? [resData.key] : null) ||
      [];

    return {
      success: true,
      status: resData.status,
      keys: extractedKeys,
      orderId: resData.id || resData.order_id,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || "Failed to connect to reseller API",
    };
  }
}

export const createResellerOrder = createServerFn({ method: "POST" })
  .validator((data: CreateOrderParams) => data)
  .handler(async ({ data }): Promise<OrderResult> => {
    return executeResellerOrderInternal(data);
  });


