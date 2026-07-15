import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Calendar,
  Phone,
  Mail,
  Instagram,
  Loader2,
  CheckCircle,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { z } from "zod";
import BlockedCalendar from "@/components/BlockedCalendar";

const bookingSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Nama wajib diisi")
    .max(100, "Nama maksimal 100 karakter"),
  email: z
    .string()
    .trim()
    .email("Format email tidak valid")
    .max(255, "Email maksimal 255 karakter"),
  phone: z
    .string()
    .trim()
    .min(8, "Nomor telepon minimal 8 digit")
    .max(20, "Nomor telepon maksimal 20 digit"),
  checkIn: z.string().min(1, "Tanggal check-in wajib diisi"),
  checkOut: z.string().min(1, "Tanggal check-out wajib diisi"),
  guests: z
    .string()
    .min(1, "Jumlah customer wajib diisi")
    .refine(
      (value) => /^[0-9]+$/.test(value) && Number(value) >= 1,
      "Jumlah customer harus berupa angka minimal 1",
    ),
  specialRequests: z
    .string()
    .max(500, "Permintaan khusus maksimal 500 karakter")
    .optional(),
});

export const FinalCTA = () => {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    checkIn: "",
    checkOut: "",
    guests: "",
    specialRequests: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [blockedRanges, setBlockedRanges] = useState<
    Array<{
      check_in_date: string;
      check_out_date: string;
      status: string;
      created_at: string;
    }>
  >([]);

  const cancelExpiredPendingBookings = async () => {
    try {
      const expiredAt = new Date(Date.now() - 60 * 60 * 1000).toISOString();
      const { error } = await supabase
        .from("bookings")
        .update({ status: "cancelled" })
        .eq("status", "pending")
        .lt("created_at", expiredAt);
      if (error) throw error;
    } catch (err) {
      console.error(
        "Gagal membatalkan reservasi pending yang kedaluwarsa:",
        err,
      );
    }
  };

  // Update form when user changes
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        name: "",
        email: "",
        phone: "",
      }));
    }
  }, [user]);

  const validateForm = () => {
    try {
      bookingSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const isDateInBlockedRange = (date: Date) => {
    return blockedRanges.some((b) => {
      const start = new Date(b.check_in_date);
      const end = new Date(b.check_out_date);
      return date >= start && date < end;
    });
  };

  const doesRangeOverlapBlocked = (startDate: Date, endDate: Date) => {
    return blockedRanges.some((b) => {
      const start = new Date(b.check_in_date);
      const end = new Date(b.check_out_date);
      return !(end <= startDate || start >= endDate);
    });
  };

  const checkSelectionOverlap = () => {
    if (!formData.checkIn || !formData.checkOut) return false;
    const requestedStart = new Date(formData.checkIn);
    const requestedEnd = new Date(formData.checkOut);
    const overlaps = doesRangeOverlapBlocked(requestedStart, requestedEnd);

    if (overlaps) {
      setErrors((prev) => ({
        ...prev,
        checkIn:
          "Tanggal yang dipilih overlap dengan booking terkonfirmasi atau sedang dalam masa grace period 1 jam",
        checkOut:
          "Tanggal yang dipilih overlap dengan booking terkonfirmasi atau sedang dalam masa grace period 1 jam",
      }));
    } else {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy.checkIn;
        delete copy.checkOut;
        return copy;
      });
    }

    return overlaps;
  };

  useEffect(() => {
    if (!formData.checkIn || !formData.checkOut) return;
    checkSelectionOverlap();
  }, [formData.checkIn, formData.checkOut, blockedRanges]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Mohon periksa kembali data yang diisi");
      return;
    }

    // Validate dates
    const checkInDate = new Date(formData.checkIn);
    const checkOutDate = new Date(formData.checkOut);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (
      Number.isNaN(checkInDate.getTime()) ||
      Number.isNaN(checkOutDate.getTime())
    ) {
      toast.error("Tanggal reservasi tidak valid");
      return;
    }

    if (checkInDate < today) {
      toast.error("Tanggal check-in tidak boleh di masa lalu");
      return;
    }

    if (checkOutDate <= checkInDate) {
      toast.error("Tanggal check-out harus setelah tanggal check-in");
      return;
    }

    setIsSubmitting(true);

    try {
      // Check overlap with confirmed or DP bookings
      await cancelExpiredPendingBookings();

      const { data: reserved, error: fetchErr } = await supabase
        .from("bookings")
        .select("check_in_date,check_out_date,created_at,status")
        .in("status", ["pending", "confirmed", "dp"]);

      if (fetchErr) throw fetchErr;

      const requestedStart = new Date(formData.checkIn);
      const requestedEnd = new Date(formData.checkOut);
      const now = new Date();

      const overlaps = (reserved || []).some((b: any) => {
        const start = new Date(b.check_in_date);
        const end = new Date(b.check_out_date);
        const status = b.status;

        if (status === "pending") {
          const createdAt = new Date(b.created_at);
          const graceEnd = new Date(createdAt.getTime() + 60 * 60 * 1000);
          if (now >= graceEnd) {
            return false;
          }
        }

        return !(end <= requestedStart || start >= requestedEnd);
      });

      if (overlaps) {
        toast.error(
          "Tanggal yang dipilih sudah terisi atau sedang dalam grace period 1 jam. Silakan pilih tanggal lain.",
        );
        setIsSubmitting(false);
        return;
      }
      // Save to database
      const guestsNumber = Number(formData.guests);
      if (Number.isNaN(guestsNumber) || guestsNumber < 1) {
        toast.error("Jumlah customer harus berupa angka minimal 1");
        setIsSubmitting(false);
        return;
      }

      const { error } = await supabase.from("bookings").insert([
        {
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          check_in_date: formData.checkIn,
          check_out_date: formData.checkOut,
          number_of_guests: guestsNumber,
          special_requests: formData.specialRequests.trim() || null,
          customer_id: null,
        },
      ]);

      if (error) throw error;

      setIsSubmitted(true);
      toast.success(
        "Reservasi berhasil dikirim! Tim kami akan menghubungi Anda segera.",
      );

      // refresh blocked ranges
      fetchBlockedRanges();

      // Create WhatsApp message
      const nights = Math.ceil(
        (checkOutDate.getTime() - checkInDate.getTime()) /
          (1000 * 60 * 60 * 24),
      );
      const message = encodeURIComponent(
        `Halo D'VILLAMODA! Saya tertarik untuk memesan villa.\n\n` +
          `Nama: ${formData.name}\n` +
          `Email: ${formData.email}\n` +
          `No. Telepon: ${formData.phone}\n` +
          `Check-in: ${formData.checkIn}\n` +
          `Check-out: ${formData.checkOut}\n` +
          `Durasi: ${nights} malam\n` +
          `Jumlah Customer: ${formData.guests} orang\n` +
          `${formData.specialRequests ? `Permintaan Khusus: ${formData.specialRequests}\n` : ""}` +
          `\nMohon informasi ketersediaan dan harga. Terima kasih!`,
      );

      // Open WhatsApp after a short delay
      setTimeout(() => {
        window.open(`https://wa.me/6281110111839?text=${message}`, "_blank");
      }, 1000);
    } catch (error: any) {
      console.error("Booking error:", error);
      toast.error(
        error?.message
          ? `Gagal mengirim reservasi: ${error.message}`
          : "Gagal mengirim reservasi. Silakan coba lagi.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const fetchBlockedRanges = async () => {
    try {
      await cancelExpiredPendingBookings();

      const { data, error } = await supabase
        .from("bookings")
        .select("check_in_date,check_out_date,created_at,status")
        .in("status", ["pending", "confirmed", "dp"])
        .order("check_in_date", { ascending: true });
      if (error) throw error;

      const now = new Date();
      const filteredRanges = (data || []).filter((b: any) => {
        if (b.status === "pending") {
          const createdAt = new Date(b.created_at);
          const graceEnd = new Date(createdAt.getTime() + 60 * 60 * 1000);
          return now < graceEnd;
        }
        return true;
      });

      setBlockedRanges(
        filteredRanges as Array<{
          check_in_date: string;
          check_out_date: string;
          status: string;
          created_at: string;
        }>,
      );
    } catch (err) {
      console.error(err);
    }
  };

  // load blocked ranges on mount
  useEffect(() => {
    fetchBlockedRanges();
  }, []);

  const handleWhatsAppDirect = () => {
    window.open(
      "https://wa.me/6281110111839?text=Halo%20D%27VILLAMODA!%20Saya%20ingin%20bertanya%20tentang%20villa.",
      "_blank",
    );
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      checkIn: "",
      checkOut: "",
      guests: "",
      specialRequests: "",
    });
    setIsSubmitted(false);
    setErrors({});
  };

  // Get today's date for min attribute
  const today = new Date().toISOString().split("T")[0];

  return (
    <section
      id="contact-section"
      className="py-20 md:py-32 bg-gradient-to-br from-primary via-primary/95 to-accent relative overflow-hidden"
    >
      {/* Decorative Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 text-white">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Jangan Tunda Lagi Liburan Impian Anda!
            </h2>
            <p className="text-xl md:text-2xl text-white/90">
              Waktunya menciptakan kenangan indah di Puncak, dalam suasana
              Modern Scandinavian yang hangat dan menenangkan. D'VILLAMODA
              menanti Anda.
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-10">
            {isSubmitted ? (
              <div className="text-center py-8">
                <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
                <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
                  Reservasi Terkirim!
                </h3>
                <p className="text-muted-foreground mb-6">
                  Terima kasih atas reservasi Anda. Tim kami akan segera
                  menghubungi Anda melalui WhatsApp atau Email untuk konfirmasi.
                </p>
                <Button
                  onClick={resetForm}
                  variant="outline"
                  className="border-2 border-primary/20 hover:bg-primary/5"
                >
                  Buat Reservasi Baru
                </Button>
              </div>
            ) : (
              <>
                <div className="text-center mb-8">
                  <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
                    Cek Ketersediaan & Harga Sekarang
                  </h3>
                  <p className="text-muted-foreground">
                    Isi form di bawah atau hubungi kami langsung via WhatsApp
                  </p>
                </div>

                {!user && (
                  <div className="mb-4 p-4 rounded-md bg-yellow-50 border border-yellow-100 text-yellow-800">
                    Reservasi terkunci — silakan{" "}
                    <Link to="/login" className="underline font-semibold">
                      masuk
                    </Link>{" "}
                    untuk mengirim reservasi.
                  </div>
                )}

                <fieldset disabled={!user}>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Nama Lengkap *
                        </label>
                        <Input
                          required
                          placeholder="Masukkan nama Anda"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          className={`h-12 ${errors.name ? "border-destructive" : ""}`}
                        />
                        {errors.name && (
                          <p className="text-destructive text-sm mt-1">
                            {errors.name}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Email *
                        </label>
                        <Input
                          required
                          type="email"
                          placeholder="email@contoh.com"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          className={`h-12 ${errors.email ? "border-destructive" : ""}`}
                        />
                        {errors.email && (
                          <p className="text-destructive text-sm mt-1">
                            {errors.email}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        No. Telepon (WhatsApp) *
                      </label>
                      <Input
                        required
                        type="tel"
                        placeholder="08xx xxxx xxxx"
                        maxLength={13}
                        inputMode="numeric"
                        value={formData.phone}
                        onChange={(e) => {
                          const value = e.target.value
                            .replace(/\D/g, "")
                            .slice(0, 13);
                          setFormData({ ...formData, phone: value });
                        }}
                        className={`h-12 ${errors.phone ? "border-destructive" : ""}`}
                      />
                      {errors.phone && (
                        <p className="text-destructive text-sm mt-1">
                          {errors.phone}
                        </p>
                      )}
                    </div>

                    <div className="grid md:grid-cols-3 gap-5">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Tanggal Check-in *
                        </label>
                        <div className="relative">
                          <Input
                            required
                            type="date"
                            min={today}
                            value={formData.checkIn}
                            onChange={(e) => {
                              setFormData({
                                ...formData,
                                checkIn: e.target.value,
                              });
                              setTimeout(() => checkSelectionOverlap(), 0);
                            }}
                            className={`h-12 ${errors.checkIn ? "border-destructive" : ""}`}
                          />
                          <Calendar className="absolute right-3 top-3 w-5 h-5 text-muted-foreground pointer-events-none" />
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Pilih tanggal yang belum diblokir oleh reservasi
                          terkonfirmasi.
                        </p>
                        {errors.checkIn && (
                          <p className="text-destructive text-sm mt-1">
                            {errors.checkIn}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Tanggal Check-out *
                        </label>
                        <div className="relative">
                          <Input
                            required
                            type="date"
                            min={formData.checkIn || today}
                            value={formData.checkOut}
                            onChange={(e) => {
                              setFormData({
                                ...formData,
                                checkOut: e.target.value,
                              });
                              setTimeout(() => checkSelectionOverlap(), 0);
                            }}
                            className={`h-12 ${errors.checkOut ? "border-destructive" : ""}`}
                          />
                          <Calendar className="absolute right-3 top-3 w-5 h-5 text-muted-foreground pointer-events-none" />
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Pastikan check-out tidak melewati tanggal yang sudah
                          diblokir.
                        </p>
                        {errors.checkOut && (
                          <p className="text-destructive text-sm mt-1">
                            {errors.checkOut}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Jumlah Customer *
                        </label>
                        <Input
                          required
                          type="number"
                          min="1"
                          max="20"
                          placeholder="Max 20"
                          value={formData.guests}
                          onChange={(e) =>
                            setFormData({ ...formData, guests: e.target.value })
                          }
                          className={`h-12 ${errors.guests ? "border-destructive" : ""}`}
                        />
                        {errors.guests && (
                          <p className="text-destructive text-sm mt-1">
                            {errors.guests}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mt-6">
                      <BlockedCalendar
                        blockedRanges={blockedRanges}
                        months={3}
                      />
                    </div>

                    <div className="mt-3 text-sm text-muted-foreground">
                      Tanggal terblokir sudah ditandai di kalender di atas.
                      <div className="mt-2 flex flex-wrap gap-2 text-xs">
                        <span className="inline-flex items-center gap-2 px-2 py-1 rounded bg-red-600 text-white">
                          <span className="w-2 h-2 rounded-full bg-white" />
                          Terisi / confirmed / DP
                        </span>
                        <span className="inline-flex items-center gap-2 px-2 py-1 rounded bg-yellow-400 text-black">
                          <span className="w-2 h-2 rounded-full bg-black" />
                          Grace period pending 1 jam
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Permintaan Khusus (Opsional)
                      </label>
                      <Textarea
                        placeholder="Contoh: Ingin kamar di lantai bawah, perayaan ulang tahun, dll."
                        value={formData.specialRequests}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            specialRequests: e.target.value,
                          })
                        }
                        className="min-h-[100px] resize-none"
                        maxLength={500}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        {formData.specialRequests.length}/500 karakter
                      </p>
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      disabled={isSubmitting || !user}
                      className="w-full bg-primary hover:bg-primary/90 text-white h-14 text-lg font-semibold rounded-xl disabled:opacity-70"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Mengirim...
                        </>
                      ) : (
                        <>
                          <Phone className="w-5 h-5 mr-2" />
                          Kirim Reservasi
                        </>
                      )}
                    </Button>
                  </form>
                </fieldset>

                {/* Contact buttons removed: contact menu available in header */}
              </>
            )}

            <p className="text-center text-sm text-muted-foreground mt-6">
              Tim kami akan merespons dalam 15 menit • Proses pemesanan 100%
              aman
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
