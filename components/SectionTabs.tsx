import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const sections = [
  { id: "home-section", label: "Home" },
  { id: "transformation-section", label: "Keunggulan" },
  { id: "benefits-section", label: "Fasilitas" },
  { id: "testimonials-section", label: "Testimoni" },
  { id: "blog-section", label: "Wisata Terdekat" },
  { id: "faq-section", label: "FAQ" },
  { id: "contact-section", label: "Reservasi" },
];

export const SectionTabs = () => {
  const [activeSection, setActiveSection] = useState(sections[0].id);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-40% 0px -55% 0px",
        threshold: 0.2,
      },
    );

    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      setActiveSection(sectionId);
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section
      className={`relative sticky top-16 z-40 bg-background/95 backdrop-blur-sm border-b border-border shadow-sm lg:fixed lg:top-16 lg:left-0 lg:h-[calc(100vh-4rem)] lg:w-56 lg:border-r lg:border-b-0 lg:shadow-none transform transition-transform duration-300 ease-in-out overflow-visible ${
        collapsed ? "lg:-translate-x-[calc(100%-3rem)]" : "lg:translate-x-0"
      }`}
    >
      <div className="h-full lg:flex lg:flex-col lg:justify-between">
        <button
          type="button"
          onClick={() => setCollapsed((s) => !s)}
          aria-label={collapsed ? "Tampilkan menu" : "Sembunyikan menu"}
          className="hidden lg:flex items-center justify-center w-9 h-9 rounded-full bg-background/90 border border-border shadow-sm absolute top-6 right-3 -translate-y-1/2 hover:bg-accent"
        >
          {collapsed ? <Menu className="w-4 h-4" /> : <X className="w-4 h-4" />}
        </button>
        <div className="container mx-auto px-4 pt-4 lg:pt-8">
          <div className="border-b border-border pb-4 mb-4 hidden lg:block">
            <h2 className="text-base font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              Menu Navigasi
            </h2>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto py-3 scrollbar-none lg:flex-col lg:overflow-y-auto lg:overflow-x-hidden lg:gap-3 lg:py-6">
            {sections.map((section) => (
              <button
                key={section.id}
                type="button"
                onClick={() => scrollToSection(section.id)}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
                  activeSection === section.id
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 ring-2 ring-primary/50"
                    : "bg-muted/10 text-muted-foreground hover:bg-muted/20"
                } lg:w-full lg:text-left lg:rounded-3xl lg:px-5 lg:py-3`}
              >
                {section.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
