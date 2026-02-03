import { Hero } from "@/components/home/Hero";
import { EmojiGrid } from "@/components/home/EmojiGrid";
import { Statistics } from "@/components/home/Statistics";
import { HowItWorks } from "@/components/home/HowItWorks";
import { getContributors, calculateStatistics } from "@/lib/contributors";

export default async function HomePage() {
  const contributors = await getContributors();
  const stats = await calculateStatistics();

  return (
    <main>
      <Hero />
      <EmojiGrid contributors={contributors} />
      <Statistics stats={stats} />
      <HowItWorks />
    </main>
  );
}
