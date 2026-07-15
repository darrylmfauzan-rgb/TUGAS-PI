import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminNavbar } from "@/pages/AdminNavbar";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Mail, Trash2, Eye } from "lucide-react";
import { toast } from "sonner";

interface Customer {
  id_customers: string;
  name: string;
  email: string;
  phone?: string;
  password_hash?: string;
  created_at: string;
  last_login?: string;
  is_active: boolean;
}

const AdminGuests = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null,
  );
  const [phoneInput, setPhoneInput] = useState("");

  useEffect(() => {
    const isAdmin = localStorage.getItem("admin-auth") === "true";
    if (!isAdmin) {
      navigate("/admin/login");
      return;
    }

    void loadCustomers();
  }, [navigate]);

  useEffect(() => {
    if (selectedCustomer) {
      setPhoneInput(selectedCustomer.phone || "");
    }
  }, [selectedCustomer]);

  const loadCustomers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("customers")
        .select(
          "id_customers,name,email,phone,password_hash,created_at,last_login,is_active",
        )
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCustomers((data || []) as Customer[]);
    } catch (err) {
      console.error("Error loading customers:", err);
      toast.error("Gagal memuat data customer");
    } finally {
      setLoading(false);
    }
  };

  const deleteGuest = async (customerId: string) => {
    const confirm = window.confirm(
      "Yakin ingin menghapus customer ini? Tindakan ini tidak dapat dibatalkan.",
    );
    if (!confirm) return;

    try {
      const { error } = await supabase
        .from("customers")
        .delete()
        .eq("id_customers", customerId);

      if (error) throw error;

      setCustomers((prev) => prev.filter((g) => g.id_customers !== customerId));
      setSelectedCustomer(null);
      toast.success("Customer berhasil dihapus");
    } catch (err) {
      console.error("Error deleting customer:", err);
      toast.error("Gagal menghapus customer");
    }
  };

  const toggleActive = async (customer: Customer) => {
    try {
      const { error } = await supabase
        .from("customers")
        .update({ is_active: !customer.is_active })
        .eq("id_customers", customer.id_customers);

      if (error) throw error;

      setCustomers((prev) =>
        prev.map((c) =>
          c.id_customers === customer.id_customers
            ? { ...c, is_active: !c.is_active }
            : c,
        ),
      );

      if (selectedCustomer?.id_customers === customer.id_customers) {
        setSelectedCustomer({
          ...selectedCustomer,
          is_active: !customer.is_active,
        });
      }

      toast.success(
        `Customer ${!customer.is_active ? "diaktifkan" : "dinonaktifkan"}`,
      );
    } catch (err) {
      console.error("Error updating customer:", err);
      toast.error("Gagal memperbarui status customer");
    }
  };

  const savePhone = async () => {
    if (!selectedCustomer) return;

    const cleanedPhone = phoneInput.replace(/\D/g, "");

    try {
      const { error } = await supabase
        .from("customers")
        .update({ phone: cleanedPhone })
        .eq("id_customers", selectedCustomer.id_customers);

      if (error) throw error;

      setCustomers((prev) =>
        prev.map((customer) =>
          customer.id_customers === selectedCustomer.id_customers
            ? { ...customer, phone: cleanedPhone }
            : customer,
        ),
      );

      setSelectedCustomer({
        ...selectedCustomer,
        phone: cleanedPhone,
      });

      toast.success("Nomor telepon customer berhasil diperbarui");
    } catch (err) {
      console.error("Error updating phone:", err);
      toast.error("Gagal memperbarui nomor telepon");
    }
  };

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-slate-300">
      <AdminNavbar />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Kelola Customer
          </h1>
          <p className="text-muted-foreground">
            Lihat dan kelola daftar customer terdaftar
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_350px]">
          <Card className="p-6">
            <div className="flex gap-4 mb-6">
              <Input
                placeholder="Cari berdasarkan nama atau email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
            </div>

            {loading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Memuat data customer...</p>
              </div>
            ) : customers.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  Belum ada customer terdaftar
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nama</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Terdaftar</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-24 text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCustomers.map((customer) => (
                      <TableRow
                        key={customer.id_customers}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => setSelectedCustomer(customer)}
                      >
                        <TableCell className="font-medium">
                          {customer.name}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-muted-foreground" />
                            {customer.email}
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {new Date(customer.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              customer.is_active
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {customer.is_active ? "Aktif" : "Nonaktif"}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedCustomer(customer);
                            }}
                            className="inline-flex items-center gap-1 p-2 rounded-lg hover:bg-primary/10 text-primary transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            <div className="mt-6 text-sm text-muted-foreground">
              Total: {filteredCustomers.length} customer
            </div>
          </Card>

          {selectedCustomer && (
            <Card className="p-6 h-fit sticky top-24">
              <h2 className="text-lg font-semibold mb-4">Detail Customer</h2>

              <div className="space-y-4">
                <div>
                  <p className="text-xs text-muted-foreground">Nama</p>
                  <p className="font-medium">{selectedCustomer.name}</p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="font-medium break-all">
                    {selectedCustomer.email}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">Telepon</p>
                  <Input
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                    placeholder="Masukkan nomor telepon"
                    inputMode="numeric"
                    maxLength={13}
                    className="mt-2"
                  />
                  <button
                    onClick={savePhone}
                    className="mt-3 w-full rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                  >
                    Simpan Nomor Telepon
                  </button>
                </div>

                {selectedCustomer.password_hash && (
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Password Hash
                    </p>
                    <p className="font-mono text-xs break-all bg-muted p-2 rounded mt-1">
                      {selectedCustomer.password_hash}
                    </p>
                  </div>
                )}

                <div>
                  <p className="text-xs text-muted-foreground">Terdaftar</p>
                  <p className="font-medium">
                    {new Date(selectedCustomer.created_at).toLocaleDateString(
                      "id-ID",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      },
                    )}
                  </p>
                </div>

                {selectedCustomer.last_login && (
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Login Terakhir
                    </p>
                    <p className="font-medium">
                      {new Date(selectedCustomer.last_login).toLocaleDateString(
                        "id-ID",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        },
                      )}
                    </p>
                  </div>
                )}

                <div className="pt-4 space-y-2 border-t">
                  <button
                    onClick={() => toggleActive(selectedCustomer)}
                    className="w-full px-4 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-sm font-medium"
                  >
                    {selectedCustomer.is_active
                      ? "Nonaktifkan Akun"
                      : "Aktifkan Akun"}
                  </button>

                  <button
                    onClick={() => deleteGuest(selectedCustomer.id_customers)}
                    className="w-full px-4 py-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Hapus Customer
                  </button>
                </div>
              </div>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminGuests;
