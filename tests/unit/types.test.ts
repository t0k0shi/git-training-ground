import { describe, it, expect } from 'vitest';
import type { Contributor, ContributorsData, Statistics } from '../../lib/types';

describe('lib/types.ts', () => {
  describe('Contributor interface', () => {
    it('should accept a valid contributor object with all required fields', () => {
      const validContributor: Contributor = {
        name: 'taro-yamada',
        github: 'https://github.com/taro-yamada',
        favoriteColor: '#FF6B6B',
        favoriteEmoji: '🚀',
        joinedAt: '2026-02-02',
        prNumber: 42,
      };

      // Type check: if this compiles, the test passes
      expect(validContributor.name).toBe('taro-yamada');
      expect(validContributor.github).toBe('https://github.com/taro-yamada');
      expect(validContributor.favoriteColor).toBe('#FF6B6B');
      expect(validContributor.favoriteEmoji).toBe('🚀');
      expect(validContributor.joinedAt).toBe('2026-02-02');
      expect(validContributor.prNumber).toBe(42);
    });

    it('should accept a contributor object with optional message field', () => {
      const contributorWithMessage: Contributor = {
        name: 'test-user',
        github: 'https://github.com/test-user',
        favoriteColor: '#3B82F6',
        favoriteEmoji: '🎉',
        message: '初めてのPRでドキドキしました!',
        joinedAt: '2026-02-03',
        prNumber: 1,
      };

      expect(contributorWithMessage.message).toBe('初めてのPRでドキドキしました!');
    });

    it('should accept a contributor object without optional message field', () => {
      const contributorWithoutMessage: Contributor = {
        name: 'another-user',
        github: 'https://github.com/another-user',
        favoriteColor: '#8B5CF6',
        favoriteEmoji: '✨',
        joinedAt: '2026-02-03',
        prNumber: 2,
      };

      expect(contributorWithoutMessage.message).toBeUndefined();
    });
  });

  describe('ContributorsData interface', () => {
    it('should accept a valid contributors data object', () => {
      const validData: ContributorsData = {
        contributors: [
          {
            name: 'user1',
            github: 'https://github.com/user1',
            favoriteColor: '#FF0000',
            favoriteEmoji: '🔥',
            joinedAt: '2026-02-01',
            prNumber: 1,
          },
          {
            name: 'user2',
            github: 'https://github.com/user2',
            favoriteColor: '#00FF00',
            favoriteEmoji: '🌟',
            message: 'Hello!',
            joinedAt: '2026-02-02',
            prNumber: 2,
          },
        ],
      };

      expect(validData.contributors).toHaveLength(2);
      expect(validData.contributors[0].name).toBe('user1');
      expect(validData.contributors[1].message).toBe('Hello!');
    });

    it('should accept an empty contributors array', () => {
      const emptyData: ContributorsData = {
        contributors: [],
      };

      expect(emptyData.contributors).toHaveLength(0);
    });
  });

  describe('Statistics interface', () => {
    it('should accept a valid statistics object', () => {
      const validStats: Statistics = {
        totalContributors: 100,
        thisMonthPRs: 15,
        recentContributors: [
          {
            name: 'recent1',
            github: 'https://github.com/recent1',
            favoriteColor: '#3B82F6',
            favoriteEmoji: '🎯',
            joinedAt: '2026-02-03',
            prNumber: 100,
          },
          {
            name: 'recent2',
            github: 'https://github.com/recent2',
            favoriteColor: '#8B5CF6',
            favoriteEmoji: '💫',
            joinedAt: '2026-02-03',
            prNumber: 99,
          },
        ],
      };

      expect(validStats.totalContributors).toBe(100);
      expect(validStats.thisMonthPRs).toBe(15);
      expect(validStats.recentContributors).toHaveLength(2);
      expect(validStats.recentContributors[0].name).toBe('recent1');
    });

    it('should accept statistics with exactly 5 recent contributors', () => {
      const statsWithFive: Statistics = {
        totalContributors: 200,
        thisMonthPRs: 30,
        recentContributors: [
          {
            name: 'user1',
            github: 'https://github.com/user1',
            favoriteColor: '#FF0000',
            favoriteEmoji: '1️⃣',
            joinedAt: '2026-02-03',
            prNumber: 5,
          },
          {
            name: 'user2',
            github: 'https://github.com/user2',
            favoriteColor: '#FF0000',
            favoriteEmoji: '2️⃣',
            joinedAt: '2026-02-03',
            prNumber: 4,
          },
          {
            name: 'user3',
            github: 'https://github.com/user3',
            favoriteColor: '#FF0000',
            favoriteEmoji: '3️⃣',
            joinedAt: '2026-02-03',
            prNumber: 3,
          },
          {
            name: 'user4',
            github: 'https://github.com/user4',
            favoriteColor: '#FF0000',
            favoriteEmoji: '4️⃣',
            joinedAt: '2026-02-03',
            prNumber: 2,
          },
          {
            name: 'user5',
            github: 'https://github.com/user5',
            favoriteColor: '#FF0000',
            favoriteEmoji: '5️⃣',
            joinedAt: '2026-02-03',
            prNumber: 1,
          },
        ],
      };

      expect(statsWithFive.recentContributors).toHaveLength(5);
    });
  });
});
