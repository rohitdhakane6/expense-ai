import {
  HeroSection,
  FeaturesSection,
  HowItWorksSection,
  PricingSection,
  CTASection,
} from "@/components/landing";
import { Navbar } from "@/components/landing/navbar";

export default function page() {
  const navItems = [
    {
      name: "Features",
      link: "#features",
    },
    {
      name: "Pricing",
      link: "#pricing",
    },
    {
      name: "How it Works",
      link: "#how-it-works",
    },
  ];

  return (
    <div className="relative w-full">
      <Navbar navItems={navItems} />
      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <FeaturesSection />

      {/* How It Works Section */}
      <HowItWorksSection />

      {/* Pricing Section */}
      <PricingSection />

      {/* CTA Section */}
      <CTASection />
    </div>
  );
}
