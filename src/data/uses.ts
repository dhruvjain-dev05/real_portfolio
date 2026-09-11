export interface UsesItem {
  label: string;
  name: string;
  link?: string;
}

export interface UsesCategory {
  category: string;
  items: UsesItem[];
}

export const usesData: UsesCategory[] = [
  {
    category: "Software",
    items: [
      { label: "Editor", name: "VS Code", link: "https://code.visualstudio.com" },
      { label: "Terminal", name: "Windows Terminal" },
      { label: "Browser", name: "Arc" },
      { label: "Design", name: "Figma", link: "https://figma.com" },
    ],
  },
  {
    category: "Hardware",
    items: [
      { label: "Laptop", name: "Your Laptop Model" },
      { label: "Keyboard", name: "Your Keyboard" },
      { label: "Mouse", name: "Your Mouse" },
    ],
  },
];
