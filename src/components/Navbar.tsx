// Navbar.tsx
import { Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

const Navbar = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const navItems = [
    { path: "/", label: "Beranda" },
    { path: "/kegiatan", label: "Kegiatan" },
    { path: "/pendaftaran", label: "Pendaftaran" },
    { path: "/dokumentasi", label: "Dokumentasi" },
  ];

  const isActive = (path: string) => {
    if (path === "/kegiatan" && location.pathname.startsWith("/informasi")) {
      return true;
    }
    return location.pathname === path;
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
        isScrolled
          ? "bg-white/80 backdrop-blur-md shadow-sm border-b border-slate-200/50"
          : "bg-white/70 backdrop-blur-sm"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2.5 group">
            <div className="flex items-center justify-center">
              <img
                src="/logosambung.png"
                alt="Logo COCONUT"
                className="w-15 h-12 object-contain"
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link key={item.path} to={item.path}>
                <button
                  className={`relative px-1 py-2 text-sm font-medium transition-colors duration-200 group ${
                    isActive(item.path)
                      ? "text-sky-600"
                      : "text-slate-700 hover:text-sky-600"
                  }`}
                >
                  {item.label}
                  {/* Animated underline */}
                  <span
                    className={`absolute left-0 bottom-0 h-0.5 bg-gradient-to-r from-sky-600 to-blue-600 transition-all duration-300 ${
                      isActive(item.path) ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  ></span>
                </button>
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden lg:block">
            <Link to="/pendaftaran">
              <Button
                size="sm"
                className="font-medium bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 shadow-lg shadow-sky-500/30 hover:shadow-xl hover:shadow-sky-500/40 transition-all duration-300 hover:scale-105"
              >
                Daftar Sekarang
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5 text-slate-800" />
            ) : (
              <Menu className="w-5 h-5 text-slate-800" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 space-y-1 border-t border-slate-200/50 animate-fade-in">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
              >
                <button
                  className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive(item.path)
                      ? "bg-gradient-to-r from-sky-50 to-blue-50 text-sky-700 border border-sky-200/50"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {item.label}
                </button>
              </Link>
            ))}
            <div className="pt-2">
              <Link to="/pendaftaran" onClick={() => setMobileMenuOpen(false)}>
                <Button
                  className="w-full font-medium bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 shadow-lg shadow-sky-500/30"
                  size="sm"
                >
                  Daftar Sekarang
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
