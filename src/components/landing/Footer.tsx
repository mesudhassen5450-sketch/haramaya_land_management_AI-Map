import { Link } from "react-router-dom";
import { MapPin, Facebook, Twitter, Youtube, Mail } from "lucide-react";

const footerLinks = {
  services: [
    { label: "Land Registration", href: "/land-registration" },
    { label: "Tax Payment", href: "/payments" },
    { label: "Property Valuation", href: "/property-valuation" },
    { label: "Dispute Resolution", href: "/disputes" },
  ],
  resources: [
    { label: "Citizen Portal", href: "/citizen-portal" },
    { label: "Tax Calculator", href: "/tax-management" },
    { label: "Property Search", href: "/citizen-portal" },
    { label: "Payment History", href: "/payments" },
  ],
  government: [
    { label: "About Us", href: "#" },
    { label: "Contact", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Accessibility", href: "#" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-sidebar border-t border-sidebar-border">
      <div className="container px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-bold text-sidebar-foreground">Haramaya</span>
                <span className="text-primary font-medium ml-1">LandTax</span>
              </div>
            </Link>
            <p className="text-sidebar-foreground/70 mb-6 max-w-sm leading-relaxed">
              Digital land and tax management system for Haramaya Wereda. 
              Making government services accessible to all citizens.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-lg bg-sidebar-accent flex items-center justify-center text-sidebar-foreground/70 hover:text-primary transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-sidebar-accent flex items-center justify-center text-sidebar-foreground/70 hover:text-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-sidebar-accent flex items-center justify-center text-sidebar-foreground/70 hover:text-primary transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-sidebar-accent flex items-center justify-center text-sidebar-foreground/70 hover:text-primary transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-sidebar-foreground mb-4">Services</h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="text-sidebar-foreground/70 hover:text-primary transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-sidebar-foreground mb-4">Resources</h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="text-sidebar-foreground/70 hover:text-primary transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Government */}
          <div>
            <h4 className="font-semibold text-sidebar-foreground mb-4">Government</h4>
            <ul className="space-y-3">
              {footerLinks.government.map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="text-sidebar-foreground/70 hover:text-primary transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-sidebar-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sidebar-foreground/50 text-sm">
            © {new Date().getFullYear()} Haramaya Wereda Land & Tax Management. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <Link to="#" className="text-sidebar-foreground/50 hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link to="#" className="text-sidebar-foreground/50 hover:text-primary transition-colors">
              Terms of Service
            </Link>
            <Link to="#" className="text-sidebar-foreground/50 hover:text-primary transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
