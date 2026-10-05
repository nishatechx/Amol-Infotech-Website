import React from "react";
import { Target, Compass, Award } from "lucide-react";

export const About: React.FC = () => {
  const cards = [
    {
      title: "Our Mission",
      description: "To empower students with practical digital skills and industry certification.",
      icon: Target,
      gradient: "from-blue-500 to-indigo-600 shadow-blue-500/25",
    },
    {
      title: "Our Vision",
      description: "To be Maharashtra's most trusted computer and typing training academy.",
      icon: Compass,
      gradient: "from-cyan-500 to-blue-600 shadow-cyan-500/25",
    },
    {
      title: "Why Choose Us?",
      description: "Authorized MKCL center, expert mentors, and guaranteed student support.",
      icon: Award,
      gradient: "from-[#d92525] to-orange-500 shadow-red-500/25",
    },
  ];

  return (
    <section id="about" className="scroll-reveal py-20 bg-gradient-to-b from-slate-50/80 via-white to-slate-50/60 border-t border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Heading and Description */}
          <div className="lg:col-span-5">
            <div className="inline-block text-xs font-bold tracking-widest text-[#0062d2] uppercase mb-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 px-3 py-1 rounded-full border border-blue-100 shadow-2xs">
              ABOUT OUR INSTITUTE
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              About <span className="bg-gradient-to-r from-[#0062d2] via-[#0284c7] to-[#2563eb] bg-clip-text text-transparent">Us</span>
            </h2>
            <p className="mt-4 text-[14.5px] sm:text-base text-slate-600 leading-relaxed font-normal">
              Amol Infotech is a leading computer training institute offering government recognized courses like MS-CIT, Tally, DTP and more. Our mission is to provide quality computer education with practical knowledge to help students build a successful career in the digital world.
            </p>
          </div>

          {/* Right Column: 3 Feature Cards with sequential entrance & micro-hover */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-5">
            {cards.map((card, index) => {
              const Icon = card.icon;
              return (
                <div
                  key={index}
                  style={{ animationDelay: `${index * 140}ms` }}
                  className="bg-gradient-to-b from-white to-slate-50/60 rounded-2xl p-6 border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-blue-300/80 transition-all duration-300 hover:-translate-y-1.5 group cursor-default"
                >
                  {/* Gradient icon badge: rotates 2.5 deg & scales 1.05 on card hover */}
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center text-white mb-4 shadow-md transition-transform duration-300 ease-out group-hover:rotate-[2.5deg] group-hover:scale-105`}
                  >
                    <Icon className="w-6 h-6 stroke-[2]" />
                  </div>
                  
                  <h3 className="text-base font-extrabold text-slate-900 tracking-tight mb-2 group-hover:text-blue-600 transition-colors duration-200">
                    {card.title}
                  </h3>
                  
                  <p className="text-[13px] text-slate-500 leading-relaxed font-medium">
                    {card.description}
                  </p>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
};

export default About;
