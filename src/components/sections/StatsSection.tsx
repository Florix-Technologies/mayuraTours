import AnimatedStat from "@/components/ui/AnimatedStat";
import { stats } from "@/lib/data/stats";

export default function StatsSection() {
  return (
    <div className="bg-ink py-16 text-white sm:py-22">
      <div className="mx-auto max-w-(--container-width) px-5 sm:px-10">
        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-white/15 bg-white/15 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col gap-2 bg-ink px-7.5 py-8.5">
              <b className="bg-linear-to-r from-sky to-accent-light bg-clip-text text-[48px] leading-none font-extrabold tracking-tight text-transparent">
                <AnimatedStat to={stat.to} suffix={stat.suffix} />
              </b>
              <span className="text-[13px] leading-[1.5] whitespace-pre-line text-white/65">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
