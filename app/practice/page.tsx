import PracticeClient from "./PracticeClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Touch Typing Test & Speed Practice",
  description: "Test your touch typing speed and accuracy in English and Hindi InScript. Choose from 15s, 30s, or 60s timed tests, track your WPM, and improve your keyboard skills.",
};

export default function Page() {
  return <PracticeClient />;
}
