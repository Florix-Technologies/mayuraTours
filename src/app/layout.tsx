import type { Metadata } from "next";
import { Playfair_Display, Poppins } from "next/font/google";
import { business } from "@/lib/data/business";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import WhatsAppFloatButton from "@/components/layout/WhatsAppFloatButton";
import MobileBottomBar from "@/components/layout/MobileBottomBar";
import "./globals.css";

// Only the weights/styles actually referenced anywhere in the app (verified via a
// full-codebase grep of the `font-*` Tailwind utilities and `italic`/`not-italic`)
// are loaded — every unused weight or style is a whole extra font file the browser
// has to fetch for zero visual benefit.
const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["700", "800"],
  style: "normal",
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const description =
  `Bengaluru's trusted travel company since ${business.foundedYear}. AC sleeper buses and luxury tour packages to Goa, Ooty, Kerala, Coorg, Mysore and Chikmagalur. Own fleet, Karnataka Tourism licensed.`;

const title = `${business.legalName} – Bengaluru's Premier Travel Company`;

export const metadata: Metadata = {
  metadataBase: new URL(business.siteUrl),
  title: {
    default: title,
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
    title,
    description,
    images: [{ url: "/mayura.png", width: 512, height: 512, alt: `${business.legalName} logo` }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/mayura.png"],
  },
};

/** TravelAgency structured data — helps search engines and AI agents/crawlers
 * understand who this business is, where it operates and how to reach it
 * without having to parse the rendered page. Sourced entirely from the same
 * `business` data used across the UI, so it can't drift out of sync. */
const structuredData = {
  "@context": "https://schema.org",
  "@type": "TravelAgency",
  name: business.legalName,
  alternateName: business.shortName,
  description,
  url: business.siteUrl,
  logo: `${business.siteUrl}/mayura.png`,
  image: `${business.siteUrl}/mayura.png`,
  telephone: business.phone,
  email: business.email,
  foundingDate: String(business.foundedYear),
  address: {
    "@type": "PostalAddress",
    streetAddress: business.address.line1,
    addressLocality: business.address.city,
    addressRegion: business.address.state,
    postalCode: business.address.postalCode,
    addressCountry: business.address.country,
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: business.aggregateRating.value,
    bestRating: "5",
  },
  sameAs: [] as string[],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${playfair.variable} ${poppins.variable}`}
    >
      <body id="top" className="min-h-screen bg-paper pb-14 font-sans text-ink antialiased sm:pb-0">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <SiteHeader />
        {children}
        <SiteFooter />
        <WhatsAppFloatButton />
        <MobileBottomBar />
      </body>
    </html>
  );
}
