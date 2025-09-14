export function SocialProof() {
  return (
    <section className="container max-w-7xl py-16">
      <h2 className="sr-only">Trusted by</h2>
      <div className="flex flex-wrap items-center justify-center gap-12 opacity-75">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="h-8 w-24 rounded bg-muted"
            aria-hidden="true"
          />
        ))}
      </div>
    </section>
  );
}

