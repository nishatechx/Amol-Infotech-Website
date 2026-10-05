import React, { useState } from "react";
import { ArrowRight, Clock, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface CoursesProps {
  onSelectCourse?: (courseName: string) => void;
}

interface CourseItem {
  id: string;
  name: string;
  subtitle: string;
  duration: string;
  category: "certificate" | "professional";
  badge: string;
  logoUrl: string;
  localFallback: string;
  highlight?: boolean;
}

export const Courses: React.FC<CoursesProps> = ({ onSelectCourse }) => {
  const [activeTab, setActiveTab] = useState<"all" | "certificate" | "professional">("all");

  const coursesList: CourseItem[] = [
    {
      id: "mscit",
      name: "MS-CIT",
      subtitle: "Maharashtra State Certificate in Information Technology",
      duration: "3 Months",
      category: "certificate",
      badge: "MKCL Authorized",
      logoUrl:
        "https://blogger.googleusercontent.com/img/a/AVvXsEiv_hwCyTScUIhfgYuRlP2qvRPMUBbQiwvWrSXcEgxZ5uuBUkVJiaLWJjSpp4LKCD-W7rG_rQoKG_PWqXEi4bRa_JT840F267tuH8xVPqY7NQRmS-8AR9i2ltNEuK1ydFqTEuDYPijcoq6a6EBy9SdMZrVmr6cTHcTrr-V0jysNpRJXH5Xo4_uY9q691Vk",
      localFallback: "/images/courses/mscit.png",
      highlight: true,
    },
    {
      id: "typing",
      name: "Computer Typing (CCTP)",
      subtitle: "English & Marathi Typing Speed Certification",
      duration: "2 Months",
      category: "certificate",
      badge: "Govt. Recognized",
      logoUrl:
        "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjSjD-OuOatjc5BqBAGi9qxjbgBjpNZNJKG-EC_CaQ1aeGX6J7LgfwTiCVIVSfXY92XcsXlAjRTO0rz33mWCDhkdJWYPWJMIYtDHI4aEpsfB0s_hfWGgjDWJStYb6wAOqD5eSb9SwZ8Rsu4jMV2LQl4iqk4ShKyQ84xDZdhnenSmWPqBoUlltXMY_juqU8/s320/Computer%20Typing.png",
      localFallback: "/images/courses/typing.png",
    },
    {
      id: "tally",
      name: "Tally Prime",
      subtitle: "GST, E-Way Bill, TDS & Practical Accounting",
      duration: "2 Months",
      category: "certificate",
      badge: "Accounting with GST",
      logoUrl:
        "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh0nU9t197ZbKOdY-aTiLqOArP8jcX3I80xH-HB6f8PWYfOTDDbZREG0pLtVj4IhHaa_HaPY3jr-I8uHYnpnSSv2rnE3AFXQhq05maWwOUrUEoTsWXOcu1C-I4Oea9jVkWO4kC8pT6z_DVjrIhyphenhyphenwfuzX_MeIJozlfByQQfC4bRS-sa9ZbdGoayDiOatTv0/s320/21d92f5f-5605-40c7-84f2-6827f923be5b.png",
      localFallback: "/images/courses/tally.png",
    },
    {
      id: "excel",
      name: "Advanced Excel",
      subtitle: "VLOOKUP, XLOOKUP, Pivot Tables, Macros & MIS",
      duration: "2 Months",
      category: "certificate",
      badge: "Corporate MIS",
      logoUrl:
        "https://blogger.googleusercontent.com/img/a/AVvXsEirgaesdVKqztAI4brjEPatifE0cwI0GB5P3yINvBLr2Z_dt6vC0oW2TKZaakEc_40AFi7YswiI-luqAg_-uahfburfIzVBePqUaVbsQ-fc8L7k1nvSmBzAe1SSBhAMw0XIL3zC1Blmepd-lNTMo9PZVZg5wd4LNTPgzMc_-tCqAmDUWoof2xIro6j7wK8=s1600",
      localFallback: "/images/courses/advanced_excel.png",
    },
    {
      id: "graphics",
      name: "Graphic Designing",
      subtitle: "Photoshop, CorelDRAW, Illustrator & Canva",
      duration: "3 to 6 Months",
      category: "professional",
      badge: "Creative Industry",
      logoUrl:
        "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh9lgPuF0JtqFKrT4rlknTx9svadl9cc9cxApyc9oTnmu3erMVYV1TmgZYOWQGgw1MKLkyqQtHSFWzEZeECSgpno2KMHzD6bvb5vcS9PpK9UrSJegJ_F_bSnIegiTMiq_pj_RSQH4qx9lKI_RjEQz3HQsET80xxXrbw4g79XwLevEKJagKJY0GI8HF3vwg/s320/Graphics%20Design.png",
      localFallback: "/images/courses/graphic_design.png",
    },
    {
      id: "video",
      name: "Video Editing",
      subtitle: "Premiere Pro, After Effects, Reels & YouTube",
      duration: "3 Months",
      category: "professional",
      badge: "Media & Creator",
      logoUrl:
        "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEijbZSJ6k6dzjjEc9VZYn1JrWF1QZdb9klVlGP-2I9KtA9jQm3mlYIIej6zaf_S9lweIw2kGk_slogw4gxgjKgKinuWptFW60NwRzRyWcMr2j5qUTF2BR29elOqOgOsEhqLsgfRUhrISIoJI0NmE_hzTR2aFL5oVDxArgz5kHaQt3JdxfaF_3CEwcK6g5o/s320/Video%20Editing.png",
      localFallback: "/images/courses/video_editing.png",
    },
    {
      id: "analytics",
      name: "Data Analytics & Visualisation",
      subtitle: "Excel, Power BI, Tableau & Business Intelligence",
      duration: "3 to 6 Months",
      category: "professional",
      badge: "In-Demand Tech",
      logoUrl:
        "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiHCpEKFx-bKTb2_rp1fo7VtN7PBznq_OiUgRCcUhqiBEC-1ShvQy5AkP6qWAjs3mRWalbVFYp_4DloXC1Nm9O40xy34axEn23yVt7n85X8abc3fFwBMbP3RYpuI-eos2LJaIaaFlb0leY-PakgZVgx47T2frZPGWCBdAXfV6FHvm_nWpcQ65KLtRDmNKU/s320/Data%20Analytics.png",
      localFallback: "/images/courses/data_analytics.png",
    },
    {
      id: "office",
      name: "Office Assistance",
      subtitle: "MS Office Suite, Email Drafting & Office Admin",
      duration: "2 Months",
      category: "certificate",
      badge: "Job Oriented",
      logoUrl:
        "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgie7wqm31MxGPkkqdUgwnu7x2U0hg0l6vDFsugDfxIqS9B-r_C7VwfzCb82dDjPWU-0LQH_TFP8PHxVDAMn_DUFjSc_Qd2qwqeD23y6erDZ_vB1q76RuE777dyYyw-mSmdfmpX-l6Wc62Vio913e6DaWzoZpR3DGScx0ePc01Ny4MRQx8kt9cjVmeIqEI/s320/Office%20Assistance.png",
      localFallback: "/images/courses/office_assistance.png",
    },
    {
      id: "softskills",
      name: "Soft Skills",
      subtitle: "Personality Development, English & Interviews",
      duration: "1 to 2 Months",
      category: "certificate",
      badge: "Career Confidence",
      logoUrl:
        "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgCsySIU4ik3s48ZJMUUUzms4d83lwQZGAvQZF9HY78zyKpRU_MFQwxmPILHJwF6afHM9P5b1NYY362ib1uL0yilB3kywjeVpmDaiwnRHPcwdB4E5Ta5YJlWJsBXcppJf8iLdqdYWu7lIH8i1of0HudakBmL3dK_-iI5AhK6Q8r_elvRsuvyd3-2ghZXLc/s320/Soft%20Skills.png",
      localFallback: "/images/courses/soft_skills.png",
    },
    {
      id: "webdev",
      name: "Web Development",
      subtitle: "HTML5, CSS3, JavaScript, React & WordPress",
      duration: "4 to 6 Months",
      category: "professional",
      badge: "Full Stack Ready",
      logoUrl:
        "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi_b-Y-buBWEO688WUutkeiRKhKbrW6Ypo3XqAe5wAt8LJI8-NTamDuzEBUNblUzZQ_NC1NjV0lz7gborrEpX31g5xSghNG_YOdMjx1Gjj2G29oOtE51N5Zx5_mgYQug-PhjIRQk-RaVKcYh98nWuG9sYtpMZwEtR6TUvRx9qDHPuMerIIkw7LbRH0rFmk/s320/Web.png",
      localFallback: "/images/courses/web_dev.png",
    },
    {
      id: "cyber",
      name: "Cyber Security",
      subtitle: "Network Defense, Ethical Hacking & Data Protection",
      duration: "3 to 6 Months",
      category: "professional",
      badge: "Cyber Defense",
      logoUrl:
        "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj1n7Mb7Vd7ED_9ZPRRnv6ynQ9zzKwUJVG-sJ5s5V8-MURIBZ22TUBY_EXIeSmzXABs18Q0LvTC8Kz1aY4e4xCFkIXe1kvwVV_RAG9MtqiWh4FsRd-HeBzA1-c-2Fi0hOC4ZEvtBhbuXO_jUXHsUPtgKzWK-ucsbhF3McXMNTS6n2Z7d6qJnSvf3uhLfmM/s320/Cyber%20security.png",
      localFallback: "/images/courses/cyber_security.png",
    },
  ];

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
              Our <span className="bg-gradient-to-r from-[#0062d2] via-[#0284c7] to-[#2563eb] bg-clip-text text-transparent">Courses</span>
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600 font-medium">
              Industry-aligned practical computer courses for students and working professionals.
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
                        if (!target.src.includes(course.localFallback)) {
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
