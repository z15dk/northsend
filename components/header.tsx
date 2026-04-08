import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { HeaderShell } from "@/components/header-shell";
import { LogoutButton } from "@/components/logout-button";
import { getLocale, t } from "@/lib/i18n";

export async function Header() {
  const user = await getCurrentUser();
  const locale = await getLocale();
  const copy = t(locale);
  const navItems = [
    { href: "/pricing", label: copy.nav.pricing },
    { href: "/upload", label: copy.nav.upload },
    { href: "/login", label: copy.nav.login },
  ];

  return (
    <HeaderShell>
      <header className="mx-auto mt-3 max-w-5xl rounded-[1.4rem] border border-black/5 bg-cloud/92 shadow-card backdrop-blur sm:mt-4 sm:rounded-full">
        <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4">
          <Link href="/" className="text-base font-semibold tracking-tight text-ink sm:text-lg">
            {copy.brand}
          </Link>
          <nav className="hidden items-center gap-6 text-sm text-ink/75 sm:flex">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="transition hover:text-ink">
                {item.label}
              </Link>
            ))}
            {user ? (
              <>
                <Link href="/dashboard" className="transition hover:text-ink">
                  {copy.nav.dashboard}
                </Link>
                <LogoutButton label={copy.nav.logout} />
              </>
            ) : (
              <Link
                href="/signup"
                className="rounded-full bg-pine px-4 py-2 font-medium text-white transition hover:bg-pine/90"
              >
                {copy.nav.startFree}
              </Link>
            )}
          </nav>
          <div className="flex items-center gap-2 sm:hidden">
            <Link
              href="/upload"
              className="inline-flex items-center justify-center rounded-full border border-black/8 bg-white/88 px-3 py-2 text-xs font-medium text-ink"
            >
              {copy.nav.upload}
            </Link>
            <Link
              href={user ? "/dashboard" : "/signup"}
              className="inline-flex items-center justify-center rounded-full bg-pine px-3 py-2 text-xs font-medium text-white"
            >
              {user ? copy.nav.dashboard : copy.nav.startFree}
            </Link>
          </div>
        </div>
      </header>
    </HeaderShell>
  );
}
