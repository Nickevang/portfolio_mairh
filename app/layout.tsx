import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { sanityFetch } from "@/lib/sanity.client";
import { siteSettingsQuery, type SiteSettings } from "@/lib/sanity.queries";

const geistSans = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const dmSans = DM_Sans({
  variable: "--font-dm",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await sanityFetch<SiteSettings>(siteSettingsQuery);
  return {
    title: {
      default: settings?.seoTitle ?? "Portfolio",
      template: `%s — ${settings?.siteName ?? "Portfolio"}`,
    },
    description: settings?.seoDescription ?? "Photography & videography portfolio.",
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await sanityFetch<SiteSettings>(siteSettingsQuery);

  const scheme = settings?.colorScheme ?? 'dark'
  const fontKey = settings?.fontFamily ?? 'geist'
  const fontVarMap: Record<string, string> = {
    geist: '--font-geist',
    playfair: '--font-playfair',
    'dm-sans': '--font-dm',
  }

  const cssVars = {
    '--accent': settings?.accentColor ?? '#ffffff',
    '--background': scheme === 'light' ? '#fafafa' : '#000000',
    '--foreground': scheme === 'light' ? '#111111' : '#f3f4f6',
    '--font-sans': `var(${fontVarMap[fontKey] ?? '--font-geist'})`,
  } as React.CSSProperties

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} ${dmSans.variable} h-full antialiased`}
      style={cssVars}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Navbar siteName={settings?.siteName} />
        <main className="flex-1">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
