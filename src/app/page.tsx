import Hero from "@/components/sections/Hero";
import BookingBar from "@/components/sections/BookingBar";
import Marquee from "@/components/sections/Marquee";
import PackagesSection from "@/components/sections/PackagesSection";
import VideoSection from "@/components/sections/VideoSection";
import DestinationsGrid from "@/components/sections/DestinationsGrid";
import GalleryStrip from "@/components/sections/GalleryStrip";
import FleetSection from "@/components/sections/FleetSection";
import HowItWorks from "@/components/sections/HowItWorks";
import TrustSection from "@/components/sections/TrustSection";
import ContactCta from "@/components/sections/ContactCta";

export default function Home() {
  return (
    <main>
      <Hero />
      <BookingBar />
      <Marquee />
      <PackagesSection />
      <VideoSection />
      <DestinationsGrid />
      <GalleryStrip />
      {/*<StatsSection />*/}
      <FleetSection />
      <HowItWorks />
      <TrustSection />
      <ContactCta />
    </main>
  );
}
