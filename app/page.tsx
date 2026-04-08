import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { getLocale, t } from "@/lib/i18n";
import { formatBytes, getPlanDefinition } from "@/lib/plans";
import { SectionTitle } from "@/components/section-title";
import { UploadPreview } from "@/components/upload-preview";

export default async function HomePage() {
  const user = await getCurrentUser();
  const locale = await getLocale();
  const copy = t(locale);
  const plan = getPlanDefinition(user?.planCode);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-20 px-6 py-14 md:py-20">
      <section className="flex min-h-[80vh] flex-col justify-center">
        <div className="mx-auto grid w-full max-w-6xl gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div className="max-w-2xl">
            <div className="inline-flex rounded-full border border-black/5 bg-white/85 px-4 py-2 text-sm text-ink/70">
              {copy.home.badge}
            </div>
            <h1 className="mt-8 text-5xl font-semibold tracking-tight text-ink md:text-7xl">
              {copy.home.title}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-ink/62">
              {copy.home.description}
            </p>
            <div className="mt-8 flex flex-wrap gap-3 text-sm">
              <Link
                href="/upload"
                className="rounded-full bg-pine px-6 py-3 font-medium text-white transition hover:bg-pine/90"
              >
                {copy.home.primaryCta}
              </Link>
              <Link
                href="/signup"
                className="rounded-full border border-black/10 bg-white px-6 py-3 font-medium text-ink transition hover:border-black/20"
              >
                {copy.home.secondaryCta}
              </Link>
            </div>
          </div>
          <div className="lg:pl-4">
            <UploadPreview
              currentPlanName={plan.name}
              currentPlanLimit={formatBytes(plan.uploadLimitBytes)}
              currentRetention={`${plan.retentionHours} hours`}
              locale={locale}
            />
          </div>
        </div>
      </section>

      <section className="pt-4">
        <SectionTitle
          eyebrow={copy.home.limitsEyebrow}
          title={copy.home.limitsTitle}
          description={copy.home.limitsDescription}
        />
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <article className="rounded-[1.75rem] border border-black/5 bg-white/80 p-6 shadow-card">
            <p className="text-xs uppercase tracking-[0.18em] text-ink/45">{copy.plans.guest.name}</p>
            <p className="mt-3 text-3xl font-semibold text-ink">2 GB</p>
            <p className="mt-2 text-sm text-ink/65">{copy.plans.guest.description}</p>
          </article>
          <article className="rounded-[1.75rem] border border-black/5 bg-white/80 p-6 shadow-card">
            <p className="text-xs uppercase tracking-[0.18em] text-ink/45">{copy.plans.free.name}</p>
            <p className="mt-3 text-3xl font-semibold text-ink">10 GB</p>
            <p className="mt-2 text-sm text-ink/65">{copy.plans.free.description}</p>
          </article>
          <article className="rounded-[1.75rem] border border-black/5 bg-white/80 p-6 shadow-card">
            <p className="text-xs uppercase tracking-[0.18em] text-ink/45">{copy.plans.pro.name}</p>
            <p className="mt-3 text-3xl font-semibold text-ink">100 GB</p>
            <p className="mt-2 text-sm text-ink/65">{copy.plans.pro.description}</p>
          </article>
        </div>
      </section>

      <section className="space-y-8 rounded-[2.5rem] border border-black/5 bg-white/75 px-8 py-10 shadow-card">
        <SectionTitle
          eyebrow={copy.home.scrollEyebrow}
          title={copy.home.scrollTitle}
          description={copy.home.scrollDescription}
        />
        <div className="grid gap-5 md:grid-cols-3">
          {copy.home.features.map((feature) => (
            <article key={feature.title} className="rounded-[1.75rem] bg-cloud p-6">
              <h3 className="text-lg font-semibold text-ink">{feature.title}</h3>
              <p className="mt-3 text-sm leading-6 text-ink/70">{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-6 rounded-[2.5rem] bg-pine px-8 py-10 text-white md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-white/60">{copy.home.whiteLabelEyebrow}</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight">{copy.home.whiteLabelTitle}</h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/75">
            {copy.home.whiteLabelDescription}
          </p>
        </div>
        <Link
          href="/settings/branding"
          className="rounded-full bg-white px-6 py-3 text-sm font-medium text-pine transition hover:bg-sand"
        >
          {copy.home.whiteLabelCta}
        </Link>
      </section>
    </div>
  );
}
