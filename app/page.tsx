import { Hero } from "@/components/home/Hero";
import { Features } from "@/components/home/Features";
import { EmojiGrid } from "@/components/home/EmojiGrid";
import { Statistics } from "@/components/home/Statistics";
import { HowItWorks } from "@/components/home/HowItWorks";
import { FinalCTA } from "@/components/home/FinalCTA";
import { getContributors, calculateStatistics } from "@/lib/contributors";

export default async function HomePage() {
  const contributors = await getContributors();
  const stats = await calculateStatistics();

  return (
    <main>
      <Hero />
      <Features />
      <HowItWorks />
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-[#1E293B] mb-10">貢献者の皆さん</h2>
          <EmojiGrid contributors={contributors} />
          <Statistics stats={stats} />
        </div>
      </section>
      <FinalCTA />
    </main>
  );
}
