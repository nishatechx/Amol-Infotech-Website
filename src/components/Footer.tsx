import React from "react";
import AmolLogo from "./AmolLogo";
import { useCms } from "../hooks/useCms";
import { DEFAULT_CONTACT } from "../server/defaultData";

export const Footer: React.FC = () => {
  const { content } = useCms();
  const contact = content?.contact || DEFAULT_CONTACT;

  return (
    <footer className="bg-white border-t border-slate-100 text-slate-700 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main 4-Column Footer */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 pb-10 border-b border-slate-100 items-start">
          
          {/* Col 1: Logo & Contact Info (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <a href="#home" className="inline-block">
              <AmolLogo size="md" />
            </a>
            <div className="text-xs text-slate-600 space-y-1.5 pt-1">
              <p className="font-semibold text-slate-800">
                {contact.address}
              </p>
              <p>
                Phone:{" "}
                <a
                  href={`tel:${contact.phone.replace(/\s+/g, "")}`}
                  className="font-bold text-blue-600 hover:underline"
                >
                  {contact.phone}
                </a>
              </p>
              <p>
                Email:{" "}
                <a
                  href={`mailto:${contact.email}`}
                  className="hover:underline text-slate-600 font-medium"
                >
                  {contact.email}
                </a>
              </p>
            </div>
          </div>

          {/* Col 2: Quick Links (3 cols with 2 sub-columns) */}
          <div className="lg:col-span-3">
            <h4 className="text-sm font-bold text-slate-900 tracking-tight mb-4">
              Quick Links
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs sm:text-[13px] text-slate-600">
              <div className="space-y-2.5">
                <div>
                  <a href="#home" className="inline-block hover:text-blue-600 hover:translate-x-1 transition-all duration-200">
                    Home
                  </a>
                </div>
                <div>
                  <a href="#about" className="inline-block hover:text-blue-600 hover:translate-x-1 transition-all duration-200">
                    About Us
                  </a>
                </div>
                <div>
                  <a href="#authorisations" className="inline-block hover:text-blue-600 hover:translate-x-1 transition-all duration-200">
                    Authorisations
                  </a>
                </div>
              </div>
              <div className="space-y-2.5">
                <div>
                  <a href="#courses" className="inline-block hover:text-blue-600 hover:translate-x-1 transition-all duration-200">
                    All Courses
                  </a>
                </div>
                <div>
                  <a href="#photos" className="inline-block hover:text-blue-600 hover:translate-x-1 transition-all duration-200">
                    Centre Photos
                  </a>
                </div>
                <div>
                  <a href="#contact" className="inline-block hover:text-blue-600 hover:translate-x-1 transition-all duration-200">
                    Contact Us
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Col 3: Popular Courses (3 cols) */}
          <div className="lg:col-span-3">
            <h4 className="text-sm font-bold text-slate-900 tracking-tight mb-4">
              Popular Courses
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs sm:text-[13px] text-slate-600">
              <div className="space-y-2.5">
                <div>
                  <a href="#courses" className="inline-block hover:text-blue-600 hover:translate-x-1 transition-all duration-200">
                    MS-CIT
                  </a>
                </div>
                <div>
                  <a href="#courses" className="inline-block hover:text-blue-600 hover:translate-x-1 transition-all duration-200">
                    TallyPrime
                  </a>
                </div>
                <div>
                  <a href="#courses" className="inline-block hover:text-blue-600 hover:translate-x-1 transition-all duration-200">
                    Typing (English/Marathi)
                  </a>
                </div>
              </div>
              <div className="space-y-2.5">
                <div>
                  <a href="#courses" className="inline-block hover:text-blue-600 hover:translate-x-1 transition-all duration-200">
                    Basic Computer
                  </a>
                </div>
                <div>
                  <a href="#courses" className="inline-block hover:text-blue-600 hover:translate-x-1 transition-all duration-200">
                    DTP Designing
                  </a>
                </div>
                <div>
                  <a href="#courses" className="inline-block hover:text-blue-600 hover:translate-x-1 transition-all duration-200">
                    Programming
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Col 4: Social Media Icons (3 cols) */}
          <div className="lg:col-span-3">
            <h4 className="text-sm font-bold text-slate-900 tracking-tight mb-4">
              Connect With Us
            </h4>
            <div className="flex items-center space-x-2.5">
              {/* WhatsApp */}
              <a
                href={`https://wa.me/${contact.whatsapp.replace(/\D/g, "")}`}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-[#25d366] flex items-center justify-center text-white hover:opacity-95 hover:-translate-y-1 hover:scale-105 active:scale-95 transition-all duration-200 shadow-xs"
                aria-label="WhatsApp"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/>
                </svg>
              </a>

              {/* Instagram */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] flex items-center justify-center text-white hover:opacity-95 hover:-translate-y-1 hover:scale-105 active:scale-95 transition-all duration-200 shadow-xs"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>

              {/* Facebook */}
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-[#1877f2] flex items-center justify-center text-white hover:opacity-95 hover:-translate-y-1 hover:scale-105 active:scale-95 transition-all duration-200 shadow-xs"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>

              {/* YouTube */}
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-[#ff0000] flex items-center justify-center text-white hover:opacity-95 hover:-translate-y-1 hover:scale-105 active:scale-95 transition-all duration-200 shadow-xs"
                aria-label="YouTube"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <div className="flex items-center space-x-2">
            <span>© 2024 Amol Infotech. All Rights Reserved.</span>
            <span>•</span>
            <a
              href="/director-login"
              className="text-slate-400 hover:text-blue-600 transition-colors"
            >
              Director Portal
            </a>
          </div>
          <div className="flex items-center space-x-1">
            <span>Designed & Developed by</span>
            <a
              href="https://www.shrinathit.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-blue-600 hover:text-blue-800 hover:underline transition-colors"
            >
              Shrinath IT Solutions
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};
export default Footer;
