import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Lora, Amiri } from "next/font/google";
import "./globals.css";
import { SiteChrome } from "@/components/layout/site-chrome";
import { getSiteChromeData } from "@/lib/data/site";
import { organizationSchema } from "@/lib/schema";

// Every page reads directly from the database (not `fetch`), so without this
// the App Router prerenders pages with no Request-time API (cookies/headers/
// searchParams) once at build time and never re-queries them — admin edits
// (new articles, contributor photos, static page content, nav links) never
// show up until the next deploy. Force every route dynamic so it always
// reflects current data.
export const dynamic = "force-dynamic";

const fontSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const fontReading = Lora({
  variable: "--font-reading",
  subsets: ["latin"],
  display: "swap",
});

const fontArabic = Amiri({
  variable: "--font-arabic-family",
  subsets: ["arabic"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://markazfiqih.com"),
  title: {
    default: "Markaz Fiqih — Membumikan Fiqih di Setiap Lini Kehidupan",
    template: "%s — Markaz Fiqih",
  },
  description:
    "Markaz Fiqih menyediakan artikel Fiqih, Ushul Fiqih, Kaidah Fiqih, Doa, Kisah, dan Tanya Jawab seputar Islam yang mudah diakses dan nyaman dibaca.",
  openGraph: {
    siteName: "Markaz Fiqih",
    type: "website",
    locale: "id_ID",
    images: ["/logo-red.png"],
  },
  twitter: {
    card: "summary",
    images: ["/logo-red.png"],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const chromeData = await getSiteChromeData();

  return (
    <html
      lang="id"
      suppressHydrationWarning
      className={`${fontSans.variable} ${fontReading.variable} ${fontArabic.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <script
          dangerouslySetInnerHTML={{
            __html:
              '(function(){try{if(localStorage.getItem("theme")==="dark"){document.documentElement.classList.add("dark")}}catch(e){}})();',
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              organizationSchema({
                address: chromeData.footer.address,
                email: chromeData.footer.email,
                tagline: chromeData.footer.tagline,
                socialUrls: [
                  chromeData.footer.youtubeUrl,
                  chromeData.footer.facebookUrl,
                  chromeData.footer.instagramUrl,
                  chromeData.footer.tiktokUrl,
                ],
              })
            ),
          }}
        />
        <SiteChrome data={chromeData}>{children}</SiteChrome>
      </body>
    </html>
  );
}
