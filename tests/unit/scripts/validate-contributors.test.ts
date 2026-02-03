import { describe, it, expect } from 'vitest';

// スクリプトから関数をインポート（まだ存在しないのでテストは失敗する）
import { validateContributors } from '../../../scripts/validate-contributors';

describe('validateContributors', () => {
  it('正常なcontributors.jsonでバリデーション成功', () => {
    const validData = {
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

    const result = validateContributors(validData);
    expect(result.valid).toBe(true);
    expect(result.errors).toBeUndefined();
  });

  it('nameが短すぎるとバリデーション失敗', () => {
    const invalidData = {
      contributors: [
        {
          name: 'ab', // 3文字未満
          github: 'https://github.com/ab',
          favoriteColor: '#3B82F6',
          favoriteEmoji: '🚀',
          joinedAt: '2026-02-01',
          prNumber: 1,
        },
      ],
    };

    const result = validateContributors(invalidData);
    expect(result.valid).toBe(false);
    expect(result.errors).toBeDefined();
    expect(result.errors!.length).toBeGreaterThan(0);
  });

  it('github URLが不正だとバリデーション失敗', () => {
    const invalidData = {
      contributors: [
        {
          name: 'taro-yamada',
          github: 'https://example.com/taro-yamada', // github.comではない
          favoriteColor: '#3B82F6',
          favoriteEmoji: '🚀',
          joinedAt: '2026-02-01',
          prNumber: 1,
        },
      ],
    };

    const result = validateContributors(invalidData);
    expect(result.valid).toBe(false);
    expect(result.errors).toBeDefined();
  });

  it('favoriteColorが不正だとバリデーション失敗', () => {
    const invalidData = {
      contributors: [
        {
          name: 'taro-yamada',
          github: 'https://github.com/taro-yamada',
          favoriteColor: 'blue', // #000000形式ではない
          favoriteEmoji: '🚀',
          joinedAt: '2026-02-01',
          prNumber: 1,
        },
      ],
    };

    const result = validateContributors(invalidData);
    expect(result.valid).toBe(false);
    expect(result.errors).toBeDefined();
  });

  it('必須フィールド欠落でバリデーション失敗', () => {
    const invalidData = {
      contributors: [
        {
          name: 'taro-yamada',
          github: 'https://github.com/taro-yamada',
          favoriteColor: '#3B82F6',
          favoriteEmoji: '🚀',
          // joinedAt と prNumber が欠落
        },
      ],
    };

    const result = validateContributors(invalidData);
    expect(result.valid).toBe(false);
    expect(result.errors).toBeDefined();
  });

  it('nameが長すぎるとバリデーション失敗', () => {
    const invalidData = {
      contributors: [
        {
          name: 'very-long-name-that-exceeds-twenty-characters',
          github: 'https://github.com/taro-yamada',
          favoriteColor: '#3B82F6',
          favoriteEmoji: '🚀',
          joinedAt: '2026-02-01',
          prNumber: 1,
        },
      ],
    };

    const result = validateContributors(invalidData);
    expect(result.valid).toBe(false);
    expect(result.errors).toBeDefined();
  });

  it('additionalPropertiesがあるとバリデーション失敗', () => {
    const invalidData = {
      contributors: [
        {
          name: 'taro-yamada',
          github: 'https://github.com/taro-yamada',
          favoriteColor: '#3B82F6',
          favoriteEmoji: '🚀',
          joinedAt: '2026-02-01',
          prNumber: 1,
          extraField: 'not allowed', // 追加フィールド
        },
      ],
    };

    const result = validateContributors(invalidData);
    expect(result.valid).toBe(false);
    expect(result.errors).toBeDefined();
  });
});
