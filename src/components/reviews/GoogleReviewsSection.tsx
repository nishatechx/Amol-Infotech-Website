import React, { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  fetchGooglePlaceReviews,
  GooglePlaceData,
  GoogleReview,
  RISOD_MAPS_LISTING_URL,
} from "../../services/googlePlaces";
import GoogleRatingSummary from "./GoogleRatingSummary";
import GoogleReviewCard from "./GoogleReviewCard";

export const GoogleReviewsSection: React.FC = () => {
  const [data, setData] = useState<GooglePlaceData | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState<boolean>(false);
  const [canScrollRight, setCanScrollRight] = useState<boolean>(true);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchGooglePlaceReviews()
      .then((result) => setData(result))
      .catch((err) => console.error("Error loading reviews:", err));
  }, []);

  const updateScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
    }
  };

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (el) {
      el.addEventListener("scroll", updateScrollButtons, { passive: true });
      updateScrollButtons();
      return () => el.removeEventListener("scroll", updateScrollButtons);
    }
  }, [data]);

  const scrollByDirection = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const cardWidth = container.firstElementChild
        ? (container.firstElementChild as HTMLElement).clientWidth + 16
        : 340;
      const scrollDistance = direction === "left" ? -cardWidth : cardWidth;
      container.scrollBy({ left: scrollDistance, behavior: "smooth" });
    }
  };

  const reviews: GoogleReview[] = data?.reviews || [];

  return (
    <section
      id="reviews"
      className="scroll-reveal py-8 sm:py-10 bg-gradient-to-b from-white via-slate-50/80 to-blue-50/20 border-b border-slate-200/80 relative"
      aria-labelledby="reviews-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Minimalist Top Bar: Heading on Left, Rating + Arrows on Right */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold tracking-wider text-blue-700 uppercase bg-gradient-to-r from-blue-50 to-indigo-50 px-2.5 py-0.5 rounded border border-blue-100 shadow-2xs">
                Google Verified
              </span>
              <h2
                id="reviews-heading"
                className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight"
              >
                What Our <span className="bg-gradient-to-r from-[#0062d2] via-[#0284c7] to-[#2563eb] bg-clip-text text-transparent">Students Say</span>
              </h2>
            </div>
            <p className="text-xs text-slate-500 font-normal mt-0.5">
              Real student experiences on Google Maps
            </p>
          </div>

          {/* Right side: Compact Rating pill & Scroll controls */}
          <div className="flex items-center justify-between sm:justify-end gap-2.5">
            <GoogleRatingSummary
              rating={data?.rating || 5}
              userRatingCount={data?.userRatingCount || 428}
            />

            <div className="flex items-center space-x-1">
              <button
                type="button"
                onClick={() => scrollByDirection("left")}
                disabled={!canScrollLeft}
                className="w-7 h-7 rounded-full bg-gradient-to-b from-white to-slate-50 border border-slate-200 text-slate-700 flex items-center justify-center hover:from-blue-50 hover:to-indigo-50 hover:text-blue-600 hover:border-blue-300 disabled:opacity-30 disabled:cursor-not-allowed shadow-2xs transition-all cursor-pointer"
                aria-label="Scroll reviews left"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => scrollByDirection("right")}
                disabled={!canScrollRight}
                className="w-7 h-7 rounded-full bg-gradient-to-b from-white to-slate-50 border border-slate-200 text-slate-700 flex items-center justify-center hover:from-blue-50 hover:to-indigo-50 hover:text-blue-600 hover:border-blue-300 disabled:opacity-30 disabled:cursor-not-allowed shadow-2xs transition-all cursor-pointer"
                aria-label="Scroll reviews right"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Scrollable Reviews Cards Track */}
        {reviews.length > 0 && (
          <div className="relative">
            <div
              ref={scrollContainerRef}
              className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory py-1 scrollbar-none"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                WebkitOverflowScrolling: "touch",
              }}
            >
              {reviews.map((review, idx) => (
                <div
                  key={review.name || idx}
                  className="w-[280px] sm:w-[320px] md:w-[340px] flex-shrink-0 snap-start"
                >
                  <GoogleReviewCard review={review} />
                </div>
              ))}
            </div>

            {/* Attribution note */}
            <div className="mt-2 text-right">
              <a
                href={RISOD_MAPS_LISTING_URL}
                target="_blank"
                rel="noreferrer"
                className="text-[10.5px] text-slate-400 hover:text-blue-600 transition-colors"
              >
                Powered by Google Maps • Amol Infotech & Maharana Typing Institute Risod
              </a>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};

export default GoogleReviewsSection;
