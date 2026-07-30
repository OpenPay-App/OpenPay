"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { Loader2, CheckCircle, XCircle, CreditCard } from "lucide-react";
import Image from "next/image";

type CheckoutStatus = "loading" | "ready" | "processing" | "success" | "failed";

interface CheckoutSession {
  payment_id: string;
  amount: number;
  currency: string;
  status: string;
  client_secret: string;
}

/**
 * PCI-Compliant Checkout Page
 *
 * Card data is tokenized entirely within the Hyperswitch Elements iframe.
 * Raw card numbers, CVC, and expiry never touch our application code.
 * The SDK returns a payment_method_id token that is sent to our backend.
 */

// Load Hyperswitch SDK from CDN (no npm install required)
const HYPER_SDK_URL = "https://beta.hyperswitch.io/v1/HyperLoader.js";
let hyperPromise: Promise<any> | null = null;

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    const timeout = setTimeout(() => reject(new Error(`SDK load timeout from ${src}`)), 15000);
    script.onload = () => { clearTimeout(timeout); resolve(); };
    script.onerror = () => { clearTimeout(timeout); reject(new Error(`Failed to load SDK from ${src}`)); };
    document.head.appendChild(script);
  });
}

function getHyper() {
  if (!hyperPromise) {
    hyperPromise = loadScript(HYPER_SDK_URL).then(() => {
      const Hyper = (window as any).Hyper;
      if (!Hyper) throw new Error("Hyper SDK loaded but window.Hyper is not defined");
      return Hyper(process.env.NEXT_PUBLIC_HYPERSWITCH_PUBLISHABLE_KEY || "");
    });
  }
  return hyperPromise;
}

export default function CheckoutPage() {
  const { session } = useParams<{ session: string }>();
  const [status, setStatus] = useState<CheckoutStatus>("loading");
  const [sessionData, setSessionData] = useState<CheckoutSession | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const hyperRef = useRef<any>(null);
  const elementsRef = useRef<any>(null);

  useEffect(() => {
    let cancelled = false;
    let paymentElement: any = null;

    async function load() {
      try {
        const res = await fetch(`/api/checkout/${session}`);
        if (!res.ok) throw new Error("Invalid checkout session");
        const data: CheckoutSession = await res.json();

        if (cancelled) return;
        setSessionData(data);

        // Initialize Hyperswitch SDK
        let hyper;
        try {
          hyper = await getHyper();
        } catch (sdkErr) {
          throw new Error(
            `Failed to load payment SDK: ${(sdkErr as Error).message}. Check your publishable key.`
          );
        }
        if (cancelled) return;

        hyperRef.current = hyper;

        const elements = hyper.elements({
          clientSecret: data.client_secret,
        });
        elementsRef.current = elements;

        // Create the unified payment element and mount it
        paymentElement = elements.create("payment");
        paymentElement.mount("#hyperswitch-payment-element");

        if (!cancelled) setStatus("ready");
      } catch (e) {
        if (!cancelled) {
          setError((e as Error).message);
          setStatus("failed");
        }
      }
    }
    load();

    return () => {
      cancelled = true;
      // Clean up payment element and refs on unmount
      if (paymentElement) {
        try { paymentElement.unmount(); } catch {}
      }
      hyperRef.current = null;
      elementsRef.current = null;
    };
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hyperRef.current || !elementsRef.current || !sessionData) return;

    setStatus("processing");

    try {
      // Confirm payment via Hyperswitch SDK
      // Card data stays inside the iframe — never touches our code
      const result = await hyperRef.current.confirmPayment({
        elements: elementsRef.current,
        confirmParams: {
          return_url: `${window.location.origin}/checkout/${session}/success`,
          billing_details: {
            email: email || undefined,
          },
        },
      });

      if (result.error) {
        setError(result.error.message || "Payment failed");
        setStatus("ready");
        return;
      }

      // Payment succeeded — redirect or show success
      setStatus("success");
    } catch (err) {
      setError((err as Error).message || "An unexpected error occurred");
      setStatus("ready");
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    try {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
        minimumFractionDigits: 2,
      }).format(amount / 100);
    } catch {
      return `${currency} ${(amount / 100).toLocaleString("en-US", {
        minimumFractionDigits: 2,
      })}`;
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-bg-alt flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-secondary animate-spin" />
          <p className="text-sm text-text-muted">Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #FF6B00 0%, #FF8C33 50%, #FFFFFF 100%)' }}>
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
            <XCircle className="w-10 h-10 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Checkout Unavailable
          </h1>
          <p className="text-gray-600 text-sm mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-medium text-sm hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #FF6B00 0%, #FF8C33 50%, #FFFFFF 100%)' }}>
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Payment Successful!
          </h1>
          <p className="text-gray-600 text-sm mb-6">
            Your payment of{' '}
            {sessionData &&
              formatCurrency(sessionData.amount, sessionData.currency)}{' '}
            has been processed.
          </p>
          <div className="bg-gray-50 rounded-xl p-4 text-sm border border-gray-100">
            <span className="text-gray-500">Reference: </span>
            <span className="font-mono text-gray-900 font-medium">
              {sessionData?.payment_id}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, #FF6B00 0%, #FF8C33 50%, #FFFFFF 100%)' }}>
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="p-6 text-center" style={{ background: 'linear-gradient(135deg, #FF6B00 0%, #FF8C33 100%)' }}>
          <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Image
              src="/brand/logo.svg"
              alt="OpenPay"
              width={32}
              height={32}
              className="h-8 w-auto brightness-0 invert"
            />
          </div>
          <div className="text-3xl font-bold text-white">
            {sessionData &&
              formatCurrency(sessionData.amount, sessionData.currency)}
          </div>
          {sessionData?.currency && (
            <div className="text-sm text-white/80 mt-1 font-medium">
              {sessionData.currency}
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-3 py-2.5 rounded-lg border border-border text-sm text-text-primary placeholder:text-text-muted outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-colors"
            />
          </div>

          {/* Hyperswitch Elements Container — card data is tokenized here */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">
              <CreditCard className="w-4 h-4 inline mr-1.5" />
              Card Details
            </label>
            <div
              id="hyperswitch-payment-element"
              className="min-h-[44px] rounded-lg border border-border p-3 focus-within:ring-2 focus-within:ring-secondary/20 focus-within:border-secondary transition-colors"
            />
            <p className="mt-1 text-xs text-text-muted">
              Card data is securely tokenized by Hyperswitch. Raw card details
              never leave the encrypted iframe.
            </p>
          </div>

          {error && (
            <p className="text-sm text-error bg-red-50 rounded-lg px-3 py-2">
              {error}
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
                Processing payment...
              </>
            ) : (
              `Pay ${
                sessionData
                  ? formatCurrency(sessionData.amount, sessionData.currency)
                  : ""
              }`
            )}
          </button>

          <p className="text-center text-xs text-text-muted">
            Secured by OpenPay · Card data tokenized via Hyperswitch
          </p>
        </form>
      </div>
    </div>
  );
}
