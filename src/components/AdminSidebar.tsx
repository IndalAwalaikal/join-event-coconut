// AdminSidebar.tsx
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Calendar,
  Users,
  LogOut,
  Menu,
  X,
  ChevronDown,
  BookOpen,
  Presentation,
  Video,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  children: React.ReactNode;
}

const AdminSidebar = ({ children }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isKegiatanOpen, setIsKegiatanOpen] = useState(true);
  const [isPendaftaranOpen, setIsPendaftaranOpen] = useState(true);

  // Get admin user from state or localStorage (avoid localStorage in artifacts, use props instead)
  const adminUser = { username: "Admin" }; // In production, pass this as props

  const handleLogout = () => {
    if (confirm("Apakah Anda yakin ingin keluar?")) {
      // In production, clear auth tokens via props/context
      navigate("/admin/login");
    }
  };

  const menuItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      path: "/admin/dashboard",
    },
    {
      title: "Kelola Kegiatan",
      icon: Calendar,
      path: null,
      submenu: [
        {
          title: "Open Class",
          icon: BookOpen,
          path: "/admin/kegiatan/open-class",
        },
        {
          title: "Seminar",
          icon: Presentation,
          path: "/admin/kegiatan/seminar",
        },
        {
          title: "Webinar",
          icon: Video,
          path: "/admin/kegiatan/webinar",
        },
      ],
    },
    {
      title: "Kelola Pendaftaran",
      icon: Users,
      path: null,
      submenu: [
        {
          title: "Open Class",
          icon: BookOpen,
          path: "/admin/pendaftaran/open-class",
        },
        {
          title: "Seminar",
          icon: Presentation,
          path: "/admin/pendaftaran/seminar",
        },
        {
          title: "Webinar",
          icon: Video,
          path: "/admin/pendaftaran/webinar",
        },
      ],
    },
  ];

  const isActive = (path: string | null) => {
    if (!path) return false;
    return location.pathname === path;
  };

  const isSubmenuActive = (submenu: any[]) => {
    return submenu.some((item) => location.pathname === item.path);
  };

  const SidebarContent = () => (
    <>
      {/* Logo & Brand */}
      <div className="p-9 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center">
            <img
              src="/logo_coconut.png"
              alt="Logo COCONUT"
              className="w-12 h-12 object-contain"
            />
          </div>

          <div>
            <h1 className="font-bold text-lg bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
              COCONUT
            </h1>
            <p className="text-xs text-slate-500">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item, index) => (
          <div key={index}>
            {/* Menu Item without Submenu */}
            {!item.submenu ? (
              <button
                onClick={() => {
                  navigate(item.path!);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  isActive(item.path)
                    ? "bg-gradient-to-r from-sky-600 to-blue-600 text-white shadow-lg shadow-sky-500/30"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium text-sm flex-1 text-left">
                  {item.title}
                </span>
              </button>
            ) : (
              // Menu Item with Submenu
              <div>
                <button
                  onClick={() => {
                    if (item.title === "Kelola Kegiatan") {
                      setIsKegiatanOpen(!isKegiatanOpen);
                    } else if (item.title === "Kelola Pendaftaran") {
                      setIsPendaftaranOpen(!isPendaftaranOpen);
                    }
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                    isSubmenuActive(item.submenu)
                      ? "bg-slate-100 text-sky-700"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  <span className="font-medium text-sm flex-1 text-left">
                    {item.title}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-300 ${
                      (item.title === "Kelola Kegiatan" && isKegiatanOpen) ||
                      (item.title === "Kelola Pendaftaran" && isPendaftaranOpen)
                        ? "rotate-180"
                        : ""
                    }`}
                  />
                </button>

                {/* Submenu */}
                <div
                  className={`mt-1 space-y-1 overflow-hidden transition-all duration-300 ${
                    (item.title === "Kelola Kegiatan" && isKegiatanOpen) ||
                    (item.title === "Kelola Pendaftaran" && isPendaftaranOpen)
                      ? "max-h-48 opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  {item.submenu.map((subItem, subIndex) => (
                    <button
                      key={subIndex}
                      onClick={() => {
                        navigate(subItem.path);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 pl-12 rounded-xl transition-all duration-300 ${
                        isActive(subItem.path)
                          ? "bg-gradient-to-r from-sky-600 to-blue-600 text-white shadow-md"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      <subItem.icon className="w-4 h-4 flex-shrink-0" />
                      <span className="text-sm font-medium">
                        {subItem.title}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-slate-200">
        <Button
          onClick={handleLogout}
          variant="outline"
          className="w-full flex items-center justify-center gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-all duration-300"
        >
          <LogOut className="w-4 h-4" />
          <span className="font-medium">Keluar</span>
        </Button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-600 to-blue-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <h1 className="font-bold text-lg bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
              COCONUT Admin
            </h1>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-slate-700" />
            ) : (
              <Menu className="w-6 h-6 text-slate-700" />
            )}
          </button>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col fixed left-0 top-0 bottom-0 w-72 bg-white border-r border-slate-200 z-40">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 animate-fade-in"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <aside
            className="fixed left-0 top-0 bottom-0 w-72 bg-white border-r border-slate-200 animate-slide-in-left"
            onClick={(e) => e.stopPropagation()}
          >
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main className="lg:ml-72 pt-16 lg:pt-0">
        <div className="min-h-screen">{children}</div>
      </main>
    </div>
  );
};

export default AdminSidebar;
