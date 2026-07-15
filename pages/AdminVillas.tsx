import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AdminNavbar } from "@/pages/AdminNavbar";
import PricingFacilitiesAdmin from "@/components/PricingFacilitiesAdmin";

const AdminVillas = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const isAdmin = localStorage.getItem("admin-auth") === "true";
    if (!isAdmin) {
      navigate("/admin/login");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-slate-300">
      <AdminNavbar />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Manajemen Villa
          </h1>
          <p className="text-muted-foreground">
            Kelola harga villa dan fasilitas yang ditampilkan ke Customer.
          </p>
        </div>

        <PricingFacilitiesAdmin />
      </main>
    </div>
  );
};

export default AdminVillas;
