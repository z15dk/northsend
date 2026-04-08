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
        kicker: "Perfekt til hurtige uploads og deling.",
        features: [
          "Send op til 15 GB pr. fil",
          "3 dages lagring",
          "Konto krævet",
        ],
      },
      {
        name: "Pro Light",
        priceLabel: "149 kr/md",
        kicker: "Til dig der vil dele filer mere professionelt.",
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
        kicker: "Til dig der arbejder med filer hver dag og vil have fuld kontrol.",
        features: [
          "500 GB storage",
          "Fair use trafik",
          "30 dages lagring",
          "Download tracking",
          "Preview (billeder + PDF)",
          "Notifikationer ved download",
        ],
      },
    ];
  }

  return [
    {
      name: "Free",
      priceLabel: "0 kr/mo",
      kicker: "Perfect for quick uploads and simple sharing.",
      features: [
        "Send up to 15 GB per file",
        "3 days of storage",
        "Account required",
      ],
    },
    {
      name: "Pro Light",
      priceLabel: "149 kr/mo",
      kicker: "For people who want to share files more professionally.",
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
      kicker: "For people who work with files every day and want full control.",
      features: [
        "500 GB storage",
        "Fair use traffic",
        "30 days of storage",
        "Download tracking",
        "Preview (images + PDF)",
        "Download notifications",
      ],
    },
  ];
}
