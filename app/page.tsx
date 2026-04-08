import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { SectionTitle } from "@/components/section-title";
import { UploadPreview } from "@/components/upload-preview";
import { getLocale, t } from "@/lib/i18n";
import { formatBytes, getPlanDefinition } from "@/lib/plans";
import { getSiteSettings } from "@/lib/site-settings";
import { getMarketingPlans } from "@/lib/site";

export default async function HomePage() {
  const user = await getCurrentUser();
  const locale = await getLocale();
  const copy = t(locale);
  const plan = getPlanDefinition(user?.planCode ?? "free");
  const plans = getMarketingPlans(locale);
  const siteSettings = await getSiteSettings(locale);

  return (
    <div className="bg-[#090909]">
      <section className="min-h-screen">
        <div
          className="relative min-h-screen overflow-hidden shadow-[0_30px_120px_rgba(0,0,0,0.45)]"
          style={{
            background: `linear-gradient(135deg, ${siteSettings.heroBackgroundFrom}, ${siteSettings.heroBackgroundTo})`,
          }}
        >
          {siteSettings.heroVideoUrl ? (
            <video
              className="absolute inset-0 h-full w-full object-cover opacity-30"
              src={siteSettings.heroVideoUrl}
              autoPlay
              muted
              loop
              playsInline
            />
          ) : null}
          {siteSettings.heroBackgroundImage ? (
            <div
              className="pointer-events-none absolute inset-0 opacity-28"
              style={{
                backgroundImage: `url(${siteSettings.heroBackgroundImage})`,
                backgroundPosition: "center",
                backgroundSize: "cover",
              }}
            />
          ) : null}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 20% 75%, ${siteSettings.heroGlowColor}, transparent 20%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.08), transparent 18%)`,
            }}
          />

          <div className="mx-auto flex w-full max-w-[1720px] items-start justify-between gap-4 p-4 sm:p-6">
            <Link
              href="/"
              className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/14 bg-[#0f1720] text-sm font-semibold tracking-[-0.04em] text-white shadow-[0_10px_30px_rgba(0,0,0,0.35)]"
            >
              NS
            </Link>

            <div className="hidden items-center gap-2 lg:flex">
              <div className="flex items-center gap-1 rounded-full bg-white px-2 py-2 text-sm text-black shadow-[0_12px_28px_rgba(255,255,255,0.12)]">
                <Link href="/pricing" className="rounded-full px-4 py-2 transition hover:bg-black/5">
                  {copy.nav.pricing}
                </Link>
                <Link href="/upload" className="rounded-full px-4 py-2 transition hover:bg-black/5">
                  {copy.nav.upload}
                </Link>
                <Link href="/pricing" className="rounded-full px-4 py-2 transition hover:bg-black/5">
                  {locale === "da" ? "Løsninger" : "Solutions"}
                </Link>
                <Link href="/settings/branding" className="rounded-full px-4 py-2 transition hover:bg-black/5">
                  {locale === "da" ? "Branding" : "Branding"}
                </Link>
              </div>
              <Link
                href="/login"
                className="rounded-full bg-white px-5 py-3 text-sm font-medium text-black shadow-[0_12px_28px_rgba(255,255,255,0.12)]"
              >
                {copy.nav.login}
              </Link>
              <Link
                href={user ? "/dashboard" : "/signup"}
                className="rounded-full bg-white px-5 py-3 text-sm font-medium text-black shadow-[0_12px_28px_rgba(255,255,255,0.12)]"
              >
                {user ? copy.nav.dashboard : copy.nav.startFree}
              </Link>
            </div>

            <div className="flex items-center gap-2 lg:hidden">
              <Link
                href="/login"
                className="rounded-full bg-white px-4 py-2.5 text-xs font-medium text-black"
              >
                {copy.nav.login}
              </Link>
              <Link
                href={user ? "/dashboard" : "/signup"}
                className="rounded-full bg-white px-4 py-2.5 text-xs font-medium text-black"
              >
                {user ? copy.nav.dashboard : copy.nav.startFree}
              </Link>
            </div>
          </div>

          <div className="mx-auto flex min-h-[calc(100vh-7rem)] w-full max-w-[1720px] flex-col justify-start p-4 pt-6 sm:p-6 sm:pt-10 lg:min-h-[calc(100vh-9rem)] lg:justify-end lg:p-10">
            <div className="grid items-end gap-8 xl:grid-cols-[420px_1fr] xl:gap-14">
              <div className="order-1 w-full max-w-[26rem] xl:order-1">
                <UploadPreview
                  currentPlanName={plan.name}
                  currentPlanLimit={formatBytes(plan.uploadLimitBytes)}
                  currentRetention={`${plan.retentionHours} hours`}
                  locale={locale}
                  requiresAccount={!user}
                />
              </div>

              <div className="order-2 flex flex-col justify-end xl:order-2">
                <div className="max-w-2xl xl:ml-auto xl:max-w-[34rem]">
                  <p className="text-[11px] uppercase tracking-[0.28em] text-white/55 sm:text-xs">
                    {siteSettings.heroBadge}
                  </p>
                  <h1 className="mt-4 hidden max-w-[11ch] text-4xl font-semibold tracking-[-0.065em] text-white sm:block sm:text-6xl xl:text-[5.4rem] xl:leading-[0.92]">
                    {siteSettings.heroTitle}
                  </h1>
                  <h1 className="mt-4 max-w-[12ch] text-4xl font-semibold tracking-[-0.065em] text-white sm:hidden">
                    {siteSettings.heroMobileTitle}
                  </h1>
                  <p className="mt-4 hidden max-w-xl text-sm leading-7 text-white/68 sm:block sm:text-base">
                    {siteSettings.heroDescription}
                  </p>
                  <p className="mt-4 max-w-xl text-sm leading-7 text-white/68 sm:hidden">
                    {siteSettings.heroMobileDescription}
                  </p>

                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <Link
                      href="/upload"
                      className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-medium text-black"
                    >
                      {siteSettings.heroPrimaryCtaLabel}
                    </Link>
                    <Link
                      href="/signup"
                      className="inline-flex items-center justify-center rounded-full border border-white/16 bg-white/8 px-6 py-3 text-sm font-medium text-white backdrop-blur"
                    >
                      {siteSettings.heroSecondaryCtaLabel}
                    </Link>
                  </div>

                  <p className="mt-6 max-w-lg text-sm leading-6 text-white/46">
                    {siteSettings.heroTrust}
                  </p>
                  <p className="mt-3 max-w-lg text-sm leading-6 text-white/32">
                    {siteSettings.heroSocialProof}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="bg-[#f4efe7]">
        <div className="mx-auto flex max-w-7xl flex-col gap-14 px-4 py-10 sm:px-6 sm:py-14 md:gap-20 md:py-20">
          <section>
            <SectionTitle
              eyebrow={copy.home.limitsEyebrow}
              title={copy.home.limitsTitle}
              description={copy.home.limitsDescription}
            />
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {plans.map((marketingPlan) => (
                <article
                  key={marketingPlan.name}
                  className={
                    marketingPlan.featured
                      ? "rounded-[2rem] border border-pine/20 bg-pine p-6 text-white shadow-[0_24px_70px_rgba(31,73,58,0.18)]"
                      : "rounded-[2rem] border border-black/5 bg-white/84 p-6 shadow-card"
                  }
                >
                  <p
                    className={
                      marketingPlan.featured
                        ? "text-xs uppercase tracking-[0.18em] text-white/58"
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

          <section className="space-y-8 rounded-[2.4rem] border border-black/5 bg-white/82 px-6 py-8 shadow-card md:px-10 md:py-12">
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

          <section className="grid gap-6 rounded-[2.4rem] bg-pine px-6 py-8 text-white shadow-[0_24px_80px_rgba(31,73,58,0.22)] md:grid-cols-[1fr_auto] md:items-center md:px-10 md:py-12">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-white/60">{copy.home.whiteLabelEyebrow}</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight">{copy.home.whiteLabelTitle}</h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/75">
                {copy.home.whiteLabelDescription}
              </p>
            </div>
            <Link
              href="/settings/branding"
              className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-medium text-pine transition hover:bg-sand"
            >
              {copy.home.whiteLabelCta}
            </Link>
          </section>

          <section className="rounded-[2.4rem] border border-black/5 bg-white/84 px-6 py-8 shadow-card md:px-10 md:py-12">
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
      </div>
    </div>
  );
}
