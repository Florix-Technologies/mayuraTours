"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import WhatsAppFloatButton from "@/components/layout/WhatsAppFloatButton";
import MobileBottomBar from "@/components/layout/MobileBottomBar";
import { isAuthPagePath } from "@/lib/auth/paths";

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideChrome = isAuthPagePath(pathname);

  useEffect(() => {
    document.body.style.paddingBottom = hideChrome ? "0px" : "";
    return () => {
      document.body.style.paddingBottom = "";
    };
  }, [hideChrome]);

  if (hideChrome) {
    return <>{children}</>;
  }

  return (
    <>
      <SiteHeader />
      {children}
      <SiteFooter />
      <WhatsAppFloatButton />
      <MobileBottomBar />
    </>
  );
}
