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
      <header className="mx-auto mt-4 max-w-5xl rounded-full border border-black/5 bg-cloud/90 shadow-card backdrop-blur">
        <div className="flex items-center justify-between px-6 py-4">
          <Link href="/" className="text-lg font-semibold tracking-tight text-ink">
            {copy.brand}
          </Link>
          <nav className="flex items-center gap-6 text-sm text-ink/75">
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
        </div>
      </header>
    </HeaderShell>
  );
}
