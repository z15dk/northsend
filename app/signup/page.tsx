import Link from "next/link";
import { SignupForm } from "@/components/signup-form";
import { getLocale, t } from "@/lib/i18n";

export default async function SignupPage() {
  const locale = await getLocale();
  const copy = t(locale);

  return (
    <div className="mx-auto max-w-md px-6 py-16">
      <div className="rounded-[2rem] border border-black/5 bg-white p-8 shadow-card">
        <p className="text-sm uppercase tracking-[0.2em] text-pine">{copy.signup.eyebrow}</p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-ink">{copy.signup.title}</h1>
        <p className="mt-3 text-sm leading-6 text-ink/70">{copy.signup.description}</p>
        <SignupForm
          locale={locale}
          labels={{
            name: copy.signup.name,
            email: copy.signup.email,
            password: copy.signup.password,
            submit: copy.signup.submit,
            pending: copy.signup.pending,
          }}
        />
        <p className="mt-6 text-sm text-ink/65">
          {copy.signup.haveAccount}{" "}
          <Link href="/login" className="font-medium text-pine">
            {copy.signup.login}
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
