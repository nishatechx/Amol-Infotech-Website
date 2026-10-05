import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Authorisations from "./components/Authorisations";
import Courses from "./components/Courses";
import Facilities from "./components/Facilities";
import GoogleReviewsSection from "./components/reviews/GoogleReviewsSection";
import CentrePhotos from "./components/CentrePhotos";
import About from "./components/About";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import FloatingWhatsApp from "./components/FloatingWhatsApp";
import ScrollProgress from "./components/ScrollProgress";
import CustomCursor from "./components/CustomCursor";
import { useScrollReveal } from "./hooks/useScrollReveal";

export default function App() {
  const [selectedCourse, setSelectedCourse] = useState<string>("");

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
          // Update URL hash smoothly without instant browser jump
          window.history.pushState(null, "", href);
        }
      }
    };

    document.addEventListener("click", handleAnchorClick);
    return () => document.removeEventListener("click", handleAnchorClick);
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans antialiased selection:bg-blue-600 selection:text-white relative">
      {/* Scroll Progress Indicator at top of viewport */}
      <ScrollProgress />

      {/* Subtle Desktop Interactive Cursor Layer */}
      <CustomCursor />

      {/* 1. Header / Navbar */}
      <Navbar onApplyClick={() => scrollToContact()} />

      {/* Main Content Sections */}
      <main>
        {/* 2. Hero Section with 4-Stat Floating Bar */}
        <section className="relative z-20">
          <Hero onApplyClick={() => scrollToContact()} />
        </section>

        {/* 3. All Authorisations Section (MKCL, MSBTE, MSCE Pune) */}
        <div className="relative z-10">
          <Authorisations />
        </div>

        {/* 4. Our Courses Section (MS-CIT, Tally, Basic Computer, Typing, DTP, Programming) */}
        <Courses onSelectCourse={(courseName) => scrollToContact(courseName)} />

        {/* 5. Our Facilities Banner */}
        <Facilities />

        {/* 6. What Our Students Say (Google Reviews) */}
        <GoogleReviewsSection />

        {/* 7. Centre Photos Section (Gallery) */}
        <CentrePhotos />

        {/* 8. About Us Section (Our Mission, Our Vision, Why Choose Us?) */}
        <About />

        {/* 9. Get In Touch / Contact Section */}
        <Contact selectedCourse={selectedCourse} />
      </main>

      {/* 10. Footer */}
      <Footer />

      {/* Floating WhatsApp Action Button */}
      <FloatingWhatsApp />
    </div>
  );
}
