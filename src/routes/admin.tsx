import { useState, useEffect, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ShieldCheck,
  Lock,
  LogOut,
  RefreshCw,
  Search,
  CheckCircle2,
  AlertCircle,
  Coins,
  Package,
  Layers,
  Save,
  Copy,
  Check,
  Sliders,
  ArrowUpRight,
  Send,
  Zap,
  Globe,
  MessageCircle,
  Clock,
  XCircle,
  CreditCard,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  adminLogin,
  getAdminDashboardData,
  updateStoreConfig,
  type StoreConfig,
} from "@/lib/store-config";
import { fetchResellerProducts, type ResellerProduct } from "@/lib/reseller-api";

export const Route = createFileRoute("/admin")({
  component: AdminDashboardPage,
});

function AdminDashboardPage() {
  const [token, setToken] = useState<string | null>(null);
  const [passwordInput, setPasswordInput] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Dashboard Data State
  const [activeTab, setActiveTab] = useState<"overview" | "orders" | "settings">("overview");
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [config, setConfig] = useState<StoreConfig | null>(null);
  const [resellerBalance, setResellerBalance] = useState<any>(null);
  const [products, setProducts] = useState<ResellerProduct[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [orderStatusFilter, setOrderStatusFilter] = useState<"all" | "paid" | "abandoned" | "failed">("all");
  const [orderSearchQuery, setOrderSearchQuery] = useState("");

  // Save/Feedback states
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Price & stock edit forms
  const [customPricesDraft, setCustomPricesDraft] = useState<Record<string, number>>({});
  const [customNamesDraft, setCustomNamesDraft] = useState<Record<string, string>>({});
  const [customStockDraft, setCustomStockDraft] = useState<Record<string, number>>({});
  const [markupDraft, setMarkupDraft] = useState<number>(3.2);
  const [eurRateDraft, setEurRateDraft] = useState<number>(92);
  const [announcementDraft, setAnnouncementDraft] = useState({ enabled: true, text: "" });
  const [supportDraft, setSupportDraft] = useState({ telegram: "", discord: "", whatsapp: "" });

  // Check saved session on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedToken = localStorage.getItem("gurf_admin_token");
      if (savedToken) {
        setToken(savedToken);
      }
    }
  }, []);

  // Fetch admin data when authenticated
  useEffect(() => {
    if (!token) return;
    loadDashboardData();
  }, [token]);

  const loadDashboardData = async () => {
    if (!token) return;
    setIsLoadingData(true);
    try {
      const [dashData, productsData] = await Promise.all([
        getAdminDashboardData({ data: { token } }),
        fetchResellerProducts(),
      ]);

      setConfig(dashData.config);
      setResellerBalance(dashData.resellerBalance);
      setProducts(productsData.products || []);

      setCustomPricesDraft(dashData.config.customPrices || {});
      setCustomNamesDraft(dashData.config.customNames || {});
      setCustomStockDraft(dashData.config.customStock || {});
      setMarkupDraft(dashData.config.markupMultiplier || 3.2);
      setEurRateDraft(dashData.config.eurToInrRate || 92);
      setAnnouncementDraft(dashData.config.announcement || { enabled: true, text: "" });
      setSupportDraft(dashData.config.supportContacts || { telegram: "", discord: "", whatsapp: "" });
    } catch (err: any) {
      if (err.message?.includes("Unauthorized")) {
        handleLogout();
      }
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError("");
    try {
      const res = await adminLogin({ data: { password: passwordInput } });
      if (res.success && res.token) {
        localStorage.setItem("gurf_admin_token", res.token);
        setToken(res.token);
      } else {
        setLoginError(res.error || "Incorrect admin password.");
      }
    } catch (err: any) {
      setLoginError(err.message || "Failed to log in.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("gurf_admin_token");
    setToken(null);
    setConfig(null);
  };

  const handleSaveConfig = async () => {
    if (!token) return;
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      const res = await updateStoreConfig({
        data: {
          token,
          config: {
            customPrices: customPricesDraft,
            customNames: customNamesDraft,
            customStock: customStockDraft,
            markupMultiplier: Number(markupDraft),
            eurToInrRate: Number(eurRateDraft),
            announcement: announcementDraft,
            supportContacts: supportDraft,
          },
        },
      });
      if (res.success) {
        setConfig(res.config);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err: any) {
      alert("Failed to save changes: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleNameChange = (productKey: string, newName: string) => {
    setCustomNamesDraft((prev) => ({
      ...prev,
      [productKey]: newName,
    }));
  };

  const handlePriceChange = (productKey: string, price: number) => {
    setCustomPricesDraft((prev) => ({
      ...prev,
      [productKey]: price,
    }));
  };

  const handleStockChange = (productKey: string, stock: number) => {
    setCustomStockDraft((prev) => ({
      ...prev,
      [productKey]: stock,
    }));
  };

  const copyToClipboard = (text: string, id: string) => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedKey(id);
      setTimeout(() => setCopiedKey(null), 2000);
    }
  };

  // Total inventory units directly from wholesale API key
  const totalApiStock = useMemo(() => {
    let sum = 0;
    for (const p of products) {
      if (p.variants && p.variants.length > 0) {
        for (const v of p.variants) {
          if (typeof v.stock === "number") sum += v.stock;
        }
      } else if (typeof p.stock === "number") {
        sum += p.stock;
      }
    }
    return sum;
  }, [products]);

  // Filtered products list
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (categoryFilter !== "All" && p.category !== categoryFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.variants.some((v) => v.name.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [products, categoryFilter, searchQuery]);

  // Orders stats computation
  const orderStats = useMemo(() => {
    const orders = config?.recentOrders || [];
    let totalPaidAmount = 0;
    let paidCount = 0;
    let abandonedCount = 0;
    let abandonedAmount = 0;
    let failedCount = 0;

    for (const o of orders) {
      if (o.status === "paid" || o.status === "fulfilled") {
        paidCount++;
        totalPaidAmount += o.amount || 0;
      } else if (o.status === "abandoned") {
        abandonedCount++;
        abandonedAmount += o.amount || 0;
      } else if (o.status === "failed") {
        failedCount++;
      }
    }

    return {
      total: orders.length,
      paidCount,
      totalPaidAmount,
      abandonedCount,
      abandonedAmount,
      failedCount,
    };
  }, [config?.recentOrders]);

  // Filtered orders list by status and search
  const filteredOrders = useMemo(() => {
    const orders = config?.recentOrders || [];
    return orders.filter((o) => {
      const isPaid = o.status === "paid" || o.status === "fulfilled";
      if (orderStatusFilter === "paid" && !isPaid) return false;
      if (orderStatusFilter === "abandoned" && o.status !== "abandoned") return false;
      if (orderStatusFilter === "failed" && o.status !== "failed") return false;

      if (orderSearchQuery.trim()) {
        const q = orderSearchQuery.toLowerCase();
        const matchEmail = (o.customerEmail || "").toLowerCase().includes(q);
        const matchPhone = (o.customerPhone || "").toLowerCase().includes(q);
        const matchProd = (o.productName || "").toLowerCase().includes(q);
        const matchId = (o.id || "").toLowerCase().includes(q) || (o.paymentId || "").toLowerCase().includes(q);
        return matchEmail || matchPhone || matchProd || matchId;
      }

      return true;
    });
  }, [config?.recentOrders, orderStatusFilter, orderSearchQuery]);

  // LOGIN SCREEN
  if (!token) {
    return (
      <main className="min-h-screen bg-[#07090b] flex items-center justify-center p-4 selection:bg-[#22c55e]/30 selection:text-white">
        <div className="w-full max-w-md rounded-2xl border border-white/[0.08] bg-[#0c0e12] p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute -right-16 -top-16 size-48 rounded-full bg-[#22c55e]/10 blur-3xl" />
          <div className="absolute -left-16 -bottom-16 size-48 rounded-full bg-blue-500/10 blur-3xl" />

          <div className="text-center relative z-10">
            <img
              src="/logo-icon.png"
              alt="GurfMarket Crown"
              className="size-16 mx-auto rounded-2xl border border-[#22c55e]/50 shadow-[0_0_24px_rgba(34,197,94,0.35)]"
            />
            <h1 className="mt-4 font-heading text-2xl font-black text-white">GurfMarket Admin</h1>
            <p className="mt-1 text-xs text-white/50">High-Control Management Portal</p>
          </div>

          <form onSubmit={handleLogin} className="mt-8 space-y-4 relative z-10">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-white/70 mb-1.5">
                Admin Access Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="Enter admin password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 pl-10 text-sm text-white placeholder:text-white/30 focus:border-[#22c55e] focus:outline-none transition-colors"
                />
                <Lock className="size-4 text-white/40 absolute left-3.5 top-3.5" />
              </div>
            </div>

            {loginError && (
              <div className="flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">
                <AlertCircle className="size-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoggingIn || !passwordInput}
              className="w-full flex h-11 items-center justify-center gap-2 rounded-xl bg-[#22c55e] text-sm font-extrabold text-black shadow-[0_4px_20px_rgba(34,197,94,0.3)] transition-all hover:bg-[#16a34a] disabled:opacity-50 cursor-pointer"
            >
              {isLoggingIn ? (
                <RefreshCw className="size-4 animate-spin" />
              ) : (
                <>
                  <ShieldCheck className="size-4" />
                  <span>Authenticate & Enter</span>
                </>
              )}
            </button>

            <div className="text-center pt-2">
              <Link to="/" className="text-xs text-white/40 hover:text-white transition-colors">
                ← Return to Public Storefront
              </Link>
            </div>
          </form>
        </div>
      </main>
    );
  }

  // AUTHENTICATED DASHBOARD
  return (
    <main className="min-h-screen bg-[#07090b] text-foreground pb-20 selection:bg-[#22c55e]/30 selection:text-white">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 border-b border-white/[0.08] bg-[#0c0e12]/95 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
          <div className="flex items-center gap-3">
            <img
              src="/logo-icon.png"
              alt="GurfMarket Crown"
              className="size-9 rounded-xl border border-[#22c55e]/50 shadow-[0_0_16px_rgba(34,197,94,0.35)]"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-extrabold text-white">GurfMarket</span>
                <span className="rounded bg-[#22c55e]/20 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#22c55e]">
                  High Control
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="rounded-lg border-white/10 bg-white/[0.03] text-xs text-white/70 hover:bg-white/10 hover:text-white"
            >
              <Link to="/">
                <Globe className="mr-1.5 size-3.5 text-[#22c55e]" /> View Storefront
              </Link>
            </Button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-semibold text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/30 transition-colors cursor-pointer"
            >
              <LogOut className="size-3.5" /> Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="mx-auto max-w-7xl px-5 pt-8 sm:px-8">
        {/* Navigation Tabs */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
          <div className="flex flex-wrap gap-2">
            {[
              { id: "overview", label: "Overview & Inventory", icon: Layers },
              { id: "orders", label: "Customer Orders & Keys", icon: Package },
              { id: "settings", label: "Store Settings & Multipliers", icon: Sliders },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? "bg-[#22c55e] text-black shadow-[0_0_20px_rgba(34,197,94,0.25)]"
                      : "border border-white/10 bg-white/[0.03] text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon className="size-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadDashboardData}
              disabled={isLoadingData}
              className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-semibold text-white/70 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
            >
              <RefreshCw className={`size-3.5 ${isLoadingData ? "animate-spin" : ""}`} />
              <span>Refresh</span>
            </button>
            <button
              onClick={handleSaveConfig}
              disabled={isSaving}
              className="flex items-center gap-1.5 rounded-xl bg-[#22c55e] px-4 py-2 text-xs font-bold text-black hover:bg-[#16a34a] shadow-[0_2px_12px_rgba(34,197,94,0.3)] transition-all cursor-pointer disabled:opacity-50"
            >
              {isSaving ? <RefreshCw className="size-3.5 animate-spin" /> : <Save className="size-3.5" />}
              <span>Save Changes</span>
            </button>
          </div>
        </div>

        {saveSuccess && (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-3 text-xs text-emerald-300">
            <CheckCircle2 className="size-4 shrink-0" />
            <span>Store configuration & custom price overrides successfully saved!</span>
          </div>
        )}

        {/* TAB 1: OVERVIEW & STATUS */}
        {activeTab === "overview" && (
          <div className="mt-6 space-y-6">
            {/* Quick Metrics Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {/* Wholesale Balance */}
              <div className="rounded-2xl border border-white/[0.08] bg-[#0c0e12] p-5 shadow-lg">
                <div className="flex items-center justify-between text-white/50 text-xs">
                  <span>Wholesale Balance</span>
                  <Coins className="size-4 text-[#22c55e]" />
                </div>
                <div className="mt-2 text-2xl font-black text-white">
                  €{resellerBalance?.balance ?? "0.00"}
                </div>
                <div className="mt-1 text-xs text-white/50">
                  ≈ ₹{((resellerBalance?.balance || 0) * (config?.eurToInrRate || 92)).toFixed(0)} INR reserve
                </div>
              </div>

              {/* Catalog Items */}
              <div className="rounded-2xl border border-white/[0.08] bg-[#0c0e12] p-5 shadow-lg">
                <div className="flex items-center justify-between text-white/50 text-xs">
                  <span>Catalog Products</span>
                  <Package className="size-4 text-emerald-400" />
                </div>
                <div className="mt-2 text-2xl font-black text-white">{products.length}</div>
                <div className="mt-1 text-xs text-white/50">
                  Active wholesale products synced
                </div>
              </div>

              {/* Price Markup */}
              <div className="rounded-2xl border border-white/[0.08] bg-[#0c0e12] p-5 shadow-lg">
                <div className="flex items-center justify-between text-white/50 text-xs">
                  <span>Markup Multiplier</span>
                  <Zap className="size-4 text-amber-400" />
                </div>
                <div className="mt-2 text-2xl font-black text-white">
                  {config?.markupMultiplier || 3.2}x
                </div>
                <div className="mt-1 text-xs text-white/50">
                  Base cost markup on wholesale
                </div>
              </div>

              {/* Total Stock in API Key */}
              <div className="rounded-2xl border border-white/[0.08] bg-[#0c0e12] p-5 shadow-lg">
                <div className="flex items-center justify-between text-white/50 text-xs">
                  <span>API Key Live Stock</span>
                  <Package className="size-4 text-[#22c55e]" />
                </div>
                <div className="mt-2 text-2xl font-black text-white">
                  {totalApiStock} units
                </div>
                <div className="mt-1 text-xs text-[#22c55e] font-semibold flex items-center gap-1">
                  <span className="size-1.5 rounded-full bg-[#22c55e] animate-pulse" />
                  <span>Live wholesale inventory synced</span>
                </div>
              </div>
            </div>


            {/* Wholesale & Database Health Card */}
            <div className="rounded-2xl border border-white/[0.08] bg-[#0c0e12] p-6 shadow-xl">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                System & Database Integrations
              </h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 text-xs">
                  <span className="text-white/50">Wholesale API</span>
                  <p className="mt-1 font-mono text-white truncate">suprememarket.cc/api/reseller/v1</p>
                </div>
                <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 text-xs">
                  <span className="text-white/50">Database Engine</span>
                  <div className="mt-1 flex items-center gap-1.5 font-semibold text-emerald-400">
                    <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Supabase Cloud (Connected)</span>
                  </div>
                </div>
                <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 text-xs">
                  <span className="text-white/50">Email Dispatch</span>
                  <div className="mt-1 flex items-center gap-1.5 font-semibold text-emerald-400">
                    <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="truncate">Resend API (From: GurfMarket)</span>
                  </div>
                </div>
                <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 text-xs">
                  <span className="text-white/50">Exchange Conversion</span>
                  <p className="mt-1 font-semibold text-white">
                    1 EUR = ₹{config?.eurToInrRate || 92} INR
                  </p>
                </div>
              </div>
            </div>

            {/* Products Table merged directly into Overview */}
            <div className="space-y-4 pt-4 border-t border-white/[0.08]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Live Products & Inventory Control
                  </h3>
                  <p className="text-xs text-white/50 mt-0.5">
                    Stock is live synced from Supreme Market API key. Adjust retail prices or set custom limits if desired.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-white/50">{filteredProducts.length} items</span>
                  <div className="relative w-full sm:w-64">
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 pl-9 text-xs text-white placeholder:text-white/40 focus:border-[#22c55e] focus:outline-none"
                    />
                    <Search className="size-3.5 text-white/40 absolute left-3 top-2.5" />
                  </div>
                </div>
              </div>

              {/* Products Table */}
              <div className="overflow-x-auto rounded-2xl border border-white/[0.08] bg-[#0c0e12] shadow-xl">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-white/[0.08] bg-white/[0.02] text-[11px] font-bold uppercase tracking-wider text-white/50">
                    <tr>
                      <th className="p-4">
                        <div className="flex items-center gap-1.5">
                          <span>Product / Variant Name</span>
                          <span className="text-[10px] text-[#22c55e] font-normal normal-case border border-[#22c55e]/30 bg-[#22c55e]/10 px-1.5 py-0.5 rounded">
                            Renameable
                          </span>
                        </div>
                      </th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Wholesale Cost</th>
                      <th className="p-4">Calculated Retail</th>
                      <th className="p-4 text-right">Custom Retail Price (₹)</th>
                      <th className="p-4 text-center">Live API Stock (Supreme Key)</th>
                      <th className="p-4 text-right">Admin Limit / Override</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.06] text-white/80">
                    {filteredProducts.map((p) => {
                      const variants = p.variants.length > 0 ? p.variants : [
                        {
                          id: p.id,
                          name: "Standard",
                          cost_price: p.cost_price,
                          retail_price: p.retail_price,
                          stock: p.stock,
                        }
                      ];

                      return variants.map((v, idx) => {
                        const itemKey = v.name === "Standard" ? p.name : v.name;
                        const customPrice = customPricesDraft[itemKey] ?? customPricesDraft[v.id];
                        const customStock = customStockDraft[itemKey] ?? customStockDraft[v.id];

                        return (
                          <tr key={`${p.id}_${v.id}_${idx}`} className="hover:bg-white/[0.02] transition-colors">
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                {p.image && idx === 0 && (
                                  <img
                                    src={p.image}
                                    alt={p.name}
                                    className="size-8 rounded-lg object-cover border border-white/10 shrink-0"
                                  />
                                )}
                                <div className="flex-1 min-w-[200px]">
                                  {idx === 0 ? (
                                    <div className="space-y-1">
                                      <input
                                        type="text"
                                        value={customNamesDraft[p.id] ?? customNamesDraft[p.name] ?? p.name}
                                        onChange={(e) => {
                                          const val = e.target.value;
                                          handleNameChange(p.id, val);
                                          handleNameChange(p.name, val);
                                        }}
                                        placeholder={p.name}
                                        title="Click to edit product display name"
                                        className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs font-semibold text-white placeholder:text-white/30 focus:border-[#22c55e] focus:bg-[#151921] focus:outline-none transition-colors"
                                      />
                                      {Boolean(
                                        (customNamesDraft[p.id] || customNamesDraft[p.name]) &&
                                          (customNamesDraft[p.id] !== p.name || customNamesDraft[p.name] !== p.name)
                                      ) && (
                                        <div className="text-[10px] text-amber-400/80 font-mono flex items-center gap-1">
                                          <span>Original: {p.name}</span>
                                          <button
                                            type="button"
                                            onClick={() => {
                                              handleNameChange(p.id, "");
                                              handleNameChange(p.name, "");
                                            }}
                                            className="text-white/40 hover:text-white underline ml-1 cursor-pointer"
                                          >
                                            Reset
                                          </button>
                                        </div>
                                      )}
                                    </div>
                                  ) : (
                                    <span className="font-semibold text-white/90 block truncate text-xs">
                                      {customNamesDraft[p.id] ?? customNamesDraft[p.name] ?? p.name}
                                    </span>
                                  )}
                                  {v.name !== "Standard" && (
                                    <span className="text-[11px] text-[#22c55e] block mt-0.5">
                                      Plan: {v.name}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="p-4 text-white/50">{p.category}</td>
                            <td className="p-4 font-mono text-white/70">€{v.cost_price}</td>
                            <td className="p-4 font-mono text-white/50">
                              ₹{Math.round(v.cost_price * markupDraft * eurRateDraft)}
                            </td>
                            <td className="p-4 text-right">
                              <input
                                type="number"
                                value={customPrice ?? v.retail_price}
                                onChange={(e) => handlePriceChange(itemKey, Number(e.target.value))}
                                className="w-24 rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1.5 text-right font-mono text-xs font-bold text-white focus:border-[#22c55e] focus:outline-none"
                              />
                            </td>
                            <td className="p-4 text-center">
                              {v.stock === 0 ? (
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/30 bg-rose-500/10 px-2.5 py-1 text-[11px] font-bold text-rose-400 font-mono">
                                  <span className="size-1.5 rounded-full bg-rose-400" />
                                  0 (API Out of Stock)
                                </span>
                              ) : typeof v.stock === "number" ? (
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-bold text-emerald-400 font-mono">
                                  <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                  {v.stock} in stock
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] font-medium text-white/60 font-mono">
                                  Auto-Dispatch
                                </span>
                              )}
                            </td>
                            <td className="p-4 text-right">
                              <input
                                type="number"
                                placeholder={v.stock !== null && v.stock !== undefined ? `API: ${v.stock}` : "No limit"}
                                value={customStock ?? ""}
                                onChange={(e) => handleStockChange(itemKey, Number(e.target.value))}
                                className="w-24 rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1.5 text-right font-mono text-xs text-white placeholder:text-white/30 focus:border-[#22c55e] focus:outline-none"
                              />
                            </td>
                          </tr>
                        );
                      });
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CUSTOMER ORDERS & KEYS (Paid, Abandoned, Failed) */}
        {activeTab === "orders" && (
          <div className="mt-6 space-y-6">
            {/* Orders Summary KPI Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {/* Total Checkouts */}
              <div className="rounded-2xl border border-white/[0.08] bg-[#0c0e12] p-5 shadow-lg">
                <div className="flex items-center justify-between text-white/50 text-xs">
                  <span>Total Checkouts</span>
                  <Package className="size-4 text-white/70" />
                </div>
                <div className="mt-2 text-2xl font-black text-white">{orderStats.total}</div>
                <div className="mt-1 text-xs text-white/50">All customer checkout attempts</div>
              </div>

              {/* Paid Orders */}
              <div className="rounded-2xl border border-emerald-500/20 bg-[#0c1611] p-5 shadow-lg">
                <div className="flex items-center justify-between text-emerald-400 text-xs font-semibold">
                  <span>Paid & Fulfilled</span>
                  <CheckCircle2 className="size-4 text-emerald-400" />
                </div>
                <div className="mt-2 text-2xl font-black text-emerald-400">{orderStats.paidCount}</div>
                <div className="mt-1 text-xs text-emerald-300/70 font-semibold">
                  ₹{orderStats.totalPaidAmount.toLocaleString("en-IN")} total revenue
                </div>
              </div>

              {/* Abandoned Checkouts */}
              <div className="rounded-2xl border border-amber-500/20 bg-[#16120c] p-5 shadow-lg">
                <div className="flex items-center justify-between text-amber-400 text-xs font-semibold">
                  <span>Abandoned Checkouts</span>
                  <Clock className="size-4 text-amber-400" />
                </div>
                <div className="mt-2 text-2xl font-black text-amber-400">{orderStats.abandonedCount}</div>
                <div className="mt-1 text-xs text-amber-300/70">
                  ≈ ₹{orderStats.abandonedAmount.toLocaleString("en-IN")} dropped cart value
                </div>
              </div>

              {/* Failed Payments */}
              <div className="rounded-2xl border border-rose-500/20 bg-[#160c0f] p-5 shadow-lg">
                <div className="flex items-center justify-between text-rose-400 text-xs font-semibold">
                  <span>Failed / Declined</span>
                  <XCircle className="size-4 text-rose-400" />
                </div>
                <div className="mt-2 text-2xl font-black text-rose-400">{orderStats.failedCount}</div>
                <div className="mt-1 text-xs text-rose-300/70">Payment errors or cancellations</div>
              </div>
            </div>

            {/* Main Orders Table Card */}
            <div className="rounded-2xl border border-white/[0.08] bg-[#0c0e12] p-6 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-base font-bold text-white">Customer Orders & Key Deliveries</h2>
                  <p className="mt-0.5 text-xs text-white/50">
                    Live log of all customer checkouts — Paid, Abandoned, and Failed.
                  </p>
                </div>

                {/* Search Box */}
                <div className="relative w-full sm:w-72">
                  <input
                    type="text"
                    placeholder="Search email, phone, product, ID..."
                    value={orderSearchQuery}
                    onChange={(e) => setOrderSearchQuery(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 pl-9 text-xs text-white placeholder:text-white/40 focus:border-[#22c55e] focus:outline-none"
                  />
                  <Search className="size-3.5 text-white/40 absolute left-3 top-2.5" />
                </div>
              </div>

              {/* Filter Tabs / Pills */}
              <div className="flex flex-wrap items-center gap-2 border-y border-white/[0.06] py-3">
                {[
                  { id: "all", label: "All Orders", count: orderStats.total, color: "text-white" },
                  { id: "paid", label: "Paid & Fulfilled", count: orderStats.paidCount, dot: "bg-emerald-400", color: "text-emerald-400" },
                  { id: "abandoned", label: "Abandoned Checkouts", count: orderStats.abandonedCount, dot: "bg-amber-400", color: "text-amber-400" },
                  { id: "failed", label: "Failed / Declined", count: orderStats.failedCount, dot: "bg-rose-400", color: "text-rose-400" },
                ].map((f) => {
                  const isActive = orderStatusFilter === f.id;
                  return (
                    <button
                      key={f.id}
                      onClick={() => setOrderStatusFilter(f.id as any)}
                      className={`flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                        isActive
                          ? "bg-white/15 text-white shadow-sm ring-1 ring-white/20"
                          : "border border-white/10 bg-white/[0.02] text-white/60 hover:bg-white/[0.06] hover:text-white"
                      }`}
                    >
                      {f.dot && <span className={`size-2 rounded-full ${f.dot}`} />}
                      <span>{f.label}</span>
                      <span className="rounded-full bg-white/10 px-1.5 py-0.2 text-[10px] font-mono text-white/70">
                        {f.count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Table */}
              {filteredOrders.length === 0 ? (
                <div className="mt-8 text-center py-12 border border-dashed border-white/10 rounded-xl">
                  <Package className="size-10 text-white/20 mx-auto" />
                  <p className="mt-3 text-sm font-semibold text-white/60">
                    {orderStatusFilter === "all"
                      ? "No customer orders recorded yet."
                      : `No ${orderStatusFilter} orders found.`}
                  </p>
                  <p className="mt-1 text-xs text-white/40">
                    Live customer checkouts (both completed payments and abandoned carts) appear here in real time.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="border-b border-white/[0.08] bg-white/[0.02] text-[11px] font-bold uppercase tracking-wider text-white/50">
                      <tr>
                        <th className="p-4">Date & Time</th>
                        <th className="p-4">Status</th>
                        <th className="p-4">Product / Plan</th>
                        <th className="p-4 text-center">Amount</th>
                        <th className="p-4">Customer Contact</th>
                        <th className="p-4">Order / Payment ID</th>
                        <th className="p-4">Credentials / Outcome</th>
                        <th className="p-4 text-right">Invoice</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.06] text-white/80">
                      {filteredOrders.map((ord: any, idx: number) => {
                        const isPaid = ord.status === "paid" || ord.status === "fulfilled";
                        const isAbandoned = ord.status === "abandoned";
                        const isFailed = ord.status === "failed";

                        return (
                          <tr key={ord.id || idx} className="hover:bg-white/[0.02] transition-colors">
                            {/* Date */}
                            <td className="p-4 text-white/50 whitespace-nowrap text-[11px]">
                              <div>{new Date(ord.date).toLocaleDateString()}</div>
                              <div className="text-[10px] text-white/30">{new Date(ord.date).toLocaleTimeString()}</div>
                            </td>

                            {/* Status Badge */}
                            <td className="p-4 whitespace-nowrap">
                              {isPaid && (
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-bold text-emerald-400">
                                  <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                  Paid
                                </span>
                              )}
                              {isAbandoned && (
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-[11px] font-bold text-amber-400">
                                  <span className="size-1.5 rounded-full bg-amber-400" />
                                  Abandoned
                                </span>
                              )}
                              {isFailed && (
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/30 bg-rose-500/10 px-2.5 py-1 text-[11px] font-bold text-rose-400">
                                  <span className="size-1.5 rounded-full bg-rose-400" />
                                  Failed
                                </span>
                              )}
                            </td>

                            {/* Product */}
                            <td className="p-4">
                              <span className="font-semibold text-white block">
                                {ord.productName}
                              </span>
                              {ord.variantName && (
                                <span className="text-[10px] text-[#22c55e]">
                                  {ord.variantName}
                                </span>
                              )}
                            </td>

                            {/* Amount */}
                            <td className="p-4 text-center font-mono font-bold text-white whitespace-nowrap">
                              {ord.amount ? `₹${ord.amount.toLocaleString("en-IN")}` : "—"}
                            </td>

                            {/* Customer Contact */}
                            <td className="p-4 text-xs">
                              {ord.customerEmail ? (
                                <a
                                  href={`mailto:${ord.customerEmail}`}
                                  className="text-white hover:text-[#22c55e] block font-medium underline-offset-2 hover:underline"
                                >
                                  {ord.customerEmail}
                                </a>
                              ) : (
                                <span className="text-white/30 text-[11px]">No email</span>
                              )}
                              {ord.customerPhone && (
                                <a
                                  href={`tel:${ord.customerPhone}`}
                                  className="text-white/50 text-[11px] block hover:text-white"
                                >
                                  {ord.customerPhone}
                                </a>
                              )}
                            </td>

                            {/* Order / Payment ID */}
                            <td className="p-4 font-mono text-[11px] text-white/60">
                              {ord.paymentId ? (
                                <div className="text-emerald-400">{ord.paymentId}</div>
                              ) : ord.orderId ? (
                                <div className="text-amber-400/80">{ord.orderId}</div>
                              ) : (
                                <div>{ord.id?.slice(0, 16)}...</div>
                              )}
                            </td>

                            {/* Credentials / Outcome */}
                            <td className="p-4">
                              {isPaid ? (
                                ord.keysDelivered && ord.keysDelivered.length > 0 ? (
                                  <button
                                    onClick={() => copyToClipboard(ord.keysDelivered!.join("\n"), ord.id)}
                                    className="flex items-center gap-1.5 font-mono text-[11px] text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors cursor-pointer"
                                  >
                                    {copiedKey === ord.id ? <Check className="size-3 text-emerald-400" /> : <Copy className="size-3" />}
                                    <span>{ord.keysDelivered[0]?.slice(0, 18)}...</span>
                                  </button>
                                ) : (
                                  <span className="text-emerald-400/70 text-[11px]">Wholesale fulfillment pending</span>
                                )
                              ) : isAbandoned ? (
                                <span className="text-amber-400/70 text-[11px]">Left checkout (Not paid)</span>
                              ) : (
                                <span className="text-rose-400/70 text-[11px]">Transaction declined / cancelled</span>
                              )}
                            </td>

                            {/* Invoice Link */}
                            <td className="p-4 text-right">
                              <a
                                href={`/invoice/${ord.invoiceToken || ord.orderId || ord.paymentId || ord.id}`}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] font-semibold text-white/90 hover:bg-[#22c55e]/15 hover:border-[#22c55e]/40 hover:text-[#22c55e] transition-all cursor-pointer whitespace-nowrap"
                              >
                                <FileText className="size-3 text-[#22c55e]" />
                                <span>Invoice</span>
                              </a>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: STORE SETTINGS & MULTIPLIERS */}
        {activeTab === "settings" && (
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {/* Multipliers & Rates Card */}
            <div className="rounded-2xl border border-white/[0.08] bg-[#0c0e12] p-6 shadow-xl space-y-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Sliders className="size-4 text-[#22c55e]" />
                Pricing Engine Parameters
              </h2>

              <div>
                <label className="block text-xs font-semibold text-white/70 mb-1">
                  Global Markup Multiplier (Wholesale to Retail)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={markupDraft}
                  onChange={(e) => setMarkupDraft(Number(e.target.value))}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white focus:border-[#22c55e] focus:outline-none"
                />
                <p className="mt-1 text-[11px] text-white/40">
                  Example: 3.2 multiplies the EUR cost by 3.2x before exchange rate conversion.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/70 mb-1">
                  EUR to INR Exchange Rate
                </label>
                <input
                  type="number"
                  step="1"
                  value={eurRateDraft}
                  onChange={(e) => setEurRateDraft(Number(e.target.value))}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white focus:border-[#22c55e] focus:outline-none"
                />
                <p className="mt-1 text-[11px] text-white/40">
                  Current benchmark is ~92 INR per EUR.
                </p>
              </div>
            </div>

            {/* Announcement Banner */}
            <div className="rounded-2xl border border-white/[0.08] bg-[#0c0e12] p-6 shadow-xl space-y-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Zap className="size-4 text-[#22c55e]" />
                Storefront Announcement Banner
              </h2>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="ann-enabled"
                  checked={announcementDraft.enabled}
                  onChange={(e) => setAnnouncementDraft((prev) => ({ ...prev, enabled: e.target.checked }))}
                  className="size-4 accent-[#22c55e] cursor-pointer"
                />
                <label htmlFor="ann-enabled" className="text-xs font-semibold text-white cursor-pointer">
                  Display Announcement Banner on Top of Store
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/70 mb-1">
                  Banner Text / Offer Notice
                </label>
                <textarea
                  rows={3}
                  value={announcementDraft.text}
                  onChange={(e) => setAnnouncementDraft((prev) => ({ ...prev, text: e.target.value }))}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] p-3 text-xs text-white focus:border-[#22c55e] focus:outline-none"
                  placeholder="⚡ Welcome to GurfMarket — Instant Digital Delivery & 24/7 Verified Replacements!"
                />
              </div>

              {/* Support Links */}
              <div className="pt-2 border-t border-white/[0.06] space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-white/50">
                  Support Channels
                </h3>
                <div>
                  <label className="block text-[11px] text-white/70 mb-1">Telegram Invite URL</label>
                  <input
                    type="text"
                    value={supportDraft.telegram}
                    onChange={(e) => setSupportDraft((prev) => ({ ...prev, telegram: e.target.value }))}
                    className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-white/70 mb-1">Discord Server Invite</label>
                  <input
                    type="text"
                    value={supportDraft.discord}
                    onChange={(e) => setSupportDraft((prev) => ({ ...prev, discord: e.target.value }))}
                    className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
