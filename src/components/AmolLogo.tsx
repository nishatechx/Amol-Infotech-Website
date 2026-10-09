import React from "react";
import { CLOUDINARY_BRANDING } from "../config/images";

interface AmolLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
}

const OFFICIAL_LOGO_URL = CLOUDINARY_BRANDING.instituteLogo;

const LOCAL_FALLBACK_URL = "/images/logos/amol_infotech_logo.png";

export const AmolLogo: React.FC<AmolLogoProps> = ({
  className = "",
  size = "md",
  showText = false,
}) => {
  const heightClasses = {
    sm: "h-9 sm:h-10",
    md: "h-12 sm:h-14",
    lg: "h-16 sm:h-20",
    xl: "h-20 sm:h-24",
  }[size];

  return (
    <div className={`relative flex items-center gap-2.5 select-none ${className}`}>
      <img
        src={OFFICIAL_LOGO_URL}
        alt="Amol Infotech Official Logo"
        className={`${heightClasses} w-auto max-w-full object-contain filter drop-shadow-xs transition-transform duration-200 hover:scale-102`}
        loading="eager"
        onError={(e) => {
          const target = e.currentTarget;
          if (!target.src.includes(LOCAL_FALLBACK_URL)) {
            target.src = LOCAL_FALLBACK_URL;
          }
        }}
      />
      {showText && (
        <div className="flex flex-col justify-center">
          <span className="text-lg font-black tracking-tight text-slate-900 leading-tight">
            AMOL <span className="text-[#0062d2]">INFOTECH</span>
          </span>
          <span className="text-[11px] font-semibold text-slate-500 tracking-wide">
            Computer Training Institute
          </span>
        </div>
      )}
    </div>
  );
};

export default AmolLogo;
