// App.tsx
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Public Pages
import Home from "./pages/Home";
import Kegiatan from "./pages/kegiatan";
import EventDetail from "./pages/EventDetail";
import Pendaftaran from "./pages/Pendaftaran";
import Documentation from "./pages/Documentation";
import NotFound from "./pages/NotFound";

// Admin Pages
import AdminLogin from "./pages/admin/Login";
import AdminDashboard from "./pages/admin/Dashboard";

// Admin - Kelola Kegiatan
import AdminOpenClass from "./pages/admin/kegiatan/OpenClass";
import AdminSeminar from "./pages/admin/kegiatan/Seminar";
import AdminWebinar from "./pages/admin/kegiatan/Webinar";

// Admin - Kelola Pendaftaran
import AdminPendaftaranOpenClass from "./pages/admin/pendaftaran/OpenClass";
import AdminPendaftaranSeminar from "./pages/admin/pendaftaran/Seminar";
import AdminPendaftaranWebinar from "./pages/admin/pendaftaran/Webinar";

// Components
import ProtectedRoute from "./components/ProtectedRoute";
import AdminSidebar from "./components/AdminSidebar";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* ============================================
              PUBLIC ROUTES
          ============================================ */}
          <Route path="/" element={<Home />} />
          <Route path="/kegiatan" element={<Kegiatan />} />
          <Route path="/informasi/:type/:id" element={<EventDetail />} />
          <Route path="/pendaftaran" element={<Pendaftaran />} />
          <Route path="/dokumentasi" element={<Documentation />} />

          {/* ============================================
              ADMIN ROUTES - LOGIN (No Sidebar)
          ============================================ */}
          <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* ============================================
              ADMIN ROUTES - DASHBOARD (With Sidebar)
          ============================================ */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <AdminSidebar>
                  <AdminDashboard />
                </AdminSidebar>
              </ProtectedRoute>
            }
          />

          {/* ============================================
              ADMIN ROUTES - KELOLA KEGIATAN (With Sidebar)
          ============================================ */}
          
          {/* Kelola Kegiatan - Open Class */}
          <Route
            path="/admin/kegiatan/open-class"
            element={
              <ProtectedRoute>
                <AdminSidebar>
                  <AdminOpenClass />
                </AdminSidebar>
              </ProtectedRoute>
            }
          />

          {/* Kelola Kegiatan - Seminar */}
          <Route
            path="/admin/kegiatan/seminar"
            element={
              <ProtectedRoute>
                <AdminSidebar>
                  <AdminSeminar />
                </AdminSidebar>
              </ProtectedRoute>
            }
          />

          {/* Kelola Kegiatan - Webinar */}
          <Route
            path="/admin/kegiatan/webinar"
            element={
              <ProtectedRoute>
                <AdminSidebar>
                  <AdminWebinar />
                </AdminSidebar>
              </ProtectedRoute>
            }
          />

          {/* ============================================
              ADMIN ROUTES - KELOLA PENDAFTARAN (With Sidebar)
          ============================================ */}
          
          {/* Kelola Pendaftaran - Open Class */}
          <Route
            path="/admin/pendaftaran/open-class"
            element={
              <ProtectedRoute>
                <AdminSidebar>
                  <AdminPendaftaranOpenClass />
                </AdminSidebar>
              </ProtectedRoute>
            }
          />

          {/* Kelola Pendaftaran - Seminar */}
          <Route
            path="/admin/pendaftaran/seminar"
            element={
              <ProtectedRoute>
                <AdminSidebar>
                  <AdminPendaftaranSeminar />
                </AdminSidebar>
              </ProtectedRoute>
            }
          />

          {/* Kelola Pendaftaran - Webinar */}
          <Route
            path="/admin/pendaftaran/webinar"
            element={
              <ProtectedRoute>
                <AdminSidebar>
                  <AdminPendaftaranWebinar />
                </AdminSidebar>
              </ProtectedRoute>
            }
          />

          {/* ============================================
              REDIRECTS - Old Routes to New Structure
          ============================================ */}
          <Route
            path="/admin/events"
            element={<Navigate to="/admin/kegiatan/open-class" replace />}
          />
          <Route
            path="/admin/registrations"
            element={<Navigate to="/admin/pendaftaran/open-class" replace />}
          />
          <Route
            path="/admin/pendaftaran"
            element={<Navigate to="/admin/pendaftaran/open-class" replace />}
          />

          {/* ============================================
              404 - NOT FOUND
          ============================================ */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;