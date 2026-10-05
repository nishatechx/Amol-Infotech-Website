import React from "react";

interface FacilityItem {
  title: string;
  iconUrl: string;
  localFallback: string;
}

export const Facilities: React.FC = () => {
  const facilities: FacilityItem[] = [
    {
      title: "Modern Computer Lab",
      iconUrl:
        "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEimIfs4M8PjuSoqbUDR6ukJiar7LAD19IgiKGfhPpn1wIxyJtYd0JdRImElW0nk1TA76DJOgy9OFP6GZLe8TVjbToMtN7HcBTg8svIocKaLLdQKnBGQ6RnSdQ2qg4foeMEQBi2tqeDVkmcxyNd2bjKzxIcz8tRPum6bh6UK2CorgyNqXMFUZihFtC597UE/s320/Computer%20Lab.png",
      localFallback: "/images/facilities/computer_lab.png",
    },
    {
      title: "High-Speed Internet",
      iconUrl:
        "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhoK02PtQNVjq0k9XJrmYiLWRXH1Hr0gCafRjSWiyhU4W9_1Txxhro8jo3ztM2nrqIlNe9M2hgyKdqyPjrNe2w3Jt_Or6iR6QkhjtcXvod9ym2ndlCVg5oQhsKGKypLJL1Md-fOF9wjaitmlDo3XYJdhOkDwEnZ5HbGRD0tHGVaMe88o7wriyg4vZ6XyDQ/s320/Wifi.png",
      localFallback: "/images/facilities/wifi.png",
    },
    {
      title: "Expert Trainers",
      iconUrl:
        "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjGZUznbjKhfMScQJ-Yxf5svGzqvlLDbKtOrd22H0uk81QifXENSBnSj6JT9xptRgh08vgt8eQGQWdtH1FM37N0YvnPO-YlCHFj9ygt2gItIL0qnxCq38W8QZ-djk-uwcoa3sc6wfmZGZGnpN_5q00GXL2hWHKi4qWYbcORa_74KhP8YeOE4loViepzEag/s320/Trainers.png",
      localFallback: "/images/facilities/trainers.png",
    },
    {
      title: "AC Classrooms",
      iconUrl:
        "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjpW06jtOvBNfgU10iw7XKsBVnarg3C6l69WvXNAZPOoVugUytZIRAN5iIXedY5-WmxdlcCuzAr4RkqzFFyHZMp0hUPuBtpM52Jk2EHKqj6OqcxreIO4W8fJzhF5ln4r4kTIhb_W-2-sQz5JQsgzjGcTvmO7bhFEGMBKKTNqJMz9T_NHbPlrQb3u3CHqVc/s320/AC.png",
      localFallback: "/images/facilities/ac.png",
    },
    {
      title: "Practical Learning Approach",
      iconUrl:
        "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEikguR3xFmSsu9JIUWq9h4Y1UikhB-oAZ9xuOk-OnbHlCgtTAGi0LK1_X6eKOg1C1RXVgvRGOid_Mt3B7-do6YHMdy559v8Q1-56OxFG8pYKYS9P9u_hjWDwhbBUJlAoDX8vTxr2gwcQYxX8Fac9VrqHb2ohK9Vqs8bBLsKZbJXTkJq0624cD9p-Wc5gTY/s320/Practicle.png",
      localFallback: "/images/facilities/practical.png",
    },
    {
      title: "Individual Attention",
      iconUrl:
        "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhTPYiNGSqaaZmU6QE2n2pLoeXfqwJ5rWvM621lXqq5DTm8-yaXxlsP14VPV9ZKCkOzTW4iXthDipk8RYuwhk3GNRnXDWGG5v2tp-rsPoMSVjipplEOiNtHgk676peItW_othb2EQbQ0LtP0UGmfmQ__P-E_Cgqwy_2hehk_8A7j9qsbIz-K4WLNlkf0dQ/s320/Indivisual.png",
      localFallback: "/images/facilities/individual.png",
    },
  ];

  return (
    <section id="facilities" className="scroll-reveal relative overflow-hidden bg-gradient-to-br from-[#041a3d] via-[#093570] to-[#04204d] text-white py-16 sm:py-20 border-y border-blue-900/60 shadow-2xl">
      {/* Decorative ambient background glows */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          
          {/* Left Heading */}
          <div className="lg:col-span-4">
            <div className="inline-block text-xs font-bold tracking-widest text-cyan-300 uppercase mb-2">
              CAMPUS & INFRASTRUCTURE
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
              Our <span className="bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-300 bg-clip-text text-transparent">Facilities</span>
            </h2>
            <p className="mt-3 text-sm sm:text-base text-blue-100/90 font-normal leading-relaxed">
              Modern digital infrastructure equipped to deliver the highest standard of hands-on computer education.
            </p>
          </div>

          {/* Right 6 Facility Items with Big Icons in Pure White Containers */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-5 sm:gap-6 text-center">
            {facilities.map((facility, index) => (
              <div
                key={index}
                className="flex flex-col items-center group cursor-default"
              >
                {/* Pure White Rounded Container with Large Custom Icon */}
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white shadow-xl hover:shadow-2xl border border-white/90 p-2 sm:p-2.5 flex items-center justify-center mb-3 group-hover:scale-108 group-hover:-translate-y-1 transition-all duration-300">
                  <img
                    src={facility.iconUrl}
                    alt={facility.title}
                    className="w-full h-full object-contain select-none scale-105 sm:scale-110 group-hover:scale-120 transition-transform duration-300"
                    loading="lazy"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (!target.src.includes(facility.localFallback)) {
                        target.src = facility.localFallback;
                      }
                    }}
                  />
                </div>

                <span className="text-xs sm:text-[13px] font-bold leading-snug text-white group-hover:text-amber-300 px-1 transition-colors drop-shadow-xs">
                  {facility.title}
                </span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default Facilities;
