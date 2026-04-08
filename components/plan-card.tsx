type PlanCardProps = {
  name: string;
  price: string;
  uploadLimit: string;
  retention: string;
  highlight: string;
  perTransferLabel: string;
  retentionLabel: string;
};

export function PlanCard({
  name,
  price,
  uploadLimit,
  retention,
  highlight,
  perTransferLabel,
  retentionLabel,
}: PlanCardProps) {
  return (
    <article className="rounded-[2rem] border border-black/5 bg-white p-6 shadow-card">
      <div className="space-y-4">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-ink/45">{name}</p>
          <h3 className="mt-2 text-3xl font-semibold text-ink">{price}</h3>
        </div>
        <p className="text-sm leading-6 text-ink/70">{highlight}</p>
        <dl className="space-y-3 text-sm text-ink/80">
          <div className="flex items-center justify-between border-t border-black/5 pt-3">
            <dt>{perTransferLabel}</dt>
            <dd className="font-medium">{uploadLimit}</dd>
          </div>
          <div className="flex items-center justify-between border-t border-black/5 pt-3">
            <dt>{retentionLabel}</dt>
            <dd className="font-medium">{retention}</dd>
          </div>
        </dl>
      </div>
    </article>
  );
}
