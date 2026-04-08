"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { SITE_SETTINGS_ID } from "@/lib/site-settings";

export type SiteEditorActionState = {
  success?: string;
  error?: string;
};

function readValue(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

export async function saveSiteSettingsAction(
  _: SiteEditorActionState,
  formData: FormData,
): Promise<SiteEditorActionState> {
  const heroBadge = readValue(formData, "heroBadge");
  const heroTitle = readValue(formData, "heroTitle");
  const heroMobileTitle = readValue(formData, "heroMobileTitle");
  const heroDescription = readValue(formData, "heroDescription");
  const heroMobileDescription = readValue(formData, "heroMobileDescription");
  const heroTrust = readValue(formData, "heroTrust");
  const heroSocialProof = readValue(formData, "heroSocialProof");
  const heroPrimaryCtaLabel = readValue(formData, "heroPrimaryCtaLabel");
  const heroSecondaryCtaLabel = readValue(formData, "heroSecondaryCtaLabel");
  const heroBackgroundFrom = readValue(formData, "heroBackgroundFrom");
  const heroBackgroundTo = readValue(formData, "heroBackgroundTo");
  const heroGlowColor = readValue(formData, "heroGlowColor");
  const heroBackgroundImage = readValue(formData, "heroBackgroundImage");
  const heroVideoUrl = readValue(formData, "heroVideoUrl");

  if (!heroTitle || !heroDescription || !heroPrimaryCtaLabel || !heroSecondaryCtaLabel) {
    return { error: "Udfyld hero-tekst og begge CTA-felter." };
  }

  await prisma.siteSetting.upsert({
    where: { id: SITE_SETTINGS_ID },
    create: {
      id: SITE_SETTINGS_ID,
      heroBadge,
      heroTitle,
      heroMobileTitle,
      heroDescription,
      heroMobileDescription,
      heroTrust,
      heroSocialProof,
      heroPrimaryCtaLabel,
      heroSecondaryCtaLabel,
      heroBackgroundFrom,
      heroBackgroundTo,
      heroGlowColor,
      heroBackgroundImage,
      heroVideoUrl,
    },
    update: {
      heroBadge,
      heroTitle,
      heroMobileTitle,
      heroDescription,
      heroMobileDescription,
      heroTrust,
      heroSocialProof,
      heroPrimaryCtaLabel,
      heroSecondaryCtaLabel,
      heroBackgroundFrom,
      heroBackgroundTo,
      heroGlowColor,
      heroBackgroundImage,
      heroVideoUrl,
    },
  });

  revalidatePath("/");
  revalidatePath("/hero-editor");
  revalidatePath("/settings/branding");

  return { success: "Hero-sektionen er opdateret." };
}
