"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { CreditCard, Loader2, CheckCircle, XCircle } from "lucide-react";
import Image from "next/image";

type CheckoutStatus = "loading" | "ready" | "processing" | "success" | "failed";

interface PaymentIntent {
  payment_id: string;
  amount: number;
  currency: string;
  status: string;
}

export default function CheckoutPage() {
  const { session } = useParams<{ session: string }>();
  const [status, setStatus] = useState<CheckoutStatus>("loading");
  const [paymentIntent, setPaymentIntent] = useState<PaymentIntent | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Card form state
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [email, setEmail] = useState("");
  const [cardError, setCardError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/checkout/${session}`);
        if (!res.ok) throw new Error("Invalid checkout session");
        const data = await res.json();
        setPaymentIntent(data);
        setStatus("ready");
      } catch (e) {
        setError((e as Error).message);
        setStatus("failed");
      }
    }
    load();
  }, [session]);

  const formatCardNumber = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(.{4})/g, "$1 ").trim();
  };

  const formatExpiry = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 2) return digits.slice(0, 2) + " / " + digits.slice(2);
    return digits;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentIntent) return;

    setCardError(null);
    setStatus("processing");

    try {
      const res = await fetch(`/api/checkout/${session}/pay`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          card_number: cardNumber.replace(/\s/g, ""),
          exp_month: expiry.split(" / ")[0],
          exp_year: "20" + (expiry.split(" / ")[1] || ""),
          cvv,
          email,
        }),
      });

      const data = await res.json();

      if (res.ok && data.status === "succeeded") {
        setStatus("success");
      } else {
        setCardError(data.error || "Payment failed");
        setStatus("ready");
      }
    } catch {
      setCardError("Network error — please try again");
      setStatus("ready");
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    const symbols: Record<string, string> = { NGN: "₦", USD: "$", GHS: "GH₵" };
    return `${symbols[currency] || currency} ${(amount / 100).toLocaleString("en-NG", { minimumFractionDigits: 2 })}`;
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-bg-alt flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-secondary animate-spin" />
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="min-h-screen bg-bg-alt flex items-center justify-center">
        <div className="bg-white rounded-xl border border-border p-8 max-w-md w-full text-center">
          <XCircle className="w-12 h-12 mx-auto mb-4 text-error" />
          <h1 className="text-xl font-semibold text-text-primary mb-2">
            Checkout Unavailable
          </h1>
          <p className="text-text-muted text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="min-h-screen bg-bg-alt flex items-center justify-center">
        <div className="bg-white rounded-xl border border-border p-8 max-w-md w-full text-center">
          <CheckCircle className="w-16 h-16 mx-auto mb-4 text-emerald-500" />
          <h1 className="text-xl font-semibold text-text-primary mb-2">
            Payment Successful
          </h1>
          <p className="text-text-muted text-sm mb-6">
            Your payment of {paymentIntent && formatCurrency(paymentIntent.amount, paymentIntent.currency)} has been processed.
          </p>
          <div className="bg-bg-alt rounded-lg p-4 text-sm">
            <span className="text-text-muted">Reference: </span>
            <span className="font-mono text-text-primary">
              {paymentIntent?.payment_id}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-alt flex items-center justify-center p-4">
      <div className="bg-white rounded-xl border border-border max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="bg-bg-dark p-6 text-center">
          <Image
            src="/brand/logo.svg"
            alt="OpenPay"
            width={120}
            height={32}
            className="h-8 w-auto mx-auto mb-4 brightness-0 invert"
          />
          <div className="text-2xl font-bold text-white">
            {paymentIntent && formatCurrency(paymentIntent.amount, paymentIntent.currency)}
          </div>
          {paymentIntent?.status && (
            <div className="text-sm text-white/50 mt-1">
              {paymentIntent.currency}
            </div>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-3 py-2.5 rounded-lg border border-border text-sm text-text-primary placeholder:text-text-muted outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-colors"
            />
          </div>

          {/* Card Number */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">
              Card Number
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={cardNumber}
                onChange={(e) =>
                  setCardNumber(formatCardNumber(e.target.value))
                }
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                className="w-full px-3 py-2.5 pr-10 rounded-lg border border-border text-sm text-text-primary placeholder:text-text-muted outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-colors font-mono"
              />
              <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            </div>
          </div>

          {/* Expiry + CVV */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">
                Expiry
              </label>
              <input
                type="text"
                required
                value={expiry}
                onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                placeholder="MM / YY"
                maxLength={7}
                className="w-full px-3 py-2.5 rounded-lg border border-border text-sm text-text-primary placeholder:text-text-muted outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-colors font-mono"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">
                CVV
              </label>
              <input
                type="text"
                required
                value={cvv}
                onChange={(e) =>
                  setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))
                }
                placeholder="123"
                maxLength={4}
                className="w-full px-3 py-2.5 rounded-lg border border-border text-sm text-text-primary placeholder:text-text-muted outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-colors font-mono"
              />
            </div>
          </div>

          {cardError && (
            <p className="text-sm text-error bg-red-50 rounded-lg px-3 py-2">
              {cardError}
            </p>
          )}

          <button
            type="submit"
            disabled={status === "processing"}
            className="w-full py-3 rounded-lg bg-gradient-to-r from-secondary to-accent text-white font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {status === "processing" ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing...
              </>
            ) : (
              `Pay ${paymentIntent ? formatCurrency(paymentIntent.amount, paymentIntent.currency) : ""}`
            )}
          </button>

          <p className="text-center text-xs text-text-muted">
            Secured by OpenPay
          </p>
        </form>
      </div>
    </div>
  );
}
