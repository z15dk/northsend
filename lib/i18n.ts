import { headers } from "next/headers";
import { copy, type Locale } from "@/lib/copy";

export type { Locale } from "@/lib/copy";

export async function getLocale(): Promise<Locale> {
  const headerStore = await headers();
  const acceptLanguage = headerStore.get("accept-language")?.toLowerCase() ?? "";

  if (acceptLanguage.includes("da")) {
    return "da";
  }

  return "en";
}

export function t(locale: Locale) {
  return copy[locale];
}
