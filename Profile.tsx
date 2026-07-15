import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";
import { toast } from "sonner";
import { Calendar, Mail, Phone, Lock, User } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import heroVilla from "@/assets/hero-villa.jpg";

const Profile = () => {
  const { user, updateProfile, changePassword } = useAuth();
  const [phone, setPhone] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setPhone(user?.phone || "");
  }, [user]);

  const savePhone = async () => {
    if (!user) return;
    setSaving(true);
    const ok = await updateProfile({ phone });
    setSaving(false);
    if (ok) toast.success("Nomor telepon disimpan");
  };

  const doChangePassword = async () => {
    if (!user) return;
    if (!oldPassword || !newPassword) {
      toast.error("Isi password lama dan baru");
      return;
    }
    setSaving(true);
    const ok = await changePassword(oldPassword, newPassword);
    setSaving(false);
    if (ok) {
      setOldPassword("");
      setNewPassword("");
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="grid gap-8 lg:grid-cols-[minmax(360px,460px)_1fr] items-start">
          <div className="space-y-6">
            <div className="sticky top-24 space-y-6">
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl border border-amber-200 p-8 shadow-lg">
                <div className="mb-6">
                  <p className="text-sm uppercase tracking-[0.2em] text-amber-700 font-semibold mb-2">
                    Profil Anda
                  </p>
                  <h1 className="text-3xl font-bold text-amber-900">
                    {user.name}
                  </h1>
                  <p className="mt-3 text-sm text-amber-700">{user.email}</p>
                </div>

                <div className="space-y-3 pt-6 border-t border-amber-200">
                  {user.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-amber-600" />
                      <span className="text-sm text-amber-800">
                        {user.phone}
                      </span>
                    </div>
                  )}
                  {user.created_at && (
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-amber-600" />
                      <span className="text-sm text-amber-800">
                        Member sejak{" "}
                        {format(new Date(user.created_at), "d MMMM yyyy", {
                          locale: id,
                        })}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-3xl overflow-hidden shadow-lg border border-border h-[300px]">
                <img
                  src={heroVilla}
                  alt="Villa D'Villa Moda"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <Card className="rounded-3xl border border-border p-8 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="rounded-2xl bg-amber-100 p-3 text-amber-700">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
                    Informasi Akun
                  </p>
                  <h2 className="text-2xl font-bold text-foreground">
                    Kelola profil dan password
                  </h2>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-2xl border border-border bg-muted/40 p-5">
                  <div className="flex items-center gap-2 mb-4 text-sm font-semibold text-foreground">
                    <Mail className="w-4 h-4 text-primary" />
                    Detail akun
                  </div>
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <div className="grid grid-cols-[72px_1fr] items-start gap-2">
                      <span className="font-medium text-foreground">Nama:</span>
                      <span className="font-medium text-foreground text-right sm:text-left">
                        {user.name || "-"}
                      </span>
                    </div>
                    <div className="grid grid-cols-[72px_1fr] items-start gap-2">
                      <span className="font-medium text-foreground">
                        Email:
                      </span>
                      <span className="font-medium text-foreground break-all text-right sm:text-left">
                        {user.email || "-"}
                      </span>
                    </div>
                    <div className="grid grid-cols-[72px_1fr] items-start gap-2">
                      <span className="font-medium text-foreground">
                        Telepon:
                      </span>
                      <span className="font-medium text-foreground text-right sm:text-left">
                        {user.phone || phone || "-"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-muted-foreground">
                      Telepon
                    </label>
                    <Input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="mt-1"
                    />
                    <Button
                      className="mt-3"
                      onClick={savePhone}
                      disabled={saving}
                    >
                      Simpan Nomor Telepon
                    </Button>
                  </div>

                  <div className="rounded-2xl border border-border p-4">
                    <div className="flex items-center gap-2 mb-3 text-sm font-semibold text-foreground">
                      <Lock className="w-4 h-4 text-primary" />
                      Ubah password
                    </div>
                    <Input
                      placeholder="Password lama"
                      type="password"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      className="mt-1"
                    />
                    <Input
                      placeholder="Password baru"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="mt-2"
                    />
                    <Button
                      className="mt-3"
                      onClick={doChangePassword}
                      disabled={saving}
                    >
                      Ganti Password
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
