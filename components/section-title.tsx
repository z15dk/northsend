type SectionTitleProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function SectionTitle({ eyebrow, title, description }: SectionTitleProps) {
  return (
    <div className="max-w-2xl space-y-3">
      <p className="text-sm font-medium uppercase tracking-[0.2em] text-pine">{eyebrow}</p>
      <h2 className="text-3xl font-semibold tracking-tight text-ink md:text-4xl">{title}</h2>
      <p className="text-base leading-7 text-ink/70">{description}</p>
    </div>
  );
}
