export interface ExperienceEntry {
  company: string;
  companyUrl?: string;
  role: string;
  dates: string;
  location: string;
  status: "present" | "past" | "future";
  statusLabel: string;
  logoUrl?: string;
  // names must match a key in techMeta (components/ExperienceSection.tsx)
  tech: string[];
  description: string[];
}

export const experience: ExperienceEntry[] = [
  {
    company: "Wallnut",
    role: "Software Engineer Intern",
    dates: "June 2026 - Present",
    location: "Remote",
    status: "present",
    statusLabel: "Working",
    logoUrl: "/images/wallnut.png",
    tech: [
      "React.js",
      "Node.js",
      "Express.js",
      "PostgreSQL",
      "JavaScript",
      "Vite",
      "REST APIs",
      "AWS EC2",
      "Vercel",
      "GitHub Actions",
      "PM2",
      "Tally Prime XML API",
      "Git",
      "Python",
    ],
    description: [
      "Architected and developed a full-stack B2B enterprise sales platform from scratch, engineering an automated data pipeline to parse, normalize, and sync multi-year Tally ERP ledger and voucher records into PostgreSQL.",
      "Implemented multi-tier Role-Based Access Control (RBAC) across 4 organizational levels (CEO, State Head, District Manager, Sales Officer), dynamically scoping financial KPIs, territory sales, and party outstandings.",
      "Engineered real-time sales analytics engines and invoice-level product drill-down modals, calculating Net Sales (excl. GST), YoY growth comparisons, and dealer performance metrics with sub-second response times.",
      "Digitized field sales operations by building an end-to-end sales call logging and daily reporting module, completely replacing manual spreadsheets in preparation for company-wide rollout across sales teams.",
    ],
  },
];
