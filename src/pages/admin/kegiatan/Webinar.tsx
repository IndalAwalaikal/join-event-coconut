import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ApiClient } from "@/lib/ApiClient";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Calendar,
  MapPin,
  Users,
  Clock,
  Eye,
  User,
  Link as LinkIcon,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// 🔁 SAMA DENGAN SEMINAR — gunakan field yang sama
interface WebinarEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string; // ✅ bukan platform
  quota: number;
  registered: number;
  instructor: string; // ✅ bukan host
  description: string;
  status: "active" | "inactive" | "completed";
  createdAt: string;
}

// Helper: Ekstrak jam mulai dan format ke HH:mm:ss
const extractStartTime = (input: string): string => {
  if (!input.trim()) return "00:00:00";
  const startPart = input.split(" - ")[0].trim();
  const parts = startPart.split(":").map((p) => p.trim());
  let hour = "00";
  let minute = "00";

  if (parts.length >= 1) {
    const h = parseInt(parts[0], 10);
    if (!isNaN(h) && h >= 0 && h <= 23) {
      hour = String(h).padStart(2, "0");
    }
  }
  if (parts.length >= 2) {
    const m = parseInt(parts[1], 10);
    if (!isNaN(m) && m >= 0 && m <= 59) {
      minute = String(m).padStart(2, "0");
    }
  }

  return `${hour}:${minute}:00`;
};

const formatDateForMySQL = (dateString: string): string => {
  if (!dateString) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return dateString;
  }
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";
  return date.toISOString().split("T")[0];
};

const AdminWebinar = () => {
  const { toast } = useToast();
  const [events, setEvents] = useState<WebinarEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<WebinarEvent[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<WebinarEvent | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 🔁 SAMA DENGAN SEMINAR
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
    quota: "",
    instructor: "",
    description: "",
  });

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const response = await ApiClient.get<any>("/admin/webinars");
      const dataArray = Array.isArray(response.data) ? response.data : [];

      const formatted: WebinarEvent[] = dataArray.map((item: any) => {
        const mysqlDate = formatDateForMySQL(item.date);

        const eventDate = new Date(mysqlDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        eventDate.setHours(0, 0, 0, 0);
        let status: "active" | "inactive" | "completed" = "active";
        if (eventDate < today) {
          status = "completed";
        }

        return {
          id: String(item.id),
          title: item.title || "",
          date: mysqlDate,
          time: item.time || "",
          location: item.location || "", // ✅
          quota: Number(item.quota) || 0,
          registered: 0,
          instructor: item.instructor || "", // ✅
          description: item.description || "",
          status,
          createdAt: item.created_at || new Date().toISOString(),
        };
      });

      setEvents(formatted);
      setFilteredEvents(formatted);
    } catch (error: any) {
      console.error("Fetch webinar error:", error);
      toast({
        title: "Gagal Memuat Data",
        description: error.message || "Cek koneksi atau coba lagi nanti.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const filtered = events.filter(
      (event) =>
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.location.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredEvents(filtered);
  }, [searchQuery, events]);

  useEffect(() => {
    fetchEvents();
  }, []);

  const resetForm = () => {
    setFormData({
      title: "",
      date: "",
      time: "",
      location: "",
      quota: "",
      instructor: "",
      description: "",
    });
  };

  const handleAdd = async () => {
    if (
      !formData.title ||
      !formData.date ||
      !formData.time ||
      !formData.location ||
      !formData.quota
    ) {
      toast({
        title: "Data tidak lengkap",
        description: "Mohon lengkapi semua field yang diperlukan",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const startTime = extractStartTime(formData.time);
      const mysqlDate = formatDateForMySQL(formData.date);

      await ApiClient.post("/admin/webinars", {
        title: formData.title,
        date: mysqlDate,
        time: startTime,
        location: formData.location, // ✅
        quota: parseInt(formData.quota, 10),
        instructor: formData.instructor, // ✅
        description: formData.description,
      });

      toast({
        title: "Berhasil!",
        description: "Webinar baru telah ditambahkan",
      });
      setIsAddDialogOpen(false);
      resetForm();
      fetchEvents();
    } catch (error: any) {
      console.error("Add webinar error:", error);
      toast({
        title: "Gagal",
        description: error.message || "Terjadi kesalahan saat menambahkan data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = async () => {
    if (!selectedEvent) return;

    setIsLoading(true);
    try {
      const startTime = extractStartTime(formData.time);
      const mysqlDate = formatDateForMySQL(formData.date);

      await ApiClient.put("/admin/webinars", {
        id: parseInt(selectedEvent.id, 10),
        data: {
          title: formData.title,
          date: mysqlDate,
          time: startTime,
          location: formData.location, // ✅
          quota: parseInt(formData.quota, 10) || 0,
          instructor: formData.instructor, // ✅
          description: formData.description,
        },
      });

      toast({
        title: "Berhasil!",
        description: "Data Webinar telah diperbarui",
      });
      setIsEditDialogOpen(false);
      setSelectedEvent(null);
      resetForm();
      fetchEvents();
    } catch (error: any) {
      console.error("Edit webinar error:", error);
      toast({
        title: "Gagal",
        description: error.message || "Terjadi kesalahan saat memperbarui data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (eventId: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus Webinar ini?")) return;

    setIsLoading(true);
    try {
      await ApiClient.delete("/admin/webinars", {
        id: parseInt(eventId, 10),
      });

      toast({
        title: "Berhasil!",
        description: "Webinar telah dihapus",
      });
      fetchEvents();
    } catch (error: any) {
      console.error("Delete webinar error:", error);
      toast({
        title: "Gagal",
        description: error.message || "Terjadi kesalahan saat menghapus data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const openEditDialog = (event: WebinarEvent) => {
    setSelectedEvent(event);
    setFormData({
      title: event.title,
      date: event.date,
      time: event.time,
      location: event.location, // ✅
      quota: event.quota.toString(),
      instructor: event.instructor, // ✅
      description: event.description,
    });
    setIsEditDialogOpen(true);
  };

  const openDetailDialog = (event: WebinarEvent) => {
    setSelectedEvent(event);
    setIsDetailDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      active: "bg-emerald-100 text-emerald-700",
      inactive: "bg-slate-100 text-slate-700",
      completed: "bg-blue-100 text-blue-700",
    };
    const labels = {
      active: "Aktif",
      inactive: "Tidak Aktif",
      completed: "Selesai",
    };
    return (
      <span
        className={`px-2 py-1 rounded-lg text-xs font-semibold ${
          styles[status as keyof typeof styles]
        }`}
      >
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 md:px-8 py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">
              Kelola Webinar
            </h1>
            <p className="text-slate-600">
              Tambah, edit, atau hapus kegiatan Webinar
            </p>
          </div>
          <Button
            onClick={() => {
              resetForm();
              setIsAddDialogOpen(true);
            }}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-500/30"
          >
            <Plus className="w-4 h-4 mr-2" />
            Tambah Webinar
          </Button>
        </div>
      </div>

      <div className="p-6 md:p-8">
        {/* Search & Filter */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                placeholder="Cari berdasarkan judul, narasumber, atau lokasi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 border-slate-300"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600 whitespace-nowrap">
                {filteredEvents.length} dari {events.length} kegiatan
              </span>
            </div>
          </div>
        </div>

        {/* Loading */}
        {isLoading && filteredEvents.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {/* Events Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
                <div
                  key={event.id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-500 hover:-translate-y-1"
                >
                  <div className="p-6 border-b border-slate-200">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <h3 className="text-lg font-bold text-slate-800 line-clamp-2 flex-1">
                        {event.title}
                      </h3>
                      {getStatusBadge(event.status)}
                    </div>
                    <p className="text-sm text-slate-600 line-clamp-2">
                      {event.description}
                    </p>
                  </div>

                  <div className="p-6 space-y-3">
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <Calendar className="w-4 h-4 text-indigo-600" />
                      <span>
                        {new Date(event.date).toLocaleDateString("id-ID", {
                          dateStyle: "long",
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <Clock className="w-4 h-4 text-indigo-600" />
                      <span>
                        {event.time.split(":").slice(0, 2).join(":")} - selesai
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <MapPin className="w-4 h-4 text-indigo-600" />
                      <span>{event.location}</span>{" "}
                      {/* Misal: "Zoom Meeting" */}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <User className="w-4 h-4 text-indigo-600" />
                      <span>{event.instructor}</span> {/* Narasumber */}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <Users className="w-4 h-4 text-sky-600" />
                      <span>{event.quota} Peserta</span>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 border-t border-slate-200 flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openDetailDialog(event)}
                      className="flex-1"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Detail
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(event)}
                      className="flex-1 border-indigo-200 text-indigo-700 hover:bg-indigo-50"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(event.id)}
                      className="border-red-200 text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {filteredEvents.length === 0 && !isLoading && (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">
                  Tidak ada data ditemukan
                </h3>
                <p className="text-slate-600 mb-6">
                  {searchQuery
                    ? "Coba ubah kata kunci pencarian"
                    : "Belum ada Webinar yang ditambahkan"}
                </p>
                {!searchQuery && (
                  <Button
                    onClick={() => {
                      resetForm();
                      setIsAddDialogOpen(true);
                    }}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Tambah Webinar
                  </Button>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Add Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              Tambah Webinar
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Judul Webinar *</Label>
              <Input
                id="title"
                placeholder="Masukkan judul"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Tanggal *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="time">Waktu *</Label>
                  <span className="text-sm text-slate-500">- selesai</span>
                </div>
                <Input
                  id="time"
                  placeholder="19:00"
                  value={formData.time}
                  onChange={(e) =>
                    setFormData({ ...formData, time: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Lokasi *</Label>{" "}
                {/* Misal: "Zoom Meeting" */}
                <Input
                  id="location"
                  placeholder="Zoom Meeting / Google Meet"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quota">Kuota Peserta *</Label>
                <Input
                  id="quota"
                  type="number"
                  placeholder="200"
                  value={formData.quota}
                  onChange={(e) =>
                    setFormData({ ...formData, quota: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="instructor">Narasumber</Label>
              <Input
                id="instructor"
                placeholder="Nama narasumber"
                value={formData.instructor}
                onChange={(e) =>
                  setFormData({ ...formData, instructor: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi</Label>
              <textarea
                id="description"
                rows={4}
                placeholder="Deskripsi kegiatan..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Batal
            </Button>
            <Button
              onClick={handleAdd}
              disabled={isLoading}
              className="bg-gradient-to-r from-indigo-600 to-purple-600"
            >
              {isLoading ? "Menyimpan..." : "Simpan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              Edit Webinar
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Judul Webinar *</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-date">Tanggal *</Label>
                <Input
                  id="edit-date"
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="edit-time">Waktu *</Label>
                  <span className="text-sm text-slate-500">- selesai</span>
                </div>
                <Input
                  id="edit-time"
                  value={formData.time}
                  onChange={(e) =>
                    setFormData({ ...formData, time: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-location">Lokasi *</Label>
                <Input
                  id="edit-location"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-quota">Kuota Peserta *</Label>
                <Input
                  id="edit-quota"
                  type="number"
                  value={formData.quota}
                  onChange={(e) =>
                    setFormData({ ...formData, quota: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-instructor">Narasumber</Label>
              <Input
                id="edit-instructor"
                value={formData.instructor}
                onChange={(e) =>
                  setFormData({ ...formData, instructor: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Deskripsi</Label>
              <textarea
                id="edit-description"
                rows={4}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Batal
            </Button>
            <Button
              onClick={handleEdit}
              disabled={isLoading}
              className="bg-gradient-to-r from-indigo-600 to-purple-600"
            >
              {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              Detail Webinar
            </DialogTitle>
          </DialogHeader>
          {selectedEvent && (
            <div className="space-y-4 py-4">
              <div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">
                  {selectedEvent.title}
                </h3>
                {getStatusBadge(selectedEvent.status)}
              </div>
              <div className="space-y-3 pt-4">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-indigo-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-slate-600">Tanggal</p>
                    <p className="font-medium text-slate-800">
                      {new Date(selectedEvent.date).toLocaleDateString(
                        "id-ID",
                        { dateStyle: "long" }
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-indigo-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-slate-600">Waktu</p>
                    <p className="font-medium text-slate-800">
                      {selectedEvent.time.split(":").slice(0, 2).join(":")} -
                      selesai
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-indigo-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-slate-600">Lokasi</p>
                    <p className="font-medium text-slate-800">
                      {selectedEvent.location}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-indigo-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-slate-600">Narasumber</p>
                    <p className="font-medium text-slate-800">
                      {selectedEvent.instructor}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-indigo-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-slate-600">Peserta</p>
                    <p className="font-medium text-slate-800">
                      {selectedEvent.registered} / {selectedEvent.quota} peserta
                    </p>
                    <div className="w-64 bg-slate-200 rounded-full h-2 mt-2">
                      <div
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2 rounded-full"
                        style={{
                          width: `${
                            (selectedEvent.registered / selectedEvent.quota) *
                            100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
                {selectedEvent.description && (
                  <div className="pt-4 border-t border-slate-200">
                    <p className="text-sm text-slate-600 mb-2">Deskripsi</p>
                    <p className="text-slate-800 leading-relaxed">
                      {selectedEvent.description}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDetailDialogOpen(false)}
            >
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminWebinar;
