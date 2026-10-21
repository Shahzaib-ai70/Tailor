type PageHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function PageHero({ eyebrow, title, description }: PageHeroProps) {
  return (
    <section className="border-b border-[rgba(46,16,101,0.12)] px-5 py-18 sm:px-8 lg:px-12">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <span className="eyebrow">{eyebrow}</span>
        <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr] lg:items-end">
          <h1 className="font-serif text-5xl leading-none tracking-[0.08em] text-[var(--color-ivory)] sm:text-6xl">
            {title}
          </h1>
          <p className="max-w-2xl text-base leading-7 text-[rgba(46,16,101,0.72)] sm:text-lg">
            {description}
          </p>
        </div>
      </div>
    </section>
  );
}

