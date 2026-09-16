"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { profile } from "@/data/profile";
import { heroSocialLinks } from "@/data/socialLinks";
import { HiOutlineMail } from "react-icons/hi";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import RotatingRole from "@/components/RotatingRole";
import MumbaiClock from "@/components/MumbaiClock";
import BannerDayMarker from "@/components/BannerDayMarker";

// opacity never starts at 0 here — this must stay visible even if JS is
// slow, blocked, or never hydrates (crawlers, screenshot tools, bad networks)
const fadeUp = {
  hidden: { y: 14 },
  show: { y: 0 },
};

export default function HeroSection() {
  return (
    <motion.section
      className="pt-6 pb-10 md:pt-8 md:pb-12"
      initial="hidden"
      animate="show"
      variants={{ show: { transition: { staggerChildren: 0.08 } } }}
    >
      <motion.div
        variants={fadeUp}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative h-36 w-full overflow-hidden rounded-lg ring-1 ring-rule sm:h-44"
      >
        {profile.bannerVideo ? (
          // object-position biased to 30% from the top — this specific video
          // is a sunset/mountain scene where a plain center-crop cuts off
          // the moon and mountain peaks; 30% keeps those plus the bridge
          // and train in frame at this box's wide, short aspect ratio
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="h-full w-full object-cover object-[50%_30%]"
          >
            <source src={profile.bannerVideo} type="video/mp4" />
          </video>
        ) : profile.banner ? (
          <Image
            src={profile.banner}
            alt=""
            fill
            unoptimized
            priority
            sizes="700px"
            className="object-cover"
          />
        ) : (
          <div className="banner-placeholder grid h-full w-full place-items-center">
            <span className="font-mono text-[0.6rem] uppercase tracking-[0.22em] text-text-ghost">
              banner
            </span>
          </div>
        )}
        {profile.bannerVideo && <BannerDayMarker />}
      </motion.div>

      {/* Sits entirely BELOW the banner — no overlap. "mt-6" is the gap
          between the banner and this row. */}
      <motion.div
        variants={fadeUp}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="mt-6 flex items-center gap-5"
      >
        <div className="h-[96px] w-[96px] shrink-0 overflow-hidden rounded-xl bg-bg-surface shadow-sm ring-1 ring-rule sm:h-[112px] sm:w-[112px]">
          {profile.avatarSketch ? (
            // illustrated mark — same box, frame, and size as the real photo
            // used to have here; only the image swapped
            <Image
              src={profile.avatarSketch}
              alt={profile.name}
              width={320}
              height={320}
              unoptimized
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="grid h-full w-full place-items-center bg-bg-surface-elevated">
              <span className="font-display text-4xl text-text-dim">
                {profile.name.charAt(0)}
              </span>
            </div>
          )}
        </div>

        <div className="min-w-0">
          <h1
            className="font-display text-[clamp(2.4rem,7vw,3.6rem)] leading-[1.05] text-text-display"
            style={{ letterSpacing: "-0.005em" }}
          >
            {profile.name}
          </h1>

          <RotatingRole
            roles={profile.roles}
            className="mt-1 text-[0.95rem] font-medium text-text-secondary"
          />
        </div>
      </motion.div>

      <motion.p
        variants={fadeUp}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[0.7rem] text-text-dim"
      >
        <span>{profile.location}</span>
        <span className="text-text-ghost">/</span>
        <MumbaiClock />
        <span className="text-text-ghost">/</span>
        <a
          href={profile.statusUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 transition-colors hover:text-text-primary"
        >
          <span className="status-dot-glow h-1.5 w-1.5 rounded-full bg-status-active text-status-active" />
          {profile.status}
        </a>
      </motion.p>

      <motion.ul
        variants={fadeUp}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="mt-7 space-y-3.5"
      >
        {profile.bio.map((line, i) => (
          <li key={i} className="flex gap-3 text-[0.95rem] leading-[1.75] text-text-secondary">
            <span className="mt-[0.7em] h-[3px] w-[3px] shrink-0 rounded-full bg-text-ghost" />
            <span dangerouslySetInnerHTML={{ __html: line }} />
          </li>
        ))}
      </motion.ul>

      <motion.div
        variants={fadeUp}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3"
      >
        <Button asChild variant="underline">
          <a href={profile.email}>
            <HiOutlineMail className="text-text-muted transition-colors group-hover:text-text-primary" />
            <span>Get in touch</span>
          </a>
        </Button>

        <span className="h-3.5 w-px bg-rule-strong" />

        <TooltipProvider delayDuration={200}>
          <div className="flex items-center gap-4">
            {heroSocialLinks.map((link) => (
              <Tooltip key={link.name}>
                <TooltipTrigger asChild>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={link.name}
                    className="text-text-muted transition-colors hover:text-text-primary"
                  >
                    <link.icon size={16} />
                  </a>
                </TooltipTrigger>
                <TooltipContent>{link.name}</TooltipContent>
              </Tooltip>
            ))}
          </div>
        </TooltipProvider>
      </motion.div>
    </motion.section>
  );
}
