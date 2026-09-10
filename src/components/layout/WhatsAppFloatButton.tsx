import { business, whatsappHref } from "@/lib/data/business";

export default function WhatsAppFloatButton() {
  return (
    // Mobile already has a dedicated, docked WhatsApp action in MobileBottomBar —
    // this floating copy used to sit on top of it too, drifting over card CTAs and
    // body text as the page scrolled (real collisions, confirmed visually). It only
    // earns its keep on sm+ layouts, which have no bottom dock and more clearance.
    //
    // The pulsing glow used to be a `box-shadow` keyframe animation directly on the
    // link — box-shadow isn't compositable, so the browser had to repaint the layer
    // every frame. It's now a same-sized layer *behind* the link that only animates
    // `transform`/`opacity` (GPU-composited, no repaint), scaling outward from
    // fully hidden behind the button to reproduce the same expanding-ring look.
    <div className="fixed right-6 bottom-6 z-[160] hidden h-15 w-15 sm:block">
      <span
        aria-hidden="true"
        className="animate-pulse-accent-ring absolute inset-0 rounded-full bg-accent/70"
      />
      <a
        href={whatsappHref(business.whatsapp, "Hi Mayura Team, I'd like to enquire about a package tour.")}
        target="_blank"
        rel="noopener"
        aria-label="Chat on WhatsApp"
        className="absolute inset-0 flex items-center justify-center rounded-full bg-accent shadow-[0_16px_36px_-12px_rgba(229,0,126,0.95)]"
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="#fff" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
        </svg>
      </a>
    </div>
  );
}
