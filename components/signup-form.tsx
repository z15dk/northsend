"use client";

import { useActionState } from "react";
import { signupAction, type AuthActionState } from "@/app/signup/actions";
import { AuthSubmitButton } from "@/components/auth-submit-button";
import type { Locale } from "@/lib/copy";

const initialState: AuthActionState = {};

export function SignupForm({
  locale,
  labels,
}: {
  locale: Locale;
  labels: {
    name: string;
    email: string;
    password: string;
    submit: string;
    pending: string;
  };
}) {
  const [state, formAction] = useActionState(signupAction, initialState);

  return (
    <form action={formAction} className="mt-8 space-y-4">
      <input type="hidden" name="locale" value={locale} />
      <div className="space-y-2">
        <label className="text-sm font-medium text-ink" htmlFor="name">
          {labels.name}
        </label>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          className="w-full rounded-2xl border border-black/10 bg-cloud px-4 py-3 outline-none transition focus:border-pine"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-ink" htmlFor="email">
          {labels.email}
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="w-full rounded-2xl border border-black/10 bg-cloud px-4 py-3 outline-none transition focus:border-pine"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-ink" htmlFor="password">
          {labels.password}
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          className="w-full rounded-2xl border border-black/10 bg-cloud px-4 py-3 outline-none transition focus:border-pine"
        />
      </div>
      {state.error ? <p className="text-sm text-red-700">{state.error}</p> : null}
      <AuthSubmitButton label={labels.submit} pendingLabel={labels.pending} />
    </form>
  );
}
