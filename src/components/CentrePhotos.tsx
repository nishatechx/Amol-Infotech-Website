import React, { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, X, ZoomIn, Camera } from "lucide-react";
import AmolLogo from "./AmolLogo";

export const CentrePhotos: React.FC = () => {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);

  const photos = [
    {
      id: 1,
      title: "MS-CIT Computer Training Lab",
      subtitle: "High-spec workstations with modern monitors & high-speed Internet",
      image: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80",
      tag: "MS-CIT Lab",
    },
    {
      id: 2,
      title: "Interactive Practical Learning",
      subtitle: "Students mastering typing speed drills and practical software",
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
      tag: "Student Practice",
    },
    {
      id: 3,
      title: "MS-CIT Batch Training Session",
      subtitle: "Individual PC allocated to each learner with personal attention",
      image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80",
      tag: "Live Batch",
    },
    {
      id: 4,
      title: "Amol Infotech Reception & Helpdesk",
      subtitle: "Welcome counter and student admission counselling desk",
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
      tag: "Reception Desk",
    },
    {
      id: 5,
      title: "MS-CIT Certificate Distribution Ceremony",
      subtitle: "Proud students receiving their government-recognised certificates",
      image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80",
      tag: "Certificates",
    },
  ];

  const handlePrev = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + photos.length) % photos.length);
    }
  };

  const handleNext = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % photos.length);
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
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest text-blue-700 uppercase mb-2 bg-gradient-to-r from-blue-50 to-indigo-50 px-3 py-1 rounded-full border border-blue-100/80 shadow-2xs">
              <Camera className="w-3.5 h-3.5 text-blue-600" />
              <span>CAMPUS & PRACTICAL LABS</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Centre <span className="bg-gradient-to-r from-[#0062d2] via-[#0284c7] to-[#2563eb] bg-clip-text text-transparent">Photos</span>
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600 font-medium">
              Take a look at our modern training environment and student activities.
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

        {/* 5 Photos Horizontal Row with Logo and drag-to-scroll */}
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
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4.5 overflow-x-auto pb-4 scrollbar-none cursor-grab active:cursor-grabbing select-none"
        >
          {photos.map((photo, index) => (
            <div
              key={photo.id}
              onClick={() => {
                if (!isDraggingRef.current) setLightboxIndex(index);
              }}
              className="group relative h-[210px] sm:h-[220px] rounded-2xl overflow-hidden border border-slate-200/90 shadow-sm hover:shadow-xl cursor-pointer transition-all duration-300 transform hover:-translate-y-1"
            >
              {/* Background Photo with gentle 1.04 zoom */}
              <img
                src={photo.image}
                alt={photo.title}
                className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                draggable={false}
              />

              {/* Top-Left Institute Logo Watermark */}
              <div className="absolute top-2.5 left-2.5 z-10 bg-white/95 backdrop-blur-md px-2 py-1 rounded-md shadow-md border border-white/80 transition-transform duration-300 group-hover:scale-105 pointer-events-none">
                <AmolLogo size="xs" />
              </div>

              {/* Tag pill at top right (stable on hover) */}
              <div className="absolute top-2.5 right-2.5 z-10 bg-gradient-to-r from-[#071f40]/90 to-[#0b3368]/90 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
                {photo.tag}
              </div>

              {/* Hover Dark Radial Overlay with zoom icon */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-blue-950/45 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center text-white z-10">
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110">
                  <ZoomIn className="w-5 h-5 text-white" />
                </div>
              </div>

              {/* Title tag at bottom: text moves upward by a few pixels on hover */}
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950/95 via-slate-950/60 to-transparent p-3 text-white z-10 transition-transform duration-300 group-hover:-translate-y-1">
                <div className="text-xs font-bold tracking-tight truncate drop-shadow-xs">
                  {photo.title}
                </div>
                <div className="text-[10px] text-slate-300 truncate">
                  {photo.subtitle}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Lightbox Modal with Logo & entrance animation */}
      {lightboxIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-scale-in">
          <button
            onClick={() => setLightboxIndex(null)}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all duration-200 cursor-pointer active:scale-90"
          >
            <X className="w-6 h-6" />
          </button>

          <button
            onClick={handlePrev}
            className="absolute left-4 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all duration-200 cursor-pointer active:scale-90"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <div className="max-w-4xl max-h-[85vh] flex flex-col items-center">
            {/* Modal Logo watermark */}
            <div className="mb-3 bg-white/95 px-3 py-1.5 rounded-lg shadow-lg">
              <AmolLogo size="sm" />
            </div>

            <img
              src={photos[lightboxIndex].image}
              alt={photos[lightboxIndex].title}
              className="max-h-[65vh] w-auto rounded-xl shadow-2xl object-contain border border-white/20"
            />
            <div className="mt-4 text-center text-white max-w-xl">
              <h4 className="text-lg font-bold">{photos[lightboxIndex].title}</h4>
              <p className="text-sm text-slate-300 mt-1">{photos[lightboxIndex].subtitle}</p>
            </div>
          </div>

          <button
            onClick={handleNext}
            className="absolute right-4 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all duration-200 cursor-pointer active:scale-90"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}
    </section>
  );
};

export default CentrePhotos;
