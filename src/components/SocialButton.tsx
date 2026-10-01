import type { IconType } from "react-icons";

// One button style for every social / contact link on the site: a small
// pressed-in "3D" chip (see .surface-3d in globals.css) with icon + label.
export const socialButtonClass =
  "surface-3d btn-pop group inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-[0.75rem] font-medium text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-ghost focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary";

export default function SocialButton({
  href,
  label,
  icon: Icon,
  color,
  external = true,
}: {
  href: string;
  label: string;
  icon: IconType;
  color?: string;
  external?: boolean;
}) {
  // a PDF is a real download (saved as a clean file name), not a new tab
  const pdf = href.toLowerCase().endsWith(".pdf");
  return (
    <a
      href={href}
      {...(pdf
        ? { download: "Dhruv-Jain-Resume.pdf" }
        : external
          ? { target: "_blank", rel: "noreferrer" }
          : {})}
      className={socialButtonClass}
    >
      <Icon size={14} style={color && color !== "currentColor" ? { color } : undefined} className="shrink-0 transition-colors " />
      {label}
    </a>
  );
}
