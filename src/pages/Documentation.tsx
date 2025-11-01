import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Users, MapPin, Image as ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Mock data
const mockDocumentation = {
  "Open Class": [
    {
      batch: "Batch 8 - 2025",
      events: [
        {
          title: "Go REST, Go Fast: Membangun REST API dengan Golang",
          date: "17 Oktober 2025",
          location: "IndigoHub Makassar",
          participants: 44,
          images: [
            "/COC/Batch8/1.JPG",
            "/COC/Batch8/2.JPG",
            "/COC/Batch8/3.JPG",
            "/COC/Batch8/4.JPG",
          ],
          description:
            "Tingkatkan kemampuan backend-mu dengan mempelajari cara membangun REST API yang cepat, efisien, dan scalable menggunakan Golang.",
        },
      ],
    },
    {
      batch: "Batch 7 - 2025",
      events: [
        {
          title:
            "Level UP Your Skills: Bangun Portofolio Interaktif dengan Next.js dari Nol",
          date: "13 Juni 2025",
          location: "IndigoHub Makassar",
          participants: 28,
          images: [
            "/COC/Batch7/1.JPG",
            "/COC/Batch7/2.JPG",
            "/COC/Batch7/3.JPG",
            "/COC/Batch7/4.JPG",
            "/COC/Batch7/5.JPG",
          ],
          description:
            "Tingkatkan kemampuanmu dengan membangun portofolio interaktif profesional menggunakan Next.js dari nol.",
        },
      ],
    },
    {
      batch: "Batch 6 - 2025",
      events: [
        {
          title:
            "Programming 101: Mengenal dan Belajar Lebih dalam Konsep Pemrograman",
          date: "02 Maret 2025",
          location: "Institute Teknologi Jusuf Habibie",
          participants: 45,
          images: [
            "/COC/Batch6/1.JPG",
            "/COC/Batch6/2.JPG",
            "/COC/Batch6/3.JPG",
            "/COC/Batch6/4.JPG",
            "/COC/Batch6/5.JPG",
          ],
          description:
            "Pengenalan dasar pemrograman untuk memahami logika, konsep, dan praktik menulis kode secara efektif.",
        },
      ],
    },
    {
      batch: "Batch 5 - 2024",
      events: [
        {
          title: "Web Development with Laravel",
          date: "28 Desember 2024",
          location: "Institute Teknologi Akba Makassar",
          participants: 40,
          images: [
            "/COC/Batch5/1.JPG",
            "/COC/Batch5/2.JPG",
            "/COC/Batch5/3.JPG",
            "/COC/Batch5/4.JPG",
            "/COC/Batch5/5.JPG",
          ],
          description:
            "Mulai perjalanan web development dari dasar dengan mempelajari HTML, CSS, dan JavaScript, disertai penguasaan PHP dan pengenalan framework Laravel untuk membangun website modern dan interaktif.",
        },
      ],
    },
    {
      batch: "Batch 4 - 2024",
      events: [
        {
          title:
            "Introduction to Sveltekit: The Frontend Framework of the Future",
          date: "11 Oktober 2024",
          location: "IndigoHub Makassar",
          participants: 35,
          images: [
            "/COC/Batch4/1.JPG",
            "/COC/Batch4/2.JPG",
            "/COC/Batch4/3.JPG",
            "/COC/Batch4/4.JPG",
          ],
          description:
            "Kenali SvelteKit, framework frontend modern yang ringan, cepat, dan dirancang untuk membangun pengalaman web masa depan.",
        },
      ],
    },
    {
      batch: "Batch 2 - 2024",
      events: [
        {
          title:
            "CRUD: Belajar Mengolah Data Menggunakan Golang dan MYSQL",
          date: "10 Mei 2024",
          location: "STIMIK Profesional Makassar",
          participants: 30,
          images: [
            "/COC/Batch2/1.png",
            "/COC/Batch2/3.png",
            "/COC/Batch2/4.png",
            "/COC/Batch2/5.png",
          ],
          description:
            "Pelajari cara membuat aplikasi CRUD (Create, Read, Update, Delete) menggunakan Golang dan MySQL untuk mengelola data secara efisien.",
        },
      ],
    },
    {
      batch: "Batch 1 - 2024",
      events: [
        {
          title:
            "THE DISPLAY IS MAGIC: Boostrap, Framework CSS & Javascript",
          date: "12 Januari 2024",
          location: "STIMIK Profesional Makassar",
          participants: 35,
          images: [
            "/COC/Batch1/1.png",
            "/COC/Batch1/2.png",
            "/COC/Batch1/3.png",
            "/COC/Batch1/4.png",
          ],
          description:
            "Boostrap, framework CSS dan Javascript yang mempermudah pengembangan situs web yang responsif dan mobile-friendly. Temukan potensimu di dunia pemrograman web dengan Boostrap.",
        },
      ],
    },
  ],
  Seminar: [
    {
      batch: "2025",
      events: [
        {
          title:
            "IoT-Based Network Management: Solusi Pintar dalam Pengelolaan Infrastruktur Jaringan",
          date: "14 Oktober 2025",
          location: "Algo Coffee & Snack",
          participants: 60,
          images: [
            "/Seminar/IoT/1.JPG",
            "/Seminar/IoT/2.JPG",
            "/Seminar/IoT/3.JPG",
            "/Seminar/IoT/4.JPG",
            "/Seminar/IoT/5.JPG",
            "/Seminar/IoT/6.JPG",
            "/Seminar/IoT/7.JPG",
            "/Seminar/IoT/8.JPG",
          ],
          description:
            "Pelajari bagaimana teknologi IoT dapat mengoptimalkan pengelolaan jaringan, meningkatkan efisiensi operasional, dan memberikan solusi pintar untuk infrastruktur modern. Dari sensor pintar hingga analitik real-time, temukan cara IoT mengubah cara kita mengelola jaringan.",
        },
      ],
    },
    {
      batch: "2024",
      events: [
        {
          title:
            "BLOCKCHAIN DEMYSTIFIED: The Technology Behind the Digital Revolution",
          date: "12 Oktober 2024",
          location: "Algo Coffee & Snack",
          participants: 40,
          images: [
            "/Seminar/Blockchain/2.JPG",
            "/Seminar/Blockchain/3.JPG",
            "/Seminar/Blockchain/4.JPG",
            "/Seminar/Blockchain/5.JPG",
            "/Seminar/Blockchain/6.JPG",
            "/Seminar/Blockchain/7.JPG",
            "/Seminar/Blockchain/8.JPG",
            "/Seminar/Blockchain/9.JPG",
          ],
          description:
            "Kupas tuntas teknologi blockchain—mesin penggerak di balik revolusi digital yang mengubah cara dunia bertransaksi, berinovasi, dan membangun kepercayaan tanpa batas.",
        },
      ],
    },
    {
      batch: "2023",
      events: [
        {
          title: "AI & FUTURE OF HUMANITY",
          date: "03 November 2023",
          location: "STIMIK Profesional Makassar",
          participants: 45,
          images: [
            "/Seminar/AI/1.JPG",
            "/Seminar/AI/3.JPG",
            "/Seminar/AI/4.JPG",
            "/Seminar/AI/5.JPG",
            "/Seminar/AI/6.JPG",
            "/Seminar/AI/7.JPG",
            "/Seminar/AI/8.JPG",
            "/Seminar/AI/9.JPG",
          ],
          description:
            "Pelajari dasar-dasar machine learning, mulai dari konsep, tipe, hingga proses belajar mesin yang menjadi fondasi perkembangan kecerdasan buatan masa depan.",
        },
      ],
    },
  ],
  Webinar: [
    {
      batch: "2025",
      events: [
        {
          title: "Web3: Evolusi Internet Berbasis Blockchain",
          date: "23 Maret 2025",
          location: "Zoom Meeting",
          participants: 20,
          images: [
            "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=400&fit=crop",
            "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&h=400&fit=crop",
            "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&h=400&fit=crop",
            "https://images.unsplash.com/photo-1573164713988-8665fc963095?w=600&h=400&fit=crop",
          ],
          description:
            "Jelajahi masa depan internet dengan memahami konsep dan penerapan Web3 berbasis teknologi blockchain.",
        },
        {
          title: "DevOps Best Practices",
          date: "5 Des 2024",
          location: "Google Meet",
          participants: 135,
          images: [
            "https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=600&h=400&fit=crop",
            "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=600&h=400&fit=crop",
            "https://images.unsplash.com/photo-1629904853893-c2c8981a1dc5?w=600&h=400&fit=crop",
          ],
          description: "Membahas best practices dalam implementasi DevOps",
        },
      ],
    },
  ],
};

const Documentation = () => {
  const [activeTab, setActiveTab] = useState("open-class");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const getDocumentation = () => {
    switch (activeTab) {
      case "open-class":
        return mockDocumentation["Open Class"];
      case "seminar":
        return mockDocumentation["Seminar"];
      case "webbar":
        return mockDocumentation["Webinar"];
      default:
        return [];
    }
  };

  const docs = getDocumentation();

  // Variants
  const container = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.12,
      },
    },
  };

  const batchItem = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const eventItem = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

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
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl mx-auto text-center space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/80 backdrop-blur-sm rounded-full text-sm font-medium text-sky-700 border border-sky-200/50 shadow-sm">
              <div className="w-2 h-2 bg-sky-500 rounded-full animate-pulse"></div>
              Galeri Kegiatan
            </div>

            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-blue-800 via-sky-600 to-blue-900 bg-clip-text text-transparent">
                Dokumentasi
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
              Lihat dokumentasi dari berbagai kegiatan yang telah kami adakan
            </p>
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

      {/* Documentation Content */}
      <section className="container mx-auto px-4 md:px-6 py-16 md:py-24">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-3 mb-12 bg-slate-100 p-1.5 rounded-xl">
            <TabsTrigger
              value="open-class"
              className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-sky-600 data-[state=active]:to-blue-600 data-[state=active]:text-white"
            >
              Open Class
            </TabsTrigger>
            <TabsTrigger
              value="seminar"
              className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-sky-600 data-[state=active]:to-blue-600 data-[state=active]:text-white"
            >
              Seminar
            </TabsTrigger>
            <TabsTrigger
              value="webinar"
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
              {docs.length > 0 ? (
                <motion.div
                  variants={container}
                  initial="hidden"
                  animate="show"
                  className="space-y-16"
                >
                  {docs.map((batch, idx) => (
                    <motion.div key={idx} variants={batchItem}>
                      <div className="flex items-center gap-4 mb-10">
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          className="px-5 py-2 bg-gradient-to-r from-sky-600 to-blue-600 text-white rounded-xl text-sm font-semibold shadow-lg shadow-sky-500/30 cursor-pointer"
                        >
                          {batch.batch}
                        </motion.div>
                        <div className="h-px bg-slate-200 flex-grow"></div>
                      </div>

                      <div className="space-y-8">
                        {batch.events.map((event, eventIdx) => (
                          <motion.div
                            key={eventIdx}
                            variants={eventItem}
                            whileHover={{ y: -4 }}
                            className="bg-white border border-slate-200 rounded-2xl hover:shadow-2xl hover:shadow-sky-500/10 transition-all duration-500 overflow-hidden"
                          >
                            <div className="p-8 border-b border-slate-200">
                              <h3 className="text-2xl font-bold text-slate-800 mb-3 hover:text-sky-700 transition-colors duration-300">
                                {event.title}
                              </h3>
                              <p className="text-base text-slate-600 mb-6 leading-relaxed">
                                {event.description}
                              </p>
                              <div className="flex flex-wrap gap-6 text-sm text-slate-600">
                                {[
                                  { icon: Calendar, label: event.date },
                                  { icon: MapPin, label: event.location },
                                  {
                                    icon: Users,
                                    label: `${event.participants} Peserta`,
                                  },
                                  {
                                    icon: ImageIcon,
                                    label: `${event.images.length} Foto`,
                                  },
                                ].map((item, i) => (
                                  <motion.div
                                    key={i}
                                    whileHover={{ scale: 1.05 }}
                                    className="flex items-center gap-2"
                                  >
                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-100 to-blue-100 flex items-center justify-center">
                                      <item.icon className="w-4 h-4 text-sky-600" />
                                    </div>
                                    <span className="font-medium">
                                      {item.label}
                                    </span>
                                  </motion.div>
                                ))}
                              </div>
                            </div>

                            <div className="p-8 bg-gradient-to-br from-slate-50/50 to-sky-50/50">
                              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {event.images.map((img, imgIdx) => (
                                  <motion.div
                                    key={imgIdx}
                                    whileHover={{ y: -8, scale: 1.02 }}
                                    className="aspect-video rounded-xl overflow-hidden cursor-pointer border border-slate-200 hover:border-sky-300 relative"
                                    onClick={() => setSelectedImage(img)}
                                  >
                                    <img
                                      src={img.trim()}
                                      alt={`${event.title} - ${imgIdx + 1}`}
                                      className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                                    <div className="absolute bottom-2 right-2 w-8 h-8 rounded-lg bg-white/90 backdrop-blur-sm opacity-0 hover:opacity-100 transform translate-y-2 hover:translate-y-0 transition-all duration-300">
                                      <ImageIcon className="w-4 h-4 text-sky-600" />
                                    </div>
                                  </motion.div>
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="text-center py-20"
                >
                  <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-sky-100 to-blue-100 flex items-center justify-center">
                    <ImageIcon className="w-10 h-10 text-sky-600" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-slate-800">
                    Belum Ada Dokumentasi
                  </h3>
                  <p className="text-slate-600">
                    Dokumentasi untuk kategori ini akan segera ditambahkan
                  </p>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </Tabs>
      </section>

      {/* Image Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/95 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              className="relative max-w-6xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute -top-14 right-0 w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white flex items-center justify-center"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <div className="bg-white rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={selectedImage}
                  alt="Preview"
                  className="w-full h-auto max-h-[85vh] object-contain"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default Documentation;
