import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import type { ReactNode } from "react";

import { AdminSettingsProvider } from "@/components/providers/admin-settings-provider";
import { SiteShell } from "@/components/layout/site-shell";
import { GalleryAdminProvider } from "@/components/providers/gallery-admin-provider";

import "./globals.css";

function getMetadataBase() {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.SITE_URL ??
    "http://localhost:3000";

  try {
    return new URL(siteUrl);
  } catch {
    return new URL("http://localhost:3000");
  }
}

const sans = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const serif = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: getMetadataBase(),
  applicationName: "MIAN TAILOR and design",
  title: {
    default: "MIAN TAILOR and design",
    template: "%s | MIAN TAILOR and design",
  },
  description:
    "Premium men's Kameez Shalwar website with gallery browsing, contact enquiries, and clean brand presentation.",
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable} h-full`}>
      <body className="min-h-full">
        <AdminSettingsProvider>
          <GalleryAdminProvider>
            <SiteShell>{children}</SiteShell>
          </GalleryAdminProvider>
        </AdminSettingsProvider>
      </body>
    </html>
  );
}

