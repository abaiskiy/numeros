import CompatibilityApp from '@/components/CompatibilityApp';

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Как рассчитывается совместимость по нумерологии?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Совместимость рассчитывается на основе матриц Пифагора двух людей: сравниваются ключевые числа (Судьба, Душа, Карма), секторы матрицы и личные годы. Итоговый балл от 40 до 99 отражает уровень совместимости в 6 сферах жизни.",
      },
    },
    {
      "@type": "Question",
      "name": "Что входит в разбор совместимости?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "PDF 10+ страниц: балл совместимости, 6 сфер жизни (романтика, быт, финансы, интеллект, доверие, духовность), языки любви каждого, конфликтные зоны и триггеры, личные месяцы пары, совместный бизнес-потенциал и благоприятные даты на 90 дней вперёд.",
      },
    },
    {
      "@type": "Question",
      "name": "Когда придёт PDF после оплаты?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "В течение 2–5 минут на указанный email. Если письмо не пришло — проверьте папку «Спам».",
      },
    },
    {
      "@type": "Question",
      "name": "Подходит ли разбор для неженатых пар?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Да, разбор подходит для любых пар — влюблённых, семейных, партнёров по бизнесу или просто друзей. Для расчёта нужны только даты рождения двух людей.",
      },
    },
  ],
};

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
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <CompatibilityApp />
    </>
  );
}
