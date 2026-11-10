"use client"

import { useEffect, useRef, useState } from "react"
import { ChevronDown, Pause, Play } from "lucide-react"

/**
 * Homepage hero: the RIGO brand film, full-bleed and cinematic.
 *
 * The film has its own titles, so it is never covered with text or cropped:
 * - Desktop: edge to edge behind the floating navbar. Height is min(screen height, 16:9 of the width),
 *   so the whole frame is always visible (wider-than-16:9 screens get only a slight top/bottom trim).
 * - Phones: full width at its natural 16:9 shape, starting below the navbar so the bar doesn't hide it.
 * Silent film: autoplays muted on loop; visitors can pause it.
 */
export function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    // React doesn't always write the `muted` attribute into the HTML, and browsers only autoplay muted video.
    video.muted = true
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (!reduceMotion) video.play().catch(() => setPlaying(false))
  }, [])

  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return
    if (video.paused) video.play().catch(() => {})
    else video.pause()
  }

  const buttonClass =
    "flex h-10 w-10 md:h-11 md:w-11 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md border border-white/15 transition-all duration-300 hover:bg-black/75 hover:border-white/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"

  return (
    <section id="hero" className="relative bg-background pt-24 md:pt-0">
      {/* The film's titles aren't readable by search engines or screen readers, so describe the page here */}
      <h1 className="sr-only">RIGO LED Lighting — premium LED lights for homes, offices and outdoor spaces</h1>

      <div className="relative w-full overflow-hidden bg-[#f1ece4] aspect-video md:aspect-auto md:h-[min(100svh,56.25vw)] md:min-h-[480px]">
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          poster="/videos/rigo-brand-poster.jpg"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-label="RIGO product film: the downlight, panel light, and flood and street light collections"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
        >
          <source src="/videos/rigo-brand-1080.mp4" type="video/mp4" media="(min-width: 768px)" />
          <source src="/videos/rigo-brand-720.mp4" type="video/mp4" />
        </video>

        {/* Scroll cue (desktop) */}
        <a
          href="#range"
          aria-label="Scroll to products"
          className="hidden md:flex absolute bottom-6 left-1/2 -translate-x-1/2 h-11 w-11 items-center justify-center rounded-full bg-black/40 text-white/80 backdrop-blur-md border border-white/15 transition-colors hover:text-white hover:bg-black/60"
        >
          <ChevronDown className="h-5 w-5 animate-bounce" />
        </a>

        {/* Video controls */}
        <div className="absolute bottom-3 right-3 md:bottom-6 md:right-6 flex gap-2">
          <button
            type="button"
            onClick={togglePlay}
            aria-label={playing ? "Pause video" : "Play video"}
            className={buttonClass}
          >
            {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 translate-x-px" />}
          </button>
        </div>
      </div>
    </section>
  )
}
