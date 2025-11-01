import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ApiClient } from "@/lib/ApiClient";
import { Eye, EyeOff, Lock, User, AlertCircle } from "lucide-react";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const data = await ApiClient.post<any>("/admin/login", {
        username: formData.username,
        password: formData.password,
      });

      const token = data.data?.token;

      if (!token) {
        throw new Error("Token tidak ditemukan di respons server");
      }

      localStorage.setItem("adminToken", token);
      if (data.data?.user) {
        localStorage.setItem("adminUser", JSON.stringify(data.data.user));
      }

      navigate("/admin/dashboard");
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "Gagal terhubung ke server");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50 relative overflow-hidden p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgb(14 165 233 / 0.15) 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        ></div>
      </div>

      {/* Gradient Orbs */}
      <div className="absolute top-20 right-20 w-96 h-96 bg-sky-300/20 rounded-full blur-3xl animate-pulse"></div>
      <div
        className="absolute bottom-20 left-20 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: "1s" }}
      ></div>

      {/* Login Card */}
      <div className="w-full max-w-md relative z-10">
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-10 border border-slate-200 animate-fade-in">
          {/* Logo & Title */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center">
              <img
                src="/logo_coconut.png"
                alt="Logo COCONUT"
                className="w-12 h-12 object-contain"
              />
            </div>
            <h1 className="text-3xl font-bold mb-2">
              <span className="bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
                Admin
              </span>
            </h1>
            <p className="text-slate-600 text-sm">
              Masuk ke panel administrasi
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 animate-slide-up">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-red-800 font-medium">{error}</p>
              </div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Field */}
            <div className="space-y-2">
              <Label
                htmlFor="username"
                className="text-sm font-semibold text-slate-700"
              >
                Username
              </Label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  id="username"
                  type="text"
                  required
                  placeholder="Masukkan username"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  className="h-12 pl-12 border-slate-300 focus:border-sky-500 focus:ring-sky-500 transition-all duration-300"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-sm font-semibold text-slate-700"
              >
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Masukkan password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="h-12 pl-12 pr-12 border-slate-300 focus:border-sky-500 focus:ring-sky-500 transition-all duration-300"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-12 font-semibold bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 shadow-lg shadow-sky-500/30 hover:shadow-xl hover:scale-105 transition-all duration-300"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Memproses...
                </>
              ) : (
                "Masuk"
              )}
            </Button>
          </form>

          {/* Demo Credentials
          <div className="mt-6 p-4 bg-gradient-to-br from-sky-50 to-blue-50 rounded-xl border border-sky-200">
            <p className="text-xs text-slate-600 font-medium mb-2">
              Demo Credentials:
            </p>
            <p className="text-xs text-slate-700">
              <span className="font-semibold">Username:</span> coconut
              <br />
              <span className="font-semibold">Password:</span> event@2025
            </p>
          </div> */}

          {/* Back to Home */}
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="text-sm text-slate-600 hover:text-sky-600 transition-colors duration-300 font-medium"
            >
              ← Kembali ke Beranda
            </button>
          </div>
        </div>

        {/* Footer Text */}
        <p className="text-center text-sm text-slate-600 mt-6">
          © 2025 COCONUT Computer Club
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
