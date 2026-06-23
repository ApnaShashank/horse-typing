import LearnPageClient from "./LearnClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Learn Touch Typing: 56 Step-by-Step Lessons",
  description: "Master touch typing with our free 56-lesson curriculum. Learn to type without looking, from home row keys to numbers and advanced punctuation.",
};

export default function Page() {
  return <LearnPageClient />;
}
