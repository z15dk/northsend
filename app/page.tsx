import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { getLocale, t } from "@/lib/i18n";
import { formatBytes, getPlanDefinition } from "@/lib/plans";
import { SectionTitle } from "@/components/section-title";
import { UploadPreview } from "@/components/upload-preview";
import { getMarketingPlans } from "@/lib/site";

export default async function HomePage() {
  const user = await getCurrentUser();
  const locale = await getLocale();
  const copy = t(locale);
  const plan = getPlanDefinition(user?.planCode ?? "free");
  const plans = getMarketingPlans(locale);

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-24 px-4 py-6 sm:px-6 md:py-10">
      <section className="flex min-h-[88vh] flex-col justify-center">
        <div className="grid gap-8 lg:grid-cols-[1.12fr_0.88fr] lg:items-center">
          <div className="order-1">
            <div className="relative overflow-hidden rounded-[2rem] border border-black/6 bg-white/82 p-2 shadow-[0_24px_80px_rgba(31,39,34,0.12)] backdrop-blur sm:rounded-[2.6rem] sm:p-3">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(223,233,228,0.9),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(239,228,213,0.9),transparent_32%)]" />
              <div className="relative">
                <UploadPreview
                  currentPlanName={plan.name}
                  currentPlanLimit={formatBytes(plan.uploadLimitBytes)}
                  currentRetention={`${plan.retentionHours} hours`}
                  locale={locale}
                  requiresAccount={!user}
                />
              </div>
            </div>
          </div>

          <div className="order-2 mx-auto max-w-xl lg:pl-6 xl:pl-10">
            <div className="inline-flex rounded-full border border-black/6 bg-white/82 px-4 py-2 text-sm text-ink/68 shadow-sm backdrop-blur">
              {copy.home.badge}
            </div>
            <h1 className="mt-6 max-w-[11ch] text-4xl font-semibold tracking-[-0.05em] text-ink sm:text-5xl lg:text-6xl xl:text-[4.1rem] xl:leading-[0.95]">
              {copy.home.title}
            </h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-ink/64 sm:text-lg sm:leading-8">
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
                className="rounded-full border border-black/10 bg-white/88 px-6 py-3 font-medium text-ink transition hover:border-black/20"
              >
                {copy.home.secondaryCta}
              </Link>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {plans.map((marketingPlan) => (
                <div
                  key={marketingPlan.name}
                  className={
                    marketingPlan.featured
                      ? "rounded-[1.5rem] border border-pine/18 bg-pine px-4 py-4 text-white"
                      : "rounded-[1.5rem] border border-black/5 bg-white/74 px-4 py-4"
                  }
                >
                  <p
                    className={
                      marketingPlan.featured
                        ? "text-[11px] uppercase tracking-[0.22em] text-white/60"
                        : "text-[11px] uppercase tracking-[0.22em] text-ink/42"
                    }
                  >
                    {marketingPlan.name}
                  </p>
                  <p className={marketingPlan.featured ? "mt-2 text-2xl font-semibold text-white" : "mt-2 text-2xl font-semibold text-ink"}>
                    {marketingPlan.priceLabel}
                  </p>
                  <p className={marketingPlan.featured ? "mt-2 text-sm leading-6 text-white/72" : "mt-2 text-sm leading-6 text-ink/60"}>
                    {marketingPlan.features[0]}
                  </p>
                </div>
              ))}
            </div>

            <p className="mt-8 text-sm text-ink/56">
              {copy.home.trust}
            </p>
            <p className="mt-4 text-xs uppercase tracking-[0.24em] text-ink/42">
              {copy.home.fomo}
            </p>
          </div>
        </div>
      </section>

      <section className="pt-2">
        <SectionTitle
          eyebrow={copy.home.limitsEyebrow}
          title={copy.home.limitsTitle}
          description={copy.home.limitsDescription}
        />
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {plans.map((marketingPlan) => (
            <article
              key={marketingPlan.name}
              className={
                marketingPlan.featured
                  ? "rounded-[2rem] border border-pine/20 bg-pine p-7 text-white shadow-card"
                  : "rounded-[2rem] border border-black/5 bg-white/82 p-7 shadow-card"
              }
            >
              <p
                className={
                  marketingPlan.featured
                    ? "text-xs uppercase tracking-[0.18em] text-white/55"
                    : "text-xs uppercase tracking-[0.18em] text-ink/45"
                }
              >
                {marketingPlan.name}
              </p>
              <p className={marketingPlan.featured ? "mt-3 text-3xl font-semibold text-white" : "mt-3 text-3xl font-semibold text-ink"}>
                {marketingPlan.priceLabel}
              </p>
              <p className={marketingPlan.featured ? "mt-2 text-sm text-white/74" : "mt-2 text-sm text-ink/65"}>
                {marketingPlan.kicker}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-8 rounded-[2.8rem] border border-black/5 bg-white/76 px-8 py-10 shadow-card md:px-10 md:py-12">
        <SectionTitle
          eyebrow={copy.home.scrollEyebrow}
          title={copy.home.scrollTitle}
          description={copy.home.scrollDescription}
        />
        <div className="grid gap-5 md:grid-cols-3">
          {copy.home.features.map((feature) => (
            <article key={feature.title} className="rounded-[1.8rem] border border-black/4 bg-cloud/88 p-6">
              <h3 className="text-lg font-semibold text-ink">{feature.title}</h3>
              <p className="mt-3 text-sm leading-6 text-ink/70">{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-6 rounded-[2.8rem] bg-pine px-8 py-10 text-white shadow-[0_24px_80px_rgba(31,73,58,0.22)] md:grid-cols-[1fr_auto] md:items-center md:px-10 md:py-12">
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

      <section className="rounded-[2.8rem] border border-black/5 bg-white/82 px-8 py-10 shadow-card md:px-10 md:py-12">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.2em] text-pine">
            {locale === "da" ? "Klar til at starte" : "Ready to start"}
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink md:text-4xl">
            {copy.home.bottomCtaTitle}
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-ink/70">
            {copy.home.bottomCtaDescription}
          </p>
          <div className="mt-8">
            <Link
              href="/upload"
              className="inline-flex rounded-full bg-pine px-6 py-3 text-sm font-medium text-white transition hover:bg-pine/90"
            >
              {copy.home.bottomCtaButton}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
