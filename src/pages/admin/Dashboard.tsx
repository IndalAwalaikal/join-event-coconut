import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ApiClient } from "@/lib/ApiClient";
import {
  Users,
  Calendar,
  BookOpen,
  Presentation,
  Video,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface EventItem {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  quota: number;
  instructor: string;
  description: string;
  created_at: string;
}

interface RegistrationItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  university: string;
  proofImage: string;
  registeredAt: string;
  jenis: string; // 'open_class', 'seminar', 'webinar'
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [openClassEvents, setOpenClassEvents] = useState<EventItem[]>([]);
  const [seminarEvents, setSeminarEvents] = useState<EventItem[]>([]);
  const [webinarEvents, setWebinarEvents] = useState<EventItem[]>([]);
  const [registrations, setRegistrations] = useState<RegistrationItem[]>([]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [openClassRes, seminarRes, webinarRes] = await Promise.all([
        ApiClient.get<any>("/admin/open-classes"),
        ApiClient.get<any>("/admin/seminars"),
        ApiClient.get<any>("/admin/webinars"),
      ]);

      const [openClassRegRes, seminarRegRes, webinarRegRes] = await Promise.all(
        [
          ApiClient.get<any>("/admin/registrations", { jenis: "open_class" }),
          ApiClient.get<any>("/admin/registrations", { jenis: "seminar" }),
          ApiClient.get<any>("/admin/registrations", { jenis: "webinar" }),
        ]
      );

      const openClassData = Array.isArray(openClassRes.data)
        ? openClassRes.data
        : [];
      const seminarData = Array.isArray(seminarRes.data) ? seminarRes.data : [];
      const webinarData = Array.isArray(webinarRes.data) ? webinarRes.data : [];

      const openClassRegs = Array.isArray(openClassRegRes.data)
        ? openClassRegRes.data.map((r) => ({ ...r, jenis: "open_class" }))
        : [];
      const seminarRegs = Array.isArray(seminarRegRes.data)
        ? seminarRegRes.data.map((r) => ({ ...r, jenis: "seminar" }))
        : [];
      const webinarRegs = Array.isArray(webinarRegRes.data)
        ? webinarRegRes.data.map((r) => ({ ...r, jenis: "webinar" }))
        : [];

      const allRegistrations = [
        ...openClassRegs,
        ...seminarRegs,
        ...webinarRegs,
      ];

      setOpenClassEvents(openClassData);
      setSeminarEvents(seminarData);
      setWebinarEvents(webinarData);
      setRegistrations(allRegistrations);
    } catch (error: any) {
      console.error("Dashboard fetch error:", error);
      toast({
        title: "Gagal Memuat Data",
        description: "Beberapa data mungkin tidak ditampilkan.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getActiveCount = (events: EventItem[]) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return events.filter((event) => {
      const eventDate = new Date(event.date);
      eventDate.setHours(0, 0, 0, 0);
      return eventDate >= today;
    }).length;
  };

  const totalEvents =
    openClassEvents.length + seminarEvents.length + webinarEvents.length;
  const activeEvents =
    getActiveCount(openClassEvents) +
    getActiveCount(seminarEvents) +
    getActiveCount(webinarEvents);
  const totalParticipants = registrations.length;

  const allEvents = [
    ...openClassEvents.map((e) => ({ ...e, type: "Open Class" })),
    ...seminarEvents.map((e) => ({ ...e, type: "Seminar" })),
    ...webinarEvents.map((e) => ({ ...e, type: "Webinar" })),
  ]
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    .slice(0, 4);

  const recentRegistrations = registrations
    .sort(
      (a, b) =>
        new Date(b.registeredAt).getTime() - new Date(a.registeredAt).getTime()
    )
    .slice(0, 3)
    .map((reg) => ({
      ...reg,
      time: "Baru saja",
      status: "pending" as const,
    }));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-sky-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  const StatCard = ({
    icon: Icon,
    title,
    value,
    subtitle,
    gradient,
    onClick,
  }: {
    icon: React.ElementType;
    title: string;
    value: number | string;
    subtitle?: string;
    gradient: string;
    onClick?: () => void;
  }) => (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-lg hover:shadow-sky-500/10 transition-all duration-300 ${
        onClick ? "cursor-pointer hover:-translate-y-0.5" : ""
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-600 mb-1">{title}</p>
          <p className="text-2xl md:text-3xl font-bold text-slate-800">
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
          )}
        </div>
        <div
          className={`w-10 h-10 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center`}
        >
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
              Dashboard
            </h1>
            <p className="text-slate-600 mt-1">
              Selamat datang kembali! Berikut ringkasan data Anda.
            </p>
          </div>
          <div className="px-4 py-2 bg-gradient-to-br from-sky-50 to-blue-50 rounded-xl border border-sky-200">
            <p className="text-xs text-slate-600">Total Kegiatan</p>
            <p className="text-xl font-bold text-sky-700">{totalEvents}</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-8 max-w-7xl mx-auto">
        {/* Main Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard
            icon={Calendar}
            title="Total Kegiatan"
            value={totalEvents}
            subtitle={`${activeEvents} kegiatan aktif`}
            gradient="from-sky-500 to-blue-500"
          />
          <StatCard
            icon={Users}
            title="Total Peserta"
            value={totalParticipants}
            subtitle="Peserta terdaftar"
            gradient="from-emerald-500 to-green-500"
          />
          <StatCard
            icon={CheckCircle}
            title="Kegiatan Aktif"
            value={activeEvents}
            subtitle="Sedang berjalan"
            gradient="from-blue-500 to-indigo-500"
          />
        </div>

        {/* Event Type Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "Open Class",
              icon: BookOpen,
              gradient: "from-sky-500 to-blue-500",
              events: openClassEvents,
              regType: "open_class",
              path: "/admin/kegiatan/open-class",
            },
            {
              title: "Seminar",
              icon: Presentation,
              gradient: "from-blue-500 to-indigo-500",
              events: seminarEvents,
              regType: "seminar",
              path: "/admin/kegiatan/seminar",
            },
            {
              title: "Webinar",
              icon: Video,
              gradient: "from-indigo-500 to-purple-500",
              events: webinarEvents,
              regType: "webinar",
              path: "/admin/kegiatan/webinar",
            },
          ].map((item, index) => (
            <div
              key={index}
              onClick={() => navigate(item.path)}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-lg hover:shadow-sky-500/10 transition-all duration-300 cursor-pointer hover:-translate-y-0.5"
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`w-10 h-10 rounded-lg bg-gradient-to-br ${item.gradient} flex items-center justify-center`}
                >
                  <item.icon className="w-5 h-5 text-white" />
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-sky-600 transition-transform group-hover:translate-x-0.5" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-3">
                {item.title}
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Total Event</span>
                  <span className="text-sm font-medium text-slate-800">
                    {item.events.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Peserta</span>
                  <span className="text-sm font-medium text-slate-800">
                    {
                      registrations.filter((r) => r.jenis === item.regType)
                        .length
                    }
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Aktif</span>
                  <span className="text-xs font-semibold px-2 py-1 bg-emerald-100 text-emerald-700 rounded">
                    {getActiveCount(item.events)} event
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Events & Registrations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Events */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-800">
                Kegiatan Terbaru
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/admin/kegiatan/open-class")}
                className="text-sky-600 hover:text-sky-700 h-8 px-3"
              >
                Lihat Semua
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </div>
            <div className="divide-y divide-slate-100">
              {allEvents.length > 0 ? (
                allEvents.map((event) => {
                  const participants = registrations.filter(
                    (r) =>
                      r.jenis === event.type.toLowerCase().replace(" ", "_")
                  ).length;
                  return (
                    <div
                      key={event.id}
                      className="p-5 hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-slate-800 text-sm mb-1 truncate">
                            {event.title}
                          </h3>
                          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 mb-2">
                            <span className="px-2 py-0.5 bg-sky-100 text-sky-700 rounded font-medium">
                              {event.type}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(event.date).toLocaleDateString("id-ID")}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-slate-200 rounded-full h-1.5">
                              <div
                                className="bg-gradient-to-r from-sky-600 to-blue-600 h-1.5 rounded-full"
                                style={{
                                  width: `${
                                    event.quota > 0
                                      ? Math.min(
                                          100,
                                          (participants / event.quota) * 100
                                        )
                                      : 0
                                  }%`,
                                }}
                              />
                            </div>
                            <span className="text-xs text-slate-600 whitespace-nowrap">
                              {participants}/{event.quota}
                            </span>
                          </div>
                        </div>
                        <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-xs font-medium whitespace-nowrap">
                          Aktif
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-5 text-center text-sm text-slate-500">
                  Belum ada kegiatan
                </div>
              )}
            </div>
          </div>

          {/* Recent Registrations */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-800">
                Pendaftaran Terbaru
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/admin/pendaftaran")}
                className="text-sky-600 hover:text-sky-700 h-8 px-3"
              >
                Lihat Semua
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </div>
            <div className="divide-y divide-slate-100">
              {recentRegistrations.length > 0 ? (
                recentRegistrations.map((reg) => (
                  <div
                    key={reg.id}
                    className="p-5 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-slate-800 text-sm truncate">
                          {reg.name}
                        </h3>
                        <p className="text-xs text-slate-600 truncate">
                          {reg.email}
                        </p>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-700 rounded">
                            {reg.jenis === "open_class"
                              ? "Open Class"
                              : reg.jenis === "seminar"
                              ? "Seminar"
                              : "Webinar"}
                          </span>
                          <span className="text-[10px] text-slate-500">
                            • {reg.time}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-5 text-center text-sm text-slate-500">
                  Belum ada pendaftaran
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gradient-to-br from-sky-600 to-blue-700 rounded-2xl p-6 text-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold">Kelola Kegiatan Anda</h2>
              <p className="text-sky-100 text-sm mt-1">
                Tambahkan kegiatan baru atau kelola peserta yang sudah terdaftar
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() => navigate("/admin/kegiatan/open-class")}
                className="bg-white text-sky-700 hover:bg-slate-50 text-sm px-4 py-2"
              >
                Tambah Kegiatan
              </Button>
              <Button
                onClick={() => navigate("/admin/pendaftaran")}
                className="border-white text-white hover:bg-white/10 text-sm px-4 py-2"
              >
                Lihat Pendaftaran
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
