import { Home, History, LogIn, LogOut, User } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold text-primary">
                D'Villa Moda
              </span>
            </Link>
            {user ? (
              <div className="hidden md:flex items-center gap-2">
                <div className="flex flex-col items-start rounded-2xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-foreground shadow-sm">
                  <span className="font-semibold text-amber-700 truncate max-w-[220px]">
                    {user.name}
                  </span>
                  <span className="text-xs text-amber-600">{user.email}</span>
                </div>
              </div>
            ) : null}
          </div>

          <div className="flex items-center space-x-1 md:space-x-2">
            <Link
              to="/"
              onClick={(event) => {
                if (location.pathname === "/") {
                  event.preventDefault();
                  window.scrollTo({ top: 0, behavior: "smooth" });
                } else {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }
              }}
              className={`flex items-center space-x-1 px-3 md:px-4 py-2 rounded-lg transition-colors ${
                location.pathname === "/"
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-accent"
              }`}
            >
              <Home className="w-4 h-4" />
              <span className="text-sm md:text-base">Home</span>
            </Link>

            {user ? (
              <>
                <Link
                  to="/profile"
                  className={`flex items-center space-x-1 px-3 md:px-4 py-2 rounded-lg transition-colors hover:bg-accent ${
                    location.pathname === "/profile"
                      ? "bg-primary text-primary-foreground"
                      : ""
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span className="text-sm md:text-base">Profil</span>
                </Link>
                <Link
                  to="/booking-history"
                  className={`flex items-center space-x-1 px-3 md:px-4 py-2 rounded-lg transition-colors text-xs md:text-sm font-medium ${
                    location.pathname === "/booking-history"
                      ? "bg-blue-500 text-white"
                      : "hover:bg-blue-50 text-blue-600"
                  }`}
                >
                  <History className="w-4 h-4" />
                  <span>Riwayat</span>
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    navigate("/login");
                  }}
                  className="flex items-center space-x-1 px-3 md:px-4 py-2 rounded-lg transition-colors hover:bg-accent"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm md:text-base">Logout</span>
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className={`flex items-center space-x-1 px-3 md:px-4 py-2 rounded-lg transition-colors ${
                  location.pathname === "/login"
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-accent"
                }`}
              >
                <LogIn className="w-4 h-4" />
                <span className="text-sm md:text-base">Login</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
