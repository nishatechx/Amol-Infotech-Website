import React from "react";

interface AmolLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
}

const OFFICIAL_LOGO_URL =
  "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgxi4v2VP-ux_tgpP_qrFA_iNc5QuhqK8xR-MK0_o4Qqwpy-UY5K3MFEOZcfYzQsouGUdKSn1YU5C8mRORw-xLl1asyWbi7FQSwuQGupZ_Y6S7sosNVxD7pfofLWdAjTvEB5h11fLV4wpoAqRkOaY-PB6aoxo_RvJiaSITCKRD9BtDVLQDSlFRoZE0q5og/s320/Amol%20Infotech%20Logo.png";

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
