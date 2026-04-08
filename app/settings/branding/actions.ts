"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
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
  await requireUser();

  const heroBadge = readValue(formData, "heroBadge");
  const heroTitle = readValue(formData, "heroTitle");
  const heroDescription = readValue(formData, "heroDescription");
  const heroTrust = readValue(formData, "heroTrust");
  const heroPrimaryCtaLabel = readValue(formData, "heroPrimaryCtaLabel");
  const heroSecondaryCtaLabel = readValue(formData, "heroSecondaryCtaLabel");
  const heroBackgroundFrom = readValue(formData, "heroBackgroundFrom");
  const heroBackgroundTo = readValue(formData, "heroBackgroundTo");
  const heroGlowColor = readValue(formData, "heroGlowColor");

  if (!heroTitle || !heroDescription || !heroPrimaryCtaLabel || !heroSecondaryCtaLabel) {
    return { error: "Udfyld hero-tekst og begge CTA-felter." };
  }

  await prisma.siteSetting.upsert({
    where: { id: SITE_SETTINGS_ID },
    create: {
      id: SITE_SETTINGS_ID,
      heroBadge,
      heroTitle,
      heroDescription,
      heroTrust,
      heroPrimaryCtaLabel,
      heroSecondaryCtaLabel,
      heroBackgroundFrom,
      heroBackgroundTo,
      heroGlowColor,
    },
    update: {
      heroBadge,
      heroTitle,
      heroDescription,
      heroTrust,
      heroPrimaryCtaLabel,
      heroSecondaryCtaLabel,
      heroBackgroundFrom,
      heroBackgroundTo,
      heroGlowColor,
    },
  });

  revalidatePath("/");
  revalidatePath("/settings/branding");

  return { success: "Hero-sektionen er opdateret." };
}
