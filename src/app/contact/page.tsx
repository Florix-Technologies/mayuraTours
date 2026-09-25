import SiteHeader from "@/components/layout/SiteHeader";

export default function ContactPage() {
  return (
    <div className="bg-white">
      {/* Solid background behind the transparent navbar */}
      <div className="relative z-50 bg-white">
        <SiteHeader />
      </div>

      <main className="min-h-screen bg-[#F7F9FC]">
        {/* HERO */}
        <section className="relative overflow-hidden border-b border-[#E5EAF0] bg-white pt-[104px]">
          <div className="pointer-events-none absolute inset-0 opacity-60">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#E9EEF4_1px,transparent_1px),linear-gradient(to_bottom,#E9EEF4_1px,transparent_1px)] bg-[size:72px_72px]" />
          </div>

          <div className="relative mx-auto max-w-7xl px-5 pb-14 pt-12 sm:px-8 sm:pb-20 sm:pt-16 lg:px-12 lg:pb-24 lg:pt-20">
            <div className="grid items-end gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
              <div>
                <div className="mb-6 flex items-center gap-3">
                  <span className="h-px w-8 bg-accent sm:w-10" />

                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent sm:text-[11px] sm:tracking-[0.24em]">
                    Contact Mayura
                  </span>
                </div>

                <h1 className="max-w-4xl text-[clamp(48px,10vw,105px)] font-extrabold leading-[0.9] tracking-[-0.055em] text-navy">
                  Let&apos;s plan
                  <br />
                  <span className="text-blue">your next</span>
                  <br />
                  journey.
                </h1>
              </div>

              <div className="max-w-md lg:pb-4">
                <div className="mb-5 flex items-center gap-4">
                  <span className="h-px flex-1 bg-[#C9D3E0]" />
                  <span className="text-2xl text-accent">↗</span>
                </div>

                <p className="text-base leading-7 text-slate sm:text-lg sm:leading-8 lg:text-xl">
                  Tell us where you want to go, when you want to travel, and
                  what kind of experience you&apos;re looking for.
                </p>

                <p className="mt-4 text-sm leading-6 text-slate/75">
                  From quick getaways to carefully planned holidays, our team
                  is here to help you shape the right journey.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CONTACT AREA */}
        <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14 lg:px-12 lg:py-20">
          <div className="grid gap-7 lg:grid-cols-[0.8fr_1.2fr] lg:gap-12">
            {/* TRAVEL IMAGE */}
            <div className="relative min-h-[460px] overflow-hidden rounded-[24px] bg-navy sm:min-h-[520px] sm:rounded-[28px]">
              <img
                src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=85"
                alt="Tropical beach destination"
                className="absolute inset-0 h-full w-full object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/35 to-transparent" />

              <div className="relative flex min-h-[460px] flex-col justify-between p-6 text-white sm:min-h-[520px] sm:p-9">
                <div className="flex items-start justify-between gap-4">
                  <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.16em] backdrop-blur-sm sm:text-[10px]">
                    Mayura Holidays
                  </span>

                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 text-lg backdrop-blur-sm sm:h-10 sm:w-10">
                    ↗
                  </span>
                </div>

                <div>
                  <p className="max-w-sm text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
                    Your journey starts with a conversation.
                  </p>

                  <p className="mt-4 max-w-sm text-sm leading-6 text-white/70">
                    Tell us your plans and let&apos;s turn your travel idea
                    into something worth remembering.
                  </p>
                </div>
              </div>
            </div>

            {/* FORM */}
            <div className="rounded-[24px] border border-[#DDE5EF] bg-white p-5 shadow-[0_25px_80px_rgba(20,40,70,0.08)] sm:rounded-[28px] sm:p-8 lg:p-11">
              <div className="mb-7">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
                  Start your enquiry
                </p>

                <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-navy sm:text-3xl lg:text-4xl">
                  Tell us about your trip.
                </h2>

                <p className="mt-3 max-w-xl text-sm leading-6 text-slate">
                  Share a few details about your travel plans and our team will
                  get back to you with suitable options.
                </p>
              </div>

              <form className="space-y-5">
                {/* NAME + PHONE */}
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="name"
                      className="mb-2 block text-xs font-bold uppercase tracking-[0.1em] text-navy"
                    >
                      Your name
                    </label>

                    <input
                      id="name"
                      type="text"
                      placeholder="Enter your name"
                      className="w-full rounded-xl border border-[#D8E0EA] bg-[#F8FAFD] px-4 py-3.5 text-sm text-navy outline-none transition placeholder:text-slate/50 focus:border-blue focus:bg-white"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="mb-2 block text-xs font-bold uppercase tracking-[0.1em] text-navy"
                    >
                      Phone number
                    </label>

                    <input
                      id="phone"
                      type="tel"
                      placeholder="+91"
                      className="w-full rounded-xl border border-[#D8E0EA] bg-[#F8FAFD] px-4 py-3.5 text-sm text-navy outline-none transition placeholder:text-slate/50 focus:border-blue focus:bg-white"
                    />
                  </div>
                </div>

                {/* EMAIL */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-xs font-bold uppercase tracking-[0.1em] text-navy"
                  >
                    Email address
                  </label>

                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-[#D8E0EA] bg-[#F8FAFD] px-4 py-3.5 text-sm text-navy outline-none transition placeholder:text-slate/50 focus:border-blue focus:bg-white"
                  />
                </div>

                {/* DESTINATION + TRAVELLERS */}
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="destination"
                      className="mb-2 block text-xs font-bold uppercase tracking-[0.1em] text-navy"
                    >
                      Destination
                    </label>

                    <select
                      id="destination"
                      defaultValue=""
                      className="w-full rounded-xl border border-[#D8E0EA] bg-[#F8FAFD] px-4 py-3.5 text-sm text-navy outline-none transition focus:border-blue focus:bg-white"
                    >
                      <option value="" disabled>
                        Choose destination
                      </option>
                      <option>Goa</option>
                      <option>Kerala</option>
                      <option>Karnataka</option>
                      <option>Tamil Nadu</option>
                      <option>Rajasthan</option>
                      <option>Himachal Pradesh</option>
                      <option>North East India</option>
                      <option>Custom / Other</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="travellers"
                      className="mb-2 block text-xs font-bold uppercase tracking-[0.1em] text-navy"
                    >
                      Travellers
                    </label>

                    <select
                      id="travellers"
                      defaultValue=""
                      className="w-full rounded-xl border border-[#D8E0EA] bg-[#F8FAFD] px-4 py-3.5 text-sm text-navy outline-none transition focus:border-blue focus:bg-white"
                    >
                      <option value="" disabled>
                        Number of people
                      </option>
                      <option>1 Traveller</option>
                      <option>2 Travellers</option>
                      <option>3 Travellers</option>
                      <option>4 Travellers</option>
                      <option>5+ Travellers</option>
                    </select>
                  </div>
                </div>

                {/* DATE */}
                <div>
                  <label
                    htmlFor="date"
                    className="mb-2 block text-xs font-bold uppercase tracking-[0.1em] text-navy"
                  >
                    Preferred travel date
                  </label>

                  <input
                    id="date"
                    type="date"
                    className="w-full rounded-xl border border-[#D8E0EA] bg-[#F8FAFD] px-4 py-3.5 text-sm text-navy outline-none transition focus:border-blue focus:bg-white"
                  />
                </div>

                {/* MESSAGE */}
                <div>
                  <label
                    htmlFor="message"
                    className="mb-2 block text-xs font-bold uppercase tracking-[0.1em] text-navy"
                  >
                    Tell us more
                  </label>

                  <textarea
                    id="message"
                    rows={4}
                    placeholder="Tell us what you have in mind..."
                    className="w-full resize-none rounded-xl border border-[#D8E0EA] bg-[#F8FAFD] px-4 py-3.5 text-sm text-navy outline-none transition placeholder:text-slate/50 focus:border-blue focus:bg-white"
                  />
                </div>

                {/* SUBMIT */}
                <button
                  type="button"
                  className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue to-navy px-5 py-4 text-center text-sm font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 sm:px-6"
                >
                  <span>Send enquiry</span>

                  <span className="text-lg transition-transform duration-200 group-hover:translate-x-1">
                    ↗
                  </span>
                </button>

                <p className="text-center text-xs leading-5 text-slate/60">
                  We&apos;ll use your details only to respond to your travel
                  enquiry.
                </p>
              </form>
            </div>
          </div>
        </section>

        {/* CONTACT DETAILS */}
        <section className="border-t border-[#E2E8F0] bg-white">
          <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-14 lg:px-12 lg:py-16">
            <div className="grid gap-5 md:grid-cols-3">
              {/* PHONE */}
              <button
                type="button"
                className="group w-full rounded-2xl border border-[#E2E8F0] bg-[#F8FAFD] p-6 text-left transition-all duration-200 hover:-translate-y-1 hover:border-blue/30 hover:bg-white hover:shadow-lg"
              >
                <span className="mb-5 flex h-11 w-11 items-center justify-center rounded-full bg-blue/10 text-xl text-blue">
                  ☎
                </span>

                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
                  Call us
                </p>

                <h3 className="mt-2 text-xl font-bold text-navy">
                  Let&apos;s talk travel
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate">
                  Speak directly with our travel team.
                </p>
              </button>

              {/* EMAIL */}
              <button
                type="button"
                className="group w-full rounded-2xl border border-[#E2E8F0] bg-[#F8FAFD] p-6 text-left transition-all duration-200 hover:-translate-y-1 hover:border-accent/30 hover:bg-white hover:shadow-lg"
              >
                <span className="mb-5 flex h-11 w-11 items-center justify-center rounded-full bg-accent/10 text-xl text-accent">
                  @
                </span>

                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
                  Email us
                </p>

                <h3 className="mt-2 text-xl font-bold text-navy">
                  Send your enquiry
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate">
                  We&apos;ll get back to you with suitable options.
                </p>
              </button>

              {/* OFFICE */}
              <button
                type="button"
                className="group w-full rounded-2xl border border-[#E2E8F0] bg-[#F8FAFD] p-6 text-left transition-all duration-200 hover:-translate-y-1 hover:border-blue/30 hover:bg-white hover:shadow-lg"
              >
                <span className="mb-5 flex h-11 w-11 items-center justify-center rounded-full bg-blue/10 text-xl text-blue">
                  ⌖
                </span>

                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
                  Visit us
                </p>

                <h3 className="mt-2 text-xl font-bold text-navy">
                  Mayura Holidays
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate">
                  Visit our office and speak with our team in person.
                </p>
              </button>
            </div>
          </div>
        </section>

        {/* BOTTOM CTA */}
        <section className="bg-navy">
          <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-16 lg:px-12 lg:py-20">
            <div className="flex flex-col gap-7 md:flex-row md:items-end md:justify-between md:gap-10">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-accent">
                  Your next adventure
                </p>

                <h2 className="mt-3 max-w-3xl text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
                  Somewhere new is waiting.
                </h2>
              </div>

              <p className="max-w-md text-sm leading-6 text-white/60">
                Have a destination in mind? Start the conversation and let
                Mayura help you plan the journey.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}