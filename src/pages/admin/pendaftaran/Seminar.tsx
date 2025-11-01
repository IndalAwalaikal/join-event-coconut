import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ApiClient } from "@/lib/ApiClient";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Search,
  Trash2,
  Eye,
  FileSpreadsheet,
  FileText,
  Mail,
  Phone,
  University,
  X,
  User,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Registration {
  id: string;
  name: string;
  email: string;
  phone: string;
  university: string;
  proofImage: string;
  registeredAt: string;
}

const AdminPendaftaranSeminar = () => {
  const { toast } = useToast();
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [filteredRegistrations, setFilteredRegistrations] = useState<
    Registration[]
  >([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [selectedRegistration, setSelectedRegistration] =
    useState<Registration | null>(null);

  // Fetch data dari API
  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      const response = await ApiClient.get<any>("/admin/registrations", {
        jenis: "seminar",
      });

      // Handle jika data null/undefined → jadikan array kosong
      const dataArray = Array.isArray(response.data) ? response.data : [];

      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
      const formatted: Registration[] = response.data
        .map((item: any) => ({
          id: String(item.id),
          name: item.nama || "",
          email: item.email || "",
          phone: item.nomor_hp || "",
          university: item.asal_universitas || "",
          proofImage: item.bukti_foto
            ? `${API_BASE_URL}/uploads/${item.bukti_foto}`
            : "",
          registeredAt: item.created_at || new Date().toISOString(),
        }))
        .sort(
          (a, b) =>
            new Date(a.registeredAt).getTime() -
            new Date(b.registeredAt).getTime()
        );

      setRegistrations(formatted);
      setFilteredRegistrations(formatted);
    } catch (error: any) {
      console.error("Fetch error:", error);
      toast({
        title: "Gagal Memuat Data",
        description: error.message || "Cek koneksi atau coba lagi nanti.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Search filter
  useEffect(() => {
    if (searchQuery) {
      const filtered = registrations.filter(
        (reg) =>
          reg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          reg.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          reg.phone.includes(searchQuery) ||
          reg.university.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredRegistrations(filtered);
    } else {
      setFilteredRegistrations(registrations);
    }
  }, [searchQuery, registrations]);

  // Panggil API saat komponen mount
  useEffect(() => {
    fetchRegistrations();
  }, []);

  const handleDelete = async (registrationId: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus pendaftaran ini?")) return;

    try {
      await ApiClient.delete("/admin/registrations", {
        jenis: "seminar",
        id: parseInt(registrationId, 10),
      });

      setRegistrations(
        registrations.filter((reg) => reg.id !== registrationId)
      );
      toast({ title: "Berhasil!", description: "Pendaftaran telah dihapus." });
    } catch (error: any) {
      toast({
        title: "Gagal Menghapus",
        description: error.message || "Coba lagi nanti.",
        variant: "destructive",
      });
    }
  };

  const openDetailDialog = (registration: Registration) => {
    setSelectedRegistration(registration);
    setIsDetailDialogOpen(true);
  };

  const openImageDialog = (registration: Registration) => {
    setSelectedRegistration(registration);
    setIsImageDialogOpen(true);
  };

  const exportToCSV = () => {
    if (filteredRegistrations.length === 0) {
      toast({
        title: "Tidak ada data",
        description: "Tidak ada data untuk diexport.",
      });
      return;
    }

    const headers = [
      "Nama",
      "Email",
      "Nomor Telepon",
      "Universitas",
      "Tanggal Daftar",
    ];
    const csvData = filteredRegistrations.map((reg) => [
      reg.name,
      reg.email,
      reg.phone,
      reg.university,
      new Date(reg.registeredAt).toLocaleString("id-ID"),
    ]);

    const csvContent = [
      headers.join(","),
      ...csvData.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `pendaftaran-seminar-${new Date().toLocaleDateString(
      "id-ID"
    )}.csv`;
    link.click();

    toast({
      title: "Berhasil!",
      description: "Data berhasil diexport ke CSV.",
    });
  };

  const exportToExcel = () => {
    toast({
      title: "Fitur Belum Tersedia",
      description: "Gunakan Export CSV untuk saat ini.",
    });
  };

  const resetSearch = () => setSearchQuery("");

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 md:px-8 py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">
              Pendaftaran Seminar
            </h1>
            <p className="text-slate-600">
              Kelola peserta yang mendaftar Seminar
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={exportToCSV}
              variant="outline"
              className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
            >
              <FileText className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
            <Button
              onClick={exportToExcel}
              variant="outline"
              className="border-blue-200 text-blue-700 hover:bg-blue-50"
            >
              <FileSpreadsheet className="w-4 h-4 mr-2" />
              Export Excel
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6 md:p-8">
        {/* Search */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                placeholder="Cari berdasarkan nama, email, telepon, atau universitas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 border-slate-300"
              />
            </div>
            {searchQuery && (
              <Button
                onClick={resetSearch}
                variant="ghost"
                className="text-slate-600"
              >
                <X className="w-4 h-4 mr-1" />
                Reset
              </Button>
            )}
            <div className="flex items-center text-sm text-slate-600">
              {filteredRegistrations.length} dari {registrations.length}{" "}
              pendaftaran
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredRegistrations.length > 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      No.
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Peserta
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Nomor HP
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Universitas
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Tanggal Daftar
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredRegistrations.map((registration, index) => (
                    <tr
                      key={registration.id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      {/* Kolom Nomor */}
                      <td className="px-6 py-4 text-center">
                        <span className="font-mono text-slate-700">
                          {index + 1}
                        </span>
                      </td>

                      {/* Kolom Peserta */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-100 to-blue-100 flex items-center justify-center flex-shrink-0">
                            <User className="w-5 h-5 text-sky-700" />
                          </div>
                          <p className="font-semibold text-slate-800">
                            {registration.name}
                          </p>
                        </div>
                      </td>

                      {/* Kolom Email */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-slate-800">
                          <Mail className="w-4 h-4 text-slate-400" />
                          {registration.email}
                        </div>
                      </td>

                      {/* Kolom Nomor HP */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-slate-800">
                          <Phone className="w-4 h-4 text-slate-400" />
                          {registration.phone}
                        </div>
                      </td>

                      {/* Kolom Universitas */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-slate-800">
                          <University className="w-4 h-4 text-slate-400" />
                          {registration.university}
                        </div>
                      </td>

                      {/* Kolom Tanggal */}
                      <td className="px-6 py-4">
                        <p className="text-sm text-slate-600">
                          {new Date(registration.registeredAt).toLocaleString(
                            "id-ID",
                            {
                              dateStyle: "medium",
                              timeStyle: "short",
                            }
                          )}
                        </p>
                      </td>

                      {/* Kolom Aksi */}
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openDetailDialog(registration)}
                            className="border-sky-200 text-sky-700 hover:bg-sky-50"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(registration.id)}
                            className="border-red-200 text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">
              {searchQuery ? "Tidak ada hasil" : "Belum ada pendaftaran"}
            </h3>
            <p className="text-slate-600">
              {searchQuery
                ? "Coba ubah kata kunci pencarian"
                : "Belum ada peserta yang mendaftar Seminar"}
            </p>
          </div>
        )}
      </div>

      {/* Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              Detail Pendaftaran
            </DialogTitle>
          </DialogHeader>
          {selectedRegistration && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Nama Lengkap</p>
                  <p className="font-semibold">{selectedRegistration.name}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">Email</p>
                  <p className="font-semibold">{selectedRegistration.email}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">Nomor Telepon</p>
                  <p className="font-semibold">{selectedRegistration.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">
                    Asal Universitas
                  </p>
                  <p className="font-semibold">
                    {selectedRegistration.university}
                  </p>
                </div>
              </div>
              <div className="pt-4 border-t border-slate-200">
                <p className="text-sm text-slate-600 mb-1">
                  Tanggal Pendaftaran
                </p>
                <p className="font-medium">
                  {new Date(selectedRegistration.registeredAt).toLocaleString(
                    "id-ID",
                    {
                      dateStyle: "full",
                      timeStyle: "short",
                    }
                  )}
                </p>
              </div>
              <div className="pt-4 border-t border-slate-200">
                <p className="text-sm text-slate-600 mb-3">Bukti Pembayaran</p>
                <div className="relative group">
                  <img
                    src={selectedRegistration.proofImage}
                    alt="Bukti Pembayaran"
                    className="w-full h-48 object-cover rounded-lg border border-slate-200"
                  />
                  <Button
                    onClick={() => openImageDialog(selectedRegistration)}
                    className="absolute inset-0 m-auto w-fit h-fit opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900/80 hover:bg-slate-900"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Lihat Penuh
                  </Button>
                </div>
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

      {/* Image Preview Dialog */}
      <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              Bukti Pembayaran
            </DialogTitle>
          </DialogHeader>
          {selectedRegistration && (
            <div className="py-4">
              <img
                src={selectedRegistration.proofImage}
                alt="Bukti Pembayaran"
                className="w-full h-auto rounded-lg border border-slate-200"
              />
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsImageDialogOpen(false)}
            >
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPendaftaranSeminar;
