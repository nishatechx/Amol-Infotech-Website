import React from "react";
import { Star, ExternalLink } from "lucide-react";
import { RISOD_MAPS_LISTING_URL } from "../../services/googlePlaces";

interface GoogleRatingSummaryProps {
  rating?: number;
  userRatingCount?: number;
}

export const GoogleRatingSummary: React.FC<GoogleRatingSummaryProps> = ({
  rating,
  userRatingCount,
}) => {
  const formattedRating = typeof rating === "number" ? rating.toFixed(1) : "5.0";
  const count = typeof userRatingCount === "number" ? userRatingCount : 428;

  return (
    <div className="inline-flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-full border border-slate-200/90 shadow-2xs hover:shadow-xs transition-shadow">
      {/* Google G Logo */}
      <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="#4285F4"
          d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.14z"
        />
        <path
          fill="#34A853"
          d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.27 21.41 7.34 24 12 24z"
        />
        <path
          fill="#FBBC05"
          d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
        />
        <path
          fill="#EA4335"
          d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.27 2.59 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
        />
      </svg>

      {/* Rating score & stars */}
      <span className="font-extrabold text-slate-900 text-xs sm:text-sm">
        {formattedRating}
      </span>
      <div className="flex items-center space-x-0.5">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star key={s} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
        ))}
      </div>

      <span className="text-[11px] sm:text-xs text-slate-500 font-medium">
        ({count} reviews)
      </span>

      <span className="text-slate-300">|</span>

      {/* Direct link to listing */}
      <a
        href={RISOD_MAPS_LISTING_URL}
        target="_blank"
        rel="noreferrer"
        className="text-[11px] sm:text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline inline-flex items-center gap-0.5"
      >
        <span>Google</span>
        <ExternalLink className="w-3 h-3" />
      </a>
    </div>
  );
};

export default GoogleRatingSummary;
