import { getLocale, t } from "@/lib/i18n";

export async function Footer() {
  const locale = await getLocale();
  const copy = t(locale);

  return (
    <footer className="border-t border-black/5">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-8 text-sm text-ink/65 md:flex-row md:items-center md:justify-between">
        <p>{copy.footer.line1}</p>
        <p>{copy.footer.line2}</p>
      </div>
    </footer>
  );
}
