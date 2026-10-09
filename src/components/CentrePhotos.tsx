import React, { useState, useRef } from "react";
import { ChevronLeft, ChevronRight, X, ZoomIn, Camera, Image as ImageIcon } from "lucide-react";
import AmolLogo from "./AmolLogo";
import { useCms } from "../hooks/useCms";
import { DEFAULT_PHOTOS, DEFAULT_CATEGORIES } from "../server/defaultData";

export const CentrePhotos: React.FC = () => {
  const { content } = useCms();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);

  const allPhotos = content?.photos && content.photos.length > 0 ? content.photos : DEFAULT_PHOTOS;
  const categories = content?.categories && content.categories.length > 0 ? content.categories : DEFAULT_CATEGORIES;

  const filteredPhotos =
    selectedCategory === "all"
      ? allPhotos
      : allPhotos.filter((p) => p.category === selectedCategory);

  const handlePrev = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + filteredPhotos.length) % filteredPhotos.length);
    }
  };

  const handleNext = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % filteredPhotos.length);
    }
  };

  // Drag to scroll functionality
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    isDraggingRef.current = true;
    startXRef.current = e.pageX - scrollContainerRef.current.offsetLeft;
    scrollLeftRef.current = scrollContainerRef.current.scrollLeft;
    setIsPaused(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 1.5;
    scrollContainerRef.current.scrollLeft = scrollLeftRef.current - walk;
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
    setTimeout(() => setIsPaused(false), 2000);
  };

  return (
    <section
      id="photos"
      className="scroll-reveal py-16 sm:py-20 bg-gradient-to-b from-white via-slate-50/70 to-blue-50/30 border-b border-slate-200/80 relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest text-blue-700 uppercase mb-2 bg-gradient-to-r from-blue-50 to-indigo-50 px-3 py-1 rounded-full border border-blue-100/80 shadow-2xs">
              <Camera className="w-3.5 h-3.5 text-blue-600" />
              <span>CAMPUS & PRACTICAL LABS</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Inside <span className="bg-gradient-to-r from-[#0062d2] via-[#0284c7] to-[#2563eb] bg-clip-text text-transparent">Amol Infotech</span>
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600 font-medium">
              Take a look at our learning environment.
            </p>
          </div>

          {/* Slider Controls with smooth hover animation */}
          <div className="flex items-center space-x-2 self-start sm:self-auto">
            <button
              onClick={() => {
                scrollContainerRef.current?.scrollBy({ left: -320, behavior: "smooth" });
              }}
              className="w-10 h-10 rounded-full border border-slate-200 bg-gradient-to-b from-white to-slate-100 hover:from-slate-100 hover:to-slate-200 flex items-center justify-center text-slate-700 transition-all duration-200 cursor-pointer shadow-2xs hover:shadow-xs hover:scale-105 active:scale-95"
              aria-label="Previous photos"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => {
                scrollContainerRef.current?.scrollBy({ left: 320, behavior: "smooth" });
              }}
              className="w-10 h-10 rounded-full bg-gradient-to-r from-[#071f40] via-[#0b3368] to-[#071f40] hover:from-[#0d346b] hover:to-[#0f3d7c] flex items-center justify-center text-white transition-all duration-200 cursor-pointer shadow-md hover:shadow-lg hover:scale-105 active:scale-95"
              aria-label="Next photos"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Dynamic Category Filters Pill Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-3 scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedCategory("all")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
              selectedCategory === "all"
                ? "bg-[#0062d2] text-white shadow-xs"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            All Photos ({allPhotos.length})
          </button>
          {categories.map((cat) => {
            const count = allPhotos.filter((p) => p.category === cat).length;
            if (count === 0) return null; // Only show categories with available photos
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-[#0062d2] text-white shadow-xs"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>

        {/* Photos Horizontal Row with drag-to-scroll */}
        {filteredPhotos.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-slate-200">
            <ImageIcon className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">No photos found in this category.</p>
          </div>
        ) : (
          <div
            ref={scrollContainerRef}
            id="photos-scroll-container"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => {
              if (!isDraggingRef.current) setIsPaused(false);
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setTimeout(() => setIsPaused(false), 2000)}
            className="flex gap-4.5 overflow-x-auto pb-4 scrollbar-none cursor-grab active:cursor-grabbing select-none"
          >
            {filteredPhotos.map((photo, index) => (
              <div
                key={photo.id}
                onClick={() => {
                  if (!isDraggingRef.current) setLightboxIndex(index);
                }}
                className="group relative flex-shrink-0 w-[260px] sm:w-[280px] lg:w-[300px] h-[210px] sm:h-[220px] rounded-2xl overflow-hidden border border-slate-200/90 shadow-sm hover:shadow-xl cursor-pointer transition-all duration-300 transform hover:-translate-y-1"
              >
                {/* Background Photo */}
                <img
                  src={photo.image}
                  alt={photo.title}
                  className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                  draggable={false}
                  loading="lazy"
                />

                {/* Subtle dark gradient overlay at bottom */}
                <div
                  className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/35 to-transparent pointer-events-none"
                  aria-hidden="true"
                />

                {/* Top Logo Watermark Badge */}
                <div className="absolute top-2.5 left-2.5 pointer-events-none">
                  <div className="bg-white/90 backdrop-blur-md px-2 py-1 rounded-md shadow-xs border border-white/60 flex items-center space-x-1.5 transition-transform duration-300 group-hover:scale-105">
                    <AmolLogo className="h-4 w-auto" />
                    <span className="text-[10px] font-black tracking-tight text-blue-900">
                      RISOD
                    </span>
                  </div>
                </div>

                {/* Top Right Zoom Icon Indicator */}
                <div className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-slate-900/60 backdrop-blur-sm text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                  <ZoomIn className="w-3.5 h-3.5" />
                </div>

                {/* Bottom Caption Overlay */}
                <div className="absolute inset-x-0 bottom-0 p-3.5 text-white pointer-events-none">
                  <span className="inline-block text-[9.5px] font-extrabold uppercase tracking-wider text-cyan-300 bg-blue-950/80 px-2 py-0.5 rounded border border-blue-400/30 mb-1">
                    {photo.category}
                  </span>
                  <h3 className="text-xs sm:text-[13px] font-bold leading-tight drop-shadow-md line-clamp-1">
                    {photo.title}
                  </h3>
                  {photo.subtitle && (
                    <p className="text-[11px] text-slate-200/90 leading-tight mt-0.5 drop-shadow-sm line-clamp-1">
                      {photo.subtitle}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && filteredPhotos[lightboxIndex] && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-scale-in"
          onClick={() => setLightboxIndex(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-slate-950 rounded-2xl overflow-hidden border border-white/20 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between p-4 bg-slate-900/90 text-white border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <AmolLogo className="h-6 w-auto" />
                <span className="text-xs font-bold text-slate-300">
                  {filteredPhotos[lightboxIndex].category}
                </span>
              </div>
              <button
                onClick={() => setLightboxIndex(null)}
                className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Main Lightbox Image */}
            <div className="relative aspect-video max-h-[70vh] flex items-center justify-center bg-black">
              <img
                src={filteredPhotos[lightboxIndex].image}
                alt={filteredPhotos[lightboxIndex].title}
                className="w-full h-full object-contain select-none"
              />

              {/* Prev/Next arrows in Lightbox */}
              {filteredPhotos.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrev();
                    }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-all cursor-pointer"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNext();
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-all cursor-pointer"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>

            {/* Caption */}
            <div className="p-4 bg-slate-900 text-white">
              <h3 className="font-bold text-base">
                {filteredPhotos[lightboxIndex].title}
              </h3>
              {filteredPhotos[lightboxIndex].subtitle && (
                <p className="text-xs text-slate-300 mt-1">
                  {filteredPhotos[lightboxIndex].subtitle}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

    </section>
  );
};

export default CentrePhotos;
