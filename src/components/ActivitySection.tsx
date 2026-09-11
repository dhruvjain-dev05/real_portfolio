import Section from "./Section";
import ContributionCalendar from "./ContributionCalendar";
import VisitorPulse from "./VisitorPulse";

export default function ActivitySection() {
  return (
    <Section index="03" kicker="Activity" title="By the numbers.">
      <ContributionCalendar />
      <div className="mt-10">
        <VisitorPulse />
      </div>
    </Section>
  );
}
