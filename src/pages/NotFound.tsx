import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, Search } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 via-white to-blue-50 px-4">
      <div className="max-w-2xl w-full text-center animate-fade-in">
        {/* 404 Illustration */}
        <div className="mb-8 relative">
          <div className="text-[150px] md:text-[200px] font-bold text-sky-100 leading-none select-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-6xl md:text-8xl animate-bounce">
              🤔
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-blue-800 via-sky-600 to-blue-900 bg-clip-text text-transparent">
                Halaman Tidak Ditemukan
              </span>
            </h1>
            <p className="text-lg text-gray-600 max-w-md mx-auto">
              Maaf, halaman yang Anda cari tidak ada atau telah dipindahkan. 
              Silakan kembali ke beranda atau cari kegiatan lainnya.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link to="/">
              <Button 
                size="lg"
                className="bg-sky-600 hover:bg-sky-700 font-medium shadow-md hover:shadow-lg transition-all w-full sm:w-auto"
              >
                <Home className="w-5 h-5 mr-2" />
                Kembali ke Beranda
              </Button>
            </Link>
            <Link to="/kegiatan">
              <Button 
                size="lg"
                variant="outline"
                className="border-sky-600 text-sky-600 hover:bg-sky-50 font-medium w-full sm:w-auto"
              >
                <Search className="w-5 h-5 mr-2" />
                Lihat Kegiatan
              </Button>
            </Link>
          </div>

          {/* Quick Links */}
          <div className="pt-8 border-t border-gray-200 mt-12">
            <p className="text-sm text-gray-500 mb-4">Atau kunjungi halaman lainnya:</p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Link to="/" className="text-sky-600 hover:text-sky-700 font-medium transition-colors">
                Beranda
              </Link>
              <span className="text-gray-300">•</span>
              <Link to="/kegiatan" className="text-sky-600 hover:text-sky-700 font-medium transition-colors">
                Pendaftaran
              </Link>
              <span className="text-gray-300">•</span>
              <Link to="/dokumentasi" className="text-sky-600 hover:text-sky-700 font-medium transition-colors">
                Dokumentasi
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-sky-200 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-blue-200 rounded-full blur-3xl opacity-50"></div>
      </div>
    </div>
  );
};

export default NotFound;