import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminNavbar } from "@/pages/AdminNavbar";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import {
  Calendar,
  Users,
  Home,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface BookingStats {
  total: number;
  pending: number;
  confirmed: number;
  canceled: number;
  lastCanceledDate?: string | null;
  completed: number;
}

interface CustomerStats {
  total: number;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [bookingStats, setBookingStats] = useState<BookingStats>({
    total: 0,
    pending: 0,
    confirmed: 0,
    canceled: 0,
    lastCanceledDate: null,
    completed: 0,
  });
  const [customerStats, setCustomerStats] = useState<CustomerStats>({
    total: 0,
  });
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  useEffect(() => {
    const isAdmin = localStorage.getItem("admin-auth") === "true";
    if (!isAdmin) {
      navigate("/admin/login");
      return;
    }

    fetchStats();
  }, [navigate, selectedDate]);

  const fetchStats = async () => {
    try {
      // Simpler approach: fetch all bookings rows and compute counts client-side.
      const { data: bookings, error: bookingsError } = await supabase
        .from("bookings")
        .select("*")
        .order("created_at", { ascending: false });

      if (bookingsError) throw bookingsError;

      // Filter bookings by selected month
      const startOfMonth = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        1,
      );
      const endOfMonth = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth() + 1,
        0,
        23,
        59,
        59,
      );

      const rows = bookings || [];
      const filteredRows = rows.filter((booking: any) => {
        const bookingDate = new Date(booking.created_at);
        return bookingDate >= startOfMonth && bookingDate <= endOfMonth;
      });

      const total = filteredRows.length;
      const pending = filteredRows.filter(
        (r: any) => r.status === "pending",
      ).length;
      const confirmed = filteredRows.filter(
        (r: any) => r.status === "confirmed",
      ).length;
      const completed = filteredRows.filter(
        (r: any) => r.status === "completed",
      ).length;
      const canceled = filteredRows.filter(
        (r: any) => r.status === "cancelled",
      ).length;
      let lastCanceledDate: string | null = null;
      const canceledRows = filteredRows.filter(
        (r: any) => r.status === "cancelled",
      );
      if (canceledRows.length > 0) {
        const dates = canceledRows
          .map((r: any) => r.cancelled_at || r.updated_at || r.created_at)
          .filter(Boolean)
          .map((d: string) => new Date(d));
        const latest = new Date(
          Math.max(...dates.map((d: Date) => d.getTime())),
        );
        lastCanceledDate = latest.toISOString();
      }

      setBookingStats({
        total,
        pending,
        confirmed,
        completed,
        canceled,
        lastCanceledDate,
      });

      // Fetch customer stats from Supabase
      const { data: customers, error: customerError } = await supabase
        .from("customers")
        .select("id_customers", { count: "exact" });
      if (customerError) throw customerError;
      setCustomerStats({ total: customers?.length || 0 });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({
    icon: Icon,
    title,
    value,
    subtitle,
  }: {
    icon: React.ReactNode;
    title: string;
    value: number;
    subtitle?: string;
  }) => (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground mb-1">{title}</p>
          <p className="text-3xl font-bold text-foreground">{value}</p>
          {subtitle && (
            <p className="text-xs text-muted-foreground mt-2">{subtitle}</p>
          )}
        </div>
        <div className="text-primary/20">{Icon}</div>
      </div>
    </Card>
  );

  const handlePreviousMonth = () => {
    setSelectedDate(
      new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1),
    );
  };

  const handleNextMonth = () => {
    setSelectedDate(
      new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1),
    );
  };

  const monthYear = selectedDate.toLocaleDateString("id-ID", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-slate-300">
      <AdminNavbar />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Dashboard Admin
          </h1>
          <p className="text-muted-foreground">
            Ringkasan statistik dan aktivitas villa Anda
          </p>
        </div>

        {/* Month Picker */}
        <div className="mb-8 bg-white rounded-lg p-4 flex items-center justify-between shadow-sm">
          <button
            onClick={handlePreviousMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-1">Filter Bulan</p>
            <h2 className="text-xl font-semibold text-foreground capitalize">
              {monthYear}
            </h2>
          </div>
          <button
            onClick={handleNextMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-foreground" />
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
            <StatCard
              icon={<Calendar className="w-8 h-8" />}
              title="Total Reservasi"
              value={bookingStats.total}
              subtitle="Semua reservasi"
            />
            <StatCard
              icon={<TrendingUp className="w-8 h-8" />}
              title="Menunggu Konfirmasi"
              value={bookingStats.pending}
              subtitle="Perlu action"
            />
            <StatCard
              icon={<Calendar className="w-8 h-8" />}
              title="Terkonfirmasi"
              value={bookingStats.confirmed}
              subtitle="Sudah dikonfirmasi"
            />
            <StatCard
              icon={<Calendar className="w-8 h-8" />}
              title="Dibatalkan"
              value={bookingStats.canceled}
              subtitle={
                bookingStats.lastCanceledDate
                  ? `Terakhir: ${new Date(bookingStats.lastCanceledDate).toLocaleDateString("id-ID")}`
                  : "Belum ada pembatalan"
              }
            />
            <StatCard
              icon={<Users className="w-8 h-8" />}
              title="Customer Terdaftar"
              value={customerStats.total}
              subtitle="Total akun customer"
            />
          </div>
        )}

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Pengaturan
            </h2>
            <div className="space-y-2">
              <a
                href="/admin/bookings"
                className="block p-3 rounded-lg hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
              >
                → Reservasi
              </a>
              <a
                href="/admin/guests"
                className="block p-3 rounded-lg hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
              >
                → Customer
              </a>
              <a
                href="/admin/villas"
                className="block p-3 rounded-lg hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
              >
                → Kelola Villa
              </a>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Info Admin
            </h2>
            <div className="space-y-4 text-sm text-muted-foreground">
              <div className="grid gap-2">
                <div className="flex justify-between">
                  <span>Aplikasi:</span>
                  <span className="font-medium text-foreground">
                    D'Villa Moda Admin
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Versi:</span>
                  <span className="font-medium text-foreground">1.0.0</span>
                </div>
                <div className="flex justify-between">
                  <span>Database:</span>
                  <span className="font-medium text-foreground">Supabase</span>
                </div>
              </div>
              <div className="border-t border-border pt-4">
                <div className="text-sm text-muted-foreground mb-2">
                  Kredensial Admin
                </div>
                <div className="space-y-2 text-sm text-foreground">
                  <div className="flex justify-between">
                    <span>Email/Username:</span>
                    <span className="font-medium">admin123</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Password:</span>
                    <span className="font-medium">admin123</span>
                  </div>
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  Untuk mengubah kredensial, hubungi developer
                </p>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
