export default function BillingPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <div className="rounded-[2rem] border border-black/5 bg-white p-8 shadow-card">
        <p className="text-sm uppercase tracking-[0.2em] text-pine">Billing</p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-ink">Monthly subscriptions</h1>
        <p className="mt-3 text-sm leading-6 text-ink/70">
          Stripe checkout and billing portal will live here. The first paid plan targets 99 kr per month
          for 100 GB transfers and white-label access.
        </p>
      </div>
    </div>
  );
}
