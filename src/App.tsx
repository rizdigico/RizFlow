import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Home } from "@/pages/Home";
import { About } from "@/pages/About";
import { Services } from "@/pages/Services";
import { Audit } from "@/pages/Audit";
import { FAQ } from "@/pages/FAQ";
import { PrivacyTerms } from "@/pages/PrivacyTerms";
import { ThankYou } from "@/pages/ThankYou";
import { NotFound } from "@/pages/NotFound";
import { Blog } from "@/pages/Blog";
import { BlogPost } from "@/pages/BlogPost";
import { CaseStudy } from "@/pages/CaseStudy";
import { Demo } from "@/pages/Demo";
import { RainFreshDemo } from "@/pages/RainFreshDemo";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);
  return null;
}

function AppRoutes() {
  return (
    <>
      <ScrollToTop />
      <Header />
      <main className="pb-16 md:pb-0">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/audit" element={<Audit />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/privacy-terms" element={<PrivacyTerms />} />
          <Route path="/thank-you" element={<ThankYou />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/case-study/rainfresh-sg" element={<CaseStudy />} />
          <Route path="/demo" element={<Demo />} />
          <Route path="/demo/rainfresh" element={<RainFreshDemo />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />

      {/* Sticky mobile CTA bar — visible on screens below md breakpoint */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-[#0A0F1A]/95 backdrop-blur-md border-t border-teal-500/20 safe-area-inset-bottom">
        <div className="flex items-center gap-2 px-3 py-2.5">
          <Link
            to="/demo"
            className="flex-1 text-center py-2.5 rounded-lg border border-teal-500/40 text-teal-300 text-sm font-semibold hover:bg-teal-500/10 transition-colors"
          >
            Live Demo
          </Link>
          <Link
            to="/audit"
            className="flex-1 text-center py-2.5 rounded-lg bg-gradient-to-r from-teal-500 to-teal-400 text-white text-sm font-bold shadow-[0_0_15px_rgba(0,229,255,0.2)] hover:shadow-[0_0_25px_rgba(0,229,255,0.4)] transition-all"
          >
            Free Audit →
          </Link>
        </div>
      </div>
    </>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </HelmetProvider>
  );
}
