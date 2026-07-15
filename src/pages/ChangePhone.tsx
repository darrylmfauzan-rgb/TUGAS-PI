import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Navbar } from "@/components/Navbar";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import heroVilla from "@/assets/hero-villa.jpg";
import bedroomAesthetic from "@/assets/bedroom-aesthetic.jpg";

const ChangePhone = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChangePhone = async () => {
    if (!email) {
      toast.error("Masukkan email terdaftar.");
      return;
    }
    if (!phone) {
      toast.error("Masukkan nomor telepon baru.");
      return;
    }
    if (!/^[0-9]+$/.test(phone)) {
      toast.error("Nomor telepon hanya boleh berisi angka.");
      return;
    }
    if (phone.length > 13) {
      toast.error("Nomor telepon maksimal 13 digit.");
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("customers")
        .update({ phone })
        .eq("email", email.toLowerCase())
        .select("id_customers");

      if (error) {
        throw error;
      }

      if (!data || data.length === 0) {
        toast.error("Email tidak ditemukan. Pastikan email terdaftar.");
        return;
      }

      toast.success("Nomor telepon berhasil diperbarui.");
      setEmail("");
      setPhone("");
      navigate("/login");
    } catch (err) {
      console.error("Change phone error:", err);
      toast.error("Gagal mengganti nomor telepon. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <Navbar />
      <main className="mx-auto flex min-h-screen max-w-5xl items-center justify-center px-4 py-16">
        <div className="grid w-full gap-6 lg:grid-cols-[minmax(340px,420px)_240px] items-center">
          <div className="space-y-6 max-h-[calc(100vh-8rem)] overflow-hidden">
            <div className="bg-card rounded-3xl border border-border p-8 shadow-lg max-h-[calc(100vh-9rem)] overflow-hidden">
              <div className="mb-8">
                <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground mb-2">
                  Ganti Nomor Telepon
                </p>
                <h1 className="text-3xl font-bold text-foreground">
                  Masukkan email terdaftar dan nomor telepon baru
                </h1>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  Sama seperti halaman lupa password. Isi email yang sudah
                  terdaftar di Supabase.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Email
                  </label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@contoh.com"
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Nomor Telepon Baru
                  </label>
                  <Input
                    value={phone}
                    inputMode="numeric"
                    maxLength={13}
                    onChange={(e) => {
                      const value = e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 13);
                      setPhone(value);
                    }}
                    placeholder="08xxxxxxxxxx"
                    disabled={isLoading}
                  />
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <button
                    type="button"
                    onClick={handleChangePhone}
                    disabled={isLoading}
                    className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? "Memproses..." : "Simpan Nomor Telepon"}
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate("/login")}
                    className="inline-flex items-center justify-center rounded-full border border-border bg-white px-6 py-3 text-sm font-semibold text-foreground transition hover:bg-slate-100"
                  >
                    Kembali ke login
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="hidden lg:grid grid-cols-2 gap-4 rounded-[2rem] border border-border bg-card shadow-xl overflow-hidden lg:block h-[28rem]">
            <div className="overflow-hidden rounded-[2rem] bg-slate-100 transition-transform duration-300 hover:scale-105">
              <img
                src={heroVilla}
                alt="Villa D'Villa Moda"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="overflow-hidden rounded-[2rem] bg-slate-100 transition-transform duration-300 hover:scale-105">
              <img
                src={bedroomAesthetic}
                alt="Bedroom aesthetic"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ChangePhone;
