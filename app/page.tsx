import { Hero } from "@/components/home/Hero";
import { Features } from "@/components/home/Features";
import { EmojiGrid } from "@/components/home/EmojiGrid";
import { HowItWorks } from "@/components/home/HowItWorks";
import { FinalCTA } from "@/components/home/FinalCTA";
import { getEmojis } from "@/lib/contributors";

export default async function HomePage() {
  const emojis = await getEmojis();

  return (
    <main>
      <Hero />
      <Features />
      <HowItWorks />
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-[#1E293B] mb-10">貢献者の皆さん</h2>
          <EmojiGrid emojis={emojis} />
          <p className="text-center text-gray-500 mt-6">
            {emojis.length} 人が参加中
          </p>
        </div>
      </section>
      <FinalCTA />
    </main>
  );
}
