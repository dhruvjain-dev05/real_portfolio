"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { profile } from "@/data/profile";
import { heroSocialLinks } from "@/data/socialLinks";
import { HiOutlineMail } from "react-icons/hi";
import RotatingRole from "@/components/RotatingRole";
import MumbaiClock from "@/components/MumbaiClock";
import BannerDayMarker from "@/components/BannerDayMarker";
import ThemeBanner from "@/components/banner/ThemeBanner";
import AvatarAccents from "@/components/AvatarAccents";
import SocialButton from "@/components/SocialButton";

// opacity never starts at 0 here — this must stay visible even if JS is
// slow, blocked, or never hydrates (crawlers, screenshot tools, bad networks)
const fadeUp = {
  hidden: { y: 14 },
  show: { y: 0 },
};

export default function HeroSection() {
  return (
    <motion.section
      id="now"
      className="scroll-mt-24 pt-6 pb-10 md:pt-8 md:pb-12"
      initial="hidden"
      animate="show"
      variants={{ show: { transition: { staggerChildren: 0.08 } } }}
    >
      <motion.div
        variants={fadeUp}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative h-40 w-full overflow-hidden rounded-lg ring-1 ring-rule sm:h-52 md:h-60"
      >
        {profile.bannerVideo ? (
          // dusk video in dark mode, the same valley at golden hour in light
          <ThemeBanner />
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
        <div className="avatar-frame group/avatar relative shrink-0">
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
        <AvatarAccents />
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
        className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1.5 font-mono text-[0.72rem] text-text-muted"
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
        className="mt-7 max-w-[62ch] space-y-3.5"
      >
        {/* emphasis comes from colour + semibold, not heavy bold, so the key
            terms stand out without the paragraph reading dense */}
        {profile.bio.map((line, i) => (
          <li
            key={i}
            className="flex gap-3 text-[0.95rem] leading-[1.75] text-text-secondary [&_b]:font-semibold [&_b]:text-text-primary"
          >
            <span className="mt-[0.72em] h-1 w-1 shrink-0 rounded-full bg-text-faint" />
            <span dangerouslySetInnerHTML={{ __html: line }} />
          </li>
        ))}
      </motion.ul>

      <motion.div
        variants={fadeUp}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="mt-8 flex flex-wrap items-center gap-2"
      >
        <SocialButton href="#contact" label="Get in touch" icon={HiOutlineMail} external={false} />
        {heroSocialLinks.map((link) => (
          <SocialButton key={link.name} href={link.url} label={link.name} icon={link.icon} color={link.color} />
        ))}
      </motion.div>
    </motion.section>
  );
}
