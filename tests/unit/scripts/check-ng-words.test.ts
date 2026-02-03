import { describe, it, expect } from 'vitest';

// スクリプトから関数をインポート（まだ存在しないのでテストは失敗する）
import { checkNgWords } from '../../../scripts/check-ng-words';

describe('checkNgWords', () => {
  const ngWordsData = {
    categories: {
      profanity: {
        description: '卑猥表現',
        words: ['fuck', 'shit', 'damn'],
      },
      discrimination: {
        description: '差別表現',
        words: ['nigger', 'faggot', 'retard'],
      },
      violence: {
        description: '暴力表現',
        words: ['kill', 'murder', 'die'],
      },
      spam: {
        description: 'スパム表現',
        words: ['buy now', 'click here', 'free money'],
      },
    },
  };

  it('正常なメッセージはチェック通過', () => {
    const contributorsData = {
      contributors: [
        {
          name: 'taro-yamada',
          github: 'https://github.com/taro-yamada',
          favoriteColor: '#3B82F6',
          favoriteEmoji: '🚀',
          message: 'はじめてのPR!',
          joinedAt: '2026-02-01',
          prNumber: 1,
        },
      ],
    };

    const result = checkNgWords(contributorsData, ngWordsData);
    expect(result.valid).toBe(true);
    expect(result.violations).toEqual([]);
  });

  it('NGワード含むメッセージは検出される', () => {
    const contributorsData = {
      contributors: [
        {
          name: 'taro-yamada',
          github: 'https://github.com/taro-yamada',
          favoriteColor: '#3B82F6',
          favoriteEmoji: '🚀',
          message: 'This is shit!', // NGワード含む
          joinedAt: '2026-02-01',
          prNumber: 1,
        },
      ],
    };

    const result = checkNgWords(contributorsData, ngWordsData);
    expect(result.valid).toBe(false);
    expect(result.violations.length).toBeGreaterThan(0);
    expect(result.violations[0]).toMatchObject({
      contributor: 'taro-yamada',
      message: 'This is shit!',
    });
  });

  it('全角NGワードも検出される', () => {
    const contributorsData = {
      contributors: [
        {
          name: 'taro-yamada',
          github: 'https://github.com/taro-yamada',
          favoriteColor: '#3B82F6',
          favoriteEmoji: '🚀',
          message: 'This is ｓｈｉｔ!', // 全角
          joinedAt: '2026-02-01',
          prNumber: 1,
        },
      ],
    };

    const result = checkNgWords(contributorsData, ngWordsData);
    expect(result.valid).toBe(false);
    expect(result.violations.length).toBeGreaterThan(0);
  });

  it('大文字小文字を区別せずに検出される', () => {
    const contributorsData = {
      contributors: [
        {
          name: 'taro-yamada',
          github: 'https://github.com/taro-yamada',
          favoriteColor: '#3B82F6',
          favoriteEmoji: '🚀',
          message: 'This is SHIT!', // 大文字
          joinedAt: '2026-02-01',
          prNumber: 1,
        },
      ],
    };

    const result = checkNgWords(contributorsData, ngWordsData);
    expect(result.valid).toBe(false);
    expect(result.violations.length).toBeGreaterThan(0);
  });

  it('複数のNGワードを検出できる', () => {
    const contributorsData = {
      contributors: [
        {
          name: 'user1',
          github: 'https://github.com/user1',
          favoriteColor: '#FF0000',
          favoriteEmoji: '😀',
          message: 'kill them all', // NGワード
          joinedAt: '2026-02-01',
          prNumber: 2,
        },
        {
          name: 'user2',
          github: 'https://github.com/user2',
          favoriteColor: '#00FF00',
          favoriteEmoji: '😁',
          message: 'buy now click here', // NGワード
          joinedAt: '2026-02-01',
          prNumber: 3,
        },
      ],
    };

    const result = checkNgWords(contributorsData, ngWordsData);
    expect(result.valid).toBe(false);
    expect(result.violations.length).toBeGreaterThanOrEqual(2);
  });

  it('messageフィールドがない場合はスキップされる', () => {
    const contributorsData = {
      contributors: [
        {
          name: 'taro-yamada',
          github: 'https://github.com/taro-yamada',
          favoriteColor: '#3B82F6',
          favoriteEmoji: '🚀',
          // message なし
          joinedAt: '2026-02-01',
          prNumber: 1,
        },
      ],
    };

    const result = checkNgWords(contributorsData, ngWordsData);
    expect(result.valid).toBe(true);
    expect(result.violations).toEqual([]);
  });
});
