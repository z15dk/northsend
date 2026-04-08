import { PlanCard } from "@/components/plan-card";
import { SectionTitle } from "@/components/section-title";
import { getLocale, t } from "@/lib/i18n";
import { getMarketingPlans } from "@/lib/site";

export default async function PricingPage() {
  const locale = await getLocale();
  const copy = t(locale);
  const plans = getMarketingPlans(locale);

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <SectionTitle
        eyebrow={copy.plans.pricingEyebrow}
        title={copy.plans.pricingTitle}
        description={copy.plans.pricingDescription}
      />
      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {plans.map((plan) => (
          <PlanCard
            key={plan.name}
            {...plan}
            ctaLabel={locale === "da" ? "Vælg plan" : "Choose plan"}
          />
        ))}
      </div>
    </div>
  );
}
