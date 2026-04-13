import { Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "cyrillic"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

/** Меняйте при обновлении иконки — сбрасывает агрессивный кэш favicon в браузерах. */
const ICON_CACHE = "3";

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: "Numeros — Профессиональный расчет судьбы",
  description: "Раскрой свой потенциал через сакральную геометрию Квадрата Пифагора. Узнай свои сильные стороны за несколько секунд.",
  icons: {
    icon: [
      { url: `/icon.png?v=${ICON_CACHE}`, sizes: "32x32", type: "image/png" },
      { url: `/icon.svg?v=${ICON_CACHE}`, type: "image/svg+xml", sizes: "any" },
    ],
    shortcut: `/icon.png?v=${ICON_CACHE}`,
    apple: [
      {
        url: `/apple-icon.png?v=${ICON_CACHE}`,
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
  openGraph: {
    title: "Numeros — Матрица Пифагора",
    description: "Раскрой свой потенциал через сакральную нумерологию",
    images: [
      {
        url: `/icon.png?v=${ICON_CACHE}`,
        width: 512,
        height: 512,
        alt: "Numeros",
      },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru" className={`${manrope.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
