import { Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "cyrillic"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

export const metadata = {
  title: "Numeros — Профессиональный расчет судьбы",
  description: "Раскрой свой потенциал через сакральную геометрию Квадрата Пифагора. Узнай свои сильные стороны за несколько секунд.",
  icons: {
    icon: [
      { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon-512.png',   sizes: '512x512', type: 'image/png' },
    ],
    apple: { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    shortcut: '/favicon-32.png',
  },
  openGraph: {
    title: 'Numeros — Матрица Пифагора',
    description: 'Раскрой свой потенциал через сакральную нумерологию',
    images: [{ url: '/icon-512.png' }],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru" className={`${manrope.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
