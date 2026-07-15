import {
  useContext,
  createContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface AuthUser {
  id_customers: string;
  email: string;
  name: string;
  phone?: string;
  created_at?: string;
}

interface BookingHistoryItem {
  id_bookings: string;
  name: string;
  email: string;
  phone: string;
  check_in_date: string;
  check_out_date: string;
  number_of_guests: number;
  status: string;
  created_at: string;
}

interface AuthContextType {
  user: AuthUser | null;
  bookings: BookingHistoryItem[];
  loading: boolean;
  bookingsLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (
    name: string,
    email: string,
    password: string,
    phone: string,
  ) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<AuthUser>) => Promise<boolean>;
  changePassword: (
    oldPassword: string,
    newPassword: string,
  ) => Promise<boolean>;
  resetPassword: (email: string, newPassword: string) => Promise<boolean>;
  fetchBookings: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Simple UUID generator (v4 fallback)
const generateUUID = (): string => {
  if (crypto && crypto.getRandomValues) {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = crypto.getRandomValues(new Uint8Array(1))[0] % 16;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
  // Simple fallback UUID
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, () =>
    Math.floor(Math.random() * 16).toString(16),
  );
};

// Simple hash function for password verification (client-side demo)
// In production, use bcryptjs: import bcrypt from 'bcryptjs'
const hashPassword = async (password: string): Promise<string> => {
  try {
    // Try using Web Crypto API
    if (crypto && crypto.subtle) {
      const encoder = new TextEncoder();
      const data = encoder.encode(password);
      const hashBuffer = await crypto.subtle.digest("SHA-256", data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
      return hashHex;
    }
  } catch (err) {
    console.warn("Web Crypto API not available, using fallback", err);
  }

  // Fallback: simple base64 encoding (NOT secure, for demo only)
  // In production, always use bcryptjs or proper server-side hashing
  return btoa(password);
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [bookings, setBookings] = useState<BookingHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingsLoading, setBookingsLoading] = useState(false);

  // Check for existing session on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        const sessionData = sessionStorage.getItem("auth-user");
        if (sessionData) {
          const userData = JSON.parse(sessionData) as AuthUser;
          setUser(userData);
          await fetchBookings(userData.email);
        }
      } catch (err) {
        console.error("Error initializing auth:", err);
        sessionStorage.removeItem("auth-user");
      } finally {
        setLoading(false);
      }
    };

    void initAuth();
  }, []);

  const fetchBookings = async (email?: string) => {
    if (!email && !user) return;

    setBookingsLoading(true);
    try {
      const targetEmail = email || user?.email;
      const userId = user?.id_customers;

      let query = supabase
        .from("bookings")
        .select(
          "id_bookings,name,email,phone,check_in_date,check_out_date,number_of_guests,status,created_at",
        );

      // Query by customer_id if user is logged in (customer data)
      if (userId) {
        query = query.eq("customer_id", userId);
      } else if (targetEmail) {
        // Query by email if not logged in
        query = query.eq("email", targetEmail);
      }

      const { data, error } = await query.order("created_at", {
        ascending: false,
      });

      if (error) throw error;
      setBookings((data || []) as BookingHistoryItem[]);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      toast.error("Gagal memuat riwayat reservasi");
    } finally {
      setBookingsLoading(false);
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    phone: string,
  ): Promise<boolean> => {
    try {
      // Validate input
      if (!name || !email || !password) {
        toast.error("Semua field harus diisi");
        return false;
      }

      // Check if email already exists
      try {
        const { data: existingCustomer } = await supabase
          .from("customers")
          .select("id_customers")
          .eq("email", email.toLowerCase())
          .single();

        if (existingCustomer) {
          toast.error("Email sudah terdaftar. Silakan login.");
          return false;
        }
      } catch {
        // No existing customer found - this is expected
      }

      // Hash password
      const passwordHash = await hashPassword(password);

      // Create customer in Supabase with .select() to get the ID back
      const { data, error } = await supabase
        .from("customers")
        .insert({
          name,
          email: email.toLowerCase(),
          phone,
          password_hash: passwordHash,
          is_active: true,
        })
        .select("id_customers,name,email,phone");

      if (error) {
        console.error("Supabase insert error:", error);

        if (error.message.includes("password_hash")) {
          toast.error(
            "Database error: column password_hash tidak ada. Hubungi admin.",
          );
        } else if (error.message.includes("is_active")) {
          toast.error(
            "Database error: column is_active tidak ada. Hubungi admin.",
          );
        } else if (error.message.includes("duplicate")) {
          toast.error("Email sudah terdaftar. Silakan login.");
        } else {
          toast.error(`Gagal membuat akun: ${error.message}`);
        }
        return false;
      }

      if (!data || data.length === 0) {
        toast.error("Gagal membuat akun: data tidak kembali dari server");
        return false;
      }

      // Set user session with ID dari database
      const newUser: AuthUser = {
        id_customers: data[0].id_customers,
        name: data[0].name,
        email: data[0].email,
        phone: data[0].phone,
      };

      sessionStorage.setItem("auth-user", JSON.stringify(newUser));
      setUser(newUser);
      toast.success("Akun berhasil dibuat!");
      return true;
    } catch (err: any) {
      console.error("Registration error:", err);
      toast.error(
        err?.message ||
          "Gagal membuat akun. Silakan coba lagi atau hubungi admin.",
      );
      return false;
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      if (!email || !password) {
        toast.error("Email dan password harus diisi");
        return false;
      }

      // Fetch customer from database
      const { data: customer, error } = await supabase
        .from("customers")
        .select("id_customers,name,email,password_hash,phone,is_active")
        .eq("email", email.toLowerCase())
        .single();

      if (error || !customer) {
        toast.error("Email atau password salah");
        return false;
      }

      if (!customer.is_active) {
        toast.error("Akun Anda telah dinonaktifkan");
        return false;
      }

      // Verify password
      const passwordHash = await hashPassword(password);
      if (customer.password_hash !== passwordHash) {
        toast.error("Email atau password salah");
        return false;
      }

      // Update last_login
      await supabase
        .from("customers")
        .update({ last_login: new Date().toISOString() })
        .eq("id_customers", customer.id_customers);

      // Set user session
      const userData: AuthUser = {
        id_customers: customer.id_customers,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
      };

      sessionStorage.setItem("auth-user", JSON.stringify(userData));
      setUser(userData);
      await fetchBookings(customer.email);
      toast.success(`Selamat datang, ${customer.name}!`);
      return true;
    } catch (err) {
      console.error("Login error:", err);
      toast.error("Gagal login. Silakan coba lagi.");
      return false;
    }
  };

  const logout = async () => {
    try {
      sessionStorage.removeItem("auth-user");
      setUser(null);
      setBookings([]);
      toast.success("Logout berhasil");
    } catch (err) {
      console.error("Logout error:", err);
      toast.error("Gagal logout");
    }
  };

  const updateProfile = async (
    updates: Partial<AuthUser>,
  ): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from("customers")
        .update({
          name: updates.name || user.name,
          phone: updates.phone || user.phone,
        })
        .eq("id_customers", user.id_customers);

      if (error) throw error;

      const updatedUser = { ...user, ...updates };
      sessionStorage.setItem("auth-user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      toast.success("Profil berhasil diperbarui");
      return true;
    } catch (err) {
      console.error("Update profile error:", err);
      toast.error("Gagal memperbarui profil");
      return false;
    }
  };

  const changePassword = async (
    oldPassword: string,
    newPassword: string,
  ): Promise<boolean> => {
    if (!user) return false;

    try {
      // Fetch customer to verify old password
      const { data: customer, error: fetchError } = await supabase
        .from("customers")
        .select("password_hash")
        .eq("id_customers", user.id_customers)
        .single();

      if (fetchError || !customer) {
        toast.error("Gagal mengambil data akun");
        return false;
      }

      // Verify old password
      const oldHash = await hashPassword(oldPassword);
      if (customer.password_hash !== oldHash) {
        toast.error("Password lama tidak cocok");
        return false;
      }

      // Hash new password
      const newHash = await hashPassword(newPassword);

      // Update password
      const { error: updateError } = await supabase
        .from("customers")
        .update({ password_hash: newHash })
        .eq("id_customers", user.id_customers);

      if (updateError) throw updateError;

      toast.success("Password berhasil diubah");
      return true;
    } catch (err) {
      console.error("Change password error:", err);
      toast.error("Gagal mengubah password");
      return false;
    }
  };

  const resetPassword = async (
    email: string,
    newPassword: string,
  ): Promise<boolean> => {
    try {
      if (!email || !newPassword) {
        toast.error("Email dan password baru harus diisi");
        return false;
      }

      const { data: customer, error: fetchError } = await supabase
        .from("customers")
        .select("id_customers")
        .eq("email", email.toLowerCase())
        .single();

      if (fetchError || !customer) {
        toast.error("Email tidak ditemukan. Silakan cek kembali email Anda.");
        return false;
      }

      const newHash = await hashPassword(newPassword);
      const { error: updateError } = await supabase
        .from("customers")
        .update({ password_hash: newHash })
        .eq("id_customers", customer.id_customers);

      if (updateError) throw updateError;

      toast.success("Password berhasil direset. Silakan login kembali.");
      return true;
    } catch (err) {
      console.error("Reset password error:", err);
      toast.error("Gagal mereset password. Silakan coba lagi.");
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        bookings,
        loading,
        bookingsLoading,
        login,
        register,
        logout,
        updateProfile,
        changePassword,
        resetPassword,
        fetchBookings,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
