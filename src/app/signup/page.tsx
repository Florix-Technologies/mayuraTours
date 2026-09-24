import type { Metadata } from "next";
import { Suspense } from "react";
import SignupForm from "@/components/auth/SignupForm";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create a Mayura Holidays account to book packages and manage trips.",
};

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="min-h-dvh bg-ink" />}>
      <SignupForm />
    </Suspense>
  );
}
