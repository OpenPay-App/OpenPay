import type { Metadata } from "next";
import { AuthProvider } from "@/components/auth-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "OpenPay",
  description: "Open-source payment infrastructure you actually own",
  icons: {
    icon: "/brand/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Oxygen:wght@300;400;700&family=Inconsolata:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-white text-gray-800">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}