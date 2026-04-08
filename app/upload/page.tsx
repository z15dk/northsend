import Link from "next/link";
import { UploadForm } from "@/components/upload-form";
import { getCurrentUser } from "@/lib/auth";
import { getLocale, t } from "@/lib/i18n";
import { formatBytes, getPlanDefinition } from "@/lib/plans";

export default async function UploadPage() {
  const user = await getCurrentUser();
  const locale = await getLocale();
  const copy = t(locale);
  const plan = getPlanDefinition(user?.planCode ?? "free");
  const title = user
    ? copy.uploadPage.title
    : locale === "da"
      ? "Upload dine filer eller opret en gratis konto"
      : "Upload your files or create a free account";
  const description = user
    ? copy.uploadPage.description
    : locale === "da"
      ? "Gratis konto giver op til 15 GB pr. fil og 3 dages lagring."
      : "A free account gives you up to 15 GB per file and 3 days of storage.";

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="mb-8 max-w-2xl space-y-3 sm:mb-10 sm:space-y-4">
        <p className="text-xs uppercase tracking-[0.2em] text-pine sm:text-sm">{copy.uploadPage.eyebrow}</p>
        <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">{title}</h1>
        <p className="text-base leading-7 text-ink/70">{description}</p>
      </div>
      <div className="space-y-5">
        <UploadForm
          currentPlanName={plan.name}
          currentPlanLimit={formatBytes(plan.uploadLimitBytes)}
          currentRetention={`${plan.retentionHours} hours`}
          locale={locale}
          requiresAccount={!user}
        />
        {!user ? (
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center rounded-full bg-pine px-5 py-3 text-sm font-medium text-white"
            >
              {copy.uploadPage.createFreeAccount}
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-medium text-ink"
            >
              {locale === "da" ? "Log ind" : "Login"}
            </Link>
          </div>
        ) : null}
      </div>
    </div>
  );
}
