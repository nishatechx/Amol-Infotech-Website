import React from "react";
import { GraduationCap, Laptop, Award } from "lucide-react";
import { CLOUDINARY_BRANDING } from "../config/images";

export const About: React.FC = () => {
  const directorPhotoUrl = CLOUDINARY_BRANDING.directorPhoto;

  const keyPoints = [
    {
      title: "Quality Education",
      description: "Focused on quality and meaningful computer education.",
      icon: GraduationCap,
    },
    {
      title: "Practical Learning",
      description: "Hands-on learning for real-world skills.",
      icon: Laptop,
    },
    {
      title: "Student Success",
      description: "Helping students build confidence and career opportunities.",
      icon: Award,
    },
  ];

  return (
    <section
      id="about"
      className="scroll-reveal py-16 sm:py-20 lg:py-24 bg-white border-t border-b border-slate-200/80"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* LEFT: Complete Original Director Photograph */}
          <div className="lg:col-span-5 flex justify-center lg:justify-start">
            <div className="relative w-full max-w-[380px] sm:max-w-[420px] rounded-2xl overflow-hidden bg-slate-50 border border-slate-200/90 shadow-md">
              <img
                src={directorPhotoUrl}
                alt="Mr. Ravindra Solanke (Director)"
                className="w-full h-auto object-contain block mx-auto"
                loading="lazy"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.src.includes("NSBEzZ-sp-Wg")) {
                    target.src =
                      "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhG2iTTlNQSMb1rdZv6AnyeWiUz37YXkucdO9FZyhCeZyvLkLNIppqD17yq3orWiAunlY4FDwp1l80tl_V7n8ZjCUY-XepdAi1cGVCWkpN9OSjoNSBEzZ-sp-WgO71OLkfICTlTrnEwEagjvaPYkThVApQcMYpKwI-7OH2GgVUOUitE-JYvJCoUCM3Ys38/s320/Solanke%20sir.png";
                  }
                }}
              />
              
              {/* Single Subtle Name Label */}
              <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 bg-[#0a192f]/90 text-white px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold tracking-wide shadow-sm">
                Mr. Ravindra Solanke (Director)
              </div>
            </div>
          </div>

          {/* RIGHT: Clean, Minimal About Us Content */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            
            {/* Eyebrow */}
            <div className="inline-block text-xs font-bold tracking-widest text-[#0062d2] uppercase mb-2">
              ABOUT US
            </div>

            {/* Main Heading */}
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-4">
              About <span className="bg-gradient-to-r from-[#0062d2] via-[#0284c7] to-[#2563eb] bg-clip-text text-transparent">Us</span>
            </h2>

            {/* Concise Mission Paragraph */}
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal mb-8 max-w-2xl">
              Amol Infotech is a trusted computer training institute offering government-recognized courses and practical digital education. Our focus is to provide quality training, hands-on learning and the right guidance to help students build confidence and prepare for better career opportunities.
            </p>

            {/* Three Key Points with Minimal Formatting */}
            <div className="space-y-4 border-t border-slate-100 pt-6">
              {keyPoints.map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <div key={idx} className="flex items-start space-x-3.5">
                    <div className="mt-0.5 w-8 h-8 rounded-lg bg-blue-50 text-[#0062d2] flex items-center justify-center flex-shrink-0 border border-blue-100/60">
                      <IconComponent className="w-4 h-4 stroke-[2.2]" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                        {item.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mt-0.5">
                        {item.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default About;
