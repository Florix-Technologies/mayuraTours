import Hero from "@/components/home/Hero";
import BookingBar from "@/components/home/BookingBar";
import Marquee from "@/components/home/Marquee";
import PackagesSection from "@/components/home/PackagesSection";
import VideoSection from "@/components/home/VideoSection";
import DestinationsGrid from "@/components/home/DestinationsGrid";
import GalleryStrip from "@/components/home/GalleryStrip";
import FleetSection from "@/components/home/FleetSection";
import HowItWorks from "@/components/home/HowItWorks";
import TrustSection from "@/components/home/TrustSection";
import ContactCta from "@/components/home/ContactCta";

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
