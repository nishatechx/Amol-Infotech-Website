import React, { useState, useEffect } from "react";
import { Phone, ChevronDown, ArrowRight, Menu, X, LogIn } from "lucide-react";
import { motion } from "motion/react";
import AmolLogo from "./AmolLogo";

interface NavbarProps {
  onApplyClick?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onApplyClick }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [coursesDropdownOpen, setCoursesDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);

  const navItems = [
    { name: "Home", href: "#home", id: "home" },
    { name: "About Us", href: "#about", id: "about" },
    { name: "Authorisation", href: "#authorisations", id: "authorisations" },
    { name: "Courses", href: "#courses", id: "courses", hasDropdown: true },
    { name: "Centre Photos", href: "#photos", id: "photos" },
    { name: "Contact Us", href: "#contact", id: "contact" },
  ];

  // Scroll listener for compact navbar & active section indicator
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 25);

      // Detect current active section in viewport
      const sections = ["contact", "about", "photos", "courses", "authorisations", "home"];
      const scrollPos = window.scrollY + 160;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(sectionId);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200/80"
          : "bg-white border-b border-slate-100 shadow-2xs"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`flex items-center justify-between transition-all duration-300 ${
            isScrolled ? "h-16" : "h-20"
          }`}
        >
          {/* Logo with entrance animation */}
          <a
            href="#home"
            className="flex-shrink-0 flex items-center transition-transform hover:scale-[1.02] active:scale-[0.98] duration-200 animate-fade-in-left"
          >
            <AmolLogo size="md" />
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-7 animate-fade-in-down delay-100">
            {navItems.map((item) => {
              const isActive = (hoveredNav ? hoveredNav === item.id : activeSection === item.id);

              return (
                <div
                  key={item.name}
                  className="relative"
                  onMouseEnter={() => setHoveredNav(item.id)}
                  onMouseLeave={() => setHoveredNav(null)}
                >
                  {item.hasDropdown ? (
                    <div
                      className="relative"
                      onMouseEnter={() => setCoursesDropdownOpen(true)}
                      onMouseLeave={() => setCoursesDropdownOpen(false)}
                    >
                      <a
                        href={item.href}
                        className={`flex items-center text-[15px] font-medium transition-colors duration-200 py-2 ${
                          activeSection === item.id ? "text-blue-600 font-semibold" : "text-slate-800 hover:text-blue-600"
                        }`}
                      >
                        {item.name}
                        <ChevronDown
                          className={`ml-1 w-4 h-4 text-slate-500 transition-transform duration-250 ease-out ${
                            coursesDropdownOpen ? "rotate-180 text-blue-600" : ""
                          }`}
                        />
                      </a>

                      {/* Dropdown Menu with fade + slide down */}
                      <div
                        className={`absolute top-full left-0 w-60 bg-white/98 backdrop-blur-md rounded-xl shadow-xl border border-slate-100 py-2.5 z-50 transition-all duration-200 origin-top ${
                          coursesDropdownOpen
                            ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
                            : "opacity-0 -translate-y-2 scale-95 pointer-events-none"
                        }`}
                      >
                        {[
                          { title: "MS-CIT Course", href: "#courses" },
                          { title: "TallyPrime", href: "#courses" },
                          { title: "Basic Computer", href: "#courses" },
                          { title: "Typing (English / Marathi)", href: "#courses" },
                          { title: "DTP (Designing)", href: "#courses" },
                          { title: "Programming (HTML, Python)", href: "#courses" },
                        ].map((subItem) => (
                          <a
                            key={subItem.title}
                            href={subItem.href}
                            className="block px-4 py-2 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-600 hover:translate-x-1 font-medium transition-all duration-150"
                          >
                            {subItem.title}
                          </a>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <a
                      href={item.href}
                      className={`relative text-[15px] font-medium transition-colors duration-200 py-2 flex flex-col items-center ${
                        activeSection === item.id ? "text-blue-600 font-semibold" : "text-slate-800 hover:text-blue-600"
                      }`}
                    >
                      <span>{item.name}</span>
                    </a>
                  )}

                  {/* Smooth Animated Gliding Underline between items */}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavUnderline"
                      className="absolute -bottom-0.5 left-0 right-0 h-[2.5px] bg-gradient-to-r from-[#d92525] via-blue-600 to-[#0062d2] rounded-full pointer-events-none"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </div>
              );
            })}
          </nav>

          {/* Right Action: Apply Button, Phone Contact & Sign In */}
          <div className="hidden sm:flex items-center space-x-4 lg:space-x-5 animate-fade-in-down delay-150">
            <button
              onClick={onApplyClick || (() => {
                const el = document.getElementById("contact");
                el?.scrollIntoView({ behavior: "smooth" });
              })}
              className="group inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#e52e2e] via-[#d92525] to-[#b91c1c] hover:from-[#d92525] hover:to-[#991b1b] text-white text-[14.5px] font-semibold tracking-wide transition-all duration-200 shadow-md hover:shadow-lg hover:shadow-red-500/25 cursor-pointer transform hover:-translate-y-0.5 active:scale-[0.98]"
            >
              <span>Apply Now</span>
              <ArrowRight className="ml-1.5 w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </button>

            <a
              href="tel:+919421701759"
              className="flex items-center space-x-3 group transition-transform active:scale-[0.98]"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 flex items-center justify-center text-slate-800 group-hover:from-blue-50 group-hover:to-indigo-50 group-hover:text-blue-600 group-hover:border-blue-200 group-hover:scale-105 transition-all duration-200 shadow-2xs">
                <Phone className="w-4 h-4 transition-transform duration-200 group-hover:rotate-12" />
              </div>
              <div className="text-left leading-tight hidden xl:block">
                <span className="block text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                  Call Now
                </span>
                <span className="block text-[14px] font-bold text-slate-900 group-hover:text-blue-600 transition-colors duration-200 whitespace-nowrap">
                  +91 94217 01759
                </span>
              </div>
            </a>

            {/* Sign In Icon Button: positioned last, same format as Apply Now */}
            <a
              href="/director-login"
              className="group inline-flex items-center justify-center px-3.5 py-2.5 rounded-lg bg-gradient-to-r from-[#e52e2e] via-[#d92525] to-[#b91c1c] hover:from-[#d92525] hover:to-[#991b1b] text-white shadow-md hover:shadow-lg hover:shadow-red-500/25 cursor-pointer transform hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200"
              title="Sign In"
              aria-label="Sign In"
            >
              <LogIn className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center space-x-2">
            <button
              onClick={onApplyClick || (() => {
                const el = document.getElementById("contact");
                el?.scrollIntoView({ behavior: "smooth" });
              })}
              className="px-3.5 py-1.5 rounded-md bg-gradient-to-r from-[#e52e2e] to-[#b91c1c] text-white text-xs font-semibold shadow-xs active:scale-95 transition-transform"
            >
              Apply
            </button>

            {/* Mobile Sign In Icon Button (same format as Apply) */}
            <a
              href="/director-login"
              className="p-1.5 rounded-md bg-gradient-to-r from-[#e52e2e] to-[#b91c1c] text-white shadow-xs active:scale-95 transition-transform flex items-center justify-center"
              title="Sign In"
              aria-label="Sign In"
            >
              <LogIn className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-slate-700 hover:text-blue-600 hover:bg-slate-100 active:scale-95 transition-all"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu with slide down */}
      <div
        className={`lg:hidden bg-white/98 backdrop-blur-md border-b border-slate-200 px-4 transition-all duration-300 overflow-hidden ${
          mobileMenuOpen ? "max-h-[480px] py-4 opacity-100" : "max-h-0 py-0 opacity-0 pointer-events-none"
        }`}
      >
        <div className="space-y-1">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                activeSection === item.id ? "text-[#d92525] bg-red-50/80 font-bold" : "text-slate-800 hover:bg-slate-50"
              }`}
            >
              {item.name}
            </a>
          ))}

          {/* Sign In in Mobile Drawer */}
          <div className="pt-2 border-t border-slate-100 mt-2">
            <a
              href="/director-login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center space-x-2 px-3 py-2.5 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-[#e52e2e] to-[#b91c1c] shadow-xs"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In</span>
            </a>
          </div>
        </div>
        <div className="pt-3.5 mt-2 border-t border-slate-100 flex items-center justify-between">
          <a
            href="tel:+919421701759"
            className="flex items-center space-x-2 text-slate-800"
          >
            <Phone className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-semibold">+91 94217 01759</span>
          </a>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onApplyClick?.() || document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="px-4 py-2 rounded-md bg-[#d92525] text-white text-xs font-semibold flex items-center active:scale-95 transition-transform"
          >
            Apply Now <ArrowRight className="ml-1 w-3 h-3" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
