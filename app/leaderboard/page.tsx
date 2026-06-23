import LeaderboardClient from "./LeaderboardClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Global Typing Rankings & Speed Leaderboard",
  description: "Compare your net WPM and typing speed against typists worldwide. See the top touch typists on our global verified leaderboard.",
};

export default function Page() {
  return <LeaderboardClient />;
}
