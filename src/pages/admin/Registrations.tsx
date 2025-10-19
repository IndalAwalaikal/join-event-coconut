import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AdminRegistrations = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedEvent, setSelectedEvent] = useState("all");
  
  const events = [
    { id: "all", name: "Semua Kegiatan" },
    { id: "1", name: "Web Development" },
    { id: "2", name: "AI Seminar" },
  ];

  const registrations = [
    { id: "1", name: "John Doe", email: "john@example.com", phone: "081234567890", institution: "Universitas A", event: "Web Development", code: "COCONUT-ABC123" },
    { id: "2", name: "Jane Smith", email: "jane@example.com", phone: "082345678901", institution: "SMK B", event: "AI Seminar", code: "COCONUT-DEF456" },
  ];

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin");
    }
  }, [navigate]);

  const filteredRegistrations = selectedEvent === "all" 
    ? registrations 
    : registrations.filter(reg => reg.event === events.find(e => e.id === selectedEvent)?.name);

  const handleExport = () => {
    // Mock export - implement actual CSV/Excel export
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Nama,Email,Telepon,Instansi,Kegiatan,Kode\n"
      + filteredRegistrations.map(r => `${r.name},${r.email},${r.phone},${r.institution},${r.event},${r.code}`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "pendaftaran.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({ title: "Data berhasil diekspor" });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => navigate("/admin/dashboard")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Dashboard
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Kelola Pendaftaran</h1>
          <Button variant="hero" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Daftar Peserta</CardTitle>
              <div className="w-64">
                <Select value={selectedEvent} onValueChange={setSelectedEvent}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {events.map(event => (
                      <SelectItem key={event.id} value={event.id}>
                        {event.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Telepon</TableHead>
                  <TableHead>Instansi</TableHead>
                  <TableHead>Kegiatan</TableHead>
                  <TableHead>Kode</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRegistrations.length > 0 ? (
                  filteredRegistrations.map((reg) => (
                    <TableRow key={reg.id}>
                      <TableCell className="font-medium">{reg.name}</TableCell>
                      <TableCell>{reg.email}</TableCell>
                      <TableCell>{reg.phone}</TableCell>
                      <TableCell>{reg.institution}</TableCell>
                      <TableCell>{reg.event}</TableCell>
                      <TableCell>
                        <code className="px-2 py-1 rounded bg-muted text-sm">
                          {reg.code}
                        </code>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                      Belum ada pendaftaran untuk kegiatan ini
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminRegistrations;
