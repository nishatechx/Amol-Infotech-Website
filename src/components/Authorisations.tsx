import React from "react";

interface AuthorisationItem {
  name: string;
  fullName: string;
  role: string;
  logoUrl: string;
  localFallback: string;
  accentGradient: string;
}

export const Authorisations: React.FC = () => {
  const authorisations: AuthorisationItem[] = [
    {
      name: "MKCL",
      fullName: "Maharashtra Knowledge Corporation Limited",
      role: "Authorized MS-CIT Training Centre",
      logoUrl:
        "https://play-lh.googleusercontent.com/tddR-j3x5hTuxF4FIFa7pSOknz6aFPT6rbzIYGNfkIxjmAqT2woWLW4jTazs8z_NFZOnNqKJJOeoyOTvLrLFIMU=w240-h480-rw",
      localFallback: "/images/logos/mkcl.png",
      accentGradient: "from-blue-600 via-indigo-600 to-blue-700",
    },
    {
      name: "MSBTE",
      fullName: "Maharashtra State Board of Technical Education",
      role: "Technical Certification Partner",
      logoUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQisnwmKfaRMxmEEHBeVlTbz1Og1ItCY3mu7lWhzsp2XH7cn1a4q-vRhlfx&s=10",
      localFallback: "/images/logos/msbte.jpg",
      accentGradient: "from-[#d92525] via-red-500 to-orange-500",
    },
    {
      name: "MSCE Pune",
      fullName: "Maharashtra State Council of Examination",
      role: "Government Examination Recognized",
      logoUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqYjJN9c7pmrZy0pvsd7F1Zpq04J2oL-EU59BvqF5dqLi_k2d5ghUsvKc&s=10",
      localFallback: "/images/logos/msce.jpg",
      accentGradient: "from-emerald-600 via-teal-500 to-emerald-700",
    },
  ];

  return (
    <section id="authorisations" className="scroll-reveal pt-36 sm:pt-32 lg:pt-32 pb-14 sm:pb-16 bg-gradient-to-b from-white via-slate-50 to-slate-100/70 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Section Heading Left */}
          <div className="lg:col-span-4">
            <div className="inline-block text-xs font-bold tracking-widest text-[#0062d2] uppercase mb-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 px-3 py-1 rounded-full border border-blue-100 shadow-2xs">
              OFFICIAL CERTIFICATIONS
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              All <span className="bg-gradient-to-r from-[#0062d2] via-[#0284c7] to-[#2563eb] bg-clip-text text-transparent">Authorisations</span>
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600 font-medium">
              Government Recognized & Certified Training Centre
            </p>
          </div>

          {/* 3 Authorisation Cards Right with stagger & micro-interactions */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
            {authorisations.map((item, idx) => {
              const isMkcl = item.name === "MKCL";
              return (
                <div
                  key={item.name}
                  style={{ animationDelay: `${idx * 120}ms` }}
                  className="relative bg-gradient-to-br from-white to-slate-50/70 rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-blue-300/80 transition-all duration-300 flex items-center space-x-4 overflow-hidden group transform hover:-translate-y-1.5 cursor-pointer"
                >
                  {/* Top colored accent indicator line: animates scaleX left -> right on hover */}
                  <div
                    className={`absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r ${item.accentGradient} opacity-90 origin-left transition-transform duration-300 ease-out scale-x-90 group-hover:scale-x-100`}
                  />

                  {/* Official Logo Image Container */}
                  <div
                    className={`${
                      isMkcl
                        ? "w-20 h-20 sm:w-24 sm:h-24 p-1"
                        : "w-14 h-14 sm:w-16 sm:h-16 p-1.5"
                    } rounded-xl border border-slate-200/90 bg-white shadow-2xs flex items-center justify-center flex-shrink-0 overflow-hidden transition-all duration-300 group-hover:scale-[1.04] group-hover:shadow-xs`}
                  >
                    <img
                      src={item.logoUrl}
                      alt={`${item.name} Official Logo`}
                      className={`w-full h-full object-contain select-none transition-transform duration-300 ${
                        isMkcl ? "scale-110 group-hover:scale-115" : "group-hover:scale-105"
                      }`}
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
                    <div className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight truncate group-hover:text-blue-600 transition-colors duration-200">
                      {item.name}
                    </div>
                    <div className="text-[11.5px] sm:text-xs font-semibold text-slate-500 mt-1 line-clamp-2">
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
