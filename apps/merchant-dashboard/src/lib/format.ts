import { Currency } from "./types";

const currencySymbols: Record<string, string> = {
  NGN: "₦",
  USD: "$",
  GHS: "GH₵",
  ZAR: "R",
  KES: "KSh",
};

export function formatCurrency(
  amountInSmallestUnit: number,
  currency: Currency | string = "NGN"
): string {
  const symbol = currencySymbols[currency] || currency + " ";
  const major = amountInSmallestUnit / 100;
  return `${symbol}${major.toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-NG", {
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
