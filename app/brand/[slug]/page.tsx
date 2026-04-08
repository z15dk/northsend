type BrandPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function BrandHostedPage({ params }: BrandPageProps) {
  const { slug } = await params;

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <div className="rounded-[2.5rem] bg-pine p-10 text-white shadow-card">
        <p className="text-sm uppercase tracking-[0.2em] text-white/60">Hosted brand page</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight">{slug}</h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-white/75">
          This route is reserved for each paying customer&apos;s branded upload experience. We will later
          load the customer&apos;s saved logo, colors, and copy from the database.
        </p>
      </div>
    </div>
  );
}
