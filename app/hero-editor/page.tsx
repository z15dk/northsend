import { SiteEditorForm } from "@/components/site-editor-form";
import { getLocale } from "@/lib/i18n";
import { getSiteSettings } from "@/lib/site-settings";

export default async function HeroEditorPage() {
  const locale = await getLocale();
  const siteSettings = await getSiteSettings(locale);

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <SiteEditorForm initialValues={siteSettings} />
    </div>
  );
}
