import { PlanCard } from "@/components/plan-card";
import { SectionTitle } from "@/components/section-title";
import { getLocale, t } from "@/lib/i18n";
import { planSummaries } from "@/lib/site";

export default async function PricingPage() {
  const locale = await getLocale();
  const copy = t(locale);

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <SectionTitle
        eyebrow={copy.plans.pricingEyebrow}
        title={copy.plans.pricingTitle}
        description={copy.plans.pricingDescription}
      />
      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {planSummaries.map((plan) => (
          <PlanCard
            key={plan.name}
            {...plan}
            perTransferLabel={copy.plans.perTransfer}
            retentionLabel={copy.plans.retention}
          />
        ))}
      </div>
    </div>
  );
}
