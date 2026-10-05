import React from "react";

export const GoogleReviewsSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between"
        >
          <div>
            {/* Top row: Avatar + Name Skeleton */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-full bg-slate-200" />
              <div className="space-y-1.5 flex-1">
                <div className="h-4 bg-slate-200 rounded w-28" />
                <div className="h-3 bg-slate-100 rounded w-20" />
              </div>
              <div className="w-4 h-4 rounded-full bg-slate-200" />
            </div>

            {/* Stars Skeleton */}
            <div className="flex space-x-1 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <div key={star} className="w-4 h-4 rounded bg-slate-200" />
              ))}
            </div>

            {/* Text lines Skeleton */}
            <div className="space-y-2">
              <div className="h-3.5 bg-slate-200 rounded w-full" />
              <div className="h-3.5 bg-slate-200 rounded w-5/6" />
              <div className="h-3.5 bg-slate-100 rounded w-3/4" />
            </div>
          </div>

          <div className="mt-6 pt-3 border-t border-slate-100">
            <div className="h-3 bg-slate-100 rounded w-16" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default GoogleReviewsSkeleton;
