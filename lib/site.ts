export const siteConfig = {
  name: "NorthSend",
  description:
    "A Nordic-inspired file transfer platform for small businesses that need a clean, white-label sharing flow.",
  url: "http://localhost:3000",
};

import type { Locale } from "@/lib/copy";

export type MarketingPlan = {
  name: string;
  priceLabel: string;
  kicker: string;
  features: string[];
  featured?: boolean;
};

export function getMarketingPlans(locale: Locale): MarketingPlan[] {
  if (locale === "da") {
    return [
      {
        name: "Gratis",
        priceLabel: "0 kr/md",
        kicker: "Gør det let at komme i gang og få flere oprettelser.",
        features: [
          "Send op til 15 GB pr. fil",
          "3 dages lagring",
          "Konto krævet",
        ],
      },
      {
        name: "Pro Light",
        priceLabel: "149 kr/md",
        kicker: "Til mindre teams der vil dele større filer professionelt.",
        featured: true,
        features: [
          "150 GB storage",
          "Fair use trafik",
          "30 dages lagring",
          "Basis tracking",
        ],
      },
      {
        name: "Pro",
        priceLabel: "249 kr/md",
        kicker: "Til virksomheder der vil følge downloads og levere bedre kundeoplevelser.",
        features: [
          "500 GB storage",
          "Fair use trafik",
          "30 dages lagring",
          "Download tracking",
          "Preview af billeder og PDF",
          "Notifikationer",
        ],
      },
    ];
  }

  return [
    {
      name: "Free",
      priceLabel: "0 kr/mo",
      kicker: "Built to remove friction and convert more signups.",
      features: [
        "Send up to 15 GB per file",
        "3 days of storage",
        "Account required",
      ],
    },
    {
      name: "Pro Light",
      priceLabel: "149 kr/mo",
      kicker: "For smaller teams that want a more professional file flow.",
      featured: true,
      features: [
        "150 GB storage",
        "Fair use traffic",
        "30 days of storage",
        "Basic tracking",
      ],
    },
    {
      name: "Pro",
      priceLabel: "249 kr/mo",
      kicker: "For businesses that want tracking, previews, and a stronger delivery experience.",
      features: [
        "500 GB storage",
        "Fair use traffic",
        "30 days of storage",
        "Download tracking",
        "Image and PDF preview",
        "Notifications",
      ],
    },
  ];
}
