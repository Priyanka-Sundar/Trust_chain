import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "Trust Chain — Consumer Complaint Intelligence",
  description:
    "AI-Driven Consumer Complaint Intelligence for E-commerce Platforms. Hybrid Transformer + Graph Neural Network pipeline with SHAP explainability on Yelp reviews.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-cream-100">
        <Sidebar />
        <div className="ml-64">
          <main className="p-6 lg:p-8 max-w-[1400px]">{children}</main>
        </div>
      </body>
    </html>
  );
}
