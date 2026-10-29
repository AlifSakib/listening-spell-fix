import type { Metadata, Viewport } from "next";
import { Google_Sans } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import { ConsentBanner } from "@/components/ConsentBanner";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { InstallPrompt } from "@/components/InstallPrompt";
import { ServiceWorker } from "@/components/ServiceWorker";
import { KEYWORDS, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";
import "./globals.css";

const googleSans = Google_Sans({
  subsets: ["latin"],
  weight: "variable",
  display: "swap",
  variable: "--font-google-sans",
});

const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "G-KPVL4M50B6";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME}: Free IELTS Listening Spelling Test`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: KEYWORDS,
  applicationName: SITE_NAME,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_GB",
    url: "/",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  icons: {
    icon: [{ url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" }],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }],
  },
  appleWebApp: { capable: true, title: "IELTS Spell", statusBarStyle: "default" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#4F46E5" },
    { media: "(prefers-color-scheme: dark)", color: "#0B1120" },
  ],
};

// Runs before paint: applies the saved theme (or the system one) to avoid a flash.
const themeScript = `(function(){try{var t=JSON.parse(localStorage.getItem("ielts:theme"));var d=t?t==="dark":matchMedia("(prefers-color-scheme: dark)").matches;document.documentElement.classList.toggle("dark",d)}catch(e){}})()`;

// Google Consent Mode v2: analytics is denied until the student accepts.
const consentScript = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag("consent","default",{ad_storage:"denied",ad_user_data:"denied",ad_personalization:"denied",analytics_storage:"denied",wait_for_update:500});try{if(JSON.parse(localStorage.getItem("ielts:consent"))==="granted")gtag("consent","update",{analytics_storage:"granted"})}catch(e){}`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-GB" className={googleSans.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        {GA_ID && <script dangerouslySetInnerHTML={{ __html: consentScript }} />}
      </head>
      <body className="flex min-h-dvh flex-col font-sans antialiased">
        <a
          href="#main"
          className="sr-only rounded-ctl bg-primary px-4 py-3 text-on-primary focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50"
        >
          Skip to content
        </a>
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
        <InstallPrompt />
        <ServiceWorker />
        {GA_ID && <ConsentBanner />}
      </body>
      {GA_ID && <GoogleAnalytics gaId={GA_ID} />}
    </html>
  );
}
