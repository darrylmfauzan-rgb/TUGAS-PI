import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Gift, X } from "lucide-react";

const SESSION_KEY = "auth-user";
const PROMO_HIDE_SESSION_KEY = "promo-home-popup-hidden-session";

export const HolidayPromoPopup = () => {
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);
  const [customerName, setCustomerName] = useState<string | null>(null);

  useEffect(() => {
    try {
      const hiddenForSession = sessionStorage.getItem(PROMO_HIDE_SESSION_KEY);
      if (hiddenForSession) return;

      const rawSession = sessionStorage.getItem(SESSION_KEY);
      if (rawSession) {
        const session = JSON.parse(rawSession) as {
          name?: string;
          email?: string;
        };
        if (session?.name) {
          setCustomerName(session.name);
        }
      }
    } catch {
      // ignore invalid session
    }

    const timer = window.setTimeout(() => setVisible(true), 1500);
    return () => window.clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setClosing(true);
    window.setTimeout(() => setVisible(false), 300);
  };

  const handleDontShowAgain = () => {
    try {
      sessionStorage.setItem(PROMO_HIDE_SESSION_KEY, "true");
    } catch {
      // ignore
    }
    setClosing(true);
    window.setTimeout(() => setVisible(false), 300);
  };

  if (!visible) return null;

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 w-full max-w-sm rounded-3xl border border-primary/20 bg-white/95 p-5 shadow-2xl transition-transform duration-300 ease-out ${
        closing ? "translate-y-6 opacity-0" : "translate-y-0 opacity-100"
      }`}
      role="dialog"
      aria-label="Promo Liburan D'Villa Moda"
    >
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-primary/10 text-primary">
          <Gift className="h-6 w-6" />
        </div>
        <div className="flex-1">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                Promo Liburan
              </p>
              <h3 className="mt-2 text-lg font-bold text-foreground">
                Selamat datang{customerName ? `, ${customerName}` : "!"}
              </h3>
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="rounded-full p-2 text-muted-foreground transition hover:bg-muted/20 hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-4 rounded-[1.75rem] border border-primary/10 bg-primary/5 p-4 text-sm text-foreground">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-primary/80">
                  Promo Spesial
                </p>
                <h4 className="mt-2 text-lg font-semibold text-foreground">
                  Diskon 5% untuk reservasi 2 malam atau lebih
                </h4>
              </div>
            </div>
            <ul className="mt-3 space-y-2 text-muted-foreground">
              <li>• Diskon 5% untuk pemesanan lebih dari 2 malam.</li>
              <li>• Berlaku untuk reservasi langsung melalui website.</li>
              <li>• Nikmati kenyamanan villa modern Scandinavian.</li>
            </ul>
          </div>

          <p className="mt-5 text-sm leading-6 text-muted-foreground">
            Reservasi lebih lama berarti liburan lebih hemat.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="border-primary text-primary hover:bg-primary/5"
            >
              Tutup
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={handleDontShowAgain}
              className="bg-muted text-foreground hover:bg-muted/90"
            >
              Jangan tampil lagi untuk sesi ini
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
