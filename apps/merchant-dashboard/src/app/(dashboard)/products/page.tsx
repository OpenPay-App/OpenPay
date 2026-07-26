"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  Package,
  ToggleLeft,
  ToggleRight,
  DollarSign,
} from "lucide-react";
import {
  listProducts,
  listPricingTiers,
  createProduct,
  createPricingTier,
  deleteProduct,
  deletePricingTier,
} from "@/lib/hyperswitch";
import type { Product, PricingTier, BillingInterval, Currency } from "@/lib/types";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [tiers, setTiers] = useState<PricingTier[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [tierName, setTierName] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState<Currency>("NGN");
  const [interval, setInterval] = useState<BillingInterval>("monthly");
  const [trialDays, setTrialDays] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [p, t] = await Promise.all([listProducts(), listPricingTiers()]);
    setProducts(p.data);
    setTiers(t.data);
    setLoading(false);
  };

  const handleCreate = async () => {
    if (!name.trim()) return;
    const res = await createProduct({ name: name.trim(), description: description.trim() });
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
      setTierName("");
      setAmount("");
      setTrialDays("");
    }
  };

  const handleDeleteProduct = async (id: string) => {
    await deleteProduct(id);
    setProducts((prev) => prev.filter((p) => p.product_id !== id));
  };

  const handleDeleteTier = async (id: string) => {
    await deletePricingTier(id);
    setTiers((prev) => prev.filter((t) => t.tier_id !== id));
  };

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
    }).format(amount / 100);
  };

  const getTiersForProduct = (productId: string) =>
    tiers.filter((t) => t.product_id === productId);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-text-secondary">
          Products and pricing tiers powered by Kill Bill. Each product can
          have multiple pricing tiers (monthly, yearly, etc.).
        </p>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2 bg-secondary text-white rounded-lg text-sm font-medium hover:bg-secondary-hover transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Product
        </button>
      </div>

      {/* Create Form */}
      {showCreate && (
        <div className="mb-6 p-5 rounded-xl border border-secondary/30 bg-secondary/5">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5">
                  Product Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Pro Plan"
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5">
                  Description
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What's included"
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
                />
              </div>
            </div>

            <div className="border-t border-secondary/20 pt-4">
              <p className="text-sm font-medium text-text-primary mb-3">
                Default Pricing Tier
              </p>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs text-text-secondary mb-1">
                    Tier Name
                  </label>
                  <input
                    type="text"
                    value={tierName}
                    onChange={(e) => setTierName(e.target.value)}
                    placeholder="e.g., Monthly"
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
                  />
                </div>
                <div>
                  <label className="block text-xs text-text-secondary mb-1">
                    Amount
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-2.5 w-4 h-4 text-text-muted" />
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0"
                      className="w-full pl-9 pr-3 py-2 border border-border rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-text-secondary mb-1">
                    Interval
                  </label>
                  <select
                    value={interval}
                    onChange={(e) => setInterval(e.target.value as BillingInterval)}
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                    <option value="weekly">Weekly</option>
                    <option value="daily">Daily</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-text-secondary mb-1">
                    Trial Days
                  </label>
                  <input
                    type="number"
                    value={trialDays}
                    onChange={(e) => setTrialDays(e.target.value)}
                    placeholder="0"
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleCreate}
                className="px-4 py-2 bg-secondary text-white rounded-lg text-sm font-medium hover:bg-secondary-hover transition-colors"
              >
                Create Product
              </button>
              <button
                onClick={() => setShowCreate(false)}
                className="px-4 py-2 border border-border rounded-lg text-sm text-text-secondary hover:text-text-primary transition-colors"
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
            <div key={i} className="h-32 rounded-xl bg-white border border-border animate-pulse" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 rounded-xl border border-border bg-white">
          <Package className="w-10 h-10 text-text-muted mx-auto mb-3" />
          <p className="text-text-secondary">No products yet</p>
          <p className="text-sm text-text-muted mt-1">
            Create a product with pricing tiers to start offering subscriptions.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {products.map((product) => {
            const productTiers = getTiersForProduct(product.product_id);
            return (
              <div
                key={product.product_id}
                className="p-5 rounded-xl border border-border bg-white"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-secondary-light flex items-center justify-center shrink-0">
                      <Package className="w-5 h-5 text-secondary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-text-primary">
                        {product.name}
                      </h3>
                      {product.description && (
                        <p className="text-sm text-text-secondary mt-0.5">
                          {product.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-1">
                        <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-xs font-medium">
                          Active
                        </span>
                        <span className="text-xs text-text-muted">
                          Created {new Date(product.created).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteProduct(product.product_id)}
                    className="p-1.5 rounded-lg text-text-muted hover:text-red-500 hover:bg-red-50 transition-colors"
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
                        className="flex items-center justify-between p-3 rounded-lg bg-bg-alt"
                      >
                        <div className="flex items-center gap-4">
                          <div>
                            <p className="text-sm font-medium text-text-primary">
                              {tier.name}
                            </p>
                            <p className="text-xs text-text-secondary">
                              {formatAmount(tier.amount, tier.currency)} /{" "}
                              {tier.interval}
                              {tier.trial_days
                                ? ` · ${tier.trial_days} day trial`
                                : ""}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteTier(tier.tier_id)}
                          className="p-1 rounded text-text-muted hover:text-red-500 transition-colors"
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
