import Image from "next/image";
import Reveal from "@/components/ui/Reveal";
import { business, whatsappHref } from "@/lib/data/business";
import type { TourPackage } from "@/lib/data/packages";

const badgeClasses: Record<string, string> = {
  default: "left-3.5 bg-ink/85 text-white",
  hot: "right-3.5 bg-accent text-white",
  left: "right-3.5 bg-white text-ink",
};

export default function PackageCard({ pkg, delay = 0 }: { pkg: TourPackage; delay?: number }) {
  return (
    <Reveal delay={delay} className="flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-[0_18px_46px_-28px_rgba(8,33,76,0.45)] transition-[transform,box-shadow] duration-300 hover:-translate-y-2 hover:shadow-[0_34px_70px_-30px_rgba(8,33,76,0.55)]">
      <div className="group relative h-53 overflow-hidden">
        <Image
          src={pkg.image}
          alt={pkg.imageAlt}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
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
      <div className="flex flex-1 flex-col gap-2.5 px-6 pt-5.5 pb-6">
        <h3 className="text-[21px] leading-[1.24] font-bold tracking-[-0.015em]">{pkg.name}</h3>
        <p className="flex-1 text-[13.5px] leading-[1.6] text-slate">{pkg.description}</p>
        <div className="flex flex-wrap gap-1.5">
          {pkg.tags.map((tag) => (
            <span key={tag} className="rounded-md bg-[#E9F1FC] px-2.5 py-1.5 text-[11.5px] font-medium text-navy">
              {tag}
            </span>
          ))}
        </div>
        <div className="mt-1 flex items-end justify-between border-t border-[#E9EFF7] pt-4">
          <div>
            <small className="block text-[10px] font-semibold tracking-[0.14em] text-[#93A4BE] uppercase">
              Starting from
            </small>
            <b className="text-[28px] font-extrabold tracking-tight">{pkg.price}</b>
          </div>
          <a
            href={whatsappHref(business.whatsapp, pkg.whatsappMessage)}
            target="_blank"
            rel="noopener"
            className="inline-flex items-center gap-1.5 rounded-full bg-accent px-4.5 py-2.5 text-[12.5px] font-bold text-white transition-[background-color,transform] duration-300 hover:-translate-y-0.5 hover:bg-navy"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
            </svg>
            Book via WhatsApp
          </a>
        </div>
      </div>
    </Reveal>
  );
}
