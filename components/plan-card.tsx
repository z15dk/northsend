type PlanCardProps = {
  name: string;
  priceLabel: string;
  kicker: string;
  features: string[];
  featured?: boolean;
  ctaLabel: string;
};

export function PlanCard({
  name,
  priceLabel,
  kicker,
  features,
  featured = false,
  ctaLabel,
}: PlanCardProps) {
  return (
    <article
      className={
        featured
          ? "rounded-[2.25rem] border border-pine/20 bg-pine p-7 text-white shadow-[0_24px_80px_rgba(31,73,58,0.22)]"
          : "rounded-[2.25rem] border border-black/5 bg-white/84 p-7 shadow-card"
      }
    >
      <div className="space-y-5">
        <div>
          <p className={featured ? "text-sm uppercase tracking-[0.2em] text-white/58" : "text-sm uppercase tracking-[0.2em] text-ink/45"}>
            {name}
          </p>
          <h3 className={featured ? "mt-2 text-4xl font-semibold text-white" : "mt-2 text-4xl font-semibold text-ink"}>
            {priceLabel}
          </h3>
        </div>
        <p className={featured ? "text-sm leading-6 text-white/76" : "text-sm leading-6 text-ink/70"}>{kicker}</p>
        <ul className="space-y-3 border-t border-black/6 pt-5 text-sm">
          {features.map((feature) => (
            <li
              key={feature}
              className={featured ? "flex items-start gap-3 text-white/90" : "flex items-start gap-3 text-ink/82"}
            >
              <span className={featured ? "mt-1 h-1.5 w-1.5 rounded-full bg-white/80" : "mt-1 h-1.5 w-1.5 rounded-full bg-pine"} />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        <div className="pt-2">
          <div
            className={
              featured
                ? "inline-flex rounded-full bg-white px-5 py-2.5 text-sm font-medium text-pine"
                : "inline-flex rounded-full border border-black/10 bg-cloud/70 px-5 py-2.5 text-sm font-medium text-ink"
            }
          >
            {ctaLabel}
          </div>
        </div>
      </div>
    </article>
  );
}
