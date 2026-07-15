import { Button } from "@/components/ui/button";
import { Instagram, MapPin, Phone } from "lucide-react";

export const ContactMenuSection = () => {
  const openWhatsApp = () => {
    window.open(
      "https://wa.me/6281110111839?text=Halo%20D'VILLAMODA!%20Saya%20ingin%20bertanya%20tentang%20villa.",
      "_blank",
    );
  };

  const openInstagram = () => {
    window.open(
      "https://www.instagram.com/dvillamoda?igsh=Nmd5MDJtbDd1dm5h/",
      "_blank",
    );
  };

  const openGoogleMaps = () => {
    window.open(
      "https://www.google.com/maps/place/D'Villa+Moda/@-6.6948527,106.9619448,17z/data=!4m16!1m9!3m8!1s0x2e69b70068d55c4d:0x9de560dc391725a0!2sD'Villa+Moda!8m2!3d-6.694858!4d106.9645197!9m1!1b1!16s%2Fg%2F11x9817_s0!3m5!1s0x2e69b70068d55c4d:0x9de560dc391725a0!8m2!3d-6.694858!4d106.9645197!16s%2Fg%2F11x9817_s0?entry=ttu&g_ep=EgoyMDI2MDYyOS4wIKXMDSoASAFQAw%3D%3D",
      "_blank",
    );
  };

  return (
    <section className="pt-2 pb-6 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="rounded-[2rem] border border-primary/10 bg-white/90 p-5 shadow-xl backdrop-blur-xl lg:p-7 -mt-6 lg:-mt-10">
          <div className="grid gap-6 lg:grid-cols-[minmax(280px,1fr)_1.3fr] items-start">
            <div className="space-y-4">
              <span className="inline-flex rounded-full bg-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                Kontak & Lokasi Kami
              </span>
              <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
                Hubungi kami dengan aman dan mudah.
              </h2>
              <p className="max-w-xl text-muted-foreground">
                Pilih cara terbaik untuk berbicara dengan tim D'Villa Moda.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 self-center">
              <Button
                type="button"
                variant="outline"
                onClick={openWhatsApp}
                className="h-14 border-primary/20 bg-primary/5 text-primary hover:bg-primary/10"
              >
                <Phone className="w-5 h-5 mr-2" />
                WhatsApp
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={openInstagram}
                className="h-14 border-primary/20 bg-primary/5 text-primary hover:bg-primary/10"
              >
                <Instagram className="w-5 h-5 mr-2" />
                Instagram
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={openGoogleMaps}
                className="h-14 border-primary/20 bg-primary/5 text-primary hover:bg-primary/10"
              >
                <MapPin className="w-5 h-5 mr-2" />
                Google Maps
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
