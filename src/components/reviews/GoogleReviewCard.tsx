import React, { useState } from "react";
import { Star } from "lucide-react";
import type { GoogleReview } from "../../services/googlePlaces";

interface GoogleReviewCardProps {
  review: GoogleReview;
}

export const GoogleReviewCard: React.FC<GoogleReviewCardProps> = ({ review }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const authorName = review.authorAttribution?.displayName || "Google User";
  const authorPhoto = review.authorAttribution?.photoUri;
  const authorUri = review.authorAttribution?.uri;
  const rating = review.rating || 5;
  const reviewText = review.text?.text || review.originalText?.text || "";
  const relativeTime = review.relativePublishTimeDescription;

  const isLongText = reviewText.length > 120;
  const displayedText = isLongText && !isExpanded
    ? `${reviewText.slice(0, 120)}...`
    : reviewText;

  const initial = authorName.charAt(0).toUpperCase();

  return (
    <div className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-2xs hover:shadow-sm transition-all duration-200 flex flex-col justify-between h-[165px] group">
      <div>
        {/* Top Header: Author Info & Google Icon */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2.5 min-w-0">
            {authorPhoto ? (
              <img
                src={authorPhoto}
                alt={authorName}
                className="w-8 h-8 rounded-full object-cover border border-slate-200 flex-shrink-0"
                loading="lazy"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 font-bold flex items-center justify-center text-xs border border-blue-200 flex-shrink-0">
                {initial}
              </div>
            )}

            <div className="min-w-0 truncate">
              {authorUri ? (
                <a
                  href={authorUri}
                  target="_blank"
                  rel="noreferrer"
                  className="font-bold text-slate-900 text-xs sm:text-[13px] hover:text-blue-600 transition-colors truncate block"
                >
                  {authorName}
                </a>
              ) : (
                <span className="font-bold text-slate-900 text-xs sm:text-[13px] truncate block">
                  {authorName}
                </span>
              )}
              {relativeTime && (
                <span className="text-[10.5px] text-slate-400 block -mt-0.5">
                  {relativeTime}
                </span>
              )}
            </div>
          </div>

          {/* Mini Google Icon */}
          <div className="flex-shrink-0" title="Verified Google Review">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" aria-label="Google">
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
          </div>
        </div>

        {/* Star Rating */}
        <div className="flex items-center space-x-0.5 mb-1.5">
          {[1, 2, 3, 4, 5].map((starIndex) => (
            <Star
              key={starIndex}
              className={`w-3 h-3 ${
                starIndex <= rating
                  ? "fill-amber-400 text-amber-400"
                  : "fill-slate-200 text-slate-200"
              }`}
            />
          ))}
          <span className="text-[10px] text-slate-400 ml-1 font-medium">Google</span>
        </div>

        {/* Review text */}
        <p className="text-slate-700 text-xs leading-relaxed line-clamp-3">
          “{displayedText}”
        </p>
      </div>

      {/* Expand button if long */}
      {isLongText && (
        <div className="pt-1 flex justify-end">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-[10.5px] font-semibold text-blue-600 hover:underline cursor-pointer"
          >
            {isExpanded ? "Less" : "More"}
          </button>
        </div>
      )}
    </div>
  );
};

export default GoogleReviewCard;
