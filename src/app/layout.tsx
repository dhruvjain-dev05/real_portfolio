import type { Metadata } from "next";
import { Instrument_Serif, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import ThemeToggle from "@/components/ThemeToggle";
import DotSpotlight from "@/components/DotSpotlight";
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

export const metadata: Metadata = {
  title: "Your Name | Full Stack Developer",
  description: "Portfolio of Your Name — Full Stack Developer.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`dark ${instrumentSerif.variable} ${jakarta.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg-primary text-text-primary">
        <ThemeToggle />
        <DotSpotlight />
        {/* dashed rails at the edges of the 800px content column — every
            section rule and the header/footer rules run out to meet them */}
        <div
          aria-hidden
          className="pointer-events-none fixed inset-y-0 left-1/2 z-[60] hidden w-full max-w-[800px] -translate-x-1/2 border-x border-dashed border-rule-strong sm:block"
        />
        {children}
      </body>
    </html>
  );
}
