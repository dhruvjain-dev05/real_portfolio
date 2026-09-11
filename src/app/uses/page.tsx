import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Section from "@/components/Section";
import { usesData } from "@/data/uses";

export default function UsesPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto w-full max-w-[800px] flex-1 px-5 md:px-6">
        <Section index="01" kicker="Uses" title="The setup.">
          <div className="space-y-10">
            {usesData.map((category) => (
              <div key={category.category}>
                <p className="mb-3 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-text-ghost">
                  {category.category}
                </p>
                <ul>
                  {category.items.map((item) => (
                    <li
                      key={item.name}
                      className="flex items-baseline justify-between gap-4 border-b border-rule py-2.5 text-[0.9rem]"
                    >
                      <span className="text-text-dim">{item.label}</span>
                      {item.link ? (
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noreferrer"
                          className="text-text-secondary transition-colors hover:text-text-primary"
                        >
                          {item.name}
                        </a>
                      ) : (
                        <span className="text-text-secondary">{item.name}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}
