import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
import { business, whatsappHref } from "@/lib/data/business";
import type { TourPackage } from "@/lib/data/packages";

const badgeClasses: Record<string, string> = {
  default: "left-3.5 bg-ink/85 text-white",
  hot: "right-3.5 bg-accent text-white",
  left: "right-3.5 bg-white text-ink",
};

export default function PackageCard({
  pkg,
  delay = 0,
  showDetails = false,
  editorial = false,
  reverse = false,
  compact = false,
}: {
  pkg: TourPackage;
  delay?: number;
  showDetails?: boolean;
  editorial?: boolean;
  reverse?: boolean;
  compact?: boolean;
}) {
  return (
    <Reveal
      delay={delay}
      className={`overflow-hidden rounded-2xl bg-white shadow-[0_18px_46px_-28px_rgba(8,33,76,0.45)] transition-[transform,box-shadow] duration-300 hover:-translate-y-1.5 hover:shadow-[0_34px_70px_-30px_rgba(8,33,76,0.55)] ${
        editorial ? "grid grid-cols-1 lg:grid-cols-2" : "flex h-full flex-col"
      }`}
    >
      <div className={`group relative overflow-hidden ${editorial ? `h-72 sm:h-88 lg:h-full lg:min-h-104 ${reverse ? "lg:order-2" : "lg:order-1"}` : "h-53"}`}>
        <Image
          src={pkg.image}
          alt={pkg.imageAlt}
          fill
          sizes={editorial ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"}
          className="object-cover object-[50%_68%] transition-transform duration-700 group-hover:scale-[1.07]"
        />
        <span className={`absolute top-3.5 rounded-full px-3 py-1.5 text-[10.5px] font-bold tracking-[0.1em] uppercase ${badgeClasses.default}`}>
          {pkg.badge}
        </span>
        {pkg.secondaryBadge && (
          <span className={`absolute top-3.5 rounded-full px-3 py-1.5 text-[10.5px] font-bold tracking-[0.1em] uppercase ${badgeClasses[pkg.secondaryBadgeVariant ?? "hot"]}`}>
            {pkg.secondaryBadge}
          </span>
        )}
      </div>
      <div className={`flex flex-1 flex-col gap-2.5 px-6 py-7 sm:px-9 sm:py-9 lg:justify-center ${editorial ? (reverse ? "lg:order-1" : "lg:order-2") : "pt-5.5 pb-6"}`}>
        <h3 className="text-[21px] leading-[1.24] font-bold tracking-[-0.015em]">{pkg.name}</h3>
        <p className="flex-1 text-[13.5px] leading-[1.6] text-slate">{pkg.description}</p>
        <div className="flex flex-wrap gap-1.5">
          {pkg.tags.map((tag) => (
            <span key={tag} className="rounded-md bg-[#E9F1FC] px-2.5 py-1.5 text-[11.5px] font-medium text-navy">
              {tag}
            </span>
          ))}
        </div>
        <div className="mt-1 flex flex-wrap items-end justify-between gap-x-3 gap-y-3 border-t border-[#E9EFF7] pt-4">
          <div>
            <small className="block text-[10px] font-semibold tracking-[0.14em] text-[#93A4BE] uppercase">Starting from</small>
            <b className="text-[28px] font-extrabold tracking-tight whitespace-nowrap">{pkg.price}</b>
          </div>
          {showDetails ? (
            <div className="flex w-full items-center gap-2 sm:w-auto">
              <Link href={`/packages/${pkg.slug}`} className="inline-flex flex-1 items-center justify-center rounded-full border border-line px-4 py-2.5 text-[12.5px] font-bold whitespace-nowrap text-navy transition-[background-color,border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-navy hover:bg-navy hover:text-white">
                View Details
              </Link>
              <a href={whatsappHref(business.whatsapp, pkg.whatsappMessage)} target="_blank" rel="noopener" className="inline-flex flex-1 items-center justify-center rounded-full bg-accent px-4 py-2.5 text-[12.5px] font-bold whitespace-nowrap text-white transition-[background-color,transform] duration-300 hover:-translate-y-0.5 hover:bg-navy">
                Book Now
              </a>
            </div>
          ) : (
            <a href={whatsappHref(business.whatsapp, pkg.whatsappMessage)} target="_blank" rel="noopener" className="inline-flex items-center gap-1.5 rounded-full bg-accent px-4.5 py-2.5 text-[12.5px] font-bold whitespace-nowrap text-white transition-[background-color,transform] duration-300 hover:-translate-y-0.5 hover:bg-navy">
              Book via WhatsApp
            </a>
          )}
        </div>
      </div>
    </Reveal>
  );
}
