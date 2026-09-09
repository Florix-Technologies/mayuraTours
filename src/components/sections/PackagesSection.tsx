import { packages } from "@/lib/data/packages";
import PackageCard from "./PackageCard";

export default function PackagesSection() {
  return (
    <section id="packages" className="scroll-mt-24 pt-8 pb-16 sm:pt-12 sm:pb-26">
      <div className="mx-auto max-w-(--container-width) px-5 sm:px-10">

        {/* MAYURA HOLIDAYS - CENTER TOP */}
   <div className="mb-10 text-center">
  <div className="flex items-center justify-center gap-3">
    
    <div className="flex items-center">
      <span className="h-px w-12 bg-accent"></span>
      <span className="mx-2 text-[10px] text-accent">◆</span>
      <span className="h-px w-6 bg-accent"></span>
    </div>

  <div className="flex shrink-0 flex-col items-center">
  <span className="font-display text-4xl font-extrabold tracking-wide text-ink sm:text-5xl">
    MAYURA
  </span>

  <span className="mt-0.5 text-[14px] font-bold tracking-[0.45em] text-accent uppercase">
    HOLIDAYS
  </span>
</div>

    <div className="flex items-center">
      <span className="h-px w-6 bg-accent"></span>
      <span className="mx-2 text-[10px] text-accent">◆</span>
      <span className="h-px w-12 bg-accent"></span>
    </div>

  </div>
</div>

        <div className="mb-11 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <span className="mb-3 block text-[11px] font-bold tracking-[0.22em] text-accent uppercase">
              Curated Packages
             
            </span>
            <h2 className="max-w-[12ch] text-[clamp(30px,3.4vw,44px)] leading-[1.06] font-extrabold tracking-tight text-ink">
              Packages Under One Roof:
            </h2>

            <p className="mt-4 max-w-[55ch] text-[15px] text-slate">
            All-inclusive packages with AC sleeper transport, hotel stays, and guided sightseeing. No hidden charges.
          </p>

          </div>
         
          <a
            href="#contact"
            className="border-b-2 border-blue pb-1 text-[13.5px] font-bold tracking-[0.06em] whitespace-nowrap text-blue uppercase transition-colors hover:border-accent hover:text-accent"
          >
            View all →
          </a>
        </div>

        <div className="grid grid-cols-1 gap-6.5 sm:grid-cols-2 lg:grid-cols-3">
          {packages.map((pkg, i) => (
            <PackageCard key={pkg.slug} pkg={pkg} delay={(i % 3) * 120} />
          ))}
        </div>
      </div>
    </section>
  );
}
