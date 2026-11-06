export function PageHero({
  kicker,
  title,
  subtitle,
}: {
  kicker?: string;
  title: string;
  subtitle: string;
}) {
  return (
    <header className="page-hero">
      {kicker ? (
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/75">
          {kicker}
        </p>
      ) : null}
      <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
        {title}
      </h1>
      <p className="mt-1 max-w-xl text-sm text-white/85">{subtitle}</p>
    </header>
  );
}
