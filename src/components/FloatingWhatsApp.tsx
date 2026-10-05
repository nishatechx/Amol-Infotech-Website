import React, { useState } from "react";

export const FloatingWhatsApp: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);

  const phoneNumber = "919421701759";
  const defaultMessage = encodeURIComponent(
    "Hello Amol Infotech & Maharana Typing Institute, I would like to inquire about admissions and course details."
  );
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${defaultMessage}`;

  return (
    <aside
      aria-label="WhatsApp Chat Support"
      className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 flex items-center group pointer-events-auto select-none"
    >
      {/* Floating Hover Tooltip (Desktop) */}
      <div
        className={`hidden sm:flex items-center bg-white text-slate-800 text-xs font-semibold px-3.5 py-2 rounded-full shadow-lg border border-slate-100 mr-2.5 transition-all duration-300 pointer-events-none transform ${
          isHovered
            ? "opacity-100 translate-x-0 scale-100"
            : "opacity-0 translate-x-2 scale-95"
        }`}
        role="tooltip"
      >
        <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse" />
        <span>Chat with us on WhatsApp</span>
      </div>

      {/* Main Floating Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative flex items-center justify-center w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-[#128C7E] via-[#25D366] to-[#25D366] hover:from-[#0d7165] hover:to-[#20bd5a] text-white shadow-xl hover:shadow-2xl shadow-emerald-600/30 transition-all duration-300 transform hover:scale-108 active:scale-95 focus:outline-none focus:ring-4 focus:ring-emerald-300 animate-whatsapp-attention cursor-pointer"
        aria-label="Chat with Amol Infotech on WhatsApp"
        title="Chat with Amol Infotech & Maharana Typing Institute on WhatsApp"
      >
        {/* Online Green Status Badge */}
        <span
          className="absolute top-0 right-0 w-3.5 h-3.5 bg-emerald-400 border-2 border-white rounded-full shadow-xs"
          aria-hidden="true"
          title="Online"
        />

        {/* WhatsApp Official Vector Logo */}
        <svg
          className="w-7 h-7 sm:w-8 sm:h-8 fill-current"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M17.507 14.307l-.009.075c-.238-.12-1.406-.694-1.624-.774-.219-.079-.378-.119-.537.12-.158.239-.615.774-.754.933-.139.159-.278.179-.516.06-.239-.12-1.008-.372-1.92-1.185-.709-.633-1.188-1.415-1.327-1.654-.139-.239-.015-.368.105-.487.108-.107.239-.278.358-.418.12-.139.159-.239.239-.398.079-.16.039-.299-.02-.418-.06-.12-.537-1.294-.736-1.772-.194-.466-.391-.403-.537-.411-.139-.007-.298-.009-.457-.009-.16 0-.418.06-.637.299-.219.239-.836.817-.836 1.992 0 1.176.856 2.311.975 2.47.12.16 1.685 2.573 4.082 3.608.57.246 1.015.393 1.362.504.572.182 1.093.156 1.504.095.459-.069 1.406-.575 1.605-1.13.199-.556.199-1.032.139-1.131-.059-.1-.218-.159-.457-.279z" />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12 0C5.373 0 0 5.373 0 12c0 2.115.547 4.103 1.507 5.836L.265 23.351a.6.6 0 00.742.742l5.515-1.242A11.947 11.947 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818c-1.848 0-3.579-.496-5.074-1.364a.6.6 0 00-.472-.053l-3.834.863.863-3.834a.6.6 0 00-.053-.472A9.774 9.774 0 012.182 12C2.182 6.577 6.577 2.182 12 2.182 17.423 2.182 21.818 6.577 21.818 12c0 5.423-4.395 9.818-9.818 9.818z"
          />
        </svg>
      </a>
    </aside>
  );
};

export default FloatingWhatsApp;
