import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EventCard from "@/components/EventCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Sparkles, Users } from "lucide-react";

// Mock data - replace with API fetch
const mockEvents = [
  {
    id: "1",
    title: "Web Development Fundamentals",
    type: "Open Class" as const,
    date: "15 Jan 2025",
    time: "14:00 - 16:00",
    location: "Lab Komputer A",
    quota: 30,
    registered: 25,
    description: "Belajar dasar-dasar pengembangan web modern dengan HTML, CSS, dan JavaScript",
    status: "open" as const,
  },
  {
    id: "2",
    title: "AI & Machine Learning in 2025",
    type: "Seminar" as const,
    date: "20 Jan 2025",
    time: "13:00 - 15:00",
    location: "Aula Utama",
    quota: 100,
    registered: 87,
    description: "Mengupas tren terbaru AI dan machine learning di tahun 2025",
    status: "open" as const,
  },
  {
    id: "3",
    title: "Cloud Computing with AWS",
    type: "Webinar" as const,
    date: "25 Jan 2025",
    time: "19:00 - 21:00",
    location: "Zoom Meeting",
    quota: 200,
    registered: 145,
    description: "Workshop online tentang implementasi cloud computing menggunakan AWS",
    status: "open" as const,
  },
];

const Home = () => {
  const [events, setEvents] = useState(mockEvents);
  const [activeTab, setActiveTab] = useState("all");

  const filteredEvents = activeTab === "all" 
    ? events 
    : events.filter(event => event.type.toLowerCase().replace(" ", "-") === activeTab);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/90 via-primary/70 to-accent/80 text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptMC0xMGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-10"></div>
        
        <div className="container mx-auto px-4 py-24 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6 animate-in fade-in duration-1000">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-4">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Platform Pendaftaran Kegiatan</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              COCONUT Computer Club
            </h1>
            
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
              Bergabunglah dengan berbagai kegiatan edukatif untuk meningkatkan skill teknologi Anda. 
              Daftar sekarang dan kembangkan potensi Anda!
            </p>

            <div className="flex flex-wrap gap-4 justify-center pt-4">
              <Button variant="hero" size="lg" className="bg-white text-primary hover:bg-white/90">
                <Calendar className="w-5 h-5 mr-2" />
                Lihat Kegiatan
              </Button>
              <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10">
                <Users className="w-5 h-5 mr-2" />
                Tentang Kami
              </Button>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent"></div>
      </section>

      {/* Events Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Kegiatan Tersedia
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Pilih kegiatan yang sesuai dengan minat Anda dan daftar sekarang juga!
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-4 mb-8">
            <TabsTrigger value="all">Semua</TabsTrigger>
            <TabsTrigger value="open-class">Open Class</TabsTrigger>
            <TabsTrigger value="seminar">Seminar</TabsTrigger>
            <TabsTrigger value="webinar">Webinar</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            {filteredEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.map((event) => (
                  <EventCard key={event.id} {...event} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                  <Calendar className="w-12 h-12 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Kegiatan Belum Tersedia</h3>
                <p className="text-muted-foreground">
                  Belum ada kegiatan untuk kategori ini. Pantau terus untuk update terbaru!
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
