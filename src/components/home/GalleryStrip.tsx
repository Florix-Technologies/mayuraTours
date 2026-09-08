import Image from "next/image";
import { galleryImages } from "@/lib/data/gallery";

export default function GalleryStrip() {
  const loop = [...galleryImages, ...galleryImages];

  return (
    <div className="overflow-hidden bg-ink py-15" aria-label="Photo gallery from our tours">
      <div className="mx-auto mb-6 max-w-(--container-width) px-5 sm:px-10">
        <span className="mb-2 block text-[11px] font-bold tracking-[0.22em] text-sky uppercase">Real Moments</span>
        <h2 className="text-[clamp(24px,2.8vw,36px)] font-extrabold tracking-tight text-white">
          Photos from our travellers
        </h2>
      </div>
      <div className="animate-marquee-gallery pause-on-hover flex w-max gap-4">
        {loop.map((img, i) => (
          <div key={i} className="group h-50 w-70 flex-shrink-0 overflow-hidden rounded-xl shadow-[0_12px_30px_rgba(0,0,0,0.4)] transition-transform duration-300 hover:scale-[1.03]">
            <Image
              src={img.src}
              alt={img.alt}
              width={280}
              height={200}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.07]"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
