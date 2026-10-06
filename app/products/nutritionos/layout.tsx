import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "NutritionOS — free nutrition & training tracker by Orvantia",
  description:
    "A fast, private nutrition and training tracker with 750+ Indian and Telangana foods, AI plate recognition, progressive-overload workouts and progress reports. Free, installable, built by Orvantia.",
};

export default function NutritionOSLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
