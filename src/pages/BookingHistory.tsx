import { useAuth } from "@/hooks/useAuth";
import { Navbar } from "@/components/Navbar";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Calendar, Users, Mail, Phone } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import heroVilla from "@/assets/hero-villa.jpg";

const BookingHistory = () => {
  const { user, bookings, bookingsLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

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
                    Riwayat Anda
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
            <div className="bg-card rounded-3xl border border-border p-8">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                Riwayat Pesanan Anda
              </h2>

              {bookingsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : bookings.length === 0 ? (
                <div className="text-center py-12 bg-muted/50 rounded-lg">
                  <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">Belum ada pesanan</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Mulai buat reservasi di halaman utama
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <div
                      key={booking.id_bookings}
                      className="border border-border rounded-xl p-4 hover:bg-muted/50 transition"
                    >
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div>
                          <h3 className="font-semibold text-foreground">
                            Reservasi #{booking.id_bookings.slice(0, 8)}
                          </h3>
                          <p className="text-xs text-muted-foreground mt-1">
                            Di Booking{" "}
                            {format(
                              new Date(booking.created_at),
                              "d MMM yyyy HH:mm",
                              { locale: id },
                            )}
                          </p>
                        </div>
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                            booking.status === "confirmed"
                              ? "bg-green-100 text-green-800"
                              : booking.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : booking.status === "cancelled"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {booking.status === "confirmed"
                            ? "Terkonfirmasi"
                            : booking.status === "pending"
                              ? "Menunggu"
                              : booking.status === "cancelled"
                                ? "Dibatalkan"
                                : "Selesai"}
                        </span>
                      </div>

                      <div className="space-y-3 text-sm">
                        <div className="flex items-center gap-4">
                          <p className="text-muted-foreground w-40">
                            Tanggal Check In :
                          </p>
                          <p className="font-medium">
                            {format(
                              new Date(booking.check_in_date),
                              "d MMMM yyyy",
                              { locale: id },
                            )}
                          </p>
                        </div>

                        <div className="flex items-center gap-4">
                          <p className="text-muted-foreground w-40">
                            Tanggal Check Out :
                          </p>
                          <p className="font-medium">
                            {format(
                              new Date(booking.check_out_date),
                              "d MMMM yyyy",
                              { locale: id },
                            )}
                          </p>
                        </div>

                        <div className="flex items-center gap-4">
                          <p className="text-muted-foreground w-40">
                            Jumlah Customer :
                          </p>
                          <p className="font-medium">
                            {booking.number_of_guests} orang
                          </p>
                        </div>

                        <div className="flex items-center gap-4">
                          <p className="text-muted-foreground w-40">
                            Kontak Customer :
                          </p>
                          <p className="font-medium text-xs">{booking.phone}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BookingHistory;
