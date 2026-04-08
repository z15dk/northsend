"use client";

import { useActionState } from "react";
import { loginAction, type AuthActionState } from "@/app/login/actions";
import { AuthSubmitButton } from "@/components/auth-submit-button";
import type { Locale } from "@/lib/copy";

const initialState: AuthActionState = {};

export function LoginForm({
  locale,
  labels,
}: {
  locale: Locale;
  labels: {
    email: string;
    password: string;
    submit: string;
    pending: string;
  };
}) {
  const [state, formAction] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="mt-8 space-y-4">
      <input type="hidden" name="locale" value={locale} />
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
          autoComplete="current-password"
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
