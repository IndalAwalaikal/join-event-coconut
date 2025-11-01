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
  User,
  Users,
  Clock,
  Eye,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface OpenClassEvent {
  id: string;
  title: string;
  date: string; // format: YYYY-MM-DD
  time: string; // format: HH:mm:ss
  location: string;
  quota: number;
  registered: number;
  instructor: string;
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

// Helper: Format tanggal ke YYYY-MM-DD untuk MySQL
const formatDateForMySQL = (dateString: string): string => {
  if (!dateString) return "";
  // Jika sudah format YYYY-MM-DD, kembalikan langsung
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return dateString;
  }
  // Jika berupa ISO string atau Date object, konversi
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";
  return date.toISOString().split("T")[0];
};

const AdminOpenClass = () => {
  const { toast } = useToast();
  const [events, setEvents] = useState<OpenClassEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<OpenClassEvent[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<OpenClassEvent | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);

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
      const response = await ApiClient.get<any>("/admin/open-classes");
      const dataArray = Array.isArray(response.data) ? response.data : [];

      const formatted: OpenClassEvent[] = dataArray.map((item: any) => {
        // Format date ke YYYY-MM-DD saat load
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
          date: mysqlDate, // ✅ Pastikan format YYYY-MM-DD
          time: item.time || "",
          location: item.location || "",
          quota: Number(item.quota) || 0,
          registered: 0,
          instructor: item.instructor || "",
          description: item.description || "",
          status,
          createdAt: item.created_at || new Date().toISOString(),
        };
      });

      setEvents(formatted);
      setFilteredEvents(formatted);
    } catch (error: any) {
      console.error("Fetch events error:", error);
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

      await ApiClient.post("/admin/open-classes", {
        title: formData.title,
        date: mysqlDate,
        time: startTime,
        location: formData.location,
        quota: parseInt(formData.quota, 10),
        instructor: formData.instructor,
        description: formData.description,
      });

      toast({
        title: "Berhasil!",
        description: "Open Class baru telah ditambahkan",
      });
      setIsAddDialogOpen(false);
      resetForm();
      fetchEvents();
    } catch (error: any) {
      console.error("Add error:", error);
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

      await ApiClient.put("/admin/open-classes", {
        id: parseInt(selectedEvent.id, 10),
        data: {
          title: formData.title,
          date: mysqlDate, // ✅
          time: startTime, // ✅
          location: formData.location,
          quota: parseInt(formData.quota, 10),
          instructor: formData.instructor,
          description: formData.description,
        },
      });

      toast({
        title: "Berhasil!",
        description: "Data Open Class telah diperbarui",
      });
      setIsEditDialogOpen(false);
      setSelectedEvent(null);
      resetForm();
      fetchEvents();
    } catch (error: any) {
      console.error("Edit error:", error);
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
    if (!confirm("Apakah Anda yakin ingin menghapus Open Class ini?")) return;

    setIsLoading(true);
    try {
      await ApiClient.delete("/admin/open-classes", {
        id: parseInt(eventId, 10),
      });

      toast({
        title: "Berhasil!",
        description: "Open Class telah dihapus",
      });
      fetchEvents();
    } catch (error: any) {
      console.error("Delete error:", error);
      toast({
        title: "Gagal",
        description: error.message || "Terjadi kesalahan saat menghapus data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const openEditDialog = (event: OpenClassEvent) => {
    setSelectedEvent(event);
    setFormData({
      title: event.title,
      date: event.date, // Sudah YYYY-MM-DD karena diformat di fetchEvents
      time: event.time,
      location: event.location,
      quota: event.quota.toString(),
      instructor: event.instructor,
      description: event.description,
    });
    setIsEditDialogOpen(true);
  };

  const openDetailDialog = (event: OpenClassEvent) => {
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
              Kelola Open Class
            </h1>
            <p className="text-slate-600">
              Tambah, edit, atau hapus kegiatan Open Class
            </p>
          </div>
          <Button
            onClick={() => {
              resetForm();
              setIsAddDialogOpen(true);
            }}
            className="bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 shadow-lg shadow-sky-500/30"
          >
            <Plus className="w-4 h-4 mr-2" />
            Tambah Open Class
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
                placeholder="Cari berdasarkan judul, instruktur, atau lokasi..."
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
            <div className="w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {/* Events Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
                <div
                  key={event.id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:shadow-sky-500/10 transition-all duration-500 hover:-translate-y-1"
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
                      <Calendar className="w-4 h-4 text-sky-600" />
                      <span>
                        {new Date(event.date).toLocaleDateString("id-ID", {
                          dateStyle: "long",
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <Clock className="w-4 h-4 text-sky-600" />
                      <span>
                        {event.time.split(":").slice(0, 2).join(":")} - selesai
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <MapPin className="w-4 h-4 text-sky-600" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <User className="w-4 h-4 text-blue-600" />
                      <span>{event.instructor}</span>
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
                      className="flex-1 border-sky-200 text-sky-700 hover:bg-sky-50"
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
                    : "Belum ada Open Class yang ditambahkan"}
                </p>
                {!searchQuery && (
                  <Button
                    onClick={() => {
                      resetForm();
                      setIsAddDialogOpen(true);
                    }}
                    className="bg-gradient-to-r from-sky-600 to-blue-600"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Tambah Open Class
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
              Tambah Open Class
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Judul Open Class *</Label>
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
                  placeholder="13:00"
                  value={formData.time}
                  onChange={(e) =>
                    setFormData({ ...formData, time: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Lokasi *</Label>
                <Input
                  id="location"
                  placeholder="Lab Komputer A"
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
                  placeholder="30"
                  value={formData.quota}
                  onChange={(e) =>
                    setFormData({ ...formData, quota: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="instructor">Instruktur</Label>
              <Input
                id="instructor"
                placeholder="Nama instruktur"
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
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent resize-none"
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
              className="bg-gradient-to-r from-sky-600 to-blue-600"
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
              Edit Open Class
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Judul Open Class *</Label>
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
              <Label htmlFor="edit-instructor">Instruktur</Label>
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
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent resize-none"
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
              className="bg-gradient-to-r from-sky-600 to-blue-600"
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
              Detail Open Class
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
                  <Calendar className="w-5 h-5 text-sky-600 mt-0.5" />
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
                  <Clock className="w-5 h-5 text-sky-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-slate-600">Waktu</p>
                    <p className="font-medium text-slate-800">
                      {selectedEvent.time.split(":").slice(0, 2).join(":")} -
                      selesai
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-sky-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-slate-600">Lokasi</p>
                    <p className="font-medium text-slate-800">
                      {selectedEvent.location}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-sky-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-slate-600">Kuota Peserta</p>
                    <p className="font-medium text-slate-800">
                      {selectedEvent.quota} Peserta
                    </p>
                  </div>
                </div>

                {selectedEvent.instructor && (
                  <div className="flex items-start gap-3">
                    <Users className="w-5 h-5 text-sky-600 mt-0.5" />
                    <div>
                      <p className="text-sm text-slate-600">Instruktur</p>
                      <p className="font-medium text-slate-800">
                        {selectedEvent.instructor}
                      </p>
                    </div>
                  </div>
                )}
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

export default AdminOpenClass;
