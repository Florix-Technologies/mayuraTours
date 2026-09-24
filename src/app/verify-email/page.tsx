import type { Metadata } from "next";
import { Suspense } from "react";
import VerifyEmailForm from "@/components/auth/VerifyEmailForm";

export const metadata: Metadata = {
  title: "Verify Email",
  description: "Enter the 6-digit code to verify your Mayura Holidays account.",
};

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="min-h-dvh bg-ink" />}>
      <VerifyEmailForm />
    </Suspense>
  );
}
