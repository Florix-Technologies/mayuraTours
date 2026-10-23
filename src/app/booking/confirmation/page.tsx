import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { isLocalDevelopmentHost } from "@/lib/booking/development-payment";
import BookingConfirmationPreview from "./BookingConfirmationPreview";

export default async function BookingConfirmationPage() {
  // No payment-verification backend exists yet. Production fails closed.
  // A real confirmation must load a verified booking from the backend here;
  // browser storage, query flags and the preview marker must never authorize it.
  if (process.env.NODE_ENV !== "development") redirect("/booking/payment");
  const host = (await headers()).get("host") ?? "";
  if (!isLocalDevelopmentHost(host)) redirect("/booking/payment");
  return <BookingConfirmationPreview />;
}
