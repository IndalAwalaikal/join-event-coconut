import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { FiBookOpen } from "react-icons/fi";
import { MdOutlineSpeakerNotes } from "react-icons/md";
import { FaLaptop } from "react-icons/fa";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  Users,
  ArrowRight,
  User,
  MapPin,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

// Tipe event dari API publik
interface EventItem {
  id: number | string;
  title: string;
  date: string; // "YYYY-MM-DD"
  time: string; // "HH:MM:SS"
  location: string;
  quota: number;
  instructor: string;
  description: string;
  registered?: number; // opsional
}

// Mock data poster kegiatan sebelumnya
const mockPosters = [
  {
    id: "p2",
    title: "IoT-Based Network Management",
    type: "Seminar" as const,
    image: "/Poster/Seminar/2025-2026/1.jpg",
    date: "24 Oktober 2025",
  },
  {
    id: "p1",
    title: "Go REST, Go Fast: Membangun REST API dengan Golang",
    type: "Open Class" as const,
    image: "/Poster/COC/batch_8.png",
    date: "17 Oktober 2025",
  },
  {
    id: "p3",
    title:
      "Level UP Your Skills: Bangun Portofolio Interaktif dengan Next.js dari Nol",
    type: "Open Class" as const,
    image: "/Poster/COC/batch_7.png",
    date: "13 Juni 2025",
  },
  {
    id: "p4",
    title: "THE ART OF PROMPTING : Crafting Better AI Responses",
    type: "Webinar" as const,
    image: "/Poster/Webinar/2024-2025/2.jpeg",
    date: "12 April 2025",
  },
  {
    id: "p5",
    title: "Blockchain Technology",
    type: "Webinar" as const,
    image: "/Poster/Webinar/2024-2025/1.jpg",
    date: "22 - 23 Maret 2025",
  },
  {
    id: "p6",
    title:
      "Programming 101: Mengenal dan Belajar Lebih dalam Konsep Pemrograman",
    type: "Open Class" as const,
    image: "/Poster/COC/batch_6.jpg",
    date: "02 Maret 2025",
  },
  {
    id: "p7",
    title: "Web Development with Laravel",
    type: "Open Class" as const,
    image: "/Poster/COC/batch_5.jpg",
    date: "28 Desember 2024",
  },
  {
    id: "p8",
    title:
      "BLOCKCHAIN DEMYSTIFIED: The Technology Behind the Digital Revolution",
    type: "Seminar" as const,
    image: "/Poster/Seminar/2024-2025/1.jpeg",
    date: "12 Oktober 2024",
  },
  {
    id: "p9",
    title: "Introduction to Sveltekit: The Frontend Framework of the Future",
    type: "Open Class" as const,
    image: "/Poster/COC/batch_4.jpg",
    date: "11 Oktober 2024",
  },
  {
    id: "p10",
    title: "Pengenalan Sistem Operasi dan Praktik Perintah Dasar Linux",
    type: "Open Class" as const,
    image: "/Poster/COC/batch_3.jpg",
    date: "10 Agustus 2024",
  },
  {
    id: "p11",
    title: "CRUD: Belajar Mengolah Data Menggunakan Golang dan MYSQL",
    type: "Open Class" as const,
    image: "/Poster/COC/batch_2.png",
    date: "10 Mei 2024",
  },
  {
    id: "p12",
    title:
      "AI FUTURE & HUMANITY: Penerapan Natural Language Processing dalam Mendeskripsikan Ulasan Pengguna",
    type: "Webinar" as const,
    image: "/Poster/Webinar/2023-2024/1.png",
    date: "4 Februari 2024",
  },
  {
    id: "p13",
    title: "THE DISPLAY IS MAGIC: Boostrap, Framework CSS & Javascript",
    type: "Open Class" as const,
    image: "/Poster/COC/batch_1.png",
    date: "12 Januari 2024",
  },
  {
    id: "p15",
    title: "AI & FUTURE OF HUMANITY",
    type: "Seminar" as const,
    image: "/Poster/Seminar/2023-2024/1.jpeg",
    date: "03 November 2023",
  },
  {
    id: "p14",
    title: "Introduce Your Self to Information Technology",
    type: "Open Class" as const,
    image: "/Poster/COC/batch_0.png",
    date: "12 - 13 Agustus 2023",
  },
];

const Home = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("all");
  const [activePosterTab, setActivePosterTab] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(6);
  const galleryRef = useRef<HTMLDivElement>(null);

  const [events, setEvents] = useState<{
    "Open Class": EventItem[];
    Seminar: EventItem[];
    Webinar: EventItem[];
  }>({
    "Open Class": [],
    Seminar: [],
    Webinar: [],
  });

  // Reset ke 6 saat ganti tab
  useEffect(() => {
    setVisibleCount(6);
  }, [activePosterTab]);

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
      console.error("Gagal memuat event:", error);
      toast({
        title: "Gagal Memuat Event",
        description: "Beberapa event mungkin tidak ditampilkan.",
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
      const timeA = a.time.split(":").slice(0, 2).join(":");
      const timeB = b.time.split(":").slice(0, 2).join(":");
      const dateA = new Date(`${a.date}T${timeA}`);
      const dateB = new Date(`${b.date}T${timeB}`);
      return dateA.getTime() - dateB.getTime();
    });

  const filteredEvents =
    activeTab === "all"
      ? allEvents
      : allEvents.filter((event) => {
          if (activeTab === "Open Class")
            return event.type === "Open Class";
          return event.type === activeTab;
        });

  const filteredPosters =
    activePosterTab === "all"
      ? mockPosters
      : mockPosters.filter((poster) => poster.type === activePosterTab);

  const handleCollapse = () => {
    setVisibleCount(6);
    document.getElementById("gallery-section")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  // Variants untuk staggered animations
  const container = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.08,
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

      {/* Hero Section */}
      <section className="relative pt-24 pb-32 md:pt-32 md:pb-40 overflow-hidden bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50">
        <div className="absolute inset-0 opacity-30">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, rgb(14 165 233 / 0.15) 1px, transparent 0)`,
              backgroundSize: "40px 40px",
            }}
          ></div>
        </div>

        <div className="absolute top-20 left-10 w-72 h-72 bg-sky-300/20 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-4xl mx-auto text-center space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/80 backdrop-blur-sm rounded-full text-sm font-medium text-sky-700 border border-sky-200/50 shadow-sm">
              <div className="w-2 h-2 bg-sky-500 rounded-full animate-pulse"></div>
              Platform Pendaftaran Event
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-blue-800 via-sky-600 to-blue-900 bg-clip-text text-transparent">
                COCONUT
              </span>
              <br />
              <span className="text-2xl md:text-4xl lg:text-5xl bg-gradient-to-r from-blue-700 via-sky-500 to-blue-800 bg-clip-text text-transparent font-semibold mt-2 block">
                Computer Club
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto font-light leading-relaxed">
              Computer Club Oriented Network, Utility & Technology
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <Link to="/kegiatan">
                <Button
                  size="lg"
                  className="w-full sm:w-auto font-medium bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 shadow-lg shadow-sky-500/30 hover:shadow-xl hover:shadow-sky-500/40 transition-all duration-300 hover:scale-105"
                >
                  Lihat Semua Event
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link to="/pendaftaran">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto font-medium bg-white/80 backdrop-blur-sm border-2 border-sky-600 text-sky-700 hover:bg-sky-50 hover:border-sky-700 transition-all duration-300 hover:scale-105"
                >
                  Daftar Sekarang
                </Button>
              </Link>
            </div>
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

      {/* About Section */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="space-y-6"
              >
                <div className="flex justify-center">
                  <div className="inline-block px-4 py-1.5 bg-sky-100 rounded-full text-sm font-medium text-sky-700 mb-2">
                    Tentang Platform
                  </div>
                </div>

                <h2 className="text-4xl md:text-5xl font-bold leading-snug text-center overflow-visible">
                  <span className="bg-gradient-to-r from-blue-800 via-sky-600 to-blue-900 bg-clip-text text-transparent block">
                    COCONUT Event
                  </span>
                  <span className="bg-gradient-to-r from-blue-800 via-sky-600 to-blue-900 bg-clip-text text-transparent block mt-2">
                    Study Club Teknologi
                  </span>
                </h2>

                <p className="text-slate-600 text-lg leading-relaxed mt-4 text-justify">
                  Platform resmi pendaftaran berbagai kegiatan yang
                  diselenggarakan oleh
                  <b> COCONUT Computer Club</b>. Temukan dan ikuti beragam event
                  seperti
                  <b> COCONUT Open Class, Workshop, dan Seminar</b> yang dirancang untuk
                  memperluas wawasan di bidang teknologi.
                </p>

                <p className="text-slate-600 text-lg leading-relaxed mt-3 text-justify">
                  Bergabunglah dalam komunitas pembelajar dan jadilah bagian
                  dari perjalanan COCONUT dalam menghadirkan ruang belajar yang
                  interaktif dan inspiratif.
                </p>

                <Link to="/kegiatan">
                  <Button
                    variant="outline"
                    className="font-medium border-2 border-sky-600 text-sky-700 hover:bg-sky-50 mt-4"
                  >
                    Pelajari Lebih Lanjut
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </motion.div>

              {/* Ganti bagian statistik dengan gambar */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="flex justify-center"
              >
                <img
                  src="/kegiatan.JPG"
                  alt="Ilustrasi COCONUT"
                  className="rounded-2xl shadow-lg max-w-full h-auto object-cover"
                />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Program Section */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-slate-50 via-sky-50 to-blue-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-sky-300/10 rounded-full blur-3xl"></div>
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-block px-4 py-1.5 bg-white/80 backdrop-blur-sm rounded-full text-sm font-medium text-sky-700 mb-4 border border-sky-200/50">
              Program Kami
            </div>
            <h2 className="text-4xl md:text-5xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-blue-800 via-sky-600 to-blue-900 bg-clip-text text-transparent">
                Program Kegiatan
              </span>
            </h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              Nikmati tiga kegiatan seru dalam event COCONUT yang siap mengasah
              kemampuan dan kreativitas Anda di dunia teknologi.
            </p>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
          >
            {[
              {
                title: "COCONUT Open Class",
                desc: "Sesi belajar terbuka untuk siapa saja yang ingin mengenal dan mencoba teknologi terbaru dengan cara yang seru dan interaktif.",
                icon: <FiBookOpen className="text-sky-600 text-3xl" />,
              },
              {
                title: "Seminar",
                desc: "Berbagi wawasan seputar tren teknologi dan inovasi bersama narasumber inspiratif dari berbagai bidang.",
                icon: (
                  <MdOutlineSpeakerNotes className="text-blue-600 text-3xl" />
                ),
              },
              {
                title: "Webinar",
                desc: "Kegiatan online yang bisa diikuti dari mana saja untuk menambah pengetahuan dan keterampilan di dunia teknologi.",
                icon: <FaLaptop className="text-indigo-600 text-3xl" />,
              },
            ].map((program, index) => (
              <motion.div
                key={index}
                variants={item}
                className="group bg-white rounded-2xl p-8 hover:shadow-2xl hover:shadow-sky-500/20 transition-all duration-500 hover:-translate-y-2 animate-slide-up border border-slate-100 text-center"
              >
                {/* Ikon tanpa background, langsung ditampilkan dan dipusatkan */}
                <div className="mb-6 flex justify-center">{program.icon}</div>
                <h3 className="text-2xl font-bold text-slate-800 mb-4">
                  {program.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">{program.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Events Section */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-block px-4 py-1.5 bg-sky-100 rounded-full text-sm font-medium text-sky-700 mb-4">
              Event Terbaru
            </div>
            <h2 className="text-4xl md:text-5xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-blue-800 via-sky-600 to-blue-900 bg-clip-text text-transparent">
                Event Mendatang
              </span>
            </h2>

            <p className="text-slate-600 text-lg">
              Pilih kegiatan yang sesuai dengan minat Anda
            </p>
          </motion.div>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
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
                    <p className="mt-4 text-slate-600">Memuat event...</p>
                  </div>
                ) : filteredEvents.length > 0 ? (
                  <>
                    <motion.div
                      variants={container}
                      initial="hidden"
                      animate="show"
                      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto mb-12"
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
                                <span className="text-xs font-semibold px-3 py-1.5 bg-gradient-to-r from-sky-50 to-blue-50 text-sky-700 rounded-lg whitespace-nowrap border border-sky-200/50">
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
                                to={`/informasi/${encodeURIComponent(
                                  event.type
                                )}/${event.id}`}
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
                    <div className="text-center">
                      <Link to="/kegiatan">
                        <Button
                          variant="outline"
                          size="lg"
                          className="font-medium border-2 border-sky-600 text-sky-700 hover:bg-sky-50"
                        >
                          Lihat Semua Event
                          <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </>
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
        </div>
      </section>

      {/* Gallery/Poster Section */}
      <section
        id="gallery-section"
        className="py-20 md:py-28 bg-gradient-to-br from-slate-50 via-sky-50 to-blue-50 relative overflow-hidden"
      >
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-300/10 rounded-full blur-3xl"></div>
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-block px-4 py-1.5 bg-white/80 backdrop-blur-sm rounded-full text-sm font-medium text-sky-700 mb-4 border border-sky-200/50">
              Galeri Kegiatan
            </div>
            <h2 className="text-4xl md:text-5xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-blue-800 via-sky-600 to-blue-900 bg-clip-text text-transparent">
                Kegiatan Sebelumnya
              </span>
            </h2>
            <p className="text-slate-600 text-lg">
              Lihat dokumentasi kegiatan yang telah kami selenggarakan
            </p>
          </motion.div>

          <Tabs
            value={activePosterTab}
            onValueChange={setActivePosterTab}
            className="w-full"
          >
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
                key={activePosterTab + visibleCount}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {filteredPosters.length === 0 ? (
                  <div className="text-center py-12 text-slate-500">
                    Tidak ada kegiatan untuk ditampilkan.
                  </div>
                ) : (
                  <>
                    <div
                      ref={galleryRef}
                      className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto"
                    >
                      {filteredPosters
                        .slice(0, visibleCount)
                        .map((poster, index) => (
                          <motion.div
                            key={poster.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: index * 0.06 }}
                            whileHover={{ y: -8 }}
                            className="group"
                          >
                            <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl hover:shadow-sky-500/20 transition-all duration-500 aspect-[3/4] bg-gradient-to-br from-slate-100 to-slate-200">
                              <img
                                src={poster.image.trim()}
                                alt={poster.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                              <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                                <span className="inline-block text-xs font-semibold px-3 py-1.5 bg-white/90 backdrop-blur-sm text-sky-700 rounded-lg mb-3">
                                  {poster.type}
                                </span>
                                <h3 className="text-white font-bold text-lg mb-2 line-clamp-2">
                                  {poster.title}
                                </h3>
                                <p className="text-white/80 text-sm">
                                  {poster.date}
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                    </div>

                    {filteredPosters.length > 6 && (
                      <div className="text-center mt-12 flex justify-center gap-4 flex-wrap">
                        {visibleCount < filteredPosters.length ? (
                          <Button
                            variant="outline"
                            size="lg"
                            className="font-medium border-2 border-sky-600 text-sky-700 hover:bg-sky-50"
                            onClick={() => setVisibleCount((prev) => prev + 6)}
                          >
                            Lihat Lebih Banyak
                            <ChevronDown className="ml-2 w-4 h-4" />
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="lg"
                            className="font-medium border-2 border-sky-600 text-sky-700 hover:bg-sky-50"
                            onClick={handleCollapse}
                          >
                            Tutup
                            <ChevronUp className="ml-2 w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    )}
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </Tabs>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50 opacity-50"></div>
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="max-w-4xl mx-auto bg-gradient-to-br from-sky-600 to-blue-700 rounded-3xl p-10 md:p-16 text-center shadow-2xl shadow-sky-500/30 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-bold mb-5 text-white">
                Siap Ikut Keseruan Event COCONUT?
              </h2>
              <p className="text-white/90 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
                Daftarkan diri Anda sekarang dan rasakan pengalaman seru belajar
                teknologi serta berkolaborasi dalam event COCONUT!
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/pendaftaran">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto font-medium bg-white text-sky-700 hover:bg-slate-50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                  >
                    Daftar Sekarang
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
                <Link to="/kegiatan">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto font-medium bg-transparent border-2 border-white text-white hover:bg-white/10 backdrop-blur-sm transition-all duration-300 hover:scale-105"
                  >
                    Lihat Event
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
