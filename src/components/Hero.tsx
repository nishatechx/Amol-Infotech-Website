import React, { useState, useEffect } from "react";
import { ArrowRight, GraduationCap, Users, TrendingUp, Play, X, BookOpen } from "lucide-react";
import { CLOUDINARY_BRANDING } from "../config/images";

interface HeroProps {
  onApplyClick?: () => void;
  onExploreCoursesClick?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onApplyClick, onExploreCoursesClick }) => {
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  const HERO_BG_IMAGE = CLOUDINARY_BRANDING.heroBanner;

  // Desktop only: mouse parallax (max 6px), smooth requestAnimationFrame
  useEffect(() => {
    const isDesktop = window.innerWidth >= 1024;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!isDesktop || prefersReducedMotion) return;

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

  const handleExploreCourses = () => {
    if (onExploreCoursesClick) {
      onExploreCoursesClick();
    } else {
      const el = document.getElementById("courses");
      el?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleApply = () => {
    if (onApplyClick) {
      onApplyClick();
    } else {
      const el = document.getElementById("contact");
      el?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div id="home" className="relative w-full bg-gradient-to-br from-[#041228] via-[#071f45] to-[#041124] overflow-hidden">
      
      {/* 
        Hero Background Image:
        - Gentle scale on page load
        - Subtle mouse-follow parallax max 6px on desktop
        - Soft gradient on left ensures high-contrast readability
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
        <div className="absolute inset-y-0 left-0 w-full sm:w-[75%] lg:w-[58%] bg-gradient-to-r from-[#041228] via-[#071f45]/90 to-transparent pointer-events-none" />
      </div>

      {/* Main Hero Content */}
      <div className="relative z-10 w-full min-h-[480px] sm:min-h-[520px] lg:min-h-[580px] flex flex-col justify-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16 sm:py-20 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Hero text overlaid on the LEFT side */}
            <div className="w-full max-w-2xl lg:col-span-8 text-white">
              
              {/* Small Tracking Header: reveals at ~150ms */}
              <div className="inline-flex items-center gap-1.5 text-[11px] sm:text-[13px] font-bold tracking-[0.2em] sm:tracking-[0.25em] text-blue-200 uppercase mb-3 drop-shadow-md animate-fade-in-down delay-150">
                <span>COMPUTER TRAINING INSTITUTE • RISOD</span>
              </div>

              {/* Main Headline: reveals at ~250ms */}
              <h1 className="text-3xl sm:text-4xl lg:text-[54px] font-black tracking-tight leading-[1.15] mb-3 sm:mb-4 drop-shadow-lg animate-fade-in-up delay-250">
                <span className="text-white block sm:inline">Master Digital Skills.</span>{" "}
                <br className="hidden sm:inline" />
                <span className="relative inline-block bg-gradient-to-r from-[#ff4d4d] via-[#ff6b6b] to-[#ff3b3b] bg-clip-text text-transparent font-black">
                  Build Your Future.
                </span>
              </h1>

              {/* Supporting Text: reveals at ~350ms */}
              <p className="text-slate-100 text-xs sm:text-base font-medium tracking-wide mb-5 sm:mb-7 drop-shadow-md max-w-xl animate-fade-in-up delay-350">
                Government Recognized Courses | Expert Trainers | Practical Learning
              </p>

              {/* 3 Highlights Badges Row: reveals at ~450ms */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3.5 mb-6 sm:mb-8 text-slate-100 animate-fade-in-up delay-450">
                <div className="flex items-center space-x-1.5 sm:space-x-2 bg-gradient-to-r from-blue-950/80 to-blue-900/60 backdrop-blur-md px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-lg border border-blue-400/30 shadow-md hover:border-blue-300 transition-all duration-200 cursor-default">
                  <GraduationCap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-300 flex-shrink-0" />
                  <span className="text-[10.5px] sm:text-xs font-bold leading-tight">Authorized Centre</span>
                </div>

                <div className="flex items-center space-x-1.5 sm:space-x-2 bg-gradient-to-r from-blue-950/80 to-indigo-900/60 backdrop-blur-md px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-lg border border-blue-400/30 shadow-md hover:border-blue-300 transition-all duration-200 cursor-default">
                  <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-300 flex-shrink-0" />
                  <span className="text-[10.5px] sm:text-xs font-bold leading-tight">Expert Faculty</span>
                </div>

                <div className="flex items-center space-x-1.5 sm:space-x-2 bg-gradient-to-r from-blue-950/80 to-sky-900/60 backdrop-blur-md px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-lg border border-blue-400/30 shadow-md hover:border-blue-300 transition-all duration-200 cursor-default">
                  <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-300 flex-shrink-0" />
                  <span className="text-[10.5px] sm:text-xs font-bold leading-tight">100% Practical</span>
                </div>
              </div>

              {/* Action Buttons: Primary "Apply Now", Secondary "Explore Courses", and "Watch Video" */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 animate-fade-in-up delay-550">
                <button
                  onClick={handleApply}
                  className="group inline-flex items-center justify-center px-5 py-2.5 sm:px-7 sm:py-3.5 rounded-xl bg-gradient-to-r from-[#e52e2e] via-[#d92525] to-[#b91c1c] hover:from-[#d92525] hover:to-[#991b1b] text-white text-xs sm:text-[15px] font-bold tracking-wide transition-all duration-200 shadow-lg hover:shadow-xl hover:shadow-red-600/35 cursor-pointer transform hover:-translate-y-0.5 active:scale-[0.98]"
                >
                  <span>Apply Now</span>
                  <ArrowRight className="ml-1.5 w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-200 group-hover:translate-x-1" />
                </button>

                <button
                  onClick={handleExploreCourses}
                  className="group inline-flex items-center justify-center px-4 py-2.5 sm:px-6 sm:py-3 rounded-xl border border-white/70 hover:border-white text-white text-xs sm:text-[14px] font-semibold transition-all duration-200 bg-white/10 hover:bg-white/20 backdrop-blur-md shadow-md cursor-pointer transform hover:-translate-y-0.5 active:scale-[0.98]"
                >
                  <BookOpen className="mr-1.5 sm:mr-2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-300" />
                  <span>Explore Courses</span>
                </button>

                <button
                  onClick={() => setVideoModalOpen(true)}
                  className="inline-flex items-center text-xs sm:text-sm text-slate-300 hover:text-white font-medium py-2 px-3 transition-colors cursor-pointer"
                  aria-label="Watch Institute Video Tour"
                >
                  <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center mr-1.5 text-white">
                    <Play className="w-2.5 h-2.5 fill-current ml-0.5" />
                  </div>
                  <span>Watch Video</span>
                </button>
              </div>

            </div>

            {/* Desktop Right Spacer */}
            <div className="hidden lg:block lg:col-span-4 h-full pointer-events-none" aria-hidden="true" />

          </div>
        </div>
      </div>

      {/* Video Modal */}
      {videoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-scale-in">
          <div className="relative bg-slate-900 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl border border-white/20">
            <div className="flex items-center justify-between p-4 border-b border-slate-800 text-white bg-gradient-to-r from-slate-900 to-slate-800">
              <h3 className="font-bold text-lg">Amol Infotech - Institute Overview</h3>
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
