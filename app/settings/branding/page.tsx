import { SiteEditorForm } from "@/components/site-editor-form";
import { requireUser } from "@/lib/auth";
import { getLocale } from "@/lib/i18n";
import { getSiteSettings } from "@/lib/site-settings";

export default async function BrandingSettingsPage() {
  await requireUser();
  const locale = await getLocale();
  const siteSettings = await getSiteSettings(locale);

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <SiteEditorForm initialValues={siteSettings} />
    </div>
  );
}
