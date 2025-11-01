import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Check,
  AlertCircle,
  Upload,
  X,
  User,
  Mail,
  Phone,
  Building,
  Calendar,
  ImageIcon,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Tipe event dari API
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

const Pendaftaran = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registrationCode, setRegistrationCode] = useState("");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);

  // State form
  const [formData, setFormData] = useState({
    eventType: "", // "open-class", "seminar", "webinar"
    selectedEventId: "", // ID event yang dipilih (hanya untuk UI)
    name: "",
    email: "",
    phone: "",
    university: "",
    photo: null as File | null,
  });

  // Data event dari API
  const [events, setEvents] = useState<{
    "open-class": EventItem[];
    seminar: EventItem[];
    webinar: EventItem[];
  }>({
    "open-class": [],
    seminar: [],
    webinar: [],
  });

  // Fetch events dari API
  const fetchEvents = async () => {
    setIsLoadingEvents(true);
    try {
      const [openClassRes, seminarRes, webinarRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_BASE_URL}/open-classes`),
        fetch(`${import.meta.env.VITE_API_BASE_URL}/seminars`),
        fetch(`${import.meta.env.VITE_API_BASE_URL}/webinars`),
      ]);

      const openClassData = (await openClassRes.json()).data || [];
      const seminarData = (await seminarRes.json()).data || [];
      const webinarData = (await webinarRes.json()).data || [];

      setEvents({
        "open-class": openClassData,
        seminar: seminarData,
        webinar: webinarData,
      });
    } catch (error) {
      console.error("Gagal memuat daftar event:", error);
      toast({
        title: "Gagal Memuat Event",
        description: "Beberapa event mungkin tidak ditampilkan.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingEvents(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File terlalu besar",
        description: "Ukuran file maksimal 10MB",
        variant: "destructive",
      });
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Format file tidak valid",
        description: "Hanya file gambar (JPG, PNG, JPEG) yang diperbolehkan",
        variant: "destructive",
      });
      return;
    }

    setFormData({ ...formData, photo: file });

    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    setFormData({ ...formData, photo: null });
    setPhotoPreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.photo) {
      toast({
        title: "Foto diperlukan",
        description: "Silakan upload foto Anda terlebih dahulu",
        variant: "destructive",
      });
      return;
    }

    if (!formData.eventType) {
      toast({
        title: "Event belum dipilih",
        description: "Silakan pilih jenis event dan event yang ingin diikuti",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Tentukan endpoint berdasarkan jenis event
      let endpoint = "";
      switch (formData.eventType) {
        case "open-class":
          endpoint = "/open-class/register";
          break;
        case "seminar":
          endpoint = "/seminar/register";
          break;
        case "webinar":
          endpoint = "/webinar/register";
          break;
        default:
          throw new Error("Jenis event tidak valid");
      }

      const submitData = new FormData();
      submitData.append("nama", formData.name);
      submitData.append("email", formData.email);
      submitData.append("nomor_hp", formData.phone);
      submitData.append("asal_universitas", formData.university);
      submitData.append("bukti_foto", formData.photo);

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}${endpoint}`,
        {
          method: "POST",
          body: submitData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Gagal mendaftar");
      }

      const code = `COCONUT-${Date.now()
        .toString(36)
        .toUpperCase()}-${Math.random()
        .toString(36)
        .substring(2, 5)
        .toUpperCase()}`;
      setRegistrationCode(code);
      setRegistrationSuccess(true);

      toast({
        title: "Pendaftaran Berhasil!",
        description: "Informasi Berikutnya akan disampaikan melalui melalui nomor WhatsApp dan email Anda.",
      });
    } catch (error: any) {
      console.error("Registration error:", error);
      toast({
        title: "Pendaftaran Gagal",
        description: error.message || "Silakan coba lagi.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const availableEvents =
    events[formData.eventType as keyof typeof events] || [];

  // Success Page
  if (registrationSuccess) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Navbar />
        <div className="flex-1 flex items-center justify-center px-4 py-16">
          <div className="max-w-md w-full bg-white border border-slate-200 rounded-2xl p-8 text-center animate-fade-in shadow-lg">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-emerald-100 to-green-100 flex items-center justify-center">
              <Check className="w-8 h-8 text-emerald-600" />
            </div>
            <h2 className="text-3xl font-bold mb-3 text-slate-800">
              Pendaftaran Berhasil!
            </h2>
            <p className="text-slate-600 mb-8">
              Terima kasih telah mendaftar untuk kegiatan COCONUT
            </p>

            {/* <div className="p-6 bg-gradient-to-br from-sky-50 to-blue-50 rounded-xl mb-6 border border-sky-200">
              <p className="text-sm text-slate-600 mb-2">
                Kode Pendaftaran Anda:
              </p>
              <p className="text-2xl font-bold text-sky-700 mb-2 tracking-wider">
                {registrationCode}
              </p>
              <p className="text-xs text-slate-500">
                Simpan kode ini untuk verifikasi kehadiran
              </p>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-left">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-amber-800">
                  <p className="font-semibold mb-1">Informasi Penting:</p>
                  <p className="leading-relaxed">
                    Konfirmasi pendaftaran akan dikirim ke email{" "}
                    <span className="font-medium">{formData.email}</span> dalam
                    1x24 jam.
                  </p>
                </div>
              </div>
            </div> */}

            <Button
              onClick={() => navigate("/")}
              className="w-full font-medium bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 shadow-lg shadow-sky-500/30"
            >
              Kembali ke Beranda
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      {/* Header */}
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
          <div className="max-w-3xl mx-auto text-center space-y-6 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/80 backdrop-blur-sm rounded-full text-sm font-medium text-sky-700 border border-sky-200/50 shadow-sm">
              <div className="w-2 h-2 bg-sky-500 rounded-full animate-pulse"></div>
              Form Pendaftaran Event
            </div>

            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-blue-800 via-sky-600 to-blue-900 bg-clip-text text-transparent">
                Daftar Event
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
              Isi formulir di bawah ini untuk mendaftar ke event pilihan Anda
            </p>
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

      {/* Form */}
      <section className="container mx-auto px-4 md:px-6 py-16 md:py-24">
        <div className="max-w-4xl mx-auto">
          <form
            onSubmit={handleSubmit}
            className="bg-white border border-slate-200 rounded-2xl p-8 md:p-12 animate-slide-up shadow-lg"
          >
            {/* Event Selection */}
            <div className="mb-10 pb-10 border-b border-slate-200">
              <h2 className="text-2xl font-bold mb-6 text-slate-800 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-100 to-blue-100 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-sky-600" />
                </div>
                Pilih Event
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label
                    htmlFor="eventType"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Jenis Event <span className="text-red-600">*</span>
                  </Label>
                  <Select
                    value={formData.eventType}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        eventType: value,
                        selectedEventId: "", // reset event saat ganti jenis
                      })
                    }
                    required
                  >
                    <SelectTrigger className="h-12 border-slate-300 focus:border-sky-500 focus:ring-sky-500">
                      <SelectValue placeholder="Pilih jenis event" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open-class">COCONUT Open Class</SelectItem>
                      <SelectItem value="seminar">Seminar</SelectItem>
                      <SelectItem value="webinar">Webinar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label
                    htmlFor="eventId"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Pilih Event <span className="text-red-600">*</span>
                  </Label>
                  {isLoadingEvents ? (
                    <div className="h-12 flex items-center text-slate-500">
                      Memuat daftar event...
                    </div>
                  ) : (
                    <Select
                      key={formData.eventType}
                      value={formData.selectedEventId}
                      onValueChange={(value) =>
                        setFormData({ ...formData, selectedEventId: value })
                      }
                      required
                      disabled={!formData.eventType}
                    >
                      <SelectTrigger className="h-12 border-slate-300 focus:border-sky-500 focus:ring-sky-500 text-slate-800">
                        <SelectValue
                          placeholder={
                            formData.eventType
                              ? availableEvents.length > 0
                                ? "Pilih event"
                                : "Belum ada event tersedia"
                              : "Pilih jenis event terlebih dahulu"
                          }
                          className="text-slate-800"
                        />
                      </SelectTrigger>

                      <SelectContent className="bg-white text-slate-800">
                        {availableEvents.length > 0 ? (
                          availableEvents.map((event) => (
                            <SelectItem key={event.id} value={String(event.id)}>
                              {event.title} -{" "}
                              {new Date(event.date).toLocaleDateString("id-ID")}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="no-event" disabled>
                            Belum ada event tersedia
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  )}
                  {formData.eventType &&
                    availableEvents.length === 0 &&
                    !isLoadingEvents && (
                      <p className="text-sm text-amber-600 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        Event untuk kategori ini sedang tidak tersedia
                      </p>
                    )}
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div className="mb-10 pb-10 border-b border-slate-200">
              <h2 className="text-2xl font-bold mb-6 text-slate-800 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-100 to-blue-100 flex items-center justify-center">
                  <User className="w-5 h-5 text-sky-600" />
                </div>
                Data Pribadi
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label
                    htmlFor="name"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Nama Lengkap <span className="text-red-600">*</span>
                  </Label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      id="name"
                      required
                      placeholder="Masukkan nama lengkap"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="h-12 pl-11 border-slate-300 focus:border-sky-500 focus:ring-sky-500"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label
                    htmlFor="email"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Email <span className="text-red-600">*</span>
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      id="email"
                      type="email"
                      required
                      placeholder="nama@email.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="h-12 pl-11 border-slate-300 focus:border-sky-500 focus:ring-sky-500"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label
                    htmlFor="phone"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Nomor Telepon <span className="text-red-600">*</span>
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      id="phone"
                      type="tel"
                      required
                      placeholder="08123456789"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="h-12 pl-11 border-slate-300 focus:border-sky-500 focus:ring-sky-500"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label
                    htmlFor="university"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Asal Universitas <span className="text-red-600">*</span>
                  </Label>
                  <div className="relative">
                    <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      id="university"
                      required
                      placeholder="Nama universitas"
                      value={formData.university}
                      onChange={(e) =>
                        setFormData({ ...formData, university: e.target.value })
                      }
                      className="h-12 pl-11 border-slate-300 focus:border-sky-500 focus:ring-sky-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Photo Upload */}
            <div className="mb-10">
              <h2 className="text-2xl font-bold mb-6 text-slate-800 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-100 to-blue-100 flex items-center justify-center">
                  <ImageIcon className="w-5 h-5 text-sky-600" />
                </div>
                Upload Foto
              </h2>

              <div className="space-y-3">
                <Label
                  htmlFor="photo"
                  className="text-sm font-semibold text-slate-700"
                >
                  Foto Diri (Bukti KTM/Identitas){" "}
                  <span className="text-red-600">*</span>
                </Label>

                {!photoPreview ? (
                  <label
                    htmlFor="photo"
                    className="flex flex-col items-center justify-center w-full h-56 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition-all duration-300 hover:border-sky-400"
                  >
                    <div className="flex flex-col items-center justify-center py-6">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-sky-100 to-blue-100 flex items-center justify-center mb-4">
                        <Upload className="w-7 h-7 text-sky-600" />
                      </div>
                      <p className="mb-2 text-sm text-slate-700">
                        <span className="font-semibold">Klik untuk upload</span>{" "}
                        atau drag and drop
                      </p>
                      <p className="text-xs text-slate-500">
                        PNG, JPG atau JPEG (Maksimal 10MB)
                      </p>
                    </div>
                    <input
                      id="photo"
                      type="file"
                      className="hidden"
                      accept="image/jpeg,image/jpg,image/png"
                      onChange={handlePhotoChange}
                    />
                  </label>
                ) : (
                  <div className="relative w-full h-56 border-2 border-sky-300 rounded-xl overflow-hidden group">
                    <img
                      src={photoPreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <button
                      type="button"
                      onClick={removePhoto}
                      className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-300 hover:scale-110 shadow-lg"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                )}
                <p className="text-xs text-slate-500">
                  Upload foto diri atau scan KTM/identitas yang jelas
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/kegiatan")}
                className="flex-1 h-12 font-medium border-2 border-slate-300 hover:bg-slate-50"
                disabled={isSubmitting}
              >
                Batal
              </Button>
              <Button
                type="submit"
                className="flex-1 h-12 font-semibold bg-gradient-to-r from-sky-300 to-blue-400 hover:from-sky-400 hover:to-blue-500 shadow-lg shadow-sky-300/50 text-white transition-all duration-200"
                disabled={isSubmitting || !formData.selectedEventId}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Memproses...
                  </>
                ) : (
                  "Daftar Sekarang"
                )}
              </Button>
            </div>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Pendaftaran;
