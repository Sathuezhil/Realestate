"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export function ImageGallery({ images, title }: { images: string[]; title: string }) {
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);

  const current = images[index] ?? images[0];

  function prev() {
    setIndex((value) => (value === 0 ? images.length - 1 : value - 1));
  }
  function next() {
    setIndex((value) => (value === images.length - 1 ? 0 : value + 1));
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="gallery-main relative block aspect-[16/10] w-full overflow-hidden rounded-2xl"
      >
        <Image
          key={current}
          src={current}
          alt={title}
          fill
          className="object-cover"
          priority
          sizes="80vw"
        />
      </button>
      <div className="mt-3 grid grid-cols-4 gap-3">
        {images.map((image, imageIndex) => (
          <button
            key={image}
            type="button"
            onClick={() => setIndex(imageIndex)}
            className={`relative aspect-[4/3] overflow-hidden rounded-xl transition duration-300 ${
              imageIndex === index ? "ring-2 ring-gold scale-[1.02]" : "opacity-70 hover:opacity-100"
            }`}
          >
            <Image src={image} alt="" fill className="object-cover" sizes="20vw" />
          </button>
        ))}
      </div>

      {open ? (
        <div className="lightbox-in fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="absolute right-5 top-5 text-white"
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>
          <button type="button" onClick={prev} className="absolute left-4 text-white" aria-label="Previous">
            <ChevronLeft className="h-8 w-8" />
          </button>
          <div className="relative h-[80vh] w-full max-w-5xl">
            <Image key={current} src={current} alt={title} fill className="object-contain" sizes="100vw" />
          </div>
          <button type="button" onClick={next} className="absolute right-4 text-white" aria-label="Next">
            <ChevronRight className="h-8 w-8" />
          </button>
        </div>
      ) : null}
    </div>
  );
}
