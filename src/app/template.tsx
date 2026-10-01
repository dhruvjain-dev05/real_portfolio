// A template re-mounts on every navigation, so each page settles in with a
// short fade. It's plain CSS (globals.css: .page-in) — no JS, and the content
// is fully visible once the animation ends, or if it never runs.
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-in flex flex-1 flex-col">{children}</div>;
}
