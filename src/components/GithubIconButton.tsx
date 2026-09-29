import { FaGithub } from "react-icons/fa6";

// Adapted from a styled-components button into this project's own system:
// Tailwind utilities + the existing CSS custom properties (--rule,
// --bg-surface-elevated, --text-muted/--text-primary) instead of the
// original's hardcoded hex/rgba values and its own styled-components
// runtime — so it reads as native to this codebase, not a pasted-in widget,
// and adapts to both themes automatically. The bordered box + rotating
// backdrop-blur panel on hover is kept as-is; that interaction is the
// entire reason this component was requested over the plain icon links
// beside it.
export default function GithubIconButton({
  href,
  label = "GitHub",
}: {
  href: string;
  label?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="group relative flex h-[42px] w-[42px] items-center justify-center rounded-lg"
    >
      <span
        aria-hidden
        className="absolute inset-0 -z-10 rounded-lg bg-bg-surface-elevated transition-transform duration-300 origin-bottom group-hover:rotate-[35deg]"
      />
      <span className="flex h-full w-full items-center justify-center rounded-lg border border-rule text-text-muted transition-colors duration-300 group-hover:border-border-hover group-hover:bg-bg-surface-elevated/70 group-hover:text-text-primary group-hover:backdrop-blur-sm">
        <FaGithub size={17} />
      </span>
    </a>
  );
}
