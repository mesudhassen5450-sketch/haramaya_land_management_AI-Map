import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Map,
  FileText,
  Receipt,
  CreditCard,
  Scale,
  Users,
  UserCircle,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Building2,
  LogOut,
  Home,
  MessageSquare,
  LandPlot,
  Building,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

const staffNavItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: Map, label: "Land Registration", path: "/land-registration" },
  { icon: FileText, label: "Property Valuation", path: "/valuation" },
  { icon: Receipt, label: "Tax Management", path: "/tax" },
  { icon: CreditCard, label: "Payments", path: "/payments" },
  { icon: Scale, label: "Disputes", path: "/disputes" },
  { icon: MessageSquare, label: "Inquiries", path: "/manage-inquiries" },
  { icon: LandPlot, label: "Property Market", path: "/property-sales" },
  { icon: LandPlot, label: "Land Sales", path: "/land-sales" },
  { icon: Building, label: "House Sales", path: "/house-sale" },
  { icon: MessageSquare, label: "Inquirie", path: "/inquirie" },
  { icon: Building2, label: "Structure Registry", path: "/structure-registry" },
  { icon: ShieldCheck, label: "Sale Validation", path: "/sale-validation" },
  { icon: BarChart3, label: "Reports", path: "/reports" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

const adminNavItems = [
  { icon: Users, label: "User Management", path: "/users" },
];

const citizenNavItems = [
  { icon: LayoutDashboard, label: "Overview", path: "/citizen-portal" },
  { icon: Home, label: "My Properties", path: "/my-properties" },
  { icon: Receipt, label: "Tax & Payments", path: "/my-payments" },
  { icon: Scale, label: "Dispute Center", path: "/my-disputes" },
  { icon: LandPlot, label: "Land Market", path: "/property-sales" },
  { icon: Home, label: "Housing Market", path: "/house-sales" },
  { icon: FileText, label: "Digital Vault", path: "/my-documents" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isStaff, hasRole, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  // Determine which nav items to show based on user role
  let navItems = citizenNavItems;
  if (isStaff()) {
    navItems = [...staffNavItems];
    if (hasRole("admin")) {
      navItems = [...staffNavItems, ...adminNavItems];
    }
  }

  return (
    <aside
      className={cn(
        "sidebar-gradient h-screen flex flex-col transition-all duration-300 shadow-sidebar",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
            <Building2 className="w-6 h-6 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="animate-fade-in">
              <h1 className="font-semibold text-sidebar-foreground text-sm">
                Haramaya Subcity
              </h1>
              <p className="text-xs text-sidebar-foreground/60">
                Land & Tax System
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group",
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
              )}
            >
              <item.icon
                className={cn(
                  "w-5 h-5 flex-shrink-0 transition-transform",
                  !isActive && "group-hover:scale-110"
                )}
              />
              {!collapsed && (
                <span className="text-sm font-medium animate-fade-in">
                  {item.label}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Sign Out Button */}
      <div className="p-3 border-t border-sidebar-border">
        <Button
          variant="ghost"
          onClick={handleSignOut}
          className={cn(
            "w-full flex items-center gap-2 text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground",
            collapsed ? "justify-center px-2" : "justify-start px-3"
          )}
        >
          <LogOut className="w-5 h-5" />
          {!collapsed && <span className="text-sm">Sign Out</span>}
        </Button>
      </div>

      {/* Collapse Toggle */}
      <div className="p-3 border-t border-sidebar-border">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <>
              <ChevronLeft className="w-5 h-5" />
              <span className="text-sm">Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
