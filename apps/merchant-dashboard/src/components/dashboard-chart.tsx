"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Payment } from "@/lib/types";

function aggregateByDay(payments: Payment[]) {
  const now = new Date();
  const days: { date: string; revenue: number; count: number }[] = [];

  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    days.push({
      date: d.toLocaleDateString("en-NG", { month: "short", day: "numeric" }),
      revenue: 0,
      count: 0,
    });
  }

  payments
    .filter((p) => p.status === "succeeded")
    .forEach((p) => {
      const d = new Date(p.created);
      const label = d.toLocaleDateString("en-NG", {
        month: "short",
        day: "numeric",
      });
      const slot = days.find((g) => g.date === label);
      if (slot) {
        slot.revenue += p.amount / 100;
        slot.count += 1;
      }
    });

  return days;
}

export function DashboardChart({ payments }: { payments: Payment[] }) {
  const data = aggregateByDay(payments);

  return (
    <div className="bg-[#0a0a0a] rounded-xl border border-border p-6">
      <h2 className="font-semibold text-white mb-4">
        Revenue — Last 30 Days
      </h2>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F56600" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#F56600" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f1f1f" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12, fill: "#666666" }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: "#666666" }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `₦${v.toLocaleString()}`}
            />
            <Tooltip
              formatter={(value: number) => [`₦${value.toLocaleString()}`, "Revenue"]}
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid #1f1f1f",
                background: "#0a0a0a",
                boxShadow: "0 2px 8px rgba(0,0,0,0.5)",
              }}
              labelStyle={{ color: "#f5f5f5" }}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#F56600"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorRevenue)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
