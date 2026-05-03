import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Home } from "@/pages/Home";
import { About } from "@/pages/About";
import { Services } from "@/pages/Services";
import { Audit } from "@/pages/Audit";
import { Contact } from "@/pages/Contact";
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
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/audit" element={<Audit />} />
          <Route path="/contact" element={<Contact />} />
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
