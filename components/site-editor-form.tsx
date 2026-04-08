"use client";

import { useActionState, useMemo, useState } from "react";
import { saveSiteSettingsAction, type SiteEditorActionState } from "@/app/settings/branding/actions";
import type { SiteSettingsValues } from "@/lib/site-settings";

const initialState: SiteEditorActionState = {};

function SaveButton() {
  return (
    <button
      type="submit"
      className="inline-flex items-center justify-center rounded-full bg-pine px-5 py-3 text-sm font-medium text-white transition hover:bg-pine/90"
    >
      Gem ændringer
    </button>
  );
}

export function SiteEditorForm({ initialValues }: { initialValues: SiteSettingsValues }) {
  const [state, formAction] = useActionState(saveSiteSettingsAction, initialState);
  const [values, setValues] = useState(initialValues);

  const heroStyle = useMemo(
    () => ({
      background: `linear-gradient(135deg, ${values.heroBackgroundFrom}, ${values.heroBackgroundTo})`,
    }),
    [values.heroBackgroundFrom, values.heroBackgroundTo],
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
      <form action={formAction} className="rounded-[2rem] border border-black/5 bg-white p-6 shadow-card sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-pine">CMS</p>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-ink">Hero editor</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-ink/70">
              Her kan du styre hero-tekster, CTA’er og baggrund uden at ændre i koden.
            </p>
          </div>
          <SaveButton />
        </div>

        <div className="mt-8 grid gap-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-ink" htmlFor="heroBadge">
              Badge / eyebrow
            </label>
            <input
              id="heroBadge"
              name="heroBadge"
              value={values.heroBadge}
              onChange={(event) => setValues((current) => ({ ...current, heroBadge: event.target.value }))}
              className="w-full rounded-2xl border border-black/10 bg-cloud px-4 py-3 outline-none transition focus:border-pine"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-ink" htmlFor="heroTitle">
              Headline
            </label>
            <textarea
              id="heroTitle"
              name="heroTitle"
              rows={3}
              value={values.heroTitle}
              onChange={(event) => setValues((current) => ({ ...current, heroTitle: event.target.value }))}
              className="w-full rounded-2xl border border-black/10 bg-cloud px-4 py-3 outline-none transition focus:border-pine"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-ink" htmlFor="heroDescription">
              Beskrivelse
            </label>
            <textarea
              id="heroDescription"
              name="heroDescription"
              rows={4}
              value={values.heroDescription}
              onChange={(event) => setValues((current) => ({ ...current, heroDescription: event.target.value }))}
              className="w-full rounded-2xl border border-black/10 bg-cloud px-4 py-3 outline-none transition focus:border-pine"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-ink" htmlFor="heroTrust">
              Trust-linje
            </label>
            <textarea
              id="heroTrust"
              name="heroTrust"
              rows={2}
              value={values.heroTrust}
              onChange={(event) => setValues((current) => ({ ...current, heroTrust: event.target.value }))}
              className="w-full rounded-2xl border border-black/10 bg-cloud px-4 py-3 outline-none transition focus:border-pine"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-ink" htmlFor="heroPrimaryCtaLabel">
                Primær CTA
              </label>
              <input
                id="heroPrimaryCtaLabel"
                name="heroPrimaryCtaLabel"
                value={values.heroPrimaryCtaLabel}
                onChange={(event) =>
                  setValues((current) => ({ ...current, heroPrimaryCtaLabel: event.target.value }))
                }
                className="w-full rounded-2xl border border-black/10 bg-cloud px-4 py-3 outline-none transition focus:border-pine"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-ink" htmlFor="heroSecondaryCtaLabel">
                Sekundær CTA
              </label>
              <input
                id="heroSecondaryCtaLabel"
                name="heroSecondaryCtaLabel"
                value={values.heroSecondaryCtaLabel}
                onChange={(event) =>
                  setValues((current) => ({ ...current, heroSecondaryCtaLabel: event.target.value }))
                }
                className="w-full rounded-2xl border border-black/10 bg-cloud px-4 py-3 outline-none transition focus:border-pine"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <label className="text-sm font-medium text-ink" htmlFor="heroBackgroundFrom">
                Baggrund fra
              </label>
              <div className="flex items-center gap-3 rounded-2xl border border-black/10 bg-cloud px-4 py-3">
                <input
                  id="heroBackgroundFrom"
                  name="heroBackgroundFrom"
                  type="color"
                  value={values.heroBackgroundFrom}
                  onChange={(event) =>
                    setValues((current) => ({ ...current, heroBackgroundFrom: event.target.value }))
                  }
                  className="h-8 w-10 rounded border-0 bg-transparent p-0"
                />
                <span className="text-sm text-ink/70">{values.heroBackgroundFrom}</span>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-ink" htmlFor="heroBackgroundTo">
                Baggrund til
              </label>
              <div className="flex items-center gap-3 rounded-2xl border border-black/10 bg-cloud px-4 py-3">
                <input
                  id="heroBackgroundTo"
                  name="heroBackgroundTo"
                  type="color"
                  value={values.heroBackgroundTo}
                  onChange={(event) =>
                    setValues((current) => ({ ...current, heroBackgroundTo: event.target.value }))
                  }
                  className="h-8 w-10 rounded border-0 bg-transparent p-0"
                />
                <span className="text-sm text-ink/70">{values.heroBackgroundTo}</span>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-ink" htmlFor="heroGlowColor">
                Glow-farve
              </label>
              <input
                id="heroGlowColor"
                name="heroGlowColor"
                value={values.heroGlowColor}
                onChange={(event) => setValues((current) => ({ ...current, heroGlowColor: event.target.value }))}
                className="w-full rounded-2xl border border-black/10 bg-cloud px-4 py-3 outline-none transition focus:border-pine"
              />
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-black/5 bg-sand/50 p-4 text-sm text-ink/65">
            Fedt at have med senere: baggrundsbillede, hero-video, badges/social proof, og separate mobil-tekster.
          </div>

          {state.error ? <p className="text-sm text-red-700">{state.error}</p> : null}
          {state.success ? <p className="text-sm text-pine">{state.success}</p> : null}
        </div>
      </form>

      <div className="rounded-[2rem] border border-black/5 bg-white p-6 shadow-card sm:p-8">
        <p className="text-sm uppercase tracking-[0.2em] text-pine">Preview</p>
        <div className="mt-6 overflow-hidden rounded-[2rem] shadow-[0_24px_80px_rgba(0,0,0,0.18)]" style={heroStyle}>
          <div
            className="relative min-h-[28rem] p-5 text-white"
            style={{
              backgroundImage: `radial-gradient(circle at 20% 75%, ${values.heroGlowColor}, transparent 22%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.08), transparent 18%)`,
            }}
          >
            <div className="max-w-md pt-24">
              <p className="text-[11px] uppercase tracking-[0.28em] text-white/55">{values.heroBadge}</p>
              <h2 className="mt-4 text-5xl font-semibold tracking-[-0.065em] leading-[0.92]">{values.heroTitle}</h2>
              <p className="mt-4 text-sm leading-7 text-white/68">{values.heroDescription}</p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <div className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-medium text-black">
                  {values.heroPrimaryCtaLabel}
                </div>
                <div className="inline-flex items-center justify-center rounded-full border border-white/16 bg-white/8 px-6 py-3 text-sm font-medium text-white backdrop-blur">
                  {values.heroSecondaryCtaLabel}
                </div>
              </div>
              <p className="mt-6 text-sm leading-6 text-white/46">{values.heroTrust}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
