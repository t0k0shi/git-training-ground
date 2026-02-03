import { Statistics as StatsType } from '@/lib/types';

interface StatisticsProps {
  stats: StatsType;
}

export function Statistics({ stats }: StatisticsProps) {
  return (
    <div className="mt-10 flex flex-col items-center gap-6">
      <div className="flex gap-12">
        <div className="text-center">
          <p className="text-3xl font-bold text-[#2563EB]">{stats.totalContributors}</p>
          <p className="text-sm text-[#64748B]">総貢献者数</p>
        </div>
        <div className="text-center">
          <p className="text-3xl font-bold text-[#2563EB]">{stats.thisMonthPRs}</p>
          <p className="text-sm text-[#64748B]">今月のPR数</p>
        </div>
      </div>
      <div className="text-center">
        <h3 className="text-sm font-semibold text-[#1E293B] mb-2">最新の貢献者</h3>
        <ul className="flex gap-4 text-sm text-[#64748B]">
          {stats.recentContributors.map((contributor) => (
            <li key={contributor.github}>
              <a href={contributor.github} target="_blank" rel="noopener noreferrer" className="hover:text-[#2563EB] transition-colors">
                {contributor.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
