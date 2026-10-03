import Section from "./Section";
import ContactCard from "./ContactCard";
import SocialButton from "./SocialButton";
import { socialLinks } from "@/data/socialLinks";

// the email is already the form's destination, so it isn't repeated as a chip
const connect = socialLinks.filter((l) => l.name !== "Email");

// Centred: a one-line invitation, one card (message or terminal), and the social
// links directly underneath — everything for getting in touch in one place.
export default function ContactSection() {
  return (
    <Section id="contact" index="05" kicker="Contact" title="Let's build something." compact center className="isolate !py-10 md:!py-14">
      {/* the section's top rule doubles as the halfway line: a faint half centre
          circle and centre spot hang beneath it, behind the heading */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 -top-[3px] -z-10 flex justify-center overflow-hidden">
        <svg viewBox="-142 -3 284 145" fill="none" className="h-auto w-[204px] text-rule-strong md:w-[276px]">
          <path
            d="M -140 0 A 140 140 0 0 0 140 0"
            stroke="currentColor"
            strokeDasharray="3 3"
            vectorEffect="non-scaling-stroke"
          />
          <circle r="2.5" fill="currentColor" />
        </svg>
      </div>
      <p className="mx-auto mb-6 max-w-[42ch] text-balance text-center text-[0.95rem] leading-[1.75] text-text-secondary">
        Got a role, a project or just an idea? Drop me a message — I’m open to interesting work and good conversations.
      </p>
      <ContactCard />
      <ul className="mt-6 flex flex-wrap items-center justify-center gap-2">
        {connect.map((l) => (
          <li key={l.name}>
            <SocialButton
              href={l.url}
              label={l.name}
              icon={l.icon}
              color={l.color}
              external={l.url.startsWith("http")}
            />
          </li>
        ))}
      </ul>
    </Section>
  );
}
