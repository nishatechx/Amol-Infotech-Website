import React, { useEffect, useRef, useState } from "react";
import { Users, GraduationCap, Award, CheckCircle2 } from "lucide-react";

interface CountUpNumberProps {
  end: number;
  suffix?: string;
  duration?: number;
  isVisible: boolean;
}

const CountUpNumber: React.FC<CountUpNumberProps> = ({
  end,
  suffix = "",
  duration = 1600,
  isVisible,
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number | null = null;
    let frameId: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic curve
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easedProgress * end));

      if (progress < 1) {
        frameId = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [isVisible, end, duration]);

  return (
    <span>
      {count}
      {suffix}
    </span>
  );
};

export const TrustStatistics: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const stats = [
    {
      value: 1000,
      suffix: "+",
      title: "Students Trained",
      subtitle: "Empowered with skills",
      icon: Users,
      gradient: "from-blue-600 to-indigo-600 shadow-blue-500/25",
    },
    {
      value: 100,
      suffix: "+",
      title: "Batches Completed",
      subtitle: "Consistent batches",
      icon: GraduationCap,
      gradient: "from-cyan-600 to-blue-600 shadow-cyan-500/25",
    },
    {
      staticText: "High Success Rate",
      title: "High Success Rate",
      subtitle: "Student-focused learning",
      icon: Award,
      gradient: "from-[#d92525] to-orange-500 shadow-red-500/25",
    },
    {
      staticText: "Govt. Recognized",
      title: "Government Recognized",
      subtitle: "Certified Courses",
      icon: CheckCircle2,
      gradient: "from-emerald-600 to-teal-600 shadow-emerald-500/25",
    },
  ];

  return (
    <section
      ref={containerRef}
      className="relative z-10 bg-white border-b border-slate-200/80 py-6 sm:py-8 shadow-xs"
      aria-label="Institute Statistics and Trust"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className={`flex items-center space-x-3.5 px-2 sm:px-4 py-3 group cursor-default transition-all duration-500 ease-out ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
                style={{ transitionDelay: `${idx * 120}ms` }}
              >
                <div
                  className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${
                    stat.gradient
                  } flex items-center justify-center text-white flex-shrink-0 shadow-md transition-all duration-300 group-hover:-translate-y-1 group-hover:scale-105 ${
                    isVisible ? "scale-100" : "scale-90"
                  }`}
                >
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div className="min-w-0">
                  <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight">
                    {stat.value ? (
                      <CountUpNumber
                        end={stat.value}
                        suffix={stat.suffix}
                        isVisible={isVisible}
                      />
                    ) : (
                      stat.title
                    )}
                  </div>
                  <div className="text-xs sm:text-[13px] font-semibold text-slate-500 truncate">
                    {stat.value ? stat.title : stat.subtitle}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TrustStatistics;
