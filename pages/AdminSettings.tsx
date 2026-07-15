import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AdminNavbar } from "@/pages/AdminNavbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const AdminSettings = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const isAdmin = localStorage.getItem("admin-auth") === "true";
    if (!isAdmin) {
      navigate("/admin/login");
      return;
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-slate-300">
      <AdminNavbar />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Pengaturan Admin
          </h1>
          <p className="text-muted-foreground">
            Kelola pengaturan aplikasi admin
          </p>
        </div>

        <div className="grid gap-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-foreground mb-2">
              Informasi Sistem
            </h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Aplikasi:</span>
                <span className="font-medium">D'Villa Moda Admin</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Versi:</span>
                <span className="font-medium">1.0.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Database:</span>
                <span className="font-medium">Supabase</span>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Kredensial Admin
            </h2>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-muted-foreground">Email/Username:</p>
                <p className="font-medium">admin123</p>
              </div>
              <div>
                <p className="text-muted-foreground">Password:</p>
                <p className="font-medium">admin123</p>
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                Untuk mengubah kredensial, hubungi developer
              </p>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AdminSettings;
