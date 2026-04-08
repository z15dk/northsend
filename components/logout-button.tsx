export function LogoutButton({ label }: { label: string }) {
  return (
    <form action="/logout" method="post">
      <button
        type="submit"
        className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium text-ink transition hover:border-black/20"
      >
        {label}
      </button>
    </form>
  );
}
