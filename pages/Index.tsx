import { Navbar } from "@/components/Navbar";
import { SectionTabs } from "@/components/SectionTabs";
import { Hero } from "@/components/Hero";
import { TransformationSection } from "@/components/TransformationSection";
import { BenefitsSection } from "@/components/BenefitsSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { BlogPreviewSection } from "@/components/BlogPreviewSection";
import { FAQSection } from "@/components/FAQSection";
import { ContactMenuSection } from "@/components/ContactMenuSection";
import { HolidayPromoPopup } from "@/components/HolidayPromoPopup";
import { FinalCTA } from "@/components/FinalCTA";
import { StickyCTA } from "@/components/StickyCTA";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <SectionTabs />
      <div className="lg:pl-56">
        <Hero />
        <ContactMenuSection />
        <TransformationSection />
        <BenefitsSection />
        <TestimonialsSection />
        <BlogPreviewSection />
        <FAQSection />
        <FinalCTA />
        <StickyCTA />
      </div>
      <HolidayPromoPopup />
    </div>
  );
};

export default Index;
