const features = [
  {
    title: "Lead-friendly onboarding",
    description: "Guests can try the upload flow, but signup unlocks larger transfers and longer retention.",
  },
  {
    title: "Business-ready upgrade path",
    description: "Paid plans open 100 GB transfers, longer storage windows, and branded delivery.",
  },
  {
    title: "White-label by design",
    description: "Use hosted branded pages and an embeddable upload widget on the customer's own site.",
  },
];

export function FeatureGrid() {
  return (
    <div className="grid gap-5 md:grid-cols-3">
      {features.map((feature) => (
        <article key={feature.title} className="rounded-[2rem] border border-black/5 bg-white p-6">
          <h3 className="text-lg font-semibold text-ink">{feature.title}</h3>
          <p className="mt-3 text-sm leading-6 text-ink/70">{feature.description}</p>
        </article>
      ))}
    </div>
  );
}
