import React, { useState, useEffect, useRef } from "react";
import { GraduationCap, Users, TrendingUp, ArrowRight, Play, X, Award, CheckCircle } from "lucide-react";

interface HeroProps {
  onApplyClick?: () => void;
}

const HERO_BG_IMAGE =
  "https://blogger.googleusercontent.com/img/a/AVvXsEgUbdFMP8cKgFNWnZm0LS4GK5woCqyYdIZy9Z8d2tcIiFn4eD94ju_sr3RC2MlkWA6-hkLeERWNe-uu_x-I2EJvaZxAM7647-fCeS_PSymrOFU6rChT4sMxqS3E7IIccSWaJdOA-6uxW7rPAp02nZIPnTgZ2iiNkl5neAAkmTj-hbAQFLor7X5m_bMzKl4=s1600";

// Numerical count-up component with smooth easeOutExpo
const CountUpNumber: React.FC<{ end: number; suffix?: string; isVisible: boolean }> = ({
  end,
  suffix = "",
  isVisible,
}) => {
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!isVisible) return;
    let startTime: number | null = null;
    const duration = 1400;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // easeOutExpo
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setVal(Math.floor(ease * end));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setVal(end);
      }
    };

    requestAnimationFrame(animate);
  }, [isVisible, end]);

  return (
    <span>
      {val}
      {suffix}
    </span>
  );
};

export const Hero: React.FC<HeroProps> = ({ onApplyClick }) => {
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  // Subtle mouse-follow effect (desktop only, disabled on touch/mobile)
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia("(pointer: fine)").matches) {
      return;
    }

    let animationFrameId: number;

    const handleMouseMove = (e: MouseEvent) => {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(() => {
        const xRatio = e.clientX / window.innerWidth - 0.5;
        const yRatio = e.clientY / window.innerHeight - 0.5;
        // Maximum 5-6px movement
        setMouseOffset({
          x: Math.round(xRatio * 6 * 10) / 10,
          y: Math.round(yRatio * 6 * 10) / 10,
        });
      });
    };

    const handleMouseLeave = () => {
      setMouseOffset({ x: 0, y: 0 });
    };

    const heroEl = document.getElementById("home");
    if (heroEl) {
      heroEl.addEventListener("mousemove", handleMouseMove, { passive: true });
      heroEl.addEventListener("mouseleave", handleMouseLeave);
      return () => {
        cancelAnimationFrame(animationFrameId);
        heroEl.removeEventListener("mousemove", handleMouseMove);
        heroEl.removeEventListener("mouseleave", handleMouseLeave);
      };
    }
  }, []);

  // IntersectionObserver for stats entrance & count-up (runs only once)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setStatsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div id="home" className="relative w-full bg-gradient-to-br from-[#041228] via-[#071f45] to-[#041124] overflow-visible">
      
      {/* 
        Hero Background Image:
        - Gentle scale from 1.03 to 1.0 on page load.
        - Subtle mouse-follow parallax max 6px on desktop.
        - Soft gradient on left ensures high-contrast readability.
      */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
        <div
          className="w-full h-full transition-transform duration-300 ease-out animate-hero-bg-scale"
          style={{
            transform: `translate3d(${mouseOffset.x}px, ${mouseOffset.y}px, 0)`,
          }}
        >
          <img
            src={HERO_BG_IMAGE}
            alt="Amol Infotech Institute"
            className="w-full h-full object-cover object-right"
            loading="eager"
            onError={(e) => {
              const target = e.currentTarget;
              if (!target.src.includes("/images/hero-bg.png")) {
                target.src = "/images/hero-bg.png";
              }
            }}
          />
        </div>

        {/* Multi-stop Left-side gradient to ensure text readability */}
        <div className="absolute inset-y-0 left-0 w-[88%] sm:w-[72%] lg:w-[55%] bg-gradient-to-r from-[#041228]/98 via-[#071f45]/85 to-transparent pointer-events-none" />
      </div>

      {/* Main Hero Content Canvas */}
      <div className="relative z-10 w-full min-h-[460px] sm:min-h-[520px] lg:h-[624px] lg:min-h-[624px] flex flex-col justify-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-4 pb-20 sm:pt-8 sm:pb-24 lg:pt-14 lg:pb-28">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Hero text overlaid on the LEFT side */}
            <div className="w-[78%] sm:w-[68%] lg:w-auto lg:col-span-7 text-white">
              
              {/* Small Tracking Header: reveals at ~150ms */}
              <div className="inline-flex items-center gap-1.5 text-[11px] sm:text-[13px] font-bold tracking-[0.2em] sm:tracking-[0.25em] text-blue-200 uppercase mb-2 drop-shadow-md animate-fade-in-down delay-150">
                <span>COMPUTER TRAINING INSTITUTE</span>
              </div>

              {/* Main Headline: reveals at ~250ms with staggered words/lines */}
              <h1 className="text-2xl sm:text-4xl lg:text-[54px] font-black tracking-tight leading-[1.15] mb-2.5 sm:mb-4 drop-shadow-lg animate-fade-in-up delay-250">
                <span className="text-white block sm:inline">Master Digital Skills.</span>{" "}
                <br className="hidden sm:inline" />
                <span className="relative inline-block bg-gradient-to-r from-[#ff4d4d] via-[#ff6b6b] to-[#ff3b3b] bg-clip-text text-transparent font-black">
                  Build Your Future.
                </span>
              </h1>

              {/* Sub-headline: reveals at ~350ms */}
              <p className="text-slate-100 text-xs sm:text-base font-medium tracking-wide mb-4 sm:mb-7 drop-shadow-md line-clamp-2 sm:line-clamp-none animate-fade-in-up delay-350">
                Government Certified Courses | Expert Trainers | Practical Learning
              </p>

              {/* 3 Highlights Badges Row: reveals at ~450ms */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-5 sm:mb-8 text-slate-100 animate-fade-in-up delay-450">
                <div className="flex items-center space-x-1.5 sm:space-x-2 bg-gradient-to-r from-blue-950/80 to-blue-900/60 backdrop-blur-md px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-lg border border-blue-400/30 shadow-md hover:scale-105 hover:border-blue-300 transition-all duration-200 cursor-default">
                  <GraduationCap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-300 flex-shrink-0" />
                  <span className="text-[10.5px] sm:text-xs font-bold leading-tight">Authorized Centre</span>
                </div>

                <div className="flex items-center space-x-1.5 sm:space-x-2 bg-gradient-to-r from-blue-950/80 to-indigo-900/60 backdrop-blur-md px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-lg border border-blue-400/30 shadow-md hover:scale-105 hover:border-blue-300 transition-all duration-200 cursor-default">
                  <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-300 flex-shrink-0" />
                  <span className="text-[10.5px] sm:text-xs font-bold leading-tight">Expert Faculty</span>
                </div>

                <div className="flex items-center space-x-1.5 sm:space-x-2 bg-gradient-to-r from-blue-950/80 to-sky-900/60 backdrop-blur-md px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-lg border border-blue-400/30 shadow-md hover:scale-105 hover:border-blue-300 transition-all duration-200 cursor-default">
                  <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-300 flex-shrink-0" />
                  <span className="text-[10.5px] sm:text-xs font-bold leading-tight">100% Practical</span>
                </div>
              </div>

              {/* Action Buttons: reveals at ~550ms with hover lift & arrow feedback */}
              <div className="flex items-center gap-2.5 sm:gap-4 animate-fade-in-up delay-550">
                <button
                  onClick={
                    onApplyClick ||
                    (() => {
                      const el = document.getElementById("contact");
                      el?.scrollIntoView({ behavior: "smooth" });
                    })
                  }
                  className="group inline-flex items-center justify-center px-4 py-2 sm:px-7 sm:py-3 rounded-lg bg-gradient-to-r from-[#e52e2e] via-[#d92525] to-[#b91c1c] hover:from-[#d92525] hover:to-[#991b1b] text-white text-xs sm:text-[15px] font-bold tracking-wide transition-all duration-200 shadow-lg hover:shadow-xl hover:shadow-red-600/35 cursor-pointer transform hover:-translate-y-0.5 active:scale-[0.98]"
                >
                  <span>Apply Now</span>
                  <ArrowRight className="ml-1.5 w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-200 group-hover:translate-x-1" />
                </button>

                <button
                  onClick={() => setVideoModalOpen(true)}
                  className="group inline-flex items-center justify-center px-3.5 py-1.5 sm:px-6 sm:py-2.5 rounded-full border border-white/70 hover:border-white text-white text-xs sm:text-[14px] font-semibold transition-all duration-200 bg-gradient-to-r from-white/15 via-white/10 to-white/5 hover:from-white/25 hover:to-white/15 backdrop-blur-md shadow-md cursor-pointer transform hover:-translate-y-0.5 active:scale-[0.98]"
                >
                  <div className="w-4 h-4 sm:w-6 sm:h-6 rounded-full bg-white flex items-center justify-center mr-1.5 sm:mr-2 text-[#071d3f] shadow-xs transition-transform duration-200 group-hover:scale-110">
                    <Play className="w-2 h-2 sm:w-3 sm:h-3 fill-current ml-0.5" />
                  </div>
                  <span>Watch Video</span>
                </button>
              </div>

            </div>

            {/* Desktop Right 5 cols spacer */}
            <div className="hidden lg:block lg:col-span-5 h-full pointer-events-none" aria-hidden="true" />

          </div>
        </div>
      </div>

      {/* 
        Floating 4-Stat Box:
        - Exactly Half on Hero dark bg and Half below Hero section
        - 100% Solid White (No Transparency)
        - Viewport animated icons (scale 0.85 -> 1)
        - Staggered items (100-150ms)
        - Count-up animation for numbers (1000+ & 100+)
        - Subtle icon hover lift without card jump
      */}
      <div className="absolute bottom-0 inset-x-0 translate-y-1/2 z-30 pointer-events-none">
        <div
          ref={statsRef}
          className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pointer-events-auto"
        >
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 sm:p-6 grid grid-cols-2 md:grid-cols-4 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
            
            {/* Stat 1: 1000+ Students Trained */}
            <div
              className={`flex items-center space-x-3.5 px-2 sm:px-4 py-2 group cursor-default transition-all duration-500 ease-out ${
                statsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
              style={{ transitionDelay: "50ms" }}
            >
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white flex-shrink-0 shadow-md shadow-blue-500/25 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-blue-500/40 group-hover:shadow-lg ${
                  statsVisible ? "scale-100" : "scale-[0.85]"
                }`}
              >
                <Users className="w-6 h-6 transition-transform duration-300 group-hover:scale-105" />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  <CountUpNumber end={1000} suffix="+" isVisible={statsVisible} />
                </div>
                <div className="text-xs sm:text-[13px] font-semibold text-slate-500">Students Trained</div>
              </div>
            </div>

            {/* Stat 2: 100+ Batches Completed */}
            <div
              className={`flex items-center space-x-3.5 px-2 sm:px-4 py-2 group cursor-default transition-all duration-500 ease-out ${
                statsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
              style={{ transitionDelay: "180ms" }}
            >
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white flex-shrink-0 shadow-md shadow-cyan-500/25 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-cyan-500/40 group-hover:shadow-lg ${
                  statsVisible ? "scale-100" : "scale-[0.85]"
                }`}
              >
                <GraduationCap className="w-6 h-6 transition-transform duration-300 group-hover:scale-105" />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  <CountUpNumber end={100} suffix="+" isVisible={statsVisible} />
                </div>
                <div className="text-xs sm:text-[13px] font-semibold text-slate-500">Batches Completed</div>
              </div>
            </div>

            {/* Stat 3: High Success Rate */}
            <div
              className={`flex items-center space-x-3.5 px-2 sm:px-4 py-2 group cursor-default transition-all duration-500 ease-out ${
                statsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
              style={{ transitionDelay: "310ms" }}
            >
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br from-[#d92525] to-orange-500 flex items-center justify-center text-white flex-shrink-0 shadow-md shadow-red-500/25 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-red-500/40 group-hover:shadow-lg ${
                  statsVisible ? "scale-100" : "scale-[0.85]"
                }`}
              >
                <Award className="w-6 h-6 transition-transform duration-300 group-hover:scale-105" />
              </div>
              <div>
                <div className="text-lg sm:text-xl font-black text-slate-900 leading-tight">High Success</div>
                <div className="text-xs sm:text-[13px] font-semibold text-slate-500">Rate (99%+)</div>
              </div>
            </div>

            {/* Stat 4: Government Recognized Courses */}
            <div
              className={`flex items-center space-x-3.5 px-2 sm:px-4 py-2 group cursor-default transition-all duration-500 ease-out ${
                statsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
              style={{ transitionDelay: "440ms" }}
            >
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white flex-shrink-0 shadow-md shadow-emerald-500/25 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-emerald-500/40 group-hover:shadow-lg ${
                  statsVisible ? "scale-100" : "scale-[0.85]"
                }`}
              >
                <CheckCircle className="w-6 h-6 transition-transform duration-300 group-hover:scale-105" />
              </div>
              <div>
                <div className="text-lg sm:text-xl font-black text-slate-900 leading-tight">Government</div>
                <div className="text-xs sm:text-[13px] font-semibold text-slate-500">Recognized Courses</div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Video Modal */}
      {videoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-scale-in">
          <div className="relative bg-slate-900 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl border border-white/20">
            <div className="flex items-center justify-between p-4 border-b border-slate-800 text-white bg-gradient-to-r from-slate-900 to-slate-800">
              <h3 className="font-bold text-lg">Amol Infotech - MS-CIT Computer Training</h3>
              <button
                onClick={() => setVideoModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer transition-colors active:scale-90"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="aspect-video w-full">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                title="Amol Infotech Institute Tour"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Hero;
