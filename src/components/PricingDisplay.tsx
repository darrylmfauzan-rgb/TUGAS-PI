import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface VillaPricing {
  weekend_price: number;
  weekday_price: number;
}

export const PricingDisplay = () => {
  const [pricing, setPricing] = useState<VillaPricing | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPricing();
  }, []);

  const fetchPricing = async () => {
    try {
      const { data, error } = await supabase
        .from("villa_pricing")
        .select("weekend_price, weekday_price")
        .eq("villa_name", "D'VILLAMODA")
        .single();

      if (data) {
        setPricing(data);
      }
    } catch (err) {
      console.error("Error fetching pricing:", err);
      // Fallback to default prices
      setPricing({
        weekend_price: 3500000,
        weekday_price: 2500000,
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!pricing) {
    return null;
  }

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-center mb-8">HARGA PER MALAM</h3>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Weekend Price */}
        <div className="rounded-2xl border-2 border-blue-200 bg-blue-50 p-6 text-center">
          <p className="text-sm uppercase tracking-wider text-blue-600 font-semibold mb-2">
            Weekend
          </p>
          <p className="text-4xl font-bold text-blue-900 mb-1 whitespace-nowrap">
            {"Rp\u00A0"}
            {pricing.weekend_price.toLocaleString("id-ID")}
          </p>
          <p className="text-xs text-blue-700">Jumat - Minggu</p>
        </div>

        {/* Weekday Price */}
        <div className="rounded-2xl border-2 border-orange-200 bg-orange-50 p-6 text-center">
          <p className="text-sm uppercase tracking-wider text-orange-600 font-semibold mb-2">
            Weekday
          </p>
          <p className="text-4xl font-bold text-orange-900 mb-1 whitespace-nowrap">
            {"Rp\u00A0"}
            {pricing.weekday_price.toLocaleString("id-ID")}
          </p>
          <p className="text-xs text-orange-700">Senin - Kamis</p>
        </div>
      </div>

      <p className="text-sm text-muted-foreground text-center italic">
        Harga dapat berubah sesuai musim dan ketersediaan
      </p>
    </div>
  );
};
