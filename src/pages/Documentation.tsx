import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Image as ImageIcon } from "lucide-react";

// Mock data - replace with API fetch
const mockDocumentation = {
  "Open Class": [
    {
      batch: "Batch 1 - 2024",
      events: [
        {
          title: "Web Development Bootcamp",
          date: "Jan 2024",
          images: ["https://images.unsplash.com/photo-1517694712202-14dd9538aa97", "https://images.unsplash.com/photo-1531482615713-2afd69097998"],
        },
      ],
    },
  ],
  "Seminar": [
    {
      batch: "2024",
      events: [
        {
          title: "Future of Technology",
          date: "Mar 2024",
          images: ["https://images.unsplash.com/photo-1540575467063-178a50c2df87"],
        },
      ],
    },
  ],
  "Webinar": [
    {
      batch: "2024",
      events: [
        {
          title: "Cloud Computing Workshop",
          date: "Feb 2024",
          images: ["https://images.unsplash.com/photo-1591453089344-5742a6c35fef"],
        },
      ],
    },
  ],
};

const Documentation = () => {
  const [activeTab, setActiveTab] = useState("open-class");

  const getDocumentation = () => {
    switch (activeTab) {
      case "open-class":
        return mockDocumentation["Open Class"];
      case "seminar":
        return mockDocumentation["Seminar"];
      case "webinar":
        return mockDocumentation["Webinar"];
      default:
        return [];
    }
  };

  const docs = getDocumentation();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      {/* Header */}
      <section className="bg-gradient-to-br from-primary/10 to-accent/10 border-b border-border">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Dokumentasi Kegiatan
            </h1>
            <p className="text-lg text-muted-foreground">
              Lihat dokumentasi dari berbagai kegiatan yang telah kami adakan sebelumnya
            </p>
          </div>
        </div>
      </section>

      {/* Documentation Content */}
      <section className="container mx-auto px-4 py-16">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8">
            <TabsTrigger value="open-class">Open Class</TabsTrigger>
            <TabsTrigger value="seminar">Seminar</TabsTrigger>
            <TabsTrigger value="webinar">Webinar</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab}>
            {docs.length > 0 ? (
              <div className="space-y-8">
                {docs.map((batch, idx) => (
                  <div key={idx}>
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                      <Badge variant="outline" className="text-base">
                        {batch.batch}
                      </Badge>
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {batch.events.map((event, eventIdx) => (
                        <Card key={eventIdx} className="group hover:shadow-lg transition-all duration-300">
                          <CardHeader>
                            <CardTitle className="text-lg">{event.title}</CardTitle>
                            <CardDescription className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              {event.date}
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-2 gap-2">
                              {event.images.map((img, imgIdx) => (
                                <div
                                  key={imgIdx}
                                  className="aspect-video rounded-lg overflow-hidden bg-muted group-hover:scale-105 transition-transform duration-300"
                                >
                                  <img
                                    src={img}
                                    alt={`${event.title} - ${imgIdx + 1}`}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              ))}
                            </div>
                            <p className="text-sm text-muted-foreground mt-3 flex items-center gap-1">
                              <ImageIcon className="w-4 h-4" />
                              {event.images.length} foto
                            </p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                  <ImageIcon className="w-12 h-12 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Belum Ada Dokumentasi</h3>
                <p className="text-muted-foreground">
                  Dokumentasi untuk kategori ini akan segera ditambahkan.
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

export default Documentation;
