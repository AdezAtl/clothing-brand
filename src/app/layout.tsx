import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tullipio Fashion House | Modern Yoruba Heritage & Bespoke Tailoring",
  description:
    "Premier African fashion design brand in Akobo, Ibadan. Architectural Agbadas, contemporary two-piece sets, sculpted dresses, and ready-to-wear.",
  keywords: [
    "Tullipio Fashion House",
    "Agbada Ibadan",
    "African Fashion",
    "Bespoke Tailoring Ibadan",
    "Senator Suit",
    "Akobo Ibadan Tailor",
  ],
  openGraph: {
    title: "Tullipio Fashion House | Akobo, Ibadan",
    description:
      "Architectural African silhouettes crafted from heavyweight heritage textiles.",
    url: "https://tullipio.com",
    siteName: "Tullipio Fashion House",
    locale: "en_NG",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,700;1,9..40,400&family=DM+Serif+Display:ital@0;1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#f6f3ec] text-[#181716]">
        {children}
      </body>
    </html>
  );
}
