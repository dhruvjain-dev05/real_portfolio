import Section from "./Section";
import { profile } from "@/data/profile";
import { socialLinks } from "@/data/socialLinks";

export default function ContactSection() {
  const address = profile.email.replace("mailto:", "");
  const elsewhere = socialLinks.filter((l) => l.name !== "Email");

  return (
    <Section index="06" kicker="Contact" title="Let's build something.">
      <p className="max-w-[48ch] text-[0.95rem] leading-[1.75] text-text-secondary">
        Open to interesting work and good conversations.
      </p>

      <a
        href={profile.email}
        className="group mt-7 inline-block font-display text-[clamp(1.7rem,5vw,2.6rem)] text-text-display"
      >
        <span className="border-b-2 border-text-ghost pb-1 transition-colors duration-300 group-hover:border-text-display">
          {address}
        </span>
      </a>

      <ul className="mt-10 flex flex-wrap gap-x-7 gap-y-3.5">
        {elsewhere.map((link) => (
          <li key={link.name}>
            <a
              href={link.url}
              target="_blank"
              rel="noreferrer"
              className="group flex items-center gap-2 text-[0.85rem] text-text-muted transition-colors hover:text-text-primary"
            >
              <link.icon size={14} style={{ color: link.color }} className="shrink-0" />
              {link.name}
            </a>
          </li>
        ))}
      </ul>
    </Section>
  );
}
