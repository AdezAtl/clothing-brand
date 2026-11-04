import React from "react";
import { StoreProviders } from "@/components/providers/StoreProviders";
import { Navbar } from "@/components/storefront/Navbar";
import { Footer } from "@/components/storefront/Footer";
import { CartDrawer } from "@/components/storefront/CartDrawer";
import { WhatsAppFloatingButton } from "@/components/storefront/WhatsAppFloatingButton";

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StoreProviders>
      <div className="min-h-screen flex flex-col bg-[#f6f3ec] text-[#181716] selection:bg-stone-900 selection:text-stone-50">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <CartDrawer />
        <WhatsAppFloatingButton />
      </div>
    </StoreProviders>
  );
}
