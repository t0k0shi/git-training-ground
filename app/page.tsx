import { HeroSection } from "@/components/home/HeroSection";
import { ConceptSection } from "@/components/home/ConceptSection";
import { HelpWantedSection } from "@/components/home/HelpWantedSection";
import { StepsSection } from "@/components/home/StepsSection";
import { ContributorsSection } from "@/components/home/ContributorsSection";
import { FooterSection } from "@/components/home/FooterSection";
import { getContributors } from "@/lib/contributors";

export default async function HomePage() {
  const contributors = await getContributors();

  return (
    <main>
      <HeroSection contributors={contributors} />
      <ConceptSection />
      <HelpWantedSection />
      <StepsSection />
      <ContributorsSection contributors={contributors} />
      <FooterSection count={contributors.length} />
    </main>
  );
}
