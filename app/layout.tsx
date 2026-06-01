import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display, DM_Sans } from "next/font/google";
import localFont from "next/font/local";
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

const pfTransport = localFont({
  variable: "--font-pf-transport",
  display: "swap",
  src: [
    { path: "./fonts/PFTransportLight-Regular.otf",  weight: "300", style: "normal" },
    { path: "./fonts/PFTransportLight-Italic.otf",   weight: "300", style: "italic" },
    { path: "./fonts/PFTransport-Regular.otf",       weight: "400", style: "normal" },
    { path: "./fonts/PFTransport-Italic.otf",        weight: "400", style: "italic" },
    { path: "./fonts/PFTransportMedium-Regular.otf", weight: "500", style: "normal" },
    { path: "./fonts/PFTransportMedium-Italic.otf",  weight: "500", style: "italic" },
    { path: "./fonts/PFTransport-Bold.otf",          weight: "700", style: "normal" },
    { path: "./fonts/PFTransport-BoldItalic.otf",    weight: "700", style: "italic" },
    { path: "./fonts/PFTransportBlack-Regular.otf",  weight: "900", style: "normal" },
    { path: "./fonts/PFTransportBlack-Italic.otf",   weight: "900", style: "italic" },
  ],
});

const pfBague = localFont({
  variable: "--font-pf-bague",
  display: "swap",
  src: [
    { path: "./fonts/PFBagueSansPro-Hairline.otf",      weight: "100", style: "normal" },
    { path: "./fonts/PFBagueSansPro-HairlineItalic.otf",weight: "100", style: "italic" },
    { path: "./fonts/PFBagueSansPro-XThin.otf",         weight: "150", style: "normal" },
    { path: "./fonts/PFBagueSansPro-XThinItalic.otf",   weight: "150", style: "italic" },
    { path: "./fonts/PFBagueSansPro-Thin.otf",          weight: "200", style: "normal" },
    { path: "./fonts/PFBagueSansPro-ThinItalic.otf",    weight: "200", style: "italic" },
    { path: "./fonts/PFBagueSansPro-Light.otf",         weight: "300", style: "normal" },
    { path: "./fonts/PFBagueSansPro-LightItalic.otf",   weight: "300", style: "italic" },
    { path: "./fonts/PFBagueSansPro-Regular.otf",       weight: "400", style: "normal" },
    { path: "./fonts/PFBagueSansPro-Italic.otf",        weight: "400", style: "italic" },
    { path: "./fonts/PFBagueSansPro-Medium.otf",        weight: "500", style: "normal" },
    { path: "./fonts/PFBagueSansPro-MediumItalic.otf",  weight: "500", style: "italic" },
    { path: "./fonts/PFBagueSansPro-Bold.otf",          weight: "700", style: "normal" },
    { path: "./fonts/PFBagueSansPro-BoldItalic.otf",    weight: "700", style: "italic" },
    { path: "./fonts/PFBagueSansPro-Black.otf",         weight: "800", style: "normal" },
    { path: "./fonts/PFBagueSansPro-BlackItalic.otf",   weight: "800", style: "italic" },
    { path: "./fonts/PFBagueSansPro-UBlack.otf",        weight: "900", style: "normal" },
    { path: "./fonts/PFBagueSansPro-UBlackItalic.otf",  weight: "900", style: "italic" },
  ],
});

const astyCF = localFont({
  variable: "--font-asty",
  display: "swap",
  src: [
    { path: "./fonts/AstyCFStdHairline.otf",  weight: "100", style: "normal" },
    { path: "./fonts/AstyCFStdThin.otf",      weight: "200", style: "normal" },
    { path: "./fonts/AstyCFStdLight.otf",     weight: "300", style: "normal" },
    { path: "./fonts/AstyCFStdBook.otf",      weight: "400", style: "normal" },
    { path: "./fonts/AstyCFStdMedium.otf",    weight: "500", style: "normal" },
    { path: "./fonts/AstyCFStdBold.otf",      weight: "700", style: "normal" },
    { path: "./fonts/AstyCFStdExtraBold.otf", weight: "800", style: "normal" },
    { path: "./fonts/AstyCFStdBlack.otf",     weight: "900", style: "normal" },
    { path: "./fonts/AstyCFStdUltra.otf",     weight: "950", style: "normal" },
  ],
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
    'pf-transport': '--font-pf-transport',
    'pf-bague': '--font-pf-bague',
    asty: '--font-asty',
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
      className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} ${dmSans.variable} ${pfTransport.variable} ${pfBague.variable} ${astyCF.variable} h-full antialiased`}
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
