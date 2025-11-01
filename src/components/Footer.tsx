import {
  Mail,
  Phone,
  Instagram,
  Linkedin,
  Youtube,
  Facebook,
} from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto">
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Logo & Description */}
          <div>
            <div className="flex items-center justify-start mb-3">
              <img
                src="/logosambung.png"
                alt="Logo COCONUT"
                className="w-15 h-12 object-contain"
              />
            </div>
            <p className="text-slate-600 text-sm leading-relaxed">
              Computer Club Oriented Network, Utility & Technology. Platform
              untuk mengembangkan kemampuan teknologi.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-slate-800 mb-4">Menu</h3>
            <ul className="space-y-2.5">
              <li>
                <Link
                  to="/"
                  className="text-sm text-slate-600 hover:text-sky-600 transition-colors duration-200 inline-block"
                >
                  Beranda
                </Link>
              </li>
              <li>
                <Link
                  to="/kegiatan"
                  className="text-sm text-slate-600 hover:text-sky-600 transition-colors duration-200 inline-block"
                >
                  Kegiatan
                </Link>
              </li>
              <li>
                <Link
                  to="/dokumentasi"
                  className="text-sm text-slate-600 hover:text-sky-600 transition-colors duration-200 inline-block"
                >
                  Dokumentasi
                </Link>
              </li>
              <li>
                <Link
                  to="/tentang"
                  className="text-sm text-slate-600 hover:text-sky-600 transition-colors duration-200 inline-block"
                >
                  Tentang
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h3 className="font-semibold text-slate-800 mb-4">Hubungi Kami</h3>
            <div className="space-y-3 mb-5">
              <a
                href="mailto:coconut@club.com"
                className="flex items-center gap-2.5 text-sm text-slate-600 hover:text-sky-600 transition-colors duration-200"
              >
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span>coconut@club.com</span>
              </a>
              <a
                href="tel:+6281234567890"
                className="flex items-center gap-2.5 text-sm text-slate-600 hover:text-sky-600 transition-colors duration-200"
              >
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span>+62 812-3456-7890</span>
              </a>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-3 font-medium">
                Ikuti Kami
              </p>
              <div className="flex gap-2.5">
                <a
                  href="#"
                  className="w-9 h-9 rounded-lg bg-slate-100 hover:bg-gradient-to-br hover:from-sky-600 hover:to-blue-600 flex items-center justify-center transition-all duration-300 hover:scale-110 group"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4 text-slate-600 group-hover:text-white transition-colors" />
                </a>
                <a
                  href="#"
                  className="w-9 h-9 rounded-lg bg-slate-100 hover:bg-gradient-to-br hover:from-sky-600 hover:to-blue-600 flex items-center justify-center transition-all duration-300 hover:scale-110 group"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-4 h-4 text-slate-600 group-hover:text-white transition-colors" />
                </a>
                <a
                  href="#"
                  className="w-9 h-9 rounded-lg bg-slate-100 hover:bg-gradient-to-br hover:from-sky-600 hover:to-blue-600 flex items-center justify-center transition-all duration-300 hover:scale-110 group"
                  aria-label="YouTube"
                >
                  <Youtube className="w-4 h-4 text-slate-600 group-hover:text-white transition-colors" />
                </a>
                <a
                  href="#"
                  className="w-9 h-9 rounded-lg bg-slate-100 hover:bg-gradient-to-br hover:from-sky-600 hover:to-blue-600 flex items-center justify-center transition-all duration-300 hover:scale-110 group"
                  aria-label="Facebook"
                >
                  <Facebook className="w-4 h-4 text-slate-600 group-hover:text-white transition-colors" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-200 text-center">
          <p className="text-sm text-slate-600">
            &copy; {new Date().getFullYear()}{" "}
            <span className="font-semibold text-sky-600">COCONUT</span>. All
            rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
