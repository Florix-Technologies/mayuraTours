"use client";

import Image from "next/image";
import Link from "next/link";
import { business } from "@/lib/data/business";

type AuthShellProps = {
  kicker: string;
  panelTitle: string;
  panelMessage: string;
  imageSrc: string;
  imageAlt: string;
  children: React.ReactNode;
};

export default function AuthShell({
  kicker,
  panelTitle,
  panelMessage,
  imageSrc,
  imageAlt,
  children,
}: AuthShellProps) {
  return (
    <main className="relative min-h-dvh overflow-x-clip bg-ink">
      <div className="absolute inset-0" aria-hidden="true">
        <Image
          src={imageSrc}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-ink/70" />
        <div className="absolute inset-0 bg-linear-to-br from-navy/80 via-ink/55 to-accent/35" />
      </div>

      <div className="relative z-10 flex min-h-dvh items-center justify-center px-4 py-8 sm:px-6 sm:py-10 lg:px-10">
        <div className="grid w-full max-w-[1120px] overflow-hidden rounded-[28px] bg-white shadow-[0_40px_80px_-32px_rgba(4,16,42,0.55)] md:grid-cols-2">
          <section className="relative min-h-[240px] overflow-hidden sm:min-h-[300px] md:min-h-[640px]">
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              priority
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-ink via-ink/35 to-navy/20" />
            <div className="absolute inset-x-0 top-0 p-6 sm:p-8">
              <p className="flex items-center gap-3 text-[10px] font-semibold tracking-[0.28em] text-white/80 uppercase">
                {kicker}
                <span className="h-px w-12 bg-white/50" aria-hidden="true" />
              </p>
            </div>
            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 lg:p-10">
              <h2 className="max-w-sm font-display text-4xl leading-[1.05] font-bold text-white sm:text-5xl">
                {panelTitle}
              </h2>
              <p className="mt-4 max-w-sm text-sm leading-7 text-white/80">
                {panelMessage}
              </p>
            </div>
          </section>

          <section className="flex flex-col bg-white px-6 py-8 sm:px-10 sm:py-12 lg:px-14 lg:py-14">
            <Link href="/" className="mb-8 inline-flex items-center gap-3 self-center sm:mb-10">
              <Image
                src="/mayura.png"
                alt={`${business.legalName} logo`}
                width={44}
                height={44}
                className="rounded-lg object-contain"
              />
              <span className="font-display text-lg font-extrabold text-navy">
                {business.shortName}
                <span className="text-accent">.</span>
              </span>
            </Link>
            <div className="mx-auto w-full max-w-[420px] flex-1">{children}</div>
          </section>
        </div>
      </div>
    </main>
  );
}
