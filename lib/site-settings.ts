import { cache } from "react";
import { prisma } from "@/lib/prisma";
import type { Locale } from "@/lib/i18n";

export const SITE_SETTINGS_ID = "global";

export type SiteSettingsValues = {
  heroBadge: string;
  heroTitle: string;
  heroMobileTitle: string;
  heroDescription: string;
  heroMobileDescription: string;
  heroTrust: string;
  heroSocialProof: string;
  heroPrimaryCtaLabel: string;
  heroSecondaryCtaLabel: string;
  heroBackgroundFrom: string;
  heroBackgroundTo: string;
  heroGlowColor: string;
  heroBackgroundImage: string;
  heroVideoUrl: string;
};

export function getDefaultSiteSettings(locale: Locale): SiteSettingsValues {
  if (locale === "da") {
    return {
      heroBadge: "Store filoverførsler til moderne teams",
      heroTitle: "Stop med at gætte om dine filer bliver set",
      heroMobileTitle: "Stop med at gætte om dine filer bliver set",
      heroDescription:
        "Upload og del dine filer på få sekunder, og se præcis hvem der åbner og downloader dem.",
      heroMobileDescription:
        "Upload og del dine filer på få sekunder, og se præcis hvem der åbner og downloader dem.",
      heroTrust: "Brugt af creators, bureauer og teams der arbejder med store filer",
      heroSocialProof: "Creators • Bureauer • Produktionsteams",
      heroPrimaryCtaLabel: "Upload filer",
      heroSecondaryCtaLabel: "Opret gratis konto",
      heroBackgroundFrom: "#050505",
      heroBackgroundTo: "#101514",
      heroGlowColor: "rgba(22,76,58,0.34)",
      heroBackgroundImage: "",
      heroVideoUrl: "",
    };
  }

  return {
    heroBadge: "Large file transfers for modern teams",
    heroTitle: "Stop guessing whether your files were actually seen",
    heroMobileTitle: "Stop guessing whether your files were actually seen",
    heroDescription:
      "Upload and share files in seconds, then see exactly who opens and downloads them.",
    heroMobileDescription:
      "Upload and share files in seconds, then see exactly who opens and downloads them.",
    heroTrust: "Used by creators, agencies, and teams working with large files every day",
    heroSocialProof: "Creators • Agencies • Production teams",
    heroPrimaryCtaLabel: "Upload files",
    heroSecondaryCtaLabel: "Create free account",
    heroBackgroundFrom: "#050505",
    heroBackgroundTo: "#101514",
    heroGlowColor: "rgba(22,76,58,0.34)",
    heroBackgroundImage: "",
    heroVideoUrl: "",
  };
}

export const getSiteSettings = cache(async (locale: Locale) => {
  const defaults = getDefaultSiteSettings(locale);

  const settings = await prisma.siteSetting.findUnique({
    where: { id: SITE_SETTINGS_ID },
  });

  if (!settings) {
    return defaults;
  }

  return {
    heroBadge: settings.heroBadge || defaults.heroBadge,
    heroTitle: settings.heroTitle || defaults.heroTitle,
    heroMobileTitle: settings.heroMobileTitle || defaults.heroMobileTitle,
    heroDescription: settings.heroDescription || defaults.heroDescription,
    heroMobileDescription: settings.heroMobileDescription || defaults.heroMobileDescription,
    heroTrust: settings.heroTrust || defaults.heroTrust,
    heroSocialProof: settings.heroSocialProof || defaults.heroSocialProof,
    heroPrimaryCtaLabel: settings.heroPrimaryCtaLabel || defaults.heroPrimaryCtaLabel,
    heroSecondaryCtaLabel: settings.heroSecondaryCtaLabel || defaults.heroSecondaryCtaLabel,
    heroBackgroundFrom: settings.heroBackgroundFrom || defaults.heroBackgroundFrom,
    heroBackgroundTo: settings.heroBackgroundTo || defaults.heroBackgroundTo,
    heroGlowColor: settings.heroGlowColor || defaults.heroGlowColor,
    heroBackgroundImage: settings.heroBackgroundImage || defaults.heroBackgroundImage,
    heroVideoUrl: settings.heroVideoUrl || defaults.heroVideoUrl,
  } satisfies SiteSettingsValues;
});
