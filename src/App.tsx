import { Suspense, lazy, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import Cases from "./pages/Cases";
import About from "./pages/About";
import ServiceDetail from "./pages/ServiceDetail";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import ScrollToTop from "./components/ScrollToTop";

// Lazy load background animation
const BackgroundAnimation = lazy(() => import("./components/BackgroundAnimation"));
// Import Admin directly instead of lazy loading
import Admin from "./pages/Admin";

const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

const App = () => {
  useEffect(() => {
    // Предзагружаем BackgroundAnimation после первого рендера
    const timer = setTimeout(() => {
      import("./components/BackgroundAnimation");
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <TooltipProvider>
      <div className="relative min-h-screen">
        <Suspense fallback={null}>
          <BackgroundAnimation />
        </Suspense>
        <div className="relative z-10">
          <Toaster />
          <Sonner />
          <ScrollToTop />
          <Routes>
            {/* Маршруты с языковыми префиксами */}
            <Route path="/ru" element={<Index />} />
            <Route path="/en" element={<Index />} />
            <Route path="/ru/cases" element={<Cases />} />
            <Route path="/en/cases" element={<Cases />} />
            <Route path="/ru/cases/:slug" element={<Cases />} />
            <Route path="/en/cases/:slug" element={<Cases />} />
            <Route path="/ru/services" element={<Services />} />
            <Route path="/en/services" element={<Services />} />
            <Route path="/ru/contact" element={<Contact />} />
            <Route path="/en/contact" element={<Contact />} />
            <Route path="/ru/about" element={<About />} />
            <Route path="/en/about" element={<About />} />
            <Route path="/ru/services/:service" element={<ServiceDetail />} />
            <Route path="/en/services/:service" element={<ServiceDetail />} />
            <Route path="/ru/login" element={<Login />} />
            <Route path="/en/login" element={<Login />} />
            <Route path="/ru/legal/:type" element={<PrivacyPolicy />} />
            <Route path="/en/legal/:type" element={<PrivacyPolicy />} />
            
            {/* Редирект с корневых маршрутов */}
            <Route path="/" element={<Index />} />
            <Route path="/cases" element={<Cases />} />
            <Route path="/cases/:slug" element={<Cases />} />
            <Route path="/services" element={<Services />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
            <Route path="/services/:service" element={<ServiceDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/legal/:type" element={<PrivacyPolicy />} />
            
            {/* Админка без языковых префиксов */}
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default App;
