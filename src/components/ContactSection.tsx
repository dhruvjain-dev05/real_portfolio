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
    <Section id="contact" index="05" kicker="Contact" title="Let's build something." compact center className="!py-10 md:!py-14">
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
