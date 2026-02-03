import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getContributors, calculateStatistics } from '@/lib/contributors';
import type { ContributorsData } from '@/lib/types';

// fs/promises をモック化
vi.mock('fs/promises', () => ({
  default: {
    readFile: vi.fn(),
  },
}));

describe('lib/contributors', () => {
  const mockContributorsData: ContributorsData = {
    contributors: [
      {
        name: 'alice',
        github: 'https://github.com/alice',
        favoriteColor: '#FF0000',
        favoriteEmoji: '🚀',
        message: 'Hello!',
        joinedAt: '2026-02-01',
        prNumber: 1,
      },
      {
        name: 'bob',
        github: 'https://github.com/bob',
        favoriteColor: '#00FF00',
        favoriteEmoji: '🎉',
        joinedAt: '2026-02-03',
        prNumber: 3,
      },
      {
        name: 'charlie',
        github: 'https://github.com/charlie',
        favoriteColor: '#0000FF',
        favoriteEmoji: '🔥',
        message: 'Test',
        joinedAt: '2026-01-15',
        prNumber: 2,
      },
    ],
  };

  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('getContributors', () => {
    it('should return contributors sorted by prNumber in descending order', async () => {
      const fs = await import('fs/promises');
      vi.mocked(fs.default.readFile).mockResolvedValue(
        JSON.stringify(mockContributorsData)
      );

      const contributors = await getContributors();

      expect(contributors).toHaveLength(3);
      expect(contributors[0].prNumber).toBe(3);
      expect(contributors[1].prNumber).toBe(2);
      expect(contributors[2].prNumber).toBe(1);
      expect(contributors[0].name).toBe('bob');
    });

    it('should throw an error when file read fails', async () => {
      const fs = await import('fs/promises');
      vi.mocked(fs.default.readFile).mockRejectedValue(
        new Error('File not found')
      );

      await expect(getContributors()).rejects.toThrow('File not found');
    });

    it('should throw an error when JSON is invalid', async () => {
      const fs = await import('fs/promises');
      vi.mocked(fs.default.readFile).mockResolvedValue('invalid json');

      await expect(getContributors()).rejects.toThrow();
    });
  });

  describe('calculateStatistics', () => {
    beforeEach(() => {
      // 現在時刻を 2026-02-03 に固定
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2026-02-03T12:00:00Z'));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should return correct totalContributors', async () => {
      const fs = await import('fs/promises');
      vi.mocked(fs.default.readFile).mockResolvedValue(
        JSON.stringify(mockContributorsData)
      );

      const stats = await calculateStatistics();

      expect(stats.totalContributors).toBe(3);
    });

    it('should return recentContributors with maximum 5 items', async () => {
      const fs = await import('fs/promises');

      // 10人のダミーデータを作成
      const manyContributors: ContributorsData = {
        contributors: Array.from({ length: 10 }, (_, i) => ({
          name: `user${i}`,
          github: `https://github.com/user${i}`,
          favoriteColor: '#000000',
          favoriteEmoji: '🚀',
          joinedAt: '2026-02-01',
          prNumber: i + 1,
        })),
      };

      vi.mocked(fs.default.readFile).mockResolvedValue(
        JSON.stringify(manyContributors)
      );

      const stats = await calculateStatistics();

      expect(stats.recentContributors).toHaveLength(5);
      // prNumber降順なので、最新5件は 10, 9, 8, 7, 6
      expect(stats.recentContributors[0].prNumber).toBe(10);
      expect(stats.recentContributors[4].prNumber).toBe(6);
    });

    it('should calculate thisMonthPRs correctly', async () => {
      const fs = await import('fs/promises');
      vi.mocked(fs.default.readFile).mockResolvedValue(
        JSON.stringify(mockContributorsData)
      );

      const stats = await calculateStatistics();

      // 現在時刻は 2026-02-03
      // mockContributorsData には 2026-02 の joinedAt が 2件
      expect(stats.thisMonthPRs).toBe(2);
    });

    it('should return 0 thisMonthPRs when no PRs in current month', async () => {
      const fs = await import('fs/promises');

      const oldContributors: ContributorsData = {
        contributors: [
          {
            name: 'old-user',
            github: 'https://github.com/old-user',
            favoriteColor: '#FF0000',
            favoriteEmoji: '🚀',
            joinedAt: '2025-12-01',
            prNumber: 1,
          },
        ],
      };

      vi.mocked(fs.default.readFile).mockResolvedValue(
        JSON.stringify(oldContributors)
      );

      const stats = await calculateStatistics();

      expect(stats.thisMonthPRs).toBe(0);
    });
  });
});
