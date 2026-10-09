import React from "react";
import { ArrowRight, Phone, Sparkles } from "lucide-react";

interface FinalCTAProps {
  onApplyClick?: () => void;
}

export const FinalCTA: React.FC<FinalCTAProps> = ({ onApplyClick }) => {
  const handleApply = () => {
    if (onApplyClick) {
      onApplyClick();
    } else {
      const el = document.getElementById("contact");
      el?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleContact = () => {
    const el = document.getElementById("contact");
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="scroll-reveal relative overflow-hidden bg-gradient-to-br from-[#041228] via-[#071f45] to-[#04162e] text-white py-16 sm:py-20 lg:py-24 border-y border-blue-900/60 shadow-2xl">
      {/* Subtle ambient background glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none -z-10"
        aria-hidden="true"
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        
        {/* Eyebrow badge */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-950/80 border border-blue-400/30 text-cyan-300 text-xs font-bold tracking-widest uppercase mb-4 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
          <span>ADMISSIONS OPEN FOR NEW BATCHES</span>
        </div>

        {/* Heading */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight mb-4">
          Ready to Start Your{" "}
          <span className="bg-gradient-to-r from-[#38bdf8] via-[#60a5fa] to-[#93c5fd] bg-clip-text text-transparent">
            Learning Journey?
          </span>
        </h2>

        {/* Supporting text */}
        <p className="text-sm sm:text-base lg:text-lg text-slate-200 max-w-2xl mx-auto leading-relaxed font-normal mb-8 sm:mb-10">
          Build practical digital skills, earn recognized certifications and take the next step toward your future.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3.5 sm:gap-5">
          <button
            onClick={handleApply}
            className="group inline-flex items-center justify-center px-6 py-3 sm:px-8 sm:py-4 rounded-xl bg-gradient-to-r from-[#e52e2e] via-[#d92525] to-[#b91c1c] hover:from-[#d92525] hover:to-[#991b1b] text-white text-sm sm:text-base font-bold tracking-wide transition-all duration-200 shadow-xl hover:shadow-red-600/30 cursor-pointer transform hover:-translate-y-0.5 active:scale-[0.98]"
          >
            <span>Apply Now</span>
            <ArrowRight className="ml-2 w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
          </button>

          <button
            onClick={handleContact}
            className="group inline-flex items-center justify-center px-6 py-3 sm:px-8 sm:py-4 rounded-xl border border-white/40 hover:border-white text-white text-sm sm:text-base font-semibold transition-all duration-200 bg-white/10 hover:bg-white/20 backdrop-blur-md shadow-md cursor-pointer transform hover:-translate-y-0.5 active:scale-[0.98]"
          >
            <Phone className="mr-2 w-4 h-4 text-blue-300" />
            <span>Contact Us</span>
          </button>
        </div>

      </div>
    </section>
  );
};

export default FinalCTA;
