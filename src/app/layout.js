import { Manrope } from "next/font/google";
import Script from "next/script";
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
  metadataBase: new URL('https://numeros.kz'),
  title: "Нумерологический разбор по дате рождения — Матрица Пифагора | Numeros",
  description: "Персональный нумерологический разбор по дате рождения: характер, денежный потенциал, предназначение. PDF на почту за 5 минут. Матрица Пифагора онлайн.",
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
      <head>
        {/* Schema.org structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "WebSite",
                  "@id": "https://numeros.kz/#website",
                  "url": "https://numeros.kz",
                  "name": "Numeros",
                  "description": "Персональный нумерологический разбор по матрице Пифагора",
                  "inLanguage": "ru-RU",
                },
                {
                  "@type": "Organization",
                  "@id": "https://numeros.kz/#organization",
                  "name": "Numeros",
                  "url": "https://numeros.kz",
                  "logo": {
                    "@type": "ImageObject",
                    "url": "https://numeros.kz/icon.png",
                  },
                  "contactPoint": {
                    "@type": "ContactPoint",
                    "contactType": "customer service",
                    "availableLanguage": ["Russian", "Kazakh"],
                  },
                },
                {
                  "@type": "Product",
                  "name": "Персональный нумерологический разбор",
                  "description": "Подробный PDF-разбор по матрице Пифагора: характер, денежный потенциал, карьера, теневая сторона, прогноз на год и аффирмации.",
                  "image": "https://numeros.kz/opengraph-image",
                  "brand": { "@type": "Brand", "name": "Numeros" },
                  "offers": {
                    "@type": "Offer",
                    "price": "3990",
                    "priceCurrency": "KZT",
                    "availability": "https://schema.org/InStock",
                    "url": "https://numeros.kz",
                    "shippingDetails": {
                      "@type": "OfferShippingDetails",
                      "shippingRate": { "@type": "MonetaryAmount", "value": "0", "currency": "KZT" },
                      "deliveryTime": {
                        "@type": "ShippingDeliveryTime",
                        "handlingTime": { "@type": "QuantitativeValue", "minValue": 0, "maxValue": 0, "unitCode": "MIN" },
                        "transitTime": { "@type": "QuantitativeValue", "minValue": 2, "maxValue": 10, "unitCode": "MIN" },
                      },
                      "shippingDestination": { "@type": "DefinedRegion", "addressCountry": "KZ" },
                    },
                    "hasMerchantReturnPolicy": {
                      "@type": "MerchantReturnPolicy",
                      "applicableCountry": "KZ",
                      "returnPolicyCategory": "https://schema.org/MerchantReturnNotPermitted",
                    },
                  },
                  "aggregateRating": {
                    "@type": "AggregateRating",
                    "ratingValue": "4.9",
                    "reviewCount": "214",
                    "bestRating": "5",
                  },
                },
              ],
            }),
          }}
        />

        {/* Google Analytics 4 */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-LZ9BTNENXY"
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-LZ9BTNENXY', { send_page_view: true });
          `}
        </Script>

        <Script id="yandex-metrika" strategy="afterInteractive">
          {`
            (function(m,e,t,r,i,k,a){
              m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
              m[i].l=1*new Date();
              for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
              k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
            })(window, document,'script','https://mc.yandex.ru/metrika/tag.js?id=103527596', 'ym');
            ym(103527596, 'init', {webvisor:true, clickmap:true, ecommerce:"dataLayer", accurateTrackBounce:true, trackLinks:true});
          `}
        </Script>
        <noscript>
          <div>
            <img src="https://mc.yandex.ru/watch/103527596" style={{position:'absolute', left:'-9999px'}} alt="" />
          </div>
        </noscript>
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
