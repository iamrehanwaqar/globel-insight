import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { CookieConsent } from "@/components/ui/cookie-consent";
import { AuthProvider } from "@/components/user/auth-provider";
import { PreferencesProvider } from "@/components/user/user-preferences-provider";
import { getServerPreferences } from "@/lib/preferences";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://globalinsight.vercel.app"),
  title: {
    default: "Global Insight | International News, Analysis and Current Affairs",
    template: "%s | Global Insight",
  },
  description:
    "Global Insight is a premium international news platform covering politics, technology, markets, AI, culture, and world affairs.",
  openGraph: {
    title: "Global Insight",
    description: "Trusted global reporting, sharp analysis, and premium current affairs coverage.",
    siteName: "Global Insight",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Global Insight",
    description: "Trusted global reporting, sharp analysis, and premium current affairs coverage.",
  },
  alternates: {
    canonical: "/",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialPreferences = await getServerPreferences();

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background text-foreground">
        <AuthProvider>
          <PreferencesProvider initialPreferences={initialPreferences}>
            <SiteHeader />
            {children}
            <SiteFooter />
            <CookieConsent />
          </PreferencesProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
