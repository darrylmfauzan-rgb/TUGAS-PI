import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminNavbar } from "@/pages/AdminNavbar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format, startOfMonth, endOfMonth } from "date-fns";
import { id } from "date-fns/locale";
import {
  Calendar,
  Users,
  Mail,
  Phone,
  MessageSquare,
  Printer,
  Download,
} from "lucide-react";
import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface Booking {
  id_bookings: string;
  name: string;
  email: string;
  phone: string;
  check_in_date: string;
  check_out_date: string;
  number_of_guests: number;
  special_requests: string | null;
  status: "pending" | "confirmed" | "cancelled" | "completed" | "dp";
  total_nights: number | null;
  created_at: string;
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
  confirmed: "bg-green-100 text-green-800 border-green-300",
  cancelled: "bg-red-100 text-red-800 border-red-300",
  completed: "bg-blue-100 text-blue-800 border-blue-300",
  dp: "bg-amber-100 text-amber-800 border-amber-300",
};

const statusLabels: Record<string, string> = {
  pending: "Menunggu",
  confirmed: "Terkonfirmasi",
  cancelled: "Dibatalkan",
  completed: "Selesai",
  dp: "DP",
};

const AdminBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(
    format(new Date(), "yyyy-MM"),
  );
  const navigate = useNavigate();

  const fetchBookings = async () => {
    try {
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const bookingsByMonth = useMemo(() => {
    return bookings.reduce(
      (groups, booking) => {
        const date = new Date(booking.check_in_date || booking.created_at);
        const monthKey = format(date, "yyyy-MM", { locale: id });
        if (!groups[monthKey]) groups[monthKey] = [];
        groups[monthKey].push(booking);
        return groups;
      },
      {} as Record<string, Booking[]>,
    );
  }, [bookings]);

  const monthKeys = useMemo(
    () => Object.keys(bookingsByMonth).sort((a, b) => (a < b ? 1 : -1)),
    [bookingsByMonth],
  );

  const availableMonths = useMemo(() => {
    const months = new Set<string>();
    bookings.forEach((booking) => {
      const date = new Date(booking.check_in_date || booking.created_at);
      const monthKey = format(date, "yyyy-MM", { locale: id });
      months.add(monthKey);
    });
    return Array.from(months).sort().reverse();
  }, [bookings]);

  const handlePrintMonth = (monthKey: string) => {
    const printContent = document.getElementById(`month-report-${monthKey}`);
    if (!printContent) return;

    const monthBookings = bookingsByMonth[monthKey] || [];
    const monthTitle = format(new Date(`${monthKey}-01`), "MMMM yyyy", {
      locale: id,
    });
    const totalGuests = monthBookings.reduce(
      (sum, booking) => sum + booking.number_of_guests,
      0,
    );
    const totalConfirmed = monthBookings.filter(
      (b) => b.status === "confirmed",
    ).length;

    const printable = window.open("", "_blank", "width=900,height=700");
    if (!printable) return;

    printable.document.write(`
      <html>
        <head>
          <title>Laporan Reservasi ${monthKey}</title>
          <style>
            body { font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color:#111827; padding:24px; }
            h1 { font-size:28px; margin-bottom:8px; font-weight:bold; }
            .header { margin-bottom:24px; border-bottom:2px solid #e5e7eb; padding-bottom:16px; }
            .summary { display:flex; gap:24px; margin:16px 0; }
            .summary-item { flex:1; }
            .summary-label { font-size:12px; color:#6b7280; text-transform:uppercase; }
            .summary-value { font-size:24px; font-weight:bold; color:#111827; }
            table { width:100%; border-collapse:collapse; margin-top:16px; }
            th, td { border:1px solid #d1d5db; padding:12px; text-align:left; }
            th { background:#f3f4f6; font-weight:600; }
            tr:nth-child(even) { background:#f9fafb; }
            .badge { display:inline-flex; padding:4px 10px; border-radius:9999px; font-size:12px; font-weight:500; }
            .status-confirmed { background:#dcfce7; color:#166534; }
            .status-pending { background:#fef3c7; color:#92400e; }
            .status-cancelled { background:#fee2e2; color:#991b1b; }
            .status-completed { background:#dbeafe; color:#1e40af; }
            .footer { margin-top:32px; padding-top:16px; border-top:1px solid #e5e7eb; text-align:center; font-size:12px; color:#6b7280; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Laporan Reservasi - ${monthTitle}</h1>
            <p style="color:#6b7280; margin:8px 0;">D'Villa Moda</p>
          </div>
          
          <div class="summary">
            <div class="summary-item">
              <div class="summary-label">Total Reservasi</div>
              <div class="summary-value">${monthBookings.length}</div>
            </div>
            <div class="summary-item">
              <div class="summary-label">Terkonfirmasi</div>
              <div class="summary-value">${totalConfirmed}</div>
            </div>
            <div class="summary-item">
              <div class="summary-label">Total Customer</div>
              <div class="summary-value">${totalGuests}</div>
            </div>
          </div>

          ${printContent.innerHTML}
          
          <div class="footer">
            <p>Laporan ini dicetak pada ${format(new Date(), "d MMMM yyyy HH:mm", { locale: id })}</p>
          </div>
        </body>
      </html>
    `);
    printable.document.close();
    printable.focus();
    printable.print();
    toast.success("Laporan sedang disiapkan untuk dicetak...");
  };

  useEffect(() => {
    const isAdmin = localStorage.getItem("admin-auth") === "true";
    if (!isAdmin) {
      navigate("/admin/login");
      return;
    }
    fetchBookings();
  }, [navigate]);

  const confirmBooking = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from("bookings")
        .update({ status: "confirmed" })
        .eq("id_bookings", id)
        .select("*")
        .single();
      if (error) {
        toast.error("Gagal konfirmasi: " + error.message);
        throw error;
      }
      if (!data) {
        toast.error("Konfirmasi gagal: data tidak ditemukan.");
        return;
      }
      toast.success("Reservasi berhasil dikonfirmasi");
      await fetchBookings();
    } catch (err) {
      console.error("Failed to confirm booking:\n", err);
    }
  };

  const markBookingAsDP = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from("bookings")
        .update({ status: "dp" })
        .eq("id_bookings", id)
        .select("*")
        .single();
      if (error) {
        toast.error("Gagal mengubah status menjadi DP: " + error.message);
        throw error;
      }
      if (!data) {
        toast.error("Gagal mengubah status menjadi DP: data tidak ditemukan.");
        return;
      }
      toast.success("Status reservasi diubah menjadi DP");
      await fetchBookings();
    } catch (err) {
      console.error("Failed to set booking to DP:\n", err);
    }
  };

  const [cancelingBookingId, setCancelingBookingId] = useState<string | null>(
    null,
  );

  const cancelBooking = async () => {
    if (!cancelingBookingId) return;

    try {
      const { data, error } = await supabase
        .from("bookings")
        .update({ status: "cancelled" })
        .eq("id_bookings", cancelingBookingId)
        .select("*")
        .single();

      if (error) {
        toast.error("Gagal membatalkan reservasi: " + error.message);
        throw error;
      }
      if (!data) {
        toast.error("Reservasi tidak ditemukan.");
        return;
      }
      toast.success("Reservasi berhasil dibatalkan");
      await fetchBookings();
    } catch (err) {
      console.error("Failed to cancel booking:\n", err);
    } finally {
      setCancelingBookingId(null);
    }
  };

  const safeFormatDate = (
    dateStr: string | null | undefined,
    formatStr: string,
  ) => {
    try {
      if (!dateStr) return "-";
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return "-";
      return format(date, formatStr, { locale: id });
    } catch (err) {
      return "-";
    }
  };

  return (
    <div className="min-h-screen bg-slate-300">
      <AdminNavbar />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Data Reservasi
          </h1>
          <p className="text-muted-foreground">
            Daftar semua reservasi yang masuk
          </p>
        </div>

        {!loading && bookings.length > 0 && (
          <div className="mb-8 grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="bg-card rounded-lg border border-border p-4">
              <p className="text-sm text-muted-foreground">Total Reservasi</p>
              <p className="text-2xl font-bold text-foreground mt-1">
                {bookings.length}
              </p>
            </div>
            <div className="bg-card rounded-lg border border-border p-4">
              <p className="text-sm text-muted-foreground">Terkonfirmasi</p>
              <p className="text-2xl font-bold text-green-600 mt-1">
                {bookings.filter((b) => b.status === "confirmed").length}
              </p>
            </div>
            <div className="bg-card rounded-lg border border-border p-4">
              <p className="text-sm text-muted-foreground">
                Menunggu Konfirmasi
              </p>
              <p className="text-2xl font-bold text-yellow-600 mt-1">
                {bookings.filter((b) => b.status === "pending").length}
              </p>
            </div>
            <div className="bg-card rounded-lg border border-border p-4">
              <p className="text-sm text-muted-foreground">Dibatalkan</p>
              <p className="text-2xl font-bold text-red-600 mt-1">
                {bookings.filter((b) => b.status === "cancelled").length}
              </p>
            </div>
            <div className="bg-card rounded-lg border border-border p-4">
              <p className="text-sm text-muted-foreground">Total Customer</p>
              <p className="text-2xl font-bold text-foreground mt-1">
                {bookings.reduce((sum, b) => sum + b.number_of_guests, 0)}
              </p>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-12 bg-card rounded-lg border">
            <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              Belum ada reservasi
            </h3>
            <p className="text-muted-foreground">
              Reservasi yang masuk akan ditampilkan di sini
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {monthKeys.map((monthKey) => {
              const monthBookings = bookingsByMonth[monthKey] || [];
              const monthTitle = format(
                new Date(`${monthKey}-01`),
                "MMMM yyyy",
                { locale: id },
              );
              const totalGuests = monthBookings.reduce(
                (sum, booking) => sum + booking.number_of_guests,
                0,
              );

              return (
                <section
                  key={monthKey}
                  className="bg-card rounded-lg border border-border overflow-hidden"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between px-6 py-5 border-b border-border">
                    <div>
                      <h2 className="text-xl font-semibold text-foreground">
                        {monthTitle}
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        {monthBookings.length} reservasi • {totalGuests}{" "}
                        customer total
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => handlePrintMonth(monthKey)}
                        className="h-11 flex items-center gap-2"
                      >
                        <Printer className="w-4 h-4" />
                        Cetak Laporan
                      </Button>
                    </div>
                  </div>

                  <div
                    id={`month-report-${monthKey}`}
                    className="overflow-x-auto p-6"
                  >
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nama Customer</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>No. Telp</TableHead>
                          <TableHead>Check In</TableHead>
                          <TableHead>Check Out</TableHead>
                          <TableHead>Jumlah Customer</TableHead>
                          <TableHead>Permintaan Khusus</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Aksi</TableHead>
                          <TableHead>Tanggal Reservasi</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {monthBookings.map((booking) => (
                          <TableRow key={booking.id_bookings}>
                            <TableCell>
                              <div className="font-medium">{booking.name}</div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2 text-sm">
                                <Mail className="h-3 w-3 text-muted-foreground" />
                                <span>{booking.email}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2 text-sm">
                                <Phone className="h-3 w-3 text-muted-foreground" />
                                <span>{booking.phone}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              {safeFormatDate(
                                booking.check_in_date,
                                "d MMM yyyy",
                              )}
                            </TableCell>
                            <TableCell>
                              {safeFormatDate(
                                booking.check_out_date,
                                "d MMM yyyy",
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Users className="h-4 w-4 text-muted-foreground" />
                                <span>{booking.number_of_guests}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              {booking.special_requests ? (
                                <div className="flex items-start gap-2 max-w-[200px]">
                                  <MessageSquare className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                                  <span className="text-sm line-clamp-2">
                                    {booking.special_requests}
                                  </span>
                                </div>
                              ) : (
                                <span className="text-muted-foreground text-sm">
                                  -
                                </span>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Badge
                                  variant="outline"
                                  className={
                                    statusColors[booking.status] ||
                                    "bg-gray-100"
                                  }
                                >
                                  {statusLabels[booking.status] ||
                                    booking.status}
                                </Badge>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col items-center gap-2">
                                {(booking.status === "pending" ||
                                  booking.status === "dp") && (
                                  <button
                                    onClick={() =>
                                      confirmBooking(booking.id_bookings)
                                    }
                                    className="inline-flex items-center justify-center px-3 py-1 rounded-md bg-green-600 text-white text-sm hover:bg-green-500"
                                  >
                                    Konfirmasi
                                  </button>
                                )}
                                {booking.status === "pending" && (
                                  <button
                                    onClick={() =>
                                      markBookingAsDP(booking.id_bookings)
                                    }
                                    className="inline-flex items-center justify-center px-3 py-1 rounded-md bg-amber-600 text-white text-sm hover:bg-amber-500"
                                  >
                                    DP
                                  </button>
                                )}
                                {booking.status !== "cancelled" &&
                                  booking.status !== "completed" && (
                                    <button
                                      onClick={() =>
                                        setCancelingBookingId(
                                          booking.id_bookings,
                                        )
                                      }
                                      className="inline-flex items-center justify-center px-3 py-1 rounded-md bg-destructive text-white text-sm hover:bg-destructive/90"
                                    >
                                      Batalkan
                                    </button>
                                  )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm text-muted-foreground">
                                {safeFormatDate(
                                  booking.created_at,
                                  "d MMM yyyy, HH:mm",
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </div>

      {cancelingBookingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-8">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-xl ring-1 ring-slate-200">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-foreground">
                Batalkan Reservasi
              </h2>
              <p className="text-sm text-muted-foreground mt-2">
                Apakah Anda yakin ingin membatalkan reservasi ini? Status akan
                berubah menjadi dikembalikan, dan data riservasi akan tetap
                disimpan.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCancelingBookingId(null)}
                className="w-full sm:w-auto"
              >
                Batal
              </Button>
              <Button
                type="button"
                className="w-full sm:w-auto bg-destructive text-white hover:bg-destructive/90"
                onClick={cancelBooking}
              >
                Ya, Batalkan
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBookings;
