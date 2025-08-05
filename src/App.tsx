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

// Lazy load heavy components
const BackgroundAnimation = lazy(() => import("./components/BackgroundAnimation"));
const Admin = lazy(() => import("./pages/Admin"));

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
            <Route path="/" element={<Index />} />
            <Route path="/cases" element={<Cases />} />
            <Route path="/cases/:slug" element={<Cases />} />
            <Route path="/services" element={<Services />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
            <Route path="/services/:service" element={<ServiceDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={
              <Suspense fallback={<LoadingSpinner />}>
                <Admin />
              </Suspense>
            } />
            <Route path="/legal/:type" element={<PrivacyPolicy />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default App;
