import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import TrustStatistics from "./components/TrustStatistics";
import Authorisations from "./components/Authorisations";
import About from "./components/About";
import Courses from "./components/Courses";
import Facilities from "./components/Facilities";
import CentrePhotos from "./components/CentrePhotos";
import GoogleReviewsSection from "./components/reviews/GoogleReviewsSection";
import FinalCTA from "./components/FinalCTA";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import FloatingWhatsApp from "./components/FloatingWhatsApp";
import ScrollProgress from "./components/ScrollProgress";
import CustomCursor from "./components/CustomCursor";
import { useScrollReveal } from "./hooks/useScrollReveal";
import { CmsProvider, useCms } from "./hooks/useCms";
import DirectorLogin from "./components/admin/DirectorLogin";
import DirectorDashboard from "./components/admin/DirectorDashboard";
import { ArrowLeft, Eye } from "lucide-react";

function PublicWebsite({
  onNavigate,
}: {
  onNavigate: (path: string) => void;
}) {
  const [selectedCourse, setSelectedCourse] = useState<string>("" );
  const { isPreviewMode } = useCms();

  // Activate global scroll reveal with mobile safety guarantees
  useScrollReveal();

  const scrollToContact = (courseName?: string) => {
    if (courseName) {
      setSelectedCourse(courseName);
    }
    const element = document.getElementById("contact");
    if (element) {
      const navOffset = 80;
      const elementPos = element.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: elementPos - navOffset,
        behavior: "smooth",
      });
    }
  };

  const scrollToCourses = () => {
    const element = document.getElementById("courses");
    if (element) {
      const navOffset = 80;
      const elementPos = element.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: elementPos - navOffset,
        behavior: "smooth",
      });
    }
  };

  // Smooth scroll handler for all hash anchor links
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a");
      if (!target) return;

      const href = target.getAttribute("href");
      if (href && href.startsWith("#") && href.length > 1) {
        const targetElement = document.querySelector(href);
        if (targetElement) {
          e.preventDefault();
          const navOffset = 80;
          const elementPos =
            targetElement.getBoundingClientRect().top + window.pageYOffset;
          window.scrollTo({
            top: elementPos - navOffset,
            behavior: "smooth",
          });
          window.history.pushState(null, "", href);
        }
      } else if (href && (href === "/director-login" || href.startsWith("/director-"))) {
        e.preventDefault();
        onNavigate(href);
      }
    };

    document.addEventListener("click", handleAnchorClick);
    return () => document.removeEventListener("click", handleAnchorClick);
  }, [onNavigate]);

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans antialiased selection:bg-blue-600 selection:text-white relative">
      {/* Scroll Progress Indicator at top of viewport */}
      <ScrollProgress />

      {/* Subtle Desktop Interactive Cursor Layer */}
      <CustomCursor />

      {/* Preview Mode Floating Banner */}
      {isPreviewMode && (
        <div className="bg-amber-500 text-slate-950 px-4 py-2 text-xs font-bold flex items-center justify-between sticky top-0 z-50 shadow-md">
          <div className="flex items-center space-x-2">
            <Eye className="w-4 h-4" />
            <span>PREVIEW MODE: Showing working draft changes (not yet published to live visitors).</span>
          </div>
          <button
            onClick={() => onNavigate("/director-dashboard")}
            className="inline-flex items-center bg-slate-950 text-white px-2.5 py-1 rounded text-[11px] font-semibold hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3 h-3 mr-1" />
            Return to Dashboard
          </button>
        </div>
      )}

      {/* Header / Sticky Navbar */}
      <Navbar onApplyClick={() => scrollToContact()} />

      {/* 
        Exact Storytelling Homepage Structure:
        1. HERO
        2. TRUST / STATISTICS
        3. ALL AUTHORISATIONS
        4. ABOUT US + DIRECTOR
        5. OUR COURSES
        6. WHY CHOOSE US / OUR FACILITIES
        7. CENTRE PHOTOS
        8. GOOGLE REVIEWS
        9. FINAL CTA
        10. CONTACT / ENQUIRY + MAP
        11. FOOTER
      */}
      <main>
        {/* 1. Hero Section */}
        <Hero
          onApplyClick={() => scrollToContact()}
          onExploreCoursesClick={() => scrollToCourses()}
        />

        {/* 2. Trust / Statistics Strip */}
        <TrustStatistics />

        {/* 3. All Authorisations Section (MKCL, MSBTE, MSCE Pune) */}
        <Authorisations />

        {/* 4. About Us + Director Profile */}
        <About />

        {/* 5. Our Courses Section (11 Courses with Filtering) */}
        <Courses onSelectCourse={(courseName) => scrollToContact(courseName)} />

        {/* 6. Why Choose Us / Our Facilities (10 Facility Items in 5x2 Grid) */}
        <Facilities />

        {/* 7. Inside Amol Infotech (Centre Photos Gallery) */}
        <CentrePhotos />

        {/* 8. What Our Students Say (Real Google Reviews) */}
        <GoogleReviewsSection />

        {/* 9. Final High-Conversion CTA Banner */}
        <FinalCTA onApplyClick={() => scrollToContact()} />

        {/* 10. Contact / Enquiry + Interactive Map */}
        <Contact selectedCourse={selectedCourse} />
      </main>

      {/* 11. Footer */}
      <Footer />

      {/* Floating WhatsApp Action Button */}
      <FloatingWhatsApp />
    </div>
  );
}

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(
    typeof window !== "undefined" ? window.location.pathname : "/"
  );

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const navigate = (path: string) => {
    window.history.pushState(null, "", path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  // Dedicated Route: /director-login
  if (currentPath === "/director-login") {
    return <DirectorLogin onNavigate={navigate} />;
  }

  // Dedicated Route: /director-dashboard
  if (currentPath.startsWith("/director-dashboard")) {
    return <DirectorDashboard onNavigate={navigate} />;
  }

  // Default: Public Website
  return (
    <CmsProvider>
      <PublicWebsite onNavigate={navigate} />
    </CmsProvider>
  );
}
