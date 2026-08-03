"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Loader2, XCircle } from "lucide-react";
import Image from "next/image";

/**
 * Payment Success Page
 *
 * This is the return_url after Hyperswitch Elements SDK confirms a payment.
 * The SDK redirects here with payment intent params in the URL.
 * We verify the final payment status server-side.
 */

type Status = "loading" | "success" | "failed";

export default function CheckoutSuccessPage() {
  const { session } = useParams<{ session: string }>();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<Status>("loading");
  const [paymentId, setPaymentId] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    let retryTimer: ReturnType<typeof setTimeout> | null = null;

    async function verify() {
      try {
        // Hyperswitch SDK appends payment_intent to the URL
        const pi = searchParams.get("payment_intent");

        if (!pi) {
          // No payment intent in URL — try to fetch the session directly
          const res = await fetch(`/api/checkout/${session}?retrieve=true`);
          if (!res.ok) throw new Error("Could not verify payment");
          const data = await res.json();
          if (cancelled) return;
          setPaymentId(data.payment_id || session);
          if (data.status === "succeeded" || data.status === "requires_capture") {
            setStatus("success");
          } else {
            setError(`Payment status: ${data.status}`);
            setStatus("failed");
          }
          return;
        }

        // Verify the payment status with our backend
        const res = await fetch(`/api/checkout/${pi}?retrieve=true`);
        if (!res.ok) throw new Error("Could not verify payment");
        const data = await res.json();
        if (cancelled) return;

        setPaymentId(data.payment_id || pi);

        if (data.status === "succeeded" || data.status === "requires_capture") {
          setStatus("success");
        } else if (data.status === "processing") {
          // Payment is still processing — poll once more after a delay
          retryTimer = setTimeout(async () => {
            if (cancelled) return;
            try {
              const retry = await fetch(`/api/checkout/${pi}?retrieve=true`);
              const retryData = await retry.json();
              if (cancelled) return;
              if (retryData.status === "succeeded" || retryData.status === "requires_capture") {
                setStatus("success");
              } else {
                setError(`Payment is ${retryData.status}. Please check your dashboard.`);
                setStatus("failed");
              }
            } catch {
              if (!cancelled) {
                setError("Could not verify payment status");
                setStatus("failed");
              }
            }
          }, 3000);
        } else {
          setError(`Payment status: ${data.status}`);
          setStatus("failed");
        }
      } catch (e) {
        if (!cancelled) {
          setError((e as Error).message);
          setStatus("failed");
        }
      }
    }
    verify();

    return () => {
      cancelled = true;
      if (retryTimer) clearTimeout(retryTimer);
    };
  }, [session, searchParams]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-bg-alt flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-secondary animate-spin" />
          <p className="text-sm text-text-muted">Verifying payment...</p>
        </div>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="min-h-screen bg-bg-alt flex items-center justify-center">
        <div className="bg-white rounded-xl border border-border p-8 max-w-md w-full text-center">
          <XCircle className="w-12 h-12 mx-auto mb-4 text-error" />
          <h1 className="text-xl font-semibold text-text-primary mb-2">
            Payment Issue
          </h1>
          <p className="text-text-muted text-sm mb-4">{error}</p>
          {paymentId && (
            <div className="bg-bg-alt rounded-lg p-3 text-sm mb-4">
              <span className="text-text-muted">Reference: </span>
              <span className="font-mono text-text-primary">{paymentId}</span>
            </div>
          )}
          <Link
            href="/"
            className="inline-block px-4 py-2 rounded-lg bg-bg-dark text-white text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Return to Store
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-alt flex items-center justify-center">
      <div className="bg-white rounded-xl border border-border p-8 max-w-md w-full text-center">
        <CheckCircle className="w-16 h-16 mx-auto mb-4 text-emerald-500" />
        <h1 className="text-xl font-semibold text-text-primary mb-2">
          Payment Successful
        </h1>
        <p className="text-text-muted text-sm mb-6">
          Your payment has been processed successfully.
        </p>
        <div className="bg-bg-alt rounded-lg p-4 text-sm mb-6">
          <span className="text-text-muted">Reference: </span>
          <span className="font-mono text-text-primary">{paymentId}</span>
        </div>
        <div className="flex items-center justify-center gap-3">
          <Image
            src="/brand/logo.svg"
            alt="OpenPay"
            width={80}
            height={22}
            className="h-5 w-auto opacity-50"
          />
          <span className="text-xs text-text-muted">Secured by OpenPay</span>
        </div>
      </div>
    </div>
  );
}
