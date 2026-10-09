import React from "react";
import { CLOUDINARY_BRANDING } from "../config/images";

interface AuthorisationItem {
  name: string;
  fullName: string;
  role: string;
  logoUrl: string;
  localFallback: string;
  accentBorder: string;
}

export const Authorisations: React.FC = () => {
  const authorisations: AuthorisationItem[] = [
    {
      name: "MKCL",
      fullName: "Maharashtra Knowledge Corporation Limited",
      role: "Authorized MS-CIT Training Centre",
      logoUrl: CLOUDINARY_BRANDING.mkclLogo,
      localFallback: "/images/logos/mkcl.png",
      accentBorder: "border-blue-500/20 group-hover:border-blue-500/50",
    },
    {
      name: "MSBTE",
      fullName: "Maharashtra State Board of Technical Education",
      role: "Technical Certification Partner",
      logoUrl: CLOUDINARY_BRANDING.msbteLogo,
      localFallback: "/images/logos/msbte.jpg",
      accentBorder: "border-red-500/20 group-hover:border-red-500/50",
    },
    {
      name: "MSCE Pune",
      fullName: "Maharashtra State Council of Examination",
      role: "Government Examination Recognized",
      logoUrl: CLOUDINARY_BRANDING.msceLogo,
      localFallback: "/images/logos/msce.jpg",
      accentBorder: "border-emerald-500/20 group-hover:border-emerald-500/50",
    },
  ];

  return (
    <section
      id="authorisations"
      className="scroll-reveal py-14 sm:py-16 bg-white border-b border-slate-200/80"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Section Heading Left */}
          <div className="lg:col-span-4">
            <div className="inline-block text-xs font-bold tracking-widest text-[#0062d2] uppercase mb-1.5 bg-blue-50 px-3 py-1 rounded-full border border-blue-100 shadow-2xs">
              OFFICIAL CERTIFICATIONS
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              All <span className="bg-gradient-to-r from-[#0062d2] via-[#0284c7] to-[#2563eb] bg-clip-text text-transparent">Authorisations</span>
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600 font-medium">
              Recognized & Authorized Training
            </p>
          </div>

          {/* 3 Authorisation Cards Right with equal visual weight */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
            {authorisations.map((item, idx) => {
              const isMkcl = item.name === "MKCL";
              return (
                <div
                  key={item.name}
                  style={{ animationDelay: `${idx * 120}ms` }}
                  className={`bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs hover:shadow-md transition-all duration-300 flex items-center space-x-4 overflow-hidden group transform hover:-translate-y-1 cursor-default ${item.accentBorder}`}
                >
                  {/* Official Logo Image Container */}
                  <div
                    className={`${
                      isMkcl
                        ? "w-16 h-16 sm:w-18 sm:h-18 p-1"
                        : "w-14 h-14 sm:w-16 sm:h-16 p-1.5"
                    } rounded-xl border border-slate-100 bg-slate-50/60 flex items-center justify-center flex-shrink-0 overflow-hidden transition-all duration-300 group-hover:scale-105`}
                  >
                    <img
                      src={item.logoUrl}
                      alt={`${item.name} Official Logo`}
                      className="w-full h-full object-contain select-none transition-transform duration-300"
                      loading="lazy"
                      onError={(e) => {
                        const target = e.currentTarget;
                        if (!target.src.includes(item.localFallback)) {
                          target.src = item.localFallback;
                        }
                      }}
                    />
                  </div>

                  {/* Text Description */}
                  <div className="leading-tight min-w-0 flex-1">
                    <div className="text-base sm:text-lg font-bold text-slate-900 tracking-tight truncate group-hover:text-blue-600 transition-colors duration-200">
                      {item.name}
                    </div>
                    <div className="text-[11.5px] sm:text-xs font-medium text-slate-500 mt-1 line-clamp-2">
                      {item.fullName}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
};

export default Authorisations;
