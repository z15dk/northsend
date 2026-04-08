export default function BrandingSettingsPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[2rem] border border-black/5 bg-white p-8 shadow-card">
          <p className="text-sm uppercase tracking-[0.2em] text-pine">Branding</p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-ink">White-label settings</h1>
          <p className="mt-3 text-sm leading-6 text-ink/70">
            Paid customers will configure logo, colors, and brand copy here before publishing a hosted
            upload page or embed widget.
          </p>
        </div>
        <div className="rounded-[2rem] border border-black/5 bg-pine p-8 text-white shadow-card">
          <p className="text-sm uppercase tracking-[0.2em] text-white/60">Preview</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight">Acme Studio Uploads</h2>
          <p className="mt-3 text-sm leading-6 text-white/75">
            Share campaign files with clients through a branded upload flow that still runs on the same
            secure transfer engine underneath.
          </p>
        </div>
      </div>
    </div>
  );
}
