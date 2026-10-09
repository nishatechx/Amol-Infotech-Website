import React from "react";
import {
  Monitor,
  Wifi,
  Users,
  Wind,
  Cpu,
  BookOpen,
  UserCheck,
  HelpCircle,
  Briefcase,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { useCms } from "../hooks/useCms";
import { DEFAULT_FACILITIES } from "../server/defaultData";

const iconMap: Record<number, React.ComponentType<{ className?: string }>> = {
  0: Monitor,
  1: Wifi,
  2: Users,
  3: Wind,
  4: Cpu,
  5: BookOpen,
  6: UserCheck,
  7: HelpCircle,
  8: Briefcase,
  9: ShieldCheck,
};

export const Facilities: React.FC = () => {
  const { content } = useCms();
  const facilitiesList =
    content?.facilities && content.facilities.length > 0
      ? content.facilities
      : DEFAULT_FACILITIES;

  return (
    <section
      id="facilities"
      className="scroll-reveal py-16 sm:py-20 lg:py-24 bg-slate-50/80 border-b border-slate-200/80 relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-14">
          <div className="inline-block text-xs font-bold tracking-widest text-[#0062d2] uppercase mb-2 bg-blue-50 px-3.5 py-1 rounded-full border border-blue-100 shadow-2xs">
            CAMPUS & INFRASTRUCTURE
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Why <span className="bg-gradient-to-r from-[#0062d2] via-[#0284c7] to-[#2563eb] bg-clip-text text-transparent">Choose Us</span>
          </h2>
          <p className="mt-2.5 text-sm sm:text-base text-slate-600 font-medium">
            Everything you need for practical, confident and career-focused learning.
          </p>
        </div>

        {/* 10 Facilities Grid: 5 columns on desktop (5x2), 2-3 on tablet, 1-2 on mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
          {facilitiesList.map((facility, index) => {
            const Icon = iconMap[index % 10] || CheckCircle2;
            return (
              <div
                key={facility.id}
                className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-blue-300 transition-all duration-300 flex flex-col justify-between group transform hover:-translate-y-1 cursor-default"
              >
                <div>
                  {/* Clean Icon Container */}
                  <div
                    className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-3.5 transition-transform duration-300 group-hover:scale-105 ${
                      facility.accentColor || "text-blue-600 bg-blue-50 border-blue-100"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  {/* Facility Title */}
                  <h3 className="text-sm font-bold text-slate-900 tracking-tight mb-1 group-hover:text-blue-600 transition-colors">
                    {facility.title}
                  </h3>

                  {/* Short Supporting Line */}
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">
                    {facility.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default Facilities;
