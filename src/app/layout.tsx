import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tullipíò | Made in Ìbàdàn, NG — Contemporary Womenswear & Cultural Heritage",
  description:
    "Contemporary womenswear bridging Aṣọ Òkè, Àdìrẹ, and cutting-edge architectural tailoring. Handcrafted in Akobo, Ìbàdàn. For the explorer in you.",
  keywords: [
    "Tullipíò",
    "Tullipio",
    "Made in Ibadan",
    "Aṣọ Òkè",
    "Àdìrẹ",
    "Contemporary Womenswear",
    "Ibadan Fashion",
    "Tulips",
    "Akobo Ibadan Tailoring",
  ],
  openGraph: {
    title: "Tullipíò | Made in Ìbàdàn, NG",
    description:
      "Contemporary womenswear and cutting-edge tailoring rooted in Nigerian heritage textiles. For the explorer in you.",
    url: "https://tullipio.com",
    siteName: "Tullipíò",
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
