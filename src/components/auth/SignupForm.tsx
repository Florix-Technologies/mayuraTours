"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Eye,
  EyeOff,
  Waves,
  Mountain,
  Trees,
  PawPrint,
  Landmark,
  Compass,
  Building2,
  Church,
  User,
  Heart,
  Users,
  UsersRound,
  Coffee,
  Camera,
  Utensils,
  Gem,
  MapPin,
  Sparkles,
  Clock3,
  WalletCards,
  ArrowLeft,
  ArrowRight,
  Check,
} from "lucide-react";
import AuthShell from "@/components/auth/AuthShell";
import { useAuth } from "@/components/auth/AuthProvider";
import { loginHref, safeNextPath, verifyEmailHref } from "@/lib/auth/paths";
import { packages } from "@/lib/data/packages";

const panelImage =
  packages.find((pkg) => pkg.slug === "coorg") ?? packages[0];

const placeOptions = [
  { label: "Beaches", icon: Waves },
  { label: "Mountains", icon: Mountain },
  { label: "Nature", icon: Trees },
  { label: "Wildlife", icon: PawPrint },
  { label: "History & Culture", icon: Landmark },
  { label: "Adventure", icon: Compass },
  { label: "Cities", icon: Building2 },
  { label: "Spiritual", icon: Church },
];

const travelWithOptions = [
  { label: "Solo", icon: User },
  { label: "Couple", icon: Heart },
  { label: "Family", icon: Users },
  { label: "Friends", icon: UsersRound },
];

const experienceOptions = [
  { label: "Relaxation", icon: Coffee },
  { label: "Adventure", icon: Mountain },
  { label: "Food", icon: Utensils },
  { label: "Photography", icon: Camera },
  { label: "Sightseeing", icon: MapPin },
  { label: "Local Experiences", icon: Sparkles },
  { label: "Luxury", icon: Gem },
];

const durationOptions = [
  "Weekend",
  "3–4 Days",
  "5–7 Days",
  "1+ Week",
];

const budgetOptions = [
  "Under ₹5,000",
  "₹5,000–₹10,000",
  "₹10,000–₹20,000",
  "₹20,000+",
];

export default function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = safeNextPath(searchParams.get("next"));
  const { isAuthenticated, isReady } = useAuth();

  const [step, setStep] = useState(1);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [favoritePlaces, setFavoritePlaces] = useState<string[]>([]);
  const [travelWith, setTravelWith] = useState("");
  const [experiences, setExperiences] = useState<string[]>([]);
  const [duration, setDuration] = useState("");
  const [budget, setBudget] = useState("");

  useEffect(() => {
    if (isReady && isAuthenticated) {
      router.replace(nextPath);
    }
  }, [isAuthenticated, isReady, nextPath, router]);

  function toggleMultiple(
    value: string,
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) {
    setter((current) =>
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value]
    );
  }

  function handleContinue(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!name.trim() || !email.trim() || !password) return;

    if (password.length < 6) {
      return;
    }

    if (password !== confirmPassword) {
      return;
    }

    setStep(2);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email.trim() || !password) return;

    // Preferences are intentionally kept in local state for now.
    // They can be connected to the backend/recommendation system later.
    console.log({
      name,
      email,
      favoritePlaces,
      travelWith,
      experiences,
      duration,
      budget,
    });

    router.push(
      verifyEmailHref(email, searchParams.get("next") ?? nextPath)
    );
  }

  const inputClass =
    "w-full rounded-2xl border border-[#E4EAF2] bg-[#F7FAFE] px-4 py-3.5 text-sm text-navy outline-none transition-colors placeholder:text-slate/70 focus:border-blue";

  return (
    <AuthShell
      kicker="Join Mayura"
      panelTitle="Your next escape begins here"
      panelMessage="Create your Mayura profile, share the way you love to travel, and make your next journey feel more like yours."
      imageSrc={panelImage.image}
      imageAlt={panelImage.imageAlt}
    >
      {/* Progress */}
      <div className="mb-7 flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span
            className={`flex size-7 items-center justify-center rounded-full text-[11px] font-bold ${
              step >= 1
                ? "bg-accent text-white"
                : "bg-[#EEF3F9] text-slate"
            }`}
          >
            {step > 1 ? <Check size={14} /> : "01"}
          </span>
          <span
            className={`text-xs font-semibold ${
              step === 1 ? "text-navy" : "text-slate"
            }`}
          >
            Account
          </span>
        </div>

        <div className="h-px flex-1 bg-[#E4EAF2]" />

        <div className="flex items-center gap-2">
          <span
            className={`flex size-7 items-center justify-center rounded-full text-[11px] font-bold ${
              step === 2
                ? "bg-accent text-white"
                : "bg-[#EEF3F9] text-slate"
            }`}
          >
            02
          </span>
          <span
            className={`text-xs font-semibold ${
              step === 2 ? "text-navy" : "text-slate"
            }`}
          >
            Travel Style
          </span>
        </div>
      </div>

      {step === 1 ? (
        <>
          <h1 className="font-display text-4xl font-bold tracking-tight text-navy sm:text-[2.6rem]">
            Create Account
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate">
            A few details are all we need to start your Mayura Holidays
            journey.
          </p>

          <form onSubmit={handleContinue} className="mt-8 space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-navy">
                Full name
              </span>
              <input
                type="text"
                name="name"
                autoComplete="name"
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Enter your name"
                className={inputClass}
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-navy">
                Email
              </span>
              <input
                type="email"
                name="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Enter your email"
                className={inputClass}
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-navy">
                Password
              </span>

              <span className="relative block">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  autoComplete="new-password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Create a password"
                  className={`${inputClass} pr-12`}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((open) => !open)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 rounded-md p-1 text-slate transition-colors hover:text-navy"
                  aria-label={
                    showPassword ? "Hide password" : "Show password"
                  }
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </span>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-navy">
                Confirm password
              </span>

              <span className="relative block">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  autoComplete="new-password"
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(event.target.value)
                  }
                  placeholder="Confirm your password"
                  className={`${inputClass} pr-12`}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword((open) => !open)
                  }
                  className="absolute top-1/2 right-3 -translate-y-1/2 rounded-md p-1 text-slate transition-colors hover:text-navy"
                  aria-label={
                    showConfirmPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </span>
            </label>

            {confirmPassword &&
              password !== confirmPassword && (
                <p className="text-xs font-medium text-accent">
                  Passwords do not match.
                </p>
              )}

            <button
              type="submit"
              className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-5 py-3.5 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-navy"
            >
              Continue
              <ArrowRight size={16} />
            </button>
          </form>
        </>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <h1 className="font-display text-3xl font-bold tracking-tight text-navy sm:text-[2.25rem]">
                Your Travel Style
              </h1>

              <p className="mt-2 text-sm leading-6 text-slate">
                Tell us what you love. We&apos;ll use this to make your Mayura
                experience more personal.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setStep(1)}
              className="mt-1 inline-flex shrink-0 items-center gap-1.5 text-xs font-semibold text-slate transition-colors hover:text-navy"
            >
              <ArrowLeft size={14} />
              Back
            </button>
          </div>

          <div className="max-h-[58vh] space-y-7 overflow-y-auto pr-1">
            {/* Places */}
            <PreferenceSection
              icon={<MapPin size={17} />}
              title="What kind of places do you love?"
              subtitle="Choose as many as you like"
            >
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {placeOptions.map((option) => {
                  const Icon = option.icon;
                  const selected = favoritePlaces.includes(option.label);

                  return (
                    <PreferenceCard
                      key={option.label}
                      label={option.label}
                      icon={<Icon size={18} />}
                      selected={selected}
                      onClick={() =>
                        toggleMultiple(option.label, setFavoritePlaces)
                      }
                    />
                  );
                })}
              </div>
            </PreferenceSection>

            {/* Travel companion */}
            <PreferenceSection
              icon={<UsersRound size={17} />}
              title="Who do you usually travel with?"
              subtitle="Choose one"
            >
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {travelWithOptions.map((option) => {
                  const Icon = option.icon;
                  const selected = travelWith === option.label;

                  return (
                    <PreferenceCard
                      key={option.label}
                      label={option.label}
                      icon={<Icon size={18} />}
                      selected={selected}
                      onClick={() => setTravelWith(option.label)}
                    />
                  );
                })}
              </div>
            </PreferenceSection>

            {/* Experiences */}
            <PreferenceSection
              icon={<Sparkles size={17} />}
              title="What makes a trip special for you?"
              subtitle="Choose your favorites"
            >
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {experienceOptions.map((option) => {
                  const Icon = option.icon;
                  const selected = experiences.includes(option.label);

                  return (
                    <PreferenceCard
                      key={option.label}
                      label={option.label}
                      icon={<Icon size={18} />}
                      selected={selected}
                      onClick={() =>
                        toggleMultiple(option.label, setExperiences)
                      }
                    />
                  );
                })}
              </div>
            </PreferenceSection>

            {/* Duration */}
            <PreferenceSection
              icon={<Clock3 size={17} />}
              title="How long do you usually travel?"
              subtitle="Choose one"
            >
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {durationOptions.map((option) => {
                  const selected = duration === option;

                  return (
                    <PreferenceCard
                      key={option}
                      label={option}
                      selected={selected}
                      onClick={() => setDuration(option)}
                    />
                  );
                })}
              </div>
            </PreferenceSection>

            {/* Budget */}
            <PreferenceSection
              icon={<WalletCards size={17} />}
              title="What's your usual travel budget?"
              subtitle="Per person"
            >
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {budgetOptions.map((option) => {
                  const selected = budget === option;

                  return (
                    <PreferenceCard
                      key={option}
                      label={option}
                      selected={selected}
                      onClick={() => setBudget(option)}
                    />
                  );
                })}
              </div>
            </PreferenceSection>

            <p className="text-center text-xs leading-5 text-slate">
              Your travel preferences can be updated anytime.
            </p>

            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-5 py-3.5 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-navy"
            >
              Create My Account
              <Check size={17} />
            </button>
          </div>
        </form>
      )}

      <p className="mt-7 text-center text-sm text-slate">
        Already have an account?{" "}
        <Link
          href={loginHref(searchParams.get("next"))}
          className="font-semibold text-navy hover:text-accent"
        >
          Sign In
        </Link>
      </p>
    </AuthShell>
  );
}

function PreferenceSection({
  icon,
  title,
  subtitle,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="mb-3">
        <div className="flex items-center gap-2 text-navy">
          <span className="flex size-7 items-center justify-center rounded-full bg-[#F7E8F1] text-accent">
            {icon}
          </span>

          <div>
            <h2 className="text-sm font-bold text-navy">{title}</h2>
            <p className="mt-0.5 text-[11px] text-slate">{subtitle}</p>
          </div>
        </div>
      </div>

      {children}
    </section>
  );
}

function PreferenceCard({
  label,
  icon,
  selected,
  onClick,
}: {
  label: string;
  icon?: React.ReactNode;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`group relative flex min-h-[68px] flex-col items-center justify-center gap-1.5 rounded-2xl border px-2 py-3 text-center transition-all duration-200 ${
        selected
          ? "border-accent bg-accent/[0.07] text-accent shadow-[0_8px_20px_-12px_rgba(229,0,126,0.6)]"
          : "border-[#E4EAF2] bg-[#F7FAFE] text-slate hover:-translate-y-0.5 hover:border-blue/40 hover:bg-white hover:text-navy"
      }`}
    >
      {selected && (
        <span className="absolute top-1.5 right-1.5 flex size-4 items-center justify-center rounded-full bg-accent text-white">
          <Check size={10} strokeWidth={3} />
        </span>
      )}

      {icon && (
        <span
          className={`transition-colors ${
            selected ? "text-accent" : "text-slate group-hover:text-blue"
          }`}
        >
          {icon}
        </span>
      )}

      <span className="text-[11px] font-semibold leading-tight sm:text-xs">
        {label}
      </span>
    </button>
  );
}