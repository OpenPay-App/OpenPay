import { Currency } from "./types";

export const currencySymbols: Record<string, string> = {
  EUR: "€",
  USD: "$",
  GBP: "£",
  NGN: "₦",
  GHS: "GH₵",
  ZAR: "R",
  KES: "KSh",
  JPY: "¥",
  CAD: "C$",
  AUD: "A$",
  INR: "₹",
  BRL: "R$",
  MXN: "MX$",
};

export function formatCurrency(
  amountInSmallestUnit: number,
  currency: Currency | string = "USD",
  fractionDigits: number = 2
): string {
  const major = amountInSmallestUnit / 100;
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits,
    }).format(major);
  } catch {
    const symbol = currencySymbols[currency] || currency + " ";
    return `${symbol}${major.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function statusColor(status: string): string {
  const map: Record<string, string> = {
    succeeded: "bg-emerald-50 text-emerald-700 border-emerald-200",
    failed: "bg-red-50 text-red-700 border-red-200",
    pending: "bg-amber-50 text-amber-700 border-amber-200",
    processing: "bg-blue-50 text-blue-700 border-blue-200",
    cancelled: "bg-gray-100 text-gray-600 border-gray-200",
    refunded: "bg-purple-50 text-purple-700 border-purple-200",
    requires_confirmation: "bg-amber-50 text-amber-700 border-amber-200",
  };
  return map[status] || "bg-gray-100 text-gray-600 border-gray-200";
}
