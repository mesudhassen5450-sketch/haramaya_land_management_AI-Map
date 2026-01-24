import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useState } from "react";
import ChatBox from "@/components/ChatBox";
// Existing App Pages
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";
import LandRegistration from "./pages/LandRegistration";
import PropertyValuation from "./pages/PropertyValuation";
import TaxManagement from "./pages/TaxManagement";
import Payments from "./pages/Payments";
import Disputes from "./pages/Disputes";
import UserManagement from "./pages/UserManagement";
import CitizenPortal from "./pages/CitizenPortal";
import CitizenProperties from "./pages/CitizenProperties";
import CitizenPayments from "./pages/CitizenPayments";
import CitizenDisputes from "./pages/CitizenDisputes";
import CitizenDocuments from "./pages/CitizenDocuments";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import PropertySales from "./pages/PropertySales";
import HouseSales from "./pages/HouseSales";
import Inquiries from "./pages/Inquiries";
import LandSales from "./pages/LandSales";
import HouseSale from "./pages/HouseSale";
import Inquirie from "./pages/Inquirie";
import StructureRegistry from "./pages/StructureRegistry";
import LandSaleValidation from "./pages/LandSaleValidation";
import NotFound from "./pages/NotFound";

// Migrated Website Pages
import Layout from "./components/website/Layout";
import Home from "./pages/website/Home";
import About from "./pages/website/About";
import History from "./pages/website/History";
import Services from "./pages/website/Services";
import News from "./pages/website/News";
import Contact from "./pages/website/Contact";
import ContactInfo from "./pages/website/ContactInfo";
import Feedback from "./pages/website/Feedback";
import Verification from "./pages/website/Verification";
import FAQ from "./pages/website/FAQ";
import DocumentLibrary from "./pages/website/DocumentLibrary";
import ZoningMap from "./pages/website/ZoningMap";
import Transparency from "./pages/website/Transparency";

const queryClient = new QueryClient();

const App = () => {
  const [lang, setLang] = useState('en');

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="haramaya-theme">
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Public Website Routes (Wrapped in Layout) */}
                {/* @ts-ignore: Layout props typing issue */}
                <Route element={<Layout lang={lang} setLang={setLang}><Outlet /></Layout>}>
                  <Route path="/" element={<Home lang={lang} />} />
                  <Route path="/about" element={<About lang={lang} />} />
                  <Route path="/history" element={<History lang={lang} />} />
                  <Route path="/services" element={<Services lang={lang} />} />
                  <Route path="/news" element={<News lang={lang} />} />
                  <Route path="/contact" element={<Contact lang={lang} />} />
                  <Route path="/contact-info" element={<ContactInfo lang={lang} />} />
                  <Route path="/feedback" element={<Feedback lang={lang} />} />
                  <Route path="/verify" element={<Verification lang={lang} />} />
                  <Route path="/faq" element={<FAQ lang={lang} />} />
                  <Route path="/library" element={<DocumentLibrary lang={lang} />} />
                  <Route path="/zoning" element={<ZoningMap lang={lang} />} />
                  <Route path="/transparency" element={<Transparency lang={lang} />} />
                </Route>

                {/* Authentication */}
                <Route path="/auth" element={<Auth />} />

                {/* Protected Dashboard */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/land-registration"
                  element={
                    <ProtectedRoute requireStaff>
                      <LandRegistration />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/valuation"
                  element={
                    <ProtectedRoute requireStaff>
                      <PropertyValuation />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/tax"
                  element={
                    <ProtectedRoute requireStaff>
                      <TaxManagement />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/payments"
                  element={
                    <ProtectedRoute requireStaff>
                      <Payments />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/disputes"
                  element={
                    <ProtectedRoute requireStaff>
                      <Disputes />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/users"
                  element={
                    <ProtectedRoute requiredRoles={["admin"]}>
                      <UserManagement />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/citizen-portal"
                  element={
                    <ProtectedRoute>
                      <CitizenPortal />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/my-properties"
                  element={
                    <ProtectedRoute>
                      <CitizenProperties />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/my-payments"
                  element={
                    <ProtectedRoute>
                      <CitizenPayments />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/my-disputes"
                  element={
                    <ProtectedRoute>
                      <CitizenDisputes />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/my-documents"
                  element={
                    <ProtectedRoute>
                      <CitizenDocuments />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/reports"
                  element={
                    <ProtectedRoute requireStaff>
                      <Reports />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/property-sales"
                  element={
                    <ProtectedRoute>
                      <PropertySales />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/house-sales"
                  element={
                    <ProtectedRoute>
                      <HouseSales />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/manage-inquiries"
                  element={
                    <ProtectedRoute requireStaff>
                      <Inquiries />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/land-sales"
                  element={
                    <ProtectedRoute requireStaff>
                      <LandSales />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/house-sale"
                  element={
                    <ProtectedRoute requireStaff>
                      <HouseSale />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/inquirie"
                  element={
                    <ProtectedRoute requireStaff>
                      <Inquirie />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/structure-registry"
                  element={
                    <ProtectedRoute requireStaff>
                      <StructureRegistry />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/sale-validation"
                  element={
                    <ProtectedRoute requireStaff>
                      <LandSaleValidation />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <ProtectedRoute>
                      <Settings />
                    </ProtectedRoute>
                  }
                />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              <ChatBox />
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
