
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { CTA } from "@/components/landing/CTA";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";

export default function HomePage() {
  return (
    <div className="bg-background">
      <Header />
      <main>
        <Hero />
        <Features />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
