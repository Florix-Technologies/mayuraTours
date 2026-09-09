import type { Metadata } from "next";
import { Playfair_Display, Poppins } from "next/font/google";
import { business } from "@/lib/data/business";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import WhatsAppFloatButton from "@/components/layout/WhatsAppFloatButton";
import MobileBottomBar from "@/components/layout/MobileBottomBar";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["700", "800"],
  style: ["normal", "italic"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const description =
  `Bengaluru's trusted travel company since ${business.foundedYear}. AC sleeper buses and luxury tour packages to Goa, Ooty, Kerala, Coorg, Mysore and Chikmagalur. Own fleet, Karnataka Tourism licensed.`;

export const metadata: Metadata = {
  metadataBase: new URL(business.siteUrl),
  title: {
    default: `${business.legalName} – Bengaluru's Premier Travel Company`,
    template: `%s | ${business.shortName}`,
  },
  description,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: business.legalName,
    title: `${business.legalName} – Bengaluru's Premier Travel Company`,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${business.legalName} – Bengaluru's Premier Travel Company`,
    description,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${playfair.variable} ${poppins.variable}`}
    >
      <body id="top" className="min-h-screen bg-paper pb-14 font-sans text-ink antialiased sm:pb-0">
        <SiteHeader />
        {children}
        <SiteFooter />
        <WhatsAppFloatButton />
        <MobileBottomBar />
      </body>
    </html>
  );
}
