const TICKER_ITEMS = [
  "GOA · 2N·3D from ₹6,475",
  "OOTY + COONOOR · 5N·6D from ₹15,600",
  "MYSORE HERITAGE · Day Trip on Request",
  "COORG · 3N·4D from ₹12,200",
  "KERALA · 6N·7D from ₹22,500",
  "CHIKMAGALUR · 2N·3D from ₹9,800",
  "AC SLEEPER COACHES · Volvo & Multi-Axle",
  "TRUSTED SINCE 2000 · Own Fleet",
];

export default function Marquee() {
  const loop = [...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <div className="mt-14 overflow-hidden bg-ink py-4 text-white/90" aria-hidden="true">
      <div className="animate-marquee flex w-max">
        {loop.map((item, i) => (
          <i key={i} className="flex items-center gap-3 px-7.5 text-sm font-medium whitespace-nowrap not-italic">
            {item}
            <s className="h-1.5 w-1.5 rounded-full bg-accent no-underline" />
          </i>
        ))}
      </div>
    </div>
  );
}
