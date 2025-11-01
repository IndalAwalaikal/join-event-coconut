import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  ArrowLeft,
  Check,
  User,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface EventItem {
  id: number | string;
  title: string;
  date: string; // "YYYY-MM-DD"
  time: string; // "HH:MM:SS"
  location: string;
  quota: number;
  instructor: string;
  description: string;
  registered: number;
  type: string;
}

// === DATA DUMMY UNTUK INFORMASI TAMBAHAN ===
const getDummyContent = (eventId: string | number) => {
  const id = String(eventId);
  switch (id) {
    case "1":
      return {
        benefits: [
          "Sertifikat keikutsertaan resmi",
          "Modul pembelajaran lengkap dalam format PDF",
          "Akses ke komunitas belajar eksklusif",
          "Mentoring session 2x setelah kelas",
          "Recording video pembelajaran",
          "Template project siap pakai",
        ],
        requirements: [
          "Laptop dengan spesifikasi minimal (RAM 4GB, Processor Core i3 atau setara)",
          "Koneksi Internet stabil minimal 5 Mbps",
          "Text Editor (VS Code recommended)",
          "Browser modern (Chrome, Firefox, atau Edge)",
          "Semangat belajar dan komitmen tinggi",
        ],
        syllabus: [
          "Pengenalan konsep dasar",
          "Materi inti sesuai topik",
          "Studi kasus / praktik langsung",
          "Sesi tanya jawab dan diskusi",
        ],
      };
    case "2":
      return {
        benefits: [
          "E-Sertifikat nasional",
          "Slide presentasi dari pembicara",
          "Akses ke grup diskusi eksklusif",
          "Rekaman seminar selamanya",
          "Networking dengan peserta dari seluruh Indonesia",
        ],
        requirements: [
          "Mahasiswa, dosen, atau profesional",
          "Minat di bidang teknologi dan inovasi",
          "Koneksi internet stabil",
        ],
        syllabus: [
          "Tren terkini di dunia AI",
          "Implementasi AI di industri",
          "Etika dan tantangan AI",
          "Sesi tanya jawab interaktif",
        ],
      };
    case "3":
      return {
        benefits: [
          "Sertifikat digital",
          "Link rekaman webinar",
          "Dokumen pendukung (PDF)",
          "Kesempatan tanya langsung ke narasumber",
        ],
        requirements: [
          "Perangkat (laptop/HP) + koneksi internet",
          "Aplikasi Zoom terinstal (opsional)",
        ],
        syllabus: [
          "Pengantar cloud computing",
          "Demo AWS & Azure",
          "Tips karier di bidang cloud",
          "Sesi Q&A",
        ],
      };
    default:
      return {
        benefits: [
          "Sertifikat keikutsertaan",
          "Materi pembelajaran",
          "Rekaman kegiatan",
        ],
        requirements: ["Perangkat dan koneksi internet", "Semangat belajar!"],
        syllabus: ["Pengenalan topik", "Materi inti", "Diskusi & penutup"],
      };
  }
};

const EventDetail = () => {
  const { id, type } = useParams<{ id: string; type: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [event, setEvent] = useState<EventItem | null>(null);
  const [loading, setLoading] = useState(true);

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

  const fetchEvent = async () => {
    if (!id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const [openClassRes, seminarRes, webinarRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_BASE_URL}/open-classes`),
        fetch(`${import.meta.env.VITE_API_BASE_URL}/seminars`),
        fetch(`${import.meta.env.VITE_API_BASE_URL}/webinars`),
      ]);

      const openClassData = (await openClassRes.json()).data || [];
      const seminarData = (await seminarRes.json()).data || [];
      const webinarData = (await webinarRes.json()).data || [];

      const allEvents = [
        ...openClassData.map((e: any) => ({ ...e, type: "Open Class" })),
        ...seminarData.map((e: any) => ({ ...e, type: "Seminar" })),
        ...webinarData.map((e: any) => ({ ...e, type: "Webinar" })),
      ];

      const found = allEvents.find(
        (e: any) => String(e.id) === id && e.type === type
      );
      setEvent(found || null);
    } catch (error) {
      console.error("Gagal memuat event:", error);
      toast({
        title: "Gagal Memuat Event",
        description: "Tidak dapat mengambil detail event.",
        variant: "destructive",
      });
      setEvent(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="inline-block w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Navbar />
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center max-w-md animate-fade-in">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-sky-100 to-blue-100 flex items-center justify-center mx-auto mb-6">
              <Calendar className="w-10 h-10 text-sky-600" />
            </div>
            <h2 className="text-3xl font-bold mb-3 text-slate-800">
              Event Tidak Ditemukan
            </h2>
            <p className="text-slate-600 mb-8">
              Event dengan ID "{id}" tidak tersedia atau sudah dihapus.
            </p>
            <Button
              onClick={() => navigate("/kegiatan")}
              className="bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali ke Daftar Event
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Ambil konten dummy berdasarkan ID
  const content = getDummyContent(event.id);

  const availableSpots = event.quota - event.registered;
  const isAvailable = availableSpots > 0;
  const progressPercentage =
    event.quota > 0 ? (event.registered / event.quota) * 100 : 0;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      {/* Header Section */}
      <section className="relative pt-28 pb-32 md:pt-32 md:pb-40 overflow-hidden bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50">
        <div className="absolute inset-0 opacity-30">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, rgb(14 165 233 / 0.15) 1px, transparent 0)`,
              backgroundSize: "40px 40px",
            }}
          ></div>
        </div>

        <div className="absolute top-10 right-10 w-72 h-72 bg-sky-300/20 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-10 left-10 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <Button
            variant="ghost"
            onClick={() => navigate("/kegiatan")}
            className="mb-6 hover:bg-white/50 text-slate-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>

          <div className="animate-fade-in max-w-4xl">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/80 backdrop-blur-sm rounded-full text-sm font-medium text-sky-700 border border-sky-200/50 shadow-sm mb-4">
              <div className="w-2 h-2 bg-sky-500 rounded-full animate-pulse"></div>
              {event.type}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-slate-800 leading-tight">
              <span className="bg-gradient-to-r from-blue-800 via-sky-600 to-blue-900 bg-clip-text text-transparent">
                {event.title}
              </span>
            </h1>
            <div className="flex items-center gap-2 text-slate-600">
              <User className="w-5 h-5 text-sky-600" />
              <span className="text-lg">
                Pembicara:{" "}
                <span className="font-semibold text-slate-800">
                  {event.instructor}
                </span>
              </span>
            </div>
          </div>
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

      <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Event Details (Kiri) — Gunakan Data Dummy */}
          <div className="lg:col-span-2 space-y-6 animate-slide-up">
            {/* Description — Bisa tetap dari API */}
            <div className="bg-white border border-slate-200 rounded-2xl p-8 hover:shadow-lg transition-shadow duration-300">
              <h2 className="text-2xl font-bold mb-4 text-slate-800">
                Deskripsi Kegiatan
              </h2>
              <p className="text-slate-600 leading-relaxed text-base">
                {event.description}
              </p>
            </div>

            {/* Benefits — DUMMY */}
            <div className="bg-white border border-slate-200 rounded-2xl p-8 hover:shadow-lg transition-shadow duration-300">
              <h2 className="text-2xl font-bold mb-6 text-slate-800">
                Apa yang Anda Dapatkan
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {content.benefits.map((benefit, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-4 bg-gradient-to-br from-sky-50 to-blue-50 rounded-xl border border-sky-100 hover:shadow-md transition-all duration-300 group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-600 to-blue-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm text-slate-700 leading-relaxed pt-1">
                      {benefit}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Requirements — DUMMY */}
            <div className="bg-white border border-slate-200 rounded-2xl p-8 hover:shadow-lg transition-shadow duration-300">
              <h2 className="text-2xl font-bold mb-6 text-slate-800">
                Persyaratan
              </h2>
              <ul className="space-y-4">
                {content.requirements.map((req, index) => (
                  <li key={index} className="flex items-start gap-4">
                    <div className="w-6 h-6 rounded-full bg-sky-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5 text-sky-600" />
                    </div>
                    <span className="text-sm text-slate-600 leading-relaxed">
                      {req}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Syllabus — DUMMY */}
            <div className="bg-white border border-slate-200 rounded-2xl p-8 hover:shadow-lg transition-shadow duration-300">
              <h2 className="text-2xl font-bold mb-6 text-slate-800">
                Materi yang Akan Dipelajari
              </h2>
              <ul className="space-y-4">
                {content.syllabus.map((item, index) => (
                  <li key={index} className="flex items-start gap-4 group">
                    <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-sky-600 to-blue-600 text-white flex items-center justify-center text-sm font-bold flex-shrink-0 group-hover:scale-110 transition-transform shadow-md">
                      {index + 1}
                    </span>
                    <span className="pt-1.5 text-sm text-slate-600 leading-relaxed">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sidebar (Kanan) — Tetap dari API */}
          <div className="lg:col-span-1">
            <div
              className="sticky top-24 bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-lg animate-slide-up"
              style={{ animationDelay: "200ms" }}
            >
              <div
                className={`p-4 text-center font-semibold ${
                  isAvailable
                    ? "bg-gradient-to-r from-cyan-400 via-sky-500 to-blue-600 text-white"
                    : "bg-gradient-to-r from-red-500 to-rose-500 text-white"
                }`}
              >
                {isAvailable ? "✓ Pendaftaran Dibuka" : "✕ Pendaftaran Ditutup"}
              </div>

              <div className="p-6 space-y-6">
                <div className="space-y-5">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-100 to-blue-100 flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-5 h-5 text-sky-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 text-sm mb-1">
                        Tanggal
                      </p>
                      <p className="text-sm text-slate-600">
                        {formatDate(event.date)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-100 to-blue-100 flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-sky-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 text-sm mb-1">
                        Waktu
                      </p>
                      <p className="text-sm text-slate-600">
                        {formatTime(event.time)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-100 to-blue-100 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-sky-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 text-sm mb-1">
                        Lokasi
                      </p>
                      <p className="text-sm text-slate-600">{event.location}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-100 to-blue-100 flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-sky-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 text-sm mb-1">
                        Pembicara
                      </p>
                      <p className="text-sm text-slate-600">{event.instructor}</p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-6">
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-semibold text-slate-800 text-sm flex items-center gap-2">
                        <Users className="w-4 h-4 text-sky-600" />
                        Kuota Peserta
                      </span>
                      <span className="text-sm font-bold text-slate-700">
                        {event.registered}/{event.quota}
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-3 rounded-full transition-all duration-500 ${
                          progressPercentage > 80
                            ? "bg-gradient-to-r from-red-500 to-rose-500"
                            : "bg-gradient-to-r from-sky-600 to-blue-600"
                        }`}
                        style={{ width: `${progressPercentage}%` }}
                      ></div>
                    </div>
                    {isAvailable && availableSpots <= 10 && (
                      <p className="text-xs text-red-600 mt-3 font-semibold flex items-center gap-1">
                        <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
                        Tersisa {availableSpots} slot lagi!
                      </p>
                    )}
                  </div>

                  <Button
                    className={`w-full font-semibold mt-6 ${
                      isAvailable
                        ? "bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 shadow-lg shadow-sky-500/30 hover:shadow-xl hover:scale-105"
                        : "bg-slate-300 cursor-not-allowed"
                    } transition-all duration-300`}
                    disabled={!isAvailable}
                    onClick={() => navigate(`/pendaftaran?eventId=${event.id}`)}
                  >
                    {!isAvailable ? "Pendaftaran Ditutup" : "Daftar Sekarang"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default EventDetail;
