import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { Hero } from "@/components/home/hero";
import { TrustStrip } from "@/components/home/trust-strip";
import { HowItWorks } from "@/components/home/how-it-works";
import { FeaturedCreators } from "@/components/home/featured-creators";
import { FeatureGrid } from "@/components/home/feature-grid";
import { CtaBanner } from "@/components/home/cta-banner";

export default function Home() {
  return (
    <div className="flex min-h-full flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <TrustStrip />
        <HowItWorks />
        <FeaturedCreators />
        <FeatureGrid />
        <CtaBanner />
      </main>
      <Footer />
    </div>
  );
}
