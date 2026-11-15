"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

export function ProductGallery({
  images,
  thumbs,
  photos,
  alt,
}: {
  images: string[]
  thumbs?: string[]
  /** Per image: true for a full photo. Its leftover space is filled with a blurred copy of itself, not white. */
  photos?: boolean[]
  alt: string
}) {
  const [index, setIndex] = useState(0)
  const count = images.length
  const src = (path: string) => encodeURI(path)

  const go = (delta: number) => setIndex((i) => (i + delta + count) % count)

  if (count === 0) return null

  return (
    <div className="space-y-4">
      {/* 3:2 matches the product photography, so photos fill the frame edge to edge */}
      <div className="relative aspect-[3/2] bg-white rounded-2xl border border-border/60 overflow-hidden group">
        {/* Photos that don't match the frame's shape: fill the empty sides with the photo's own colours */}
        {photos?.[index] && (
          <img
            key={`fill-${images[index]}`}
            src={src(images[index])}
            alt=""
            aria-hidden
            className="absolute inset-0 w-full h-full object-cover scale-110 blur-2xl"
          />
        )}
        <img
          key={images[index]}
          src={src(images[index])}
          alt={`${alt} — image ${index + 1} of ${count}`}
          className="relative w-full h-full object-contain"
        />

        {count > 1 && (
          <>
            <button
              onClick={() => go(-1)}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/90 border border-border flex items-center justify-center opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => go(1)}
              aria-label="Next image"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/90 border border-border flex items-center justify-center opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <span className="absolute bottom-4 right-4 text-xs bg-foreground/80 text-background px-2.5 py-1 rounded-full">
              {index + 1} / {count}
            </span>
          </>
        )}
      </div>

      {count > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
          {images.map((image, i) => (
            <button
              key={image + i}
              onClick={() => setIndex(i)}
              aria-label={`Show image ${i + 1}`}
              className={cn(
                "relative shrink-0 w-20 h-20 rounded-xl overflow-hidden bg-white border-2 transition-all",
                i === index ? "border-foreground" : "border-transparent opacity-70 hover:opacity-100",
              )}
            >
              {photos?.[i] && (
                <img
                  src={src(thumbs?.[i] ?? image)}
                  alt=""
                  aria-hidden
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover scale-110 blur-md"
                />
              )}
              <img
                src={src(thumbs?.[i] ?? image)}
                alt=""
                loading="lazy"
                className={cn("relative w-full h-full object-contain", !photos?.[i] && "p-1.5")}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
