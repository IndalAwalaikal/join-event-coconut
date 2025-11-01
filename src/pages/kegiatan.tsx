import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Users, User, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

// Sesuaikan dengan respons backend
interface EventItem {
  id: number | string;
  title: string;
  date: string; // "YYYY-MM-DD"
  time: string; // "HH:MM:SS"
  location: string;
  quota: number;
  instructor: string;
  description: string;
  registered?: number | null; // bisa null atau undefined
}

const Kegiatan = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [events, setEvents] = useState<{
    "Open Class": EventItem[];
    Seminar: EventItem[];
    Webinar: EventItem[];
  }>({
    "Open Class": [],
    Seminar: [],
    Webinar: [],
  });

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (timeStr: string): string => {
    return timeStr.split(":").slice(0, 2).join(":");
  };

  const isUpcoming = (dateStr: string): boolean => {
    const eventDate = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return eventDate >= today;
  };

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const [openClassRes, seminarRes, webinarRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_BASE_URL}/open-classes`),
        fetch(`${import.meta.env.VITE_API_BASE_URL}/seminars`),
        fetch(`${import.meta.env.VITE_API_BASE_URL}/webinars`),
      ]);

      if (!openClassRes.ok || !seminarRes.ok || !webinarRes.ok) {
        throw new Error("Gagal mengambil data event");
      }

      const openClassData = (await openClassRes.json()).data || [];
      const seminarData = (await seminarRes.json()).data || [];
      const webinarData = (await webinarRes.json()).data || [];

      setEvents({
        "Open Class": openClassData,
        Seminar: seminarData,
        Webinar: webinarData,
      });
    } catch (error) {
      console.error("Gagal memuat kegiatan:", error);
      toast({
        title: "Gagal Memuat Data",
        description: "Tidak dapat mengambil daftar kegiatan.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const allEvents = [
    ...events["Open Class"].map((e) => ({
      ...e,
      type: "Open Class",
      registered: e.registered ?? 0,
    })),
    ...events.Seminar.map((e) => ({
      ...e,
      type: "Seminar",
      registered: e.registered ?? 0,
    })),
    ...events.Webinar.map((e) => ({
      ...e,
      type: "Webinar",
      registered: e.registered ?? 0,
    })),
  ]
    .filter((event) => isUpcoming(event.date))
    .sort((a, b) => {
      const timeA = formatTime(a.time);
      const timeB = formatTime(b.time);
      const dateA = new Date(`${a.date}T${timeA}`);
      const dateB = new Date(`${b.date}T${timeB}`);
      return dateA.getTime() - dateB.getTime();
    });

  const filteredEvents =
    activeTab === "all"
      ? allEvents
      : allEvents.filter((event) => event.type === activeTab);

  // Variants untuk staggered list
  const container = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.07,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      {/* Header Section */}
      <section className="relative pt-28 pb-32 md:pt-32 md:pb-40 overflow-hidden bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50">
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl mx-auto text-center space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/80 backdrop-blur-sm rounded-full text-sm font-medium text-sky-700 border border-sky-200/50 shadow-sm">
              <div className="w-2 h-2 bg-sky-500 rounded-full animate-pulse"></div>
              Daftar Event Tersedia
            </div>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-blue-800 via-sky-600 to-blue-900 bg-clip-text text-transparent">
                Pilih Event Anda
              </span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
              Jelajahi berbagai kegiatan: COCONUT Open Class, Seminar, dan
              Webinar
            </p>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none">
          <svg
            className="relative block w-full h-12 md:h-20"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M0,0 Q300,80 600,60 T1200,0 L1200,120 L0,120 Z"
              fill="white"
            ></path>
          </svg>
        </div>
      </section>

      {/* Events List */}
      <section className="container mx-auto px-4 md:px-6 py-16 md:py-24">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-4 mb-12 bg-white/80 backdrop-blur-sm p-1.5 rounded-xl shadow-sm">
            <TabsTrigger
              value="all"
              className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-sky-600 data-[state=active]:to-blue-600 data-[state=active]:text-white"
            >
              Semua
            </TabsTrigger>
            <TabsTrigger
              value="Open Class"
              className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-sky-600 data-[state=active]:to-blue-600 data-[state=active]:text-white"
            >
              Open Class
            </TabsTrigger>
            <TabsTrigger
              value="Seminar"
              className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-sky-600 data-[state=active]:to-blue-600 data-[state=active]:text-white"
            >
              Seminar
            </TabsTrigger>
            <TabsTrigger
              value="Webinar"
              className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-sky-600 data-[state=active]:to-blue-600 data-[state=active]:text-white"
            >
              Webinar
            </TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {isLoading ? (
                <div className="text-center py-20">
                  <div className="inline-block w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="mt-4 text-slate-600">Memuat kegiatan...</p>
                </div>
              ) : filteredEvents.length > 0 ? (
                <motion.div
                  variants={container}
                  initial="hidden"
                  animate="show"
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto"
                >
                  {filteredEvents.map((event, index) => (
                    <motion.div
                      key={`${event.type}-${event.id}`}
                      variants={item}
                    >
                      <div className="bg-white border border-slate-200 rounded-2xl hover:shadow-2xl hover:shadow-sky-500/10 transition-all duration-500 hover:-translate-y-2 overflow-hidden h-full flex flex-col group">
                        <div className="p-7 flex-1 flex flex-col">
                          <div className="flex items-start justify-between gap-3 mb-4">
                            <h3 className="text-xl font-bold text-slate-800 line-clamp-2 flex-1 group-hover:text-sky-700 transition-colors">
                              {event.title}
                            </h3>
                            <span className="text-xs font-semibold px-3 py-1.5 bg-gradient-to-r from-sky-50 to-blue-50 text-sky-700 rounded-lg whitespace-nowrap border border-sky-200/50 flex-shrink-0">
                              {event.type}
                            </span>
                          </div>
                          <p className="text-sm text-slate-600 mb-6 line-clamp-2 flex-1">
                            {event.description}
                          </p>
                          <div className="space-y-3 text-sm text-slate-600 mb-5">
                            <div className="flex items-center gap-3">
                              <Calendar className="w-4 h-4 text-sky-600 flex-shrink-0" />
                              <span>
                                {formatDate(event.date)} •{" "}
                                {formatTime(event.time)}
                              </span>
                            </div>
                            <div className="flex items-center gap-3">
                              <MapPin className="w-4 h-4 text-sky-600 flex-shrink-0" />
                              <span className="line-clamp-1">
                                {event.location}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-slate-600">
                              <User className="w-4 h-4 text-blue-600" />
                              <span>{event.instructor}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <Users className="w-4 h-4 text-sky-600 flex-shrink-0" />
                              <span>
                                {event.registered}/{event.quota} Peserta
                              </span>
                            </div>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2 mb-5 overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-sky-600 to-blue-600 h-2 rounded-full transition-all duration-500"
                              style={{
                                width: `${
                                  event.quota > 0
                                    ? (event.registered / event.quota) * 100
                                    : 0
                                }%`,
                              }}
                            ></div>
                          </div>
                          <Link
                            to={`/informasi/${encodeURIComponent(event.type)}/${
                              event.id
                            }`}
                            className="w-full"
                          >
                            <Button
                              className="w-full font-medium bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 shadow-lg shadow-sky-500/30 hover:shadow-xl transition-all duration-300"
                              size="sm"
                            >
                              Lihat Detail
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <div className="text-center py-20">
                  <Calendar className="w-20 h-20 mx-auto mb-6 text-slate-300" />
                  <h3 className="text-2xl font-bold mb-3 text-slate-800">
                    Belum Ada Event Mendatang
                  </h3>
                  <p className="text-slate-600">
                    Event untuk kategori ini akan segera hadir
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </Tabs>
      </section>

      <Footer />
    </div>
  );
};

export default Kegiatan;
