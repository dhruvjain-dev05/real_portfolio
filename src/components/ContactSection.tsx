import Section from "./Section";
import PostcardContact from "./PostcardContact";

// Centred: a one-line invitation, then a postcard to write back on. The footer
// below carries the social links.
export default function ContactSection() {
  return (
    <Section id="contact" index="05" kicker="Contact" title="Let's build something." compact center className="!py-10 md:!py-14">
      <p className="mx-auto mb-8 max-w-[42ch] text-balance text-center text-[0.95rem] leading-[1.75] text-text-secondary">
        Got a role, a project or just an idea? Drop me a message — I’m open to interesting work and good conversations.
      </p>
      <PostcardContact />
    </Section>
  );
}
