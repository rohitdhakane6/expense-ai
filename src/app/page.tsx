import { FeaturesSection, Footer, HeroSection } from "@/components/landing";
import { Navbar } from "@/components/landing/navbar";

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
      </main>
      <Footer />
    </div>
  );
}
