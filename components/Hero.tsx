import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Check,
  Star,
  Wifi,
  Flame,
  Clock,
  Car,
  Snowflake,
  Mountain,
  UtensilsCrossed,
  MapPin,
  Tv,
  Waves,
  LucideIcon,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface VillaPricing {
  weekend_price: number;
  weekday_price: number;
}

interface VillaFacility {
  id_villa_facilities: string;
  name: string;
  description: string | null;
  icon_name: string | null;
  category: string;
  is_active: boolean;
  display_order: number;
}

const iconMap: Record<string, LucideIcon> = {
  Wifi,
  Flame,
  Clock,
  Car,
  Snowflake,
  Mountain,
  UtensilsCrossed,
  MapPin,
  Tv,
  Waves,
  Star,
  Check,
};

const heroImage = "/images/blog/hero-villa.jpg";
const galleryImages = [
  "/images/blog/bedroom-aesthetic.jpg",
  "/images/blog/dvillamoda-staycation-puncak.jpg",
  "/images/blog/bbq-area.jpg",
  "/images/blog/PuncakBogor.jpg",
  "/images/blog/foto_Puncak.jpg",
  "/images/blog/Gunungmas.jpg",
];

const defaultFacilities = [
  { icon: Snowflake, label: "AC" },
  { icon: Wifi, label: "WiFi" },
  { icon: Flame, label: "Area BBQ" },
  { icon: Clock, label: "Layanan 24 Jam" },
  { icon: Car, label: "Parkir" },
];

export const Hero = () => {
  const [pricing, setPricing] = useState<VillaPricing | null>(null);
  const [loadingPricing, setLoadingPricing] = useState(true);
  const [facilities, setFacilities] = useState<VillaFacility[]>([]);
  const [loadingFacilities, setLoadingFacilities] = useState(true);

  useEffect(() => {
    fetchPricing();
    fetchFacilities();
  }, []);

  const fetchPricing = async () => {
    try {
      const { data, error } = await supabase
        .from("villa_pricing")
        .select("weekend_price, weekday_price")
        .eq("villa_name", "D'VILLAMODA")
        .single();

      if (error) {
        console.error("Error fetching hero pricing:", error);
      }

      if (data) {
        setPricing(data);
      } else {
        setPricing({ weekend_price: 3500000, weekday_price: 2500000 });
      }
    } catch (err) {
      console.error("Error fetching hero pricing:", err);
      setPricing({ weekend_price: 3500000, weekday_price: 2500000 });
    } finally {
      setLoadingPricing(false);
    }
  };

  const fetchFacilities = async () => {
    try {
      const { data, error } = await supabase
        .from("villa_facilities")
        .select(
          "id_villa_facilities, name, description, icon_name, category, is_active, display_order",
        )
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (error) {
        console.error("Error fetching hero facilities:", error);
      }

      if (data) {
        setFacilities(data);
      } else {
        setFacilities([]);
      }
    } catch (err) {
      console.error("Error fetching hero facilities:", err);
      setFacilities([]);
    } finally {
      setLoadingFacilities(false);
    }
  };

  const scrollToCTA = () => {
    document
      .getElementById("contact-section")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToFacilities = () => {
    document
      .getElementById("benefits-section")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section
      id="home-section"
      style={{ scrollMarginTop: "5rem" }}
      className="relative bg-slate-50 py-16 lg:py-24"
    >
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-[2rem] bg-white shadow-[0_30px_80px_-40px_rgba(15,23,42,0.3)]">
          <div className="grid gap-8 lg:grid-cols-[1.7fr_1.3fr] items-start">
            <div className="flex flex-col overflow-hidden rounded-[2rem] bg-slate-100 p-2 sm:p-3">
              <div className="relative min-h-[60vh] overflow-hidden rounded-[1.5rem] bg-slate-200 md:min-h-[32rem] lg:min-h-[calc(100vh-8rem)]">
                <img
                  src={heroImage}
                  alt="D'Villa Moda - Staycation Puncak"
                  className="absolute inset-0 h-full w-full object-cover"
                  style={{ objectPosition: "left center" }}
                />
              </div>

              <div className="border border-slate-200 bg-white/95 px-5 py-4 sm:px-6 rounded-[1.25rem] m-4 shadow-sm">
                <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-3">
                  <div>
                    <p className="text-[0.65rem] uppercase tracking-[0.24em] text-slate-500">
                      Wisata di dekat area villa
                    </p>
                    <h2 className="text-base font-semibold text-slate-950">
                      Wisata Di Dekat Area Villa
                    </h2>
                  </div>
                </div>
                <ul className="mt-3 space-y-2 text-sm text-slate-600">
                  <li className="rounded-lg border border-slate-200 px-3 py-2">
                    Gunung Mas Tea Hills
                  </li>
                  <li className="rounded-lg border border-slate-200 px-3 py-2">
                    Taman Safari Indonesia Puncak
                  </li>
                  <li className="rounded-lg border border-slate-200 px-3 py-2">
                    Cimory Riverside
                  </li>
                </ul>
              </div>
            </div>

            <div className="space-y-6 p-6 md:p-10">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-sky-600 font-semibold">
                    D'Villa Moda
                  </p>
                  <h1 className="text-3xl font-bold text-slate-950 sm:text-4xl">
                    Villa Modern Scandinavian
                  </h1>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700">
                  <Star className="h-4 w-4 text-amber-400" />
                  Salah Satu Villa Puncak Terbaik
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-sky-100 px-3 py-1 text-sm text-sky-700">
                  Villa
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">
                  Online Check-In Available
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {galleryImages.map((src, index) => (
                  <div
                    key={index}
                    className="overflow-hidden rounded-3xl bg-slate-100"
                  >
                    <img
                      src={src}
                      alt={`Gallery ${index + 1}`}
                      className="h-28 w-full object-cover sm:h-24"
                    />
                  </div>
                ))}
              </div>

              <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5 shadow-sm">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                  Harga per malam
                </p>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
                    <p className="text-[0.65rem] uppercase tracking-[0.24em] text-slate-500">
                      Weekend
                    </p>
                    <p className="text-xl font-semibold text-slate-950 whitespace-nowrap">
                      {loadingPricing
                        ? "Loading..."
                        : pricing
                          ? `Rp\u00A0${pricing.weekend_price.toLocaleString("id-ID")}`
                          : "Rp\u00A03.500.000"}
                    </p>
                  </div>
                  <div className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
                    <p className="text-[0.65rem] uppercase tracking-[0.24em] text-slate-500">
                      Weekday
                    </p>
                    <p className="text-xl font-semibold text-slate-950 whitespace-nowrap">
                      {loadingPricing
                        ? "Loading..."
                        : pricing
                          ? `Rp\u00A0${pricing.weekday_price.toLocaleString("id-ID")}`
                          : "Rp\u00A02.500.000"}
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex justify-center">
                  <Button
                    size="lg"
                    onClick={scrollToCTA}
                    className="h-14 w-full max-w-xs rounded-2xl bg-orange-600 text-white hover:bg-orange-500"
                  >
                    Reservasi
                  </Button>
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-semibold text-slate-950">
                    Fasilitas Utama
                  </h2>
                  <button
                    type="button"
                    onClick={scrollToFacilities}
                    className="text-sm font-medium text-sky-600 hover:text-sky-700"
                  >
                    Lihat Selengkapnya →
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {(loadingFacilities ? defaultFacilities : facilities).map(
                    (facility, index) => {
                      const iconVal = facility.icon_name || facility.name;
                      const isUrl =
                        typeof iconVal === "string" &&
                        iconVal.startsWith("http");

                      return (
                        <div
                          key={(facility as any).id_villa_facilities ?? index}
                          className="flex items-center gap-3 rounded-3xl border border-slate-200 bg-white px-4 py-3"
                        >
                          {isUrl ? (
                            <img
                              src={iconVal}
                              alt={facility.name}
                              className="h-5 w-5 object-contain text-sky-600"
                            />
                          ) : (iconMap as any)[iconVal] ? (
                            (() => {
                              const IconComp = (iconMap as any)[iconVal] as any;
                              return (
                                <IconComp className="h-5 w-5 text-sky-600" />
                              );
                            })()
                          ) : (
                            <Check className="h-5 w-5 text-sky-600" />
                          )}
                          <span className="text-sm text-slate-700">
                            {facility.name}
                          </span>
                        </div>
                      );
                    },
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
