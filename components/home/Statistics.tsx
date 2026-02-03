import { Statistics as StatsType } from '@/lib/types';

interface StatisticsProps {
  stats: StatsType;
}

export function Statistics({ stats }: StatisticsProps) {
  return (
    <section className="statistics-section">
      <h2>統計情報</h2>
      <div className="stats-grid">
        <div className="stat-item">
          <p className="stat-value">{stats.totalContributors}</p>
          <p className="stat-label">総貢献者数</p>
        </div>
        <div className="stat-item">
          <p className="stat-value">{stats.thisMonthPRs}</p>
          <p className="stat-label">今月のPR数</p>
        </div>
      </div>
      <div className="recent-contributors">
        <h3>最新の貢献者</h3>
        <ul>
          {stats.recentContributors.map((contributor) => (
            <li key={contributor.github}>
              <a href={contributor.github} target="_blank" rel="noopener noreferrer">
                {contributor.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
