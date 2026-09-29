// What's on your plate right now — edit these lines whenever they change
// and bump `updated`. Placeholder lines are marked; replace them when ready.
export interface NowItem {
  label: string;
  text: string;
  // pulsing dot — use for the thing you're actively doing this week
  live?: boolean;
}

export const now = {
  updated: "Sep 2026",
  items: [
    {
      label: "Building",
      text: "Production web systems as a Full Stack Engineer Intern at Wallnut Building Solutions.",
      live: true,
    },
    {
      label: "Learning",
      text: "How AI & LLM applications hold up in real products — beyond the demo.",
    },
    {
      label: "Reading",
      text: "Your current book goes here.",
    },
  ] satisfies NowItem[],
};
