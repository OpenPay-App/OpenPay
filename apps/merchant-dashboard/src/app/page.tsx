import { Hero } from "@/components/marketing/hero";
import { Features } from "@/components/marketing/features";
import { PricingComparison } from "@/components/marketing/pricing-comparison";
import { SelfHost } from "@/components/marketing/self-host";
import { OpenSource } from "@/components/marketing/open-source";
import { Footer } from "@/components/marketing/footer";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <Features />
      <PricingComparison />
      <SelfHost />
      <OpenSource />
      <Footer />
    </main>
  );
}
