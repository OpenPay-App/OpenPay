"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  Package,
  DollarSign,
  AlertTriangle,
} from "lucide-react";
import {
  listProducts,
  listPricingTiers,
  createProduct,
  createPricingTier,
  deleteProduct,
  deletePricingTier,
} from "@/lib/hyperswitch";
import { useSandboxMode } from "@/lib/sandbox-mode";
import { formatCurrency } from "@/lib/format";
import type { Product, PricingTier, BillingInterval, Currency } from "@/lib/types";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [tiers, setTiers] = useState<PricingTier[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isSandbox } = useSandboxMode();
  const [actionError, setActionError] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [features, setFeatures] = useState<string[]>([""]);
  const [tierName, setTierName] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState<Currency>("EUR");
  const [interval, setInterval] = useState<BillingInterval>("monthly");
  const [trialDays, setTrialDays] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [p, t] = await Promise.all([listProducts(), listPricingTiers()]);
      setProducts(p.data);
      setTiers(t.data);
    } catch (err: any) {
      setError(err?.message ?? "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!name.trim()) return;
    setActionError(null);
    try {
      const validFeatures = features.filter((f) => f.trim());
      const res = await createProduct({ name: name.trim(), description: description.trim(), features: validFeatures });
      if (res.data) {
        if (amount && tierName) {
          await createPricingTier({
            product_id: res.data.product_id,
            name: tierName.trim(),
            amount: Number(amount) * 100,
            currency,
            interval,
            trial_days: trialDays ? Number(trialDays) : undefined,
          });
        }
        await loadData();
        setShowCreate(false);
        setName("");
        setDescription("");
        setFeatures([""]);
        setTierName("");
        setAmount("");
        setCurrency("EUR");
        setInterval("monthly");
        setTrialDays("");
      }
    } catch (err: any) {
      setActionError(err?.message ?? "Failed to create product");
    }
  };

  const handleDeleteProduct = async (id: string) => {
    setActionError(null);
    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.product_id !== id));
    } catch (err: any) {
      setActionError(err?.message ?? "Failed to delete product");
    }
  };

  const handleDeleteTier = async (id: string) => {
    setActionError(null);
    try {
      await deletePricingTier(id);
      setTiers((prev) => prev.filter((t) => t.tier_id !== id));
    } catch (err: any) {
      setActionError(err?.message ?? "Failed to delete pricing tier");
    }
  };

  const getTiersForProduct = (productId: string) =>
    tiers.filter((t) => t.product_id === productId);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <p className="text-sm text-gray-500">
            Products and pricing tiers powered by Kill Bill. Each product can
            have multiple pricing tiers (monthly, yearly, etc.).
          </p>
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
            isSandbox
              ? "bg-amber-50 border-amber-300 text-amber-700"
              : "bg-[#e6f9e6] border-[#40d63b]/30 text-[#40d63b]"
          }`}>
            {isSandbox ? "Sandbox" : "Production"}
          </span>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#3898EC] text-white rounded-[3px] text-sm font-medium hover:bg-[#2c7dd6] transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Product
        </button>
      </div>

      {/* Connection Error Banner */}
      {error && (
        <div className="mb-6 p-4 rounded-[3px] border border-[#ea384c]/30 bg-red-50">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-[#ea384c] mt-0.5 shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-[#ea384c]">
                {error.includes("Cannot reach Hyperswitch")
                  ? "Cannot connect to Hyperswitch"
                  : error}
              </p>
            </div>
            <button
              onClick={loadData}
              className="px-3 py-1.5 text-sm font-medium text-[#ea384c] bg-white border border-[#ea384c]/30 rounded-[3px] hover:bg-red-50 transition-colors shrink-0"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Inline Action Error */}
      {actionError && (
        <div className="mb-4 p-3 rounded-[3px] border border-[#ea384c]/30 bg-red-50">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-[#ea384c] shrink-0" />
            <p className="text-sm text-[#ea384c] flex-1">
              {actionError.includes("Cannot reach Hyperswitch")
                ? "Cannot connect to Hyperswitch"
                : actionError}
            </p>
            <button
              onClick={() => setActionError(null)}
              className="text-xs text-[#ea384c] hover:text-red-700 transition-colors"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Create Form */}
      {showCreate && (
        <div className="mb-6 p-5 rounded-[3px] border border-[#3898EC]/30 bg-[#e8f0fe]">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1.5">
                  Product Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Pro Plan"
                  className="w-full px-3 py-2 border border-[#e2e2e2] rounded-[3px] text-sm text-[#333333] placeholder:text-[#AAADB0] focus:outline-none focus:ring-2 focus:ring-[#3898EC]/20 focus:border-[#3898EC]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1.5">
                  Description
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What's included"
                  className="w-full px-3 py-2 border border-[#e2e2e2] rounded-[3px] text-sm text-[#333333] placeholder:text-[#AAADB0] focus:outline-none focus:ring-2 focus:ring-[#3898EC]/20 focus:border-[#3898EC]"
                />
              </div>
            </div>

            <div className="border-t border-[#3898EC]/20 pt-4">
              <p className="text-sm font-medium text-gray-900 mb-3">
                Default Pricing Tier
              </p>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Tier Name
                  </label>
                  <input
                    type="text"
                    value={tierName}
                    onChange={(e) => setTierName(e.target.value)}
                    placeholder="e.g., Monthly"
                    className="w-full px-3 py-2 border border-[#e2e2e2] rounded-[3px] text-sm text-[#333333] placeholder:text-[#AAADB0] focus:outline-none focus:ring-2 focus:ring-[#3898EC]/20 focus:border-[#3898EC]"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Amount
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-2.5 w-4 h-4 text-[#AAADB0]" />
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0"
                      className="w-full pl-9 pr-3 py-2 border border-[#e2e2e2] rounded-[3px] text-sm text-[#333333] placeholder:text-[#AAADB0] focus:outline-none focus:ring-2 focus:ring-[#3898EC]/20 focus:border-[#3898EC]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Interval
                  </label>
                  <select
                    value={interval}
                    onChange={(e) => setInterval(e.target.value as BillingInterval)}
                    className="w-full px-3 py-2 border border-[#e2e2e2] rounded-[3px] text-sm text-[#333333] focus:outline-none focus:ring-2 focus:ring-[#3898EC]/20 focus:border-[#3898EC]"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                    <option value="weekly">Weekly</option>
                    <option value="daily">Daily</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Trial Days
                  </label>
                  <input
                    type="number"
                    value={trialDays}
                    onChange={(e) => setTrialDays(e.target.value)}
                    placeholder="0"
                    className="w-full px-3 py-2 border border-[#e2e2e2] rounded-[3px] text-sm text-[#333333] placeholder:text-[#AAADB0] focus:outline-none focus:ring-2 focus:ring-[#3898EC]/20 focus:border-[#3898EC]"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1.5">
                Features
              </label>
              <p className="text-xs text-[#AAADB0] mb-2">
                Add features included in this product (one per line)
              </p>
              <div className="space-y-2">
                {features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => {
                        const updated = [...features];
                        updated[idx] = e.target.value;
                        setFeatures(updated);
                      }}
                      placeholder={`Feature ${idx + 1} (e.g., Priority support)`}
                      className="flex-1 px-3 py-2 border border-[#e2e2e2] rounded-[3px] text-sm text-[#333333] placeholder:text-[#AAADB0] focus:outline-none focus:ring-2 focus:ring-[#3898EC]/20 focus:border-[#3898EC]"
                    />
                    {features.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setFeatures(features.filter((_, i) => i !== idx))}
                        className="p-2 text-[#AAADB0] hover:text-[#ea384c] transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setFeatures([...features, ""])}
                  className="flex items-center gap-1.5 text-xs text-[#3898EC] hover:text-[#2c7dd6] font-medium transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add feature
                </button>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleCreate}
                className="px-4 py-2 bg-[#3898EC] text-white rounded-[3px] text-sm font-medium hover:bg-[#2c7dd6] transition-colors"
              >
                Create Product
              </button>
              <button
                onClick={() => setShowCreate(false)}
                className="px-4 py-2 border border-[#e2e2e2] rounded-[3px] text-sm text-gray-700 hover:text-[#333333] transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Products List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-32 rounded-[3px] bg-white border border-[#e2e2e2] animate-pulse shadow-[0_0_0_1px_rgba(0,0,0,0.05),0_1px_3px_rgba(0,0,0,0.05)]" />
          ))}
        </div>
      ) : products.length === 0 && !error ? (
        <div className="text-center py-16 rounded-[3px] border border-[#e2e2e2] bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.05),0_1px_3px_rgba(0,0,0,0.05)]">
          <Package className="w-10 h-10 text-[#AAADB0] mx-auto mb-3" />
          <p className="text-gray-500">{isSandbox ? "No sandbox products yet" : "No products yet"}</p>
          <p className="text-sm text-[#AAADB0] mt-1">
            {isSandbox
              ? "Create a test product to start experimenting with subscriptions."
              : "Create a product with pricing tiers to start offering subscriptions."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {products.map((product) => {
            const productTiers = getTiersForProduct(product.product_id);
            return (
              <div
                key={product.product_id}
                className="p-5 rounded-[3px] border border-[#e2e2e2] bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.05),0_1px_3px_rgba(0,0,0,0.05)]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-[3px] bg-[#e8f0fe] flex items-center justify-center shrink-0">
                      <Package className="w-5 h-5 text-[#3898EC]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {product.name}
                      </h3>
                      {product.description && (
                        <p className="text-sm text-gray-500 mt-0.5">
                          {product.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-1">
                        <span className="px-2 py-0.5 rounded bg-[#e6f9e6] text-[#40d63b] text-xs font-medium border border-[#40d63b]/30">
                          Active
                        </span>
                        <span className="text-xs text-[#AAADB0]">
                          Created {new Date(product.created).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteProduct(product.product_id)}
                    className="p-1.5 rounded-[3px] text-[#AAADB0] hover:text-[#ea384c] hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Pricing Tiers */}
                {productTiers.length > 0 && (
                  <div className="mt-4 ml-14 space-y-2">
                    {productTiers.map((tier) => (
                      <div
                        key={tier.tier_id}
                        className="flex items-center justify-between p-3 rounded-[3px] bg-[#fafafa] border border-[#e2e2e2]"
                      >
                        <div className="flex items-center gap-4">
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {tier.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatCurrency(tier.amount, tier.currency, 0)} /{" "}
                              {tier.interval}
                              {tier.trial_days
                                ? ` · ${tier.trial_days} day trial`
                                : ""}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteTier(tier.tier_id)}
                          className="p-1 rounded text-[#AAADB0] hover:text-[#ea384c] transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
