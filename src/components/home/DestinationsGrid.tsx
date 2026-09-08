import Image from "next/image";
import Reveal from "@/components/ui/Reveal";
import { destinations } from "@/lib/data/destinations";

export default function DestinationsGrid() {
  return (
    <section id="destinations" className="py-16 sm:py-26">
      <div className="mx-auto max-w-(--container-width) px-5 sm:px-10">
        <div className="mb-11 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <span className="mb-3 block text-[11px] font-bold tracking-[0.22em] text-accent uppercase">Where We Go</span>
            <h2 className="text-[clamp(30px,3.4vw,44px)] leading-[1.06] font-extrabold tracking-tight text-ink">
              Top destinations from Bengaluru
            </h2>
          </div>
          <a
            href="#contact"
            className="border-b-2 border-blue pb-1 text-[13.5px] font-bold tracking-[0.06em] whitespace-nowrap text-blue uppercase transition-colors hover:border-accent hover:text-accent"
          >
            See all routes →
          </a>
        </div>

        <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 sm:gap-3.5 lg:grid-cols-7">
          {destinations.map((d, i) => (
            <Reveal key={d.name} delay={(i % 7) * 50}>
              <a
                href="#contact"
                className="group relative block aspect-square overflow-hidden rounded-xl shadow-[0_12px_30px_-20px_rgba(8,33,76,0.6)] transition-transform duration-300 hover:-translate-y-1.5"
              >
                <Image
                  src={d.image}
                  alt={d.imageAlt}
                  fill
                  sizes="(min-width: 1024px) 14vw, (min-width: 640px) 25vw, 33vw"
                  className="object-cover object-[50%_58%] transition-transform duration-700 group-hover:scale-[1.09]"
                />
                <span className="absolute inset-x-0 bottom-0 bg-linear-to-t from-ink/92 to-transparent px-3 pt-6 pb-2.5 text-[13px] font-semibold text-white">
                  {d.name}
                </span>
              </a>
            </Reveal>
          ))}
          <Reveal delay={150}>
            <a
              href="#contact"
              className="flex aspect-square items-center justify-center rounded-xl bg-ink p-2.5 text-center text-[13px] leading-[1.4] font-bold text-white transition-colors hover:bg-navy"
            >
              More
              <br />
              destinations
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
