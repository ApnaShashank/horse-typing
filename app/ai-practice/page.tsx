import AIPracticeClient from "./AIPracticeClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Typing Coach & Custom Practice Prompt Generator",
  description: "Generate custom typing text using AI prompts or analyze your keystroke latency with our AI typing diagnostics coach.",
};

export default function Page() {
  return <AIPracticeClient />;
}
