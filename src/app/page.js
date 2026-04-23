import NumerosApp from "@/components/NumerosApp";

export const metadata = {
  title: "Нумерологический разбор по дате рождения — Матрица Пифагора | Numeros",
  description:
    "Получите персональный нумерологический разбор по дате рождения: характер, денежный потенциал, предназначение, прогноз на год. PDF на почту за 5 минут. Матрица Пифагора онлайн.",
  keywords:
    "нумерологический разбор, матрица пифагора, число судьбы, разбор по дате рождения, нумерология онлайн, психоматрица пифагора",
  alternates: {
    canonical: "https://numeros.kz",
  },
  openGraph: {
    title: "Персональный нумерологический разбор — Numeros",
    description:
      "Матрица Пифагора, число судьбы, денежный потенциал, карьера и прогноз на год. PDF на почту за 5 минут.",
    url: "https://numeros.kz",
    siteName: "Numeros",
    locale: "ru_RU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Персональный нумерологический разбор — Numeros",
    description: "Матрица Пифагора, число судьбы, денежный потенциал. PDF на почту за 5 минут.",
  },
};

export default function Home() {
  return <NumerosApp />;
}
