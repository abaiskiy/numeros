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
  },
  twitter: {
    card: "summary_large_image",
    title: "Совместимость по дате рождения — Numeros",
    description: "Нумерологический разбор совместимости пары. PDF на почту.",
  },
};

export default function SovmestimostPage() {
  return <CompatibilityApp />;
}
