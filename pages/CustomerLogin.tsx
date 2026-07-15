import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import heroVilla from "@/assets/hero-villa.jpg";

const CustomerLogin = () => {
  const {
    user,
    bookings,
    bookingsLoading,
    login,
    register,
    logout,
    resetPassword,
    updateProfile,
  } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "register" | "forgot">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [editPhone, setEditPhone] = useState("");
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !phone || !password || !confirmPassword) {
      toast.error("Semua kolom perlu diisi.");
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
    if (password !== confirmPassword) {
      toast.error("Password dan konfirmasi tidak cocok.");
      return;
    }
    if (password.length < 6) {
      toast.error("Password minimal 6 karakter.");
      return;
    }

    setIsLoading(true);
    const success = await register(name, email, password, phone);
    setIsLoading(false);

    if (success) {
      setName("");
      setEmail("");
      setPhone("");
      setPassword("");
      setConfirmPassword("");
      navigate("/");
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("Email dan password wajib diisi.");
      return;
    }

    setIsLoading(true);
    try {
      const adminUser = import.meta.env.VITE_ADMIN_USER || "admin123";
      const adminPass = import.meta.env.VITE_ADMIN_PASS || "admin123";
      if (email === adminUser && password === adminPass) {
        localStorage.setItem("admin-auth", "true");
        toast.success("Login admin berhasil!");
        navigate("/admin/dashboard");
        return;
      }

      const success = await login(email, password);
      if (success) {
        setEmail("");
        setPassword("");
        navigate("/");
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error("Gagal login. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgot = async () => {
    if (!email) {
      toast.error("Masukkan email untuk mereset password.");
      return;
    }
    if (!newPassword) {
      toast.error("Masukkan password baru.");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Password minimal 6 karakter.");
      return;
    }

    setIsLoading(true);
    const success = await resetPassword(email, newPassword);
    setIsLoading(false);

    if (success) {
      setNewPassword("");
      setPassword("");
      setConfirmPassword("");
      setMode("login");
    }
  };

  const handleLogout = async () => {
    await logout();
    setEmail("");
    setPassword("");
    setName("");
  };

  const handlePhoneUpdate = async () => {
    if (!user) return;
    if (!editPhone) {
      toast.error("Masukkan nomor telepon baru.");
      return;
    }
    if (!/^[0-9]+$/.test(editPhone)) {
      toast.error("Nomor telepon hanya boleh berisi angka.");
      return;
    }
    if (editPhone.length > 13) {
      toast.error("Nomor telepon maksimal 13 digit.");
      return;
    }

    const success = await updateProfile({ phone: editPhone });
    if (success) {
      setIsEditingPhone(false);
    }
  };

  useEffect(() => {
    const isAdmin = localStorage.getItem("admin-auth") === "true";
    if (isAdmin && email && password) {
      // Hanya redirect admin bila ada kredensial yang dievaluasi.
      navigate("/admin/dashboard");
    } else {
      localStorage.removeItem("admin-auth");
      if (user) {
        navigate("/");
      }
    }
  }, [navigate, user, email, password]);

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <Navbar />
      <main className="mx-auto flex min-h-screen max-w-5xl items-center justify-center px-4 py-16">
        <div className="grid w-full gap-6 lg:grid-cols-[minmax(340px,420px)_320px] items-center">
          <div className="space-y-6 max-h-[calc(100vh-8rem)] overflow-auto">
            <div className="bg-card rounded-3xl border border-border p-8 shadow-lg max-h-[calc(100vh-9rem)] overflow-auto">
              <div className="mb-8">
                <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground mb-2">
                  Login Customer
                </p>
                <h1 className="text-3xl font-bold text-foreground">
                  {mode === "register"
                    ? "Daftar akun baru"
                    : mode === "forgot"
                      ? "Reset password"
                      : "Masuk dan mulai reservasi villa kami"}
                </h1>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {mode === "register"
                    ? "Buat akun baru untuk melakukan reservasi"
                    : mode === "forgot"
                      ? "Masukkan email dan password baru untuk mereset akun"
                      : "Gunakan email dan password Anda untuk mengakses website"}
                </p>
              </div>

              {!user ? (
                <div className="space-y-4">
                  {mode === "register" && (
                    <>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Nama Lengkap
                        </label>
                        <Input
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Nama Anda"
                          disabled={isLoading}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Nomor Telepon (WhatsApp)
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
                    </>
                  )}

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

                  {mode !== "forgot" && (
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Password
                      </label>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Password Anda"
                          disabled={isLoading}
                          className="pr-12"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((s) => !s)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                          aria-label={
                            showPassword
                              ? "Sembunyikan password"
                              : "Tampilkan password"
                          }
                        >
                          {showPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  {mode === "register" && (
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Konfirmasi Password
                      </label>
                      <div className="relative">
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Ulangi password"
                          disabled={isLoading}
                          className="pr-12"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword((s) => !s)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                          aria-label={
                            showConfirmPassword
                              ? "Sembunyikan konfirmasi password"
                              : "Tampilkan konfirmasi password"
                          }
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  {mode === "forgot" && (
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Password Baru
                      </label>
                      <div className="relative">
                        <Input
                          type={showNewPassword ? "text" : "password"}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Password baru"
                          disabled={isLoading}
                          className="pr-12"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword((s) => !s)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                          aria-label={
                            showNewPassword
                              ? "Sembunyikan password baru"
                              : "Tampilkan password baru"
                          }
                        >
                          {showNewPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <button
                      type="button"
                      onClick={
                        mode === "register"
                          ? handleRegister
                          : mode === "forgot"
                            ? handleForgot
                            : handleLogin
                      }
                      disabled={isLoading}
                      className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading
                        ? "Memproses..."
                        : mode === "register"
                          ? "Daftar"
                          : mode === "forgot"
                            ? "Reset Password"
                            : "Login"}
                    </button>
                    <div className="space-x-2 text-sm text-muted-foreground">
                      {mode === "login" && (
                        <>
                          <button
                            type="button"
                            onClick={() => setMode("forgot")}
                            disabled={isLoading}
                            className="text-primary hover:underline disabled:opacity-50"
                          >
                            Lupa password?
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setMode("register");
                              setPassword("");
                              setConfirmPassword("");
                            }}
                            disabled={isLoading}
                            className="text-primary hover:underline disabled:opacity-50"
                          >
                            Belum punya akun?
                          </button>
                          {/* Ubah Nomor Telepon dipindah ke halaman Profil */}
                        </>
                      )}

                      {mode === "register" && (
                        <button
                          type="button"
                          onClick={() => {
                            setMode("login");
                            setPassword("");
                            setConfirmPassword("");
                          }}
                          disabled={isLoading}
                          className="text-primary hover:underline disabled:opacity-50"
                        >
                          Sudah punya akun?
                        </button>
                      )}

                      {mode === "forgot" && (
                        <button
                          type="button"
                          onClick={() => {
                            setMode("login");
                            setNewPassword("");
                          }}
                          disabled={isLoading}
                          className="text-primary hover:underline disabled:opacity-50"
                        >
                          Kembali ke login
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="rounded-3xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-8">
                    <p className="text-sm text-amber-700 font-semibold uppercase tracking-wide">
                      Selamat datang
                    </p>
                    <h2 className="mt-3 text-3xl font-bold text-amber-900">
                      {user.name}
                    </h2>
                    <p className="mt-2 text-sm text-amber-700">{user.email}</p>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="mt-6 w-full rounded-lg border border-amber-300 bg-white px-4 py-2 text-sm font-medium text-amber-900 transition hover:bg-amber-50"
                    >
                      Logout
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate("/")}
                      className="mt-3 w-full rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-amber-700"
                    >
                      Menuju Home
                    </button>
                  </div>

                  {/* bookings preview removed to avoid build-time parsing issues */}
                </div>
              )}
            </div>
          </div>

          <div className="hidden lg:block rounded-[2rem] border border-border bg-card shadow-xl overflow-hidden h-[32rem]">
            <div className="h-full w-full overflow-hidden rounded-[2rem] bg-slate-100 transition-transform duration-300 hover:scale-105">
              <img
                src={heroVilla}
                alt="Villa D'Villa Moda"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CustomerLogin;
