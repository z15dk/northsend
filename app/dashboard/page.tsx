import Link from "next/link";
import { requireUser } from "@/lib/auth";

export default async function DashboardPage() {
  const user = await requireUser();

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <div className="grid gap-6 md:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[2rem] border border-black/5 bg-white p-8 shadow-card">
          <p className="text-sm uppercase tracking-[0.2em] text-pine">Dashboard</p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-ink">
            Welcome{user.name ? `, ${user.name}` : ""}.
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-ink/70">
            Your account is live. The next implementation step is to connect real transfers, storage,
            and plan-based limits directly to this view.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/hero-editor"
              className="inline-flex items-center justify-center rounded-full bg-pine px-5 py-3 text-sm font-medium text-white transition hover:bg-pine/90"
            >
              Hero editor
            </Link>
            <Link
              href="/upload"
              className="inline-flex items-center justify-center rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-medium text-ink transition hover:border-pine/30"
            >
              Upload filer
            </Link>
          </div>
        </div>
        <div className="rounded-[2rem] border border-black/5 bg-sand p-8">
          <p className="text-sm uppercase tracking-[0.2em] text-ink/50">Current account</p>
          <dl className="mt-5 space-y-4 text-sm text-ink/75">
            <div className="flex items-center justify-between border-t border-black/10 pt-4">
              <dt>Email</dt>
              <dd className="font-medium text-ink">{user.email}</dd>
            </div>
            <div className="flex items-center justify-between border-t border-black/10 pt-4">
              <dt>Plan</dt>
              <dd className="font-medium uppercase text-ink">{user.planCode}</dd>
            </div>
            <div className="flex items-center justify-between border-t border-black/10 pt-4">
              <dt>Member since</dt>
              <dd className="font-medium text-ink">
                {new Intl.DateTimeFormat("en-GB", { dateStyle: "medium" }).format(user.createdAt)}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
