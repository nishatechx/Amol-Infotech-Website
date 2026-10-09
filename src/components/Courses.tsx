import React, { useState } from "react";
import { ArrowRight, Clock, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useCms } from "../hooks/useCms";
import { DEFAULT_COURSES } from "../server/defaultData";

interface CoursesProps {
  onSelectCourse?: (courseName: string) => void;
}

export const Courses: React.FC<CoursesProps> = ({ onSelectCourse }) => {
  const [activeTab, setActiveTab] = useState<"all" | "certificate" | "professional">("all");
  const { content } = useCms();

  const coursesList =
    content?.courses && content.courses.length > 0 ? content.courses : DEFAULT_COURSES;

  const filteredCourses =
    activeTab === "all"
      ? coursesList
      : coursesList.filter((c) => c.category === activeTab);

  const handleCardClick = (courseName: string) => {
    onSelectCourse?.(courseName);
    const contactSection = document.getElementById("contact");
    contactSection?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="courses" className="scroll-reveal py-20 bg-gradient-to-b from-white via-slate-50/70 to-blue-50/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-block text-xs font-bold tracking-widest text-[#0062d2] uppercase mb-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 px-3 py-1 rounded-full border border-blue-100 shadow-2xs">
              CAREER & SKILL PROGRAMS
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Explore Our <span className="bg-gradient-to-r from-[#0062d2] via-[#0284c7] to-[#2563eb] bg-clip-text text-transparent">Courses</span>
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600 font-medium max-w-xl">
              Learn practical digital skills with industry-relevant courses designed for students, professionals and career growth.
            </p>
          </div>

          {/* Filter Tabs with Gradients and micro-transitions */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex p-1 bg-gradient-to-r from-slate-100 to-slate-200/80 rounded-full shadow-inner">
              <button
                onClick={() => setActiveTab("all")}
                className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-full transition-all duration-200 cursor-pointer active:scale-95 ${
                  activeTab === "all"
                    ? "bg-gradient-to-r from-[#0052cc] to-[#0066ee] text-white shadow-md shadow-blue-500/25"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                All Courses ({coursesList.length})
              </button>
              <button
                onClick={() => setActiveTab("certificate")}
                className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-full transition-all duration-200 cursor-pointer active:scale-95 ${
                  activeTab === "certificate"
                    ? "bg-gradient-to-r from-[#0052cc] to-[#0066ee] text-white shadow-md shadow-blue-500/25"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Certificate
              </button>
              <button
                onClick={() => setActiveTab("professional")}
                className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-full transition-all duration-200 cursor-pointer active:scale-95 ${
                  activeTab === "professional"
                    ? "bg-gradient-to-r from-[#0052cc] to-[#0066ee] text-white shadow-md shadow-blue-500/25"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Professional & Tech
              </button>
            </div>

            <button
              onClick={() => {
                const el = document.getElementById("contact");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
              className="inline-flex items-center px-4 py-2 rounded-full border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-600 hover:to-indigo-600 text-blue-700 hover:text-white text-xs sm:text-sm font-bold transition-all duration-200 shadow-2xs hover:shadow-md cursor-pointer active:scale-95"
            >
              <span>Enroll Now</span>
              <ArrowRight className="ml-1.5 w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 11 Course Cards Grid with AnimatePresence for smooth filter change */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.24, ease: "easeOut" }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          >
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                onClick={() => handleCardClick(course.name)}
                className="group bg-gradient-to-b from-white to-slate-50/50 rounded-2xl border border-slate-200/90 p-5 flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:border-blue-400 hover:-translate-y-1.5 cursor-pointer relative overflow-hidden"
              >
                {/* Highlight Ribbon for MS-CIT with subtle single pulse */}
                {course.highlight && (
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-[#ef4444] to-[#dc2626] text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-bl-lg shadow-sm animate-single-pulse">
                    Most Popular
                  </div>
                )}

                <div>
                  {/* Official Course Logo Container with smooth gentle zoom */}
                  <div className="w-full h-32 rounded-xl bg-gradient-to-b from-slate-50 to-slate-100/60 border border-slate-100 p-2.5 flex items-center justify-center overflow-hidden mb-4 group-hover:from-blue-50/70 group-hover:to-indigo-50/50 transition-colors duration-300 shadow-2xs">
                    <img
                      src={course.logoUrl}
                      alt={`${course.name} Official Logo`}
                      className="max-h-full max-w-full object-contain select-none transition-transform duration-300 ease-out group-hover:scale-[1.04]"
                      loading="lazy"
                      onError={(e) => {
                        const target = e.currentTarget;
                        if (course.localFallback && !target.src.includes(course.localFallback)) {
                          target.src = course.localFallback;
                        }
                      }}
                    />
                  </div>

                  {/* Badge Tag with gradient (remains stable on hover) */}
                  <div className="mb-2">
                    <span className="inline-flex items-center text-[10.5px] font-bold text-blue-700 bg-gradient-to-r from-blue-50 to-indigo-50 px-2.5 py-0.5 rounded-md border border-blue-100">
                      <CheckCircle2 className="w-3 h-3 mr-1 text-blue-600" />
                      {course.badge}
                    </span>
                  </div>

                  {/* Course Name */}
                  <h3 className="text-base sm:text-[17px] font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors duration-200 leading-snug line-clamp-1">
                    {course.name}
                  </h3>

                  {/* Course Subtitle */}
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {course.subtitle}
                  </p>
                </div>

                {/* Card Footer: Duration & Gradient CTA Button */}
                <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center text-xs font-semibold text-slate-600">
                    <Clock className="w-3.5 h-3.5 mr-1 text-slate-400" />
                    {course.duration}
                  </div>

                  <div className="inline-flex items-center px-3 py-1 rounded-md text-xs font-bold text-blue-600 group-hover:text-white group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-indigo-600 transition-all duration-200 shadow-2xs">
                    <span>Apply Now</span>
                    <ArrowRight className="w-3 h-3 ml-1 transition-transform duration-200 group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  );
};

export default Courses;
