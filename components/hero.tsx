"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { ArrowRight, ChevronDown, Pause, Play } from "lucide-react"

/**
 * Homepage hero: the RIGO brand film, full-bleed and cinematic.
 *
 * The film has its own titles, so it is never covered with text or cropped:
 * - Desktop: edge to edge behind the floating navbar. Height is min(screen height, 16:9 of the width),
 *   so the whole frame is always visible (wider-than-16:9 screens get only a slight top/bottom trim).
 * - Phones: one dark block from the top of the page (the navbar floats over it). The film sits under the
 *   navbar, a little larger than 16:9 and with soft top/bottom edges so it melts into the block, followed
 *   by a short headline and a button, so the hero has real presence instead of a thin strip.
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
    <section id="hero" className="relative bg-[#0f0f10] pt-24 md:bg-background md:pt-0">
      {/* The film's titles aren't readable by search engines or screen readers, so describe the page here */}
      <h1 className="sr-only">RIGO LED Lighting — premium LED lights for homes, offices and outdoor spaces</h1>

      <div className="relative w-full overflow-hidden bg-[#0f0f10] aspect-[16/10] md:aspect-auto md:h-[min(100svh,56.25vw)] md:min-h-[480px]">
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover [mask-image:linear-gradient(to_bottom,transparent,black_14%,black_86%,transparent)] md:[mask-image:none]"
          poster="/videos/rigo-hero-poster.jpg"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-label="RIGO product film showcasing the lighting collections"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
        >
          <source src="/videos/rigo-hero-1080.mp4" type="video/mp4" media="(min-width: 768px)" />
          <source src="/videos/rigo-hero-720.mp4" type="video/mp4" />
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

      {/* Phones: headline and button under the film */}
      <div className="px-6 pb-10 pt-5 text-center text-white md:hidden">
        <p className="mb-3 text-[11px] uppercase tracking-[0.3em] text-white/50">RIGO LED Lighting</p>
        <p className="text-[1.75rem] font-medium leading-[1.1] tracking-tight text-balance">
          Premium LED lights for every space
        </p>
        <Link
          href="/products"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-black"
        >
          Explore products
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  )
}
