// Was previously driven by a seeded-random number generator dressed up to
// look like real traffic. There's no real visitor data to show until this
// site is actually deployed and wired to a real analytics provider — so
// this stays an honest placeholder instead, matching the same
// `.banner-placeholder` treatment already used for the "coming later" banner
// in HeroSection, rather than inventing numbers to fill the space.
export default function VisitorPulse() {
  return (
    <div className="overflow-hidden rounded-lg ring-1 ring-rule">
      <div className="banner-placeholder flex h-32 w-full flex-col items-center justify-center gap-1.5 text-center">
        <p className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-text-dim">
          People who&apos;ve stopped by
        </p>
        <p className="max-w-[26ch] text-[0.8rem] text-text-muted">
          Real visitor analytics will show up here once this site is live.
        </p>
      </div>
    </div>
  );
}
