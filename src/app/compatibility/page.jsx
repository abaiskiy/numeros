import CompatibilityApp from '@/components/CompatibilityApp';

export const metadata = {
  title: "Совместимость по дате рождения — Нумерология пары | Numeros",
  description:
    "Узнайте нумерологическую совместимость двух людей по дате рождения: 6 сфер жизни, языки любви, конфликтные зоны и благоприятные даты. PDF-разбор пары на почту.",
  keywords:
    "совместимость по дате рождения, нумерология совместимость, матрица пифагора совместимость, разбор пары нумерология",
  alternates: {
    canonical: "https://numeros.kz/compatibility",
  },
  openGraph: {
    title: "Совместимость по дате рождения — Numeros",
    description:
      "Нумерологический разбор совместимости пары: 6 сфер, языки любви, конфликтные зоны. PDF на почту.",
    url: "https://numeros.kz/compatibility",
    siteName: "Numeros",
    locale: "ru_RU",
    type: "website",
    images: [
      {
        url: "https://numeros.kz/og-image.png",
        width: 1200,
        height: 630,
        alt: "Numeros — Совместимость по дате рождения",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Совместимость по дате рождения — Numeros",
    description: "Нумерологический разбор совместимости пары. PDF на почту.",
    images: ["https://numeros.kz/og-image.png"],
  },
};

export default function SovmestimostPage() {
  return <CompatibilityApp />;
}
