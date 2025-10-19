import { Mail, MapPin, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="font-bold text-lg mb-3 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              COCONUT Computer Club
            </h3>
            <p className="text-muted-foreground text-sm">
              Komunitas yang berfokus pada pengembangan skill teknologi melalui berbagai kegiatan edukatif.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-lg mb-3">Kontak</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                <span>coconut@club.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary" />
                <span>+62 812-3456-7890</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                <span>Jakarta, Indonesia</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="/" className="hover:text-primary transition-colors">Beranda</a></li>
              <li><a href="/dokumentasi" className="hover:text-primary transition-colors">Dokumentasi</a></li>
              <li><a href="/admin" className="hover:text-primary transition-colors">Admin</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} COCONUT Computer Club. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
