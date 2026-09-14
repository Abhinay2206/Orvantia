import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FactoryFlow — Case Study | Orvantia",
  description:
    "How Orvantia replaced a manufacturing floor's diary and WhatsApp with FactoryFlow - a task and workflow platform now live at Prayagh Consumer Care Pvt. Ltd.",
};

export default function CaseStudyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
