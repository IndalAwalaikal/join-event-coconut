import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, Clock, ArrowLeft, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock data - replace with API fetch
const mockEventDetail = {
  id: "1",
  title: "Web Development Fundamentals",
  type: "Open Class" as const,
  date: "15 Jan 2025",
  time: "14:00 - 16:00",
  location: "Lab Komputer A",
  quota: 30,
  registered: 25,
  description: "Belajar dasar-dasar pengembangan web modern dengan HTML, CSS, dan JavaScript. Dalam kelas ini, peserta akan mempelajari konsep fundamental web development dan membuat project sederhana.",
  status: "open" as const,
  instructor: "John Doe",
  requirements: ["Laptop", "Koneksi Internet", "Text Editor (VS Code)"],
  syllabus: ["HTML & CSS Basics", "JavaScript Fundamentals", "Responsive Design", "Mini Project"],
};

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registrationCode, setRegistrationCode] = useState("");
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    institution: "",
  });

  const event = mockEventDetail; // Replace with API call
  const availableSpots = event.quota - event.registered;
  const isAvailable = event.status === "open" && availableSpots > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mock registration - replace with API call
    const code = `COCONUT-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    setRegistrationCode(code);
    setRegistrationSuccess(true);
    
    toast({
      title: "Pendaftaran Berhasil!",
      description: `Kode pendaftaran Anda: ${code}`,
    });
  };

  if (registrationSuccess) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="flex-1 flex items-center justify-center px-4 py-16">
          <Card className="max-w-md w-full text-center">
            <CardHeader>
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <Check className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Pendaftaran Berhasil!</CardTitle>
              <CardDescription>
                Terima kasih telah mendaftar untuk kegiatan ini
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Kode Pendaftaran Anda:</p>
                <p className="text-2xl font-bold text-primary">{registrationCode}</p>
              </div>
              <p className="text-sm text-muted-foreground">
                Simpan kode ini untuk keperluan verifikasi. Informasi lebih lanjut akan dikirim ke email Anda.
              </p>
              <Button onClick={() => navigate("/")} variant="hero" className="w-full">
                Kembali ke Beranda
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Event Details */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <Badge className="mb-3">{event.type}</Badge>
                  <h1 className="text-3xl md:text-4xl font-bold mb-2">{event.title}</h1>
                  <p className="text-muted-foreground">Instruktur: {event.instructor}</p>
                </div>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Deskripsi Kegiatan</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{event.description}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Persyaratan</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {event.requirements.map((req, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-primary" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Materi yang Akan Dipelajari</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {event.syllabus.map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-medium flex-shrink-0">
                        {index + 1}
                      </span>
                      <span className="pt-0.5">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Registration Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Informasi Kegiatan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Tanggal</p>
                    <p className="text-sm text-muted-foreground">{event.date}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Waktu</p>
                    <p className="text-sm text-muted-foreground">{event.time}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Lokasi</p>
                    <p className="text-sm text-muted-foreground">{event.location}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Kuota</p>
                    <p className="text-sm text-muted-foreground">
                      {event.registered}/{event.quota} terdaftar
                      {availableSpots > 0 && (
                        <span className="block text-xs mt-1">
                          {availableSpots} slot tersisa
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                {!showForm ? (
                  <Button 
                    variant="hero" 
                    className="w-full"
                    disabled={!isAvailable}
                    onClick={() => setShowForm(true)}
                  >
                    {!isAvailable ? "Pendaftaran Ditutup" : "Daftar Sekarang"}
                  </Button>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4 pt-4 border-t">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nama Lengkap</Label>
                      <Input 
                        id="name" 
                        required 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        required 
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Nomor HP</Label>
                      <Input 
                        id="phone" 
                        type="tel" 
                        required 
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="institution">Instansi/Sekolah</Label>
                      <Input 
                        id="institution" 
                        required 
                        value={formData.institution}
                        onChange={(e) => setFormData({...formData, institution: e.target.value})}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setShowForm(false)}
                        className="flex-1"
                      >
                        Batal
                      </Button>
                      <Button type="submit" variant="hero" className="flex-1">
                        Daftar
                      </Button>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default EventDetail;
