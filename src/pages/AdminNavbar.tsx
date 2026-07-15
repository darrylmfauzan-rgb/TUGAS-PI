import { LogOut, LayoutDashboard, Calendar, Users, Home } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export const AdminNavbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("admin-auth");
    navigate("/admin/login");
  };

  const navItems = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      path: "/admin/dashboard",
    },
    {
      label: "Kelola Villa",
      icon: Home,
      path: "/admin/villas",
    },
    {
      label: "Reservasi",
      icon: Calendar,
      path: "/admin/bookings",
    },
    {
      label: "Customer",
      icon: Users,
      path: "/admin/guests",
    },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/admin/dashboard" className="flex items-center space-x-2">
              <span className="text-xl font-bold text-primary">
                D'Villa Moda Admin
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-1 px-3 md:px-4 py-2 rounded-lg transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-accent"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm md:text-base">{item.label}</span>
                </Link>
              );
            })}
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center space-x-1 px-3 md:px-4 py-2 rounded-lg transition-colors hover:bg-destructive/10 text-destructive"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm md:text-base">Logout</span>
          </button>
        </div>

        {/* Mobile menu */}
        <div className="md:hidden pb-4 flex flex-wrap gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors text-xs ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-accent"
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
