import { useState, useRef } from "react";

interface VideoEmbedProps {
  src: string;
  title?: string;
  label?: string;
}

export function VideoEmbed({
  src,
  title = "RizFlow Explainer",
  label = "RIZFLOW_EXPLAINER",
}: VideoEmbedProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <div className="my-12 rounded-xl overflow-hidden border border-white/[0.06] bg-[#0A0F1A]/60 shadow-[0_0_30px_rgba(0,229,255,0.05)]">
      {/* Header bar */}
      <div className="px-4 py-2.5 bg-[#050A14] border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
          <span className="text-[10px] font-mono text-teal-400 uppercase tracking-widest">
            ▶ {label}
          </span>
        </div>
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
          <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
          <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
        </div>
      </div>
      {/* Video container */}
      <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
        {!isPlaying ? (
          <button
            onClick={() => setIsPlaying(true)}
            className="absolute inset-0 w-full h-full flex items-center justify-center bg-[#0A0F1A] group cursor-pointer"
            aria-label={`Play ${title}`}
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-teal-500/20 border-2 border-teal-400 flex items-center justify-center group-hover:bg-teal-500/30 group-hover:scale-110 transition-all duration-300 shadow-[0_0_30px_rgba(0,229,255,0.3)]">
              <svg
                className="w-6 h-6 sm:w-8 sm:h-8 text-teal-400 ml-1"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            <span className="absolute bottom-4 left-4 text-xs font-mono text-slate-500 uppercase tracking-widest">
              {title}
            </span>
          </button>
        ) : (
          <video
            ref={videoRef}
            src={src}
            controls
            autoPlay
            playsInline
            preload="auto"
            className="absolute inset-0 w-full h-full object-contain bg-black"
          >
            Your browser does not support the video tag.
          </video>
        )}
      </div>
    </div>
  );
}
