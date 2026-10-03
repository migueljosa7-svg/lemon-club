import { useEffect, useRef, useState } from "react";
import type { GalleryPhoto } from "../../data/gallery-types";
import { galleryFor } from "../../data/galleries";

const FALLBACK_COVER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600'%3E%3Crect width='800' height='600' fill='%23161616'/%3E%3Ctext x='50%25' y='52%25' font-size='120' text-anchor='middle' dominant-baseline='middle'%3E%F0%9F%8D%8B%3C/text%3E%3C/svg%3E";

function GalleryImage({ photo }: { photo: GalleryPhoto }) {
  const [failed, setFailed] = useState(false);
  const src = !photo.src || failed ? FALLBACK_COVER : photo.src;
  return (
    <figure className="relative h-44 w-64 shrink-0 overflow-hidden rounded-2xl border-2 border-ink bg-ink-soft sm:h-52 sm:w-80">
      <img
        src={src}
        alt={photo.alt}
        loading="lazy"
        decoding="async"
        width={320}
        height={208}
        onError={() => setFailed(true)}
        className="h-full w-full object-cover"
      />
      <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/85 to-transparent px-3 pb-2 pt-6 text-[0.65rem] font-semibold text-cream/90">
        Foto CC · {photo.credit}
      </figcaption>
    </figure>
  );
}

export default function GalleryLoop({ eventId, title }: { eventId: string; title: string }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const gallery = galleryFor(eventId);
  const doubled = [...gallery.photos, ...gallery.photos];

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    let x = 0;
    const SPEED = 0.45;
    const loop = () => {
      x += SPEED;
      const half = track.scrollWidth / 2;
      if (half > 0 && x >= half) x -= half;
      track.style.transform = `translate3d(${-x}px,0,0)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [eventId]);

  return (
    <section aria-label={`Galería de eventos pasados de ${title}`}>
      <div className="flex items-baseline justify-between gap-3">
        <h4 className="heading-display text-xl text-ink">Así se vive en directo</h4>
        <span className="eyebrow text-ink/45">Fotos de ediciones pasadas</span>
      </div>
      <div className="relative mt-4 overflow-hidden rounded-3xl border-2 border-ink bg-ink p-3">
        <div className="overflow-hidden">
          <div
            ref={trackRef}
            className="flex w-max gap-3 will-change-transform"
            style={{ transform: "translate3d(0,0,0)" }}
          >
            {doubled.map((p, i) => (
              <GalleryImage key={`${p.src}-${i}`} photo={p} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
