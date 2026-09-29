import type { Metadata } from "next";
import { Instrument_Serif, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import ThemeToggle from "@/components/ThemeToggle";
import DotSpotlight from "@/components/DotSpotlight";
import ScrollProgress from "@/components/ScrollProgress";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: "400",
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

const KICKOFF_SCRIPT = `(function(){try{var f=/[?&]kickoff\b/.test(location.search);if(!f&&(location.pathname!=="/"||sessionStorage.getItem("jyora:kickoff")||matchMedia("(prefers-reduced-motion: reduce)").matches))return;window.__jyoraKickoff=true;document.documentElement.setAttribute("data-kickoff","");var l=document.createElement("link");l.rel="preload";l.as="image";l.href="/sprites/footballer.webp";document.head.appendChild(l)}catch(e){}})()`;

export const metadata: Metadata = {
  title: "Dhruv Jain | Software Engineer",
  description:
    "Dhruv Jain — Software Engineer Intern building full-stack B2B SaaS, AI and real-time apps.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`dark ${instrumentSerif.variable} ${jakarta.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <head>
        {/* decides, before first paint, whether the kick-off intro plays
            (first home visit of the session, motion allowed; /?kickoff forces it) */}
        <script dangerouslySetInnerHTML={{ __html: KICKOFF_SCRIPT }} />
      </head>
      <body className="min-h-full flex flex-col bg-bg-primary text-text-primary">
        <ThemeToggle />
        <DotSpotlight />
        {/* dashed rails at the edges of the 800px content column — every
            section rule and the header/footer rules run out to meet them */}
        <div
          aria-hidden
          className="pointer-events-none fixed inset-y-0 left-1/2 z-[60] hidden w-full max-w-[800px] -translate-x-1/2 border-x border-dashed border-rule-strong sm:block"
        />
        <ScrollProgress />
        {children}
      </body>
    </html>
  );
}
