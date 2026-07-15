import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";
import { useEffect, useState } from "react";

export const StickyCTA = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show sticky CTA after scrolling 500px
      setIsVisible(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = () => {
    document.getElementById('contact-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div 
      className={`fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="bg-white border-t-2 border-primary/20 shadow-2xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 hidden sm:block">
              <p className="font-semibold text-foreground">Liburan Impian Menanti Anda</p>
              <p className="text-sm text-muted-foreground">Cek ketersediaan sekarang • Respon 15 menit</p>
            </div>
            <Button 
              size="lg"
              onClick={handleClick}
              className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white px-8 h-12 shadow-lg hover:shadow-xl transition-all"
            >
              <Phone className="w-5 h-5 mr-2" />
              <span className="font-semibold">Pesan Sekarang</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
