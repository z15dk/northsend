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

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <div className="mb-10 max-w-2xl space-y-4">
        <p className="text-sm uppercase tracking-[0.2em] text-pine">{copy.uploadPage.eyebrow}</p>
        <h1 className="text-4xl font-semibold tracking-tight text-ink">{copy.uploadPage.title}</h1>
        <p className="text-base leading-7 text-ink/70">{copy.uploadPage.description}</p>
      </div>
      <UploadForm
        currentPlanName={plan.name}
        currentPlanLimit={formatBytes(plan.uploadLimitBytes)}
        currentRetention={`${plan.retentionHours} hours`}
        locale={locale}
        requiresAccount={!user}
      />
      <div className="mt-6 flex flex-wrap gap-3 text-sm">
        <Link href="/signup" className="rounded-full bg-pine px-5 py-3 font-medium text-white">
          {copy.uploadPage.createFreeAccount}
        </Link>
        <Link href="/pricing" className="rounded-full border border-black/10 bg-white px-5 py-3 font-medium text-ink">
          {copy.uploadPage.comparePlans}
        </Link>
      </div>
    </div>
  );
}
