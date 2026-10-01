import Section from "./Section";
import ContributionCalendar from "./ContributionCalendar";
import VisitorPulse from "./VisitorPulse";
import { profile } from "@/data/profile";
import { getContributionData } from "@/lib/githubContributions";

export default async function ActivitySection() {
  const data = await getContributionData(profile.githubUsername);

  return (
    <Section id="activity" index="04" kicker="Activity" title="By the numbers." className="!py-8 md:!py-10">
      <ContributionCalendar data={data} username={profile.githubUsername} />
      <div className="mt-10">
        <VisitorPulse />
      </div>
    </Section>
  );
}
