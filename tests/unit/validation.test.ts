import { describe, it, expect } from 'vitest';
import {
  validateName,
  validateGithub,
  validateFavoriteColor,
  validateFavoriteEmoji,
  validateMessage,
  validateJoinedAt,
  validatePrNumber,
  validateContributor,
} from '@/lib/validation';

describe('validateName', () => {
  it('正常系: 有効な名前を受け入れる', () => {
    expect(validateName('taro-yamada')).toBe(true);
    expect(validateName('abc')).toBe(true);
    expect(validateName('a1234567890123456789')).toBe(true); // 20文字
  });

  it('異常系: 短すぎる名前を拒否する', () => {
    expect(validateName('ab')).toBe(false);
  });

  it('異常系: 日本語を拒否する', () => {
    expect(validateName('名前')).toBe(false);
  });

  it('異常系: 長すぎる名前を拒否する', () => {
    expect(validateName('a12345678901234567890')).toBe(false); // 21文字
  });

  it('異常系: 無効な文字を拒否する', () => {
    expect(validateName('taro yamada')).toBe(false); // スペース
    expect(validateName('taro@yamada')).toBe(false); // @記号
  });
});

describe('validateGithub', () => {
  it('正常系: 有効なGitHub URLを受け入れる', () => {
    expect(validateGithub('https://github.com/taro-yamada')).toBe(true);
    expect(validateGithub('https://github.com/a1234_test-user')).toBe(true);
  });

  it('異常系: httpスキーマを拒否する', () => {
    expect(validateGithub('http://github.com/taro-yamada')).toBe(false);
  });

  it('異常系: github.com以外を拒否する', () => {
    expect(validateGithub('https://gitlab.com/taro-yamada')).toBe(false);
  });

  it('異常系: 無効な形式を拒否する', () => {
    expect(validateGithub('https://github.com/')).toBe(false);
    expect(validateGithub('github.com/taro-yamada')).toBe(false);
  });
});

describe('validateFavoriteColor', () => {
  it('正常系: 有効なカラーコードを受け入れる', () => {
    expect(validateFavoriteColor('#3B82F6')).toBe(true);
    expect(validateFavoriteColor('#000000')).toBe(true);
    expect(validateFavoriteColor('#ffffff')).toBe(true);
    expect(validateFavoriteColor('#AbCdEf')).toBe(true);
  });

  it('異常系: 色名を拒否する', () => {
    expect(validateFavoriteColor('red')).toBe(false);
  });

  it('異常系: #なしを拒否する', () => {
    expect(validateFavoriteColor('3B82F6')).toBe(false);
  });

  it('異常系: 短いコードを拒否する', () => {
    expect(validateFavoriteColor('#FFF')).toBe(false);
  });

  it('異常系: 無効な文字を拒否する', () => {
    expect(validateFavoriteColor('#GGGGGG')).toBe(false);
  });
});

describe('validateFavoriteEmoji', () => {
  it('正常系: 有効な絵文字を受け入れる', () => {
    expect(validateFavoriteEmoji('😀')).toBe(true);
    expect(validateFavoriteEmoji('🎉🎊')).toBe(true);
    expect(validateFavoriteEmoji('hello')).toBe(true);
    expect(validateFavoriteEmoji('1234567890')).toBe(true); // 10文字
  });

  it('異常系: 長すぎる文字列を拒否する', () => {
    expect(validateFavoriteEmoji('12345678901')).toBe(false); // 11文字
  });

  it('異常系: 空文字列を拒否する', () => {
    expect(validateFavoriteEmoji('')).toBe(false);
  });
});

describe('validateMessage', () => {
  it('正常系: undefinedを受け入れる', () => {
    expect(validateMessage(undefined)).toBe(true);
  });

  it('正常系: 有効なメッセージを受け入れる', () => {
    expect(validateMessage('Hello, world!')).toBe(true);
    expect(validateMessage('a'.repeat(50))).toBe(true); // 50文字
  });

  it('異常系: 長すぎるメッセージを拒否する', () => {
    expect(validateMessage('a'.repeat(51))).toBe(false); // 51文字
  });

  it('正常系: 空文字列を受け入れる', () => {
    expect(validateMessage('')).toBe(true);
  });
});

describe('validateJoinedAt', () => {
  it('正常系: 有効な日付形式を受け入れる', () => {
    expect(validateJoinedAt('2026-02-03')).toBe(true);
    expect(validateJoinedAt('1970-01-01')).toBe(true);
  });

  it('異常系: スラッシュ区切りを拒否する', () => {
    expect(validateJoinedAt('2026/02/03')).toBe(false);
  });

  it('異常系: 無効な形式を拒否する', () => {
    expect(validateJoinedAt('2026-2-3')).toBe(false);
    expect(validateJoinedAt('20260203')).toBe(false);
    expect(validateJoinedAt('Feb 3, 2026')).toBe(false);
  });
});

describe('validatePrNumber', () => {
  it('正常系: 有効なPR番号を受け入れる', () => {
    expect(validatePrNumber(1)).toBe(true);
    expect(validatePrNumber(100)).toBe(true);
    expect(validatePrNumber(999999)).toBe(true);
  });

  it('異常系: 0を拒否する', () => {
    expect(validatePrNumber(0)).toBe(false);
  });

  it('異常系: 負の数を拒否する', () => {
    expect(validatePrNumber(-1)).toBe(false);
  });

  it('異常系: 小数を拒否する', () => {
    expect(validatePrNumber(1.5)).toBe(false);
  });

  it('異常系: NaNを拒否する', () => {
    expect(validatePrNumber(NaN)).toBe(false);
  });
});

describe('validateContributor', () => {
  it('正常系: 有効な全データを受け入れる', () => {
    const validContributor = {
      name: 'taro-yamada',
      github: 'https://github.com/taro-yamada',
      favoriteColor: '#3B82F6',
      favoriteEmoji: '😀',
      message: 'Hello, world!',
      joinedAt: '2026-02-03',
      prNumber: 1,
    };
    const result = validateContributor(validContributor);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('正常系: messageがオプショナル', () => {
    const validContributor = {
      name: 'taro-yamada',
      github: 'https://github.com/taro-yamada',
      favoriteColor: '#3B82F6',
      favoriteEmoji: '😀',
      joinedAt: '2026-02-03',
      prNumber: 1,
    };
    const result = validateContributor(validContributor);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('異常系: 不正なnameを拒否する', () => {
    const invalidContributor = {
      name: 'ab', // 短すぎ
      github: 'https://github.com/taro-yamada',
      favoriteColor: '#3B82F6',
      favoriteEmoji: '😀',
      joinedAt: '2026-02-03',
      prNumber: 1,
    };
    const result = validateContributor(invalidContributor);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('name');
  });

  it('異常系: 複数の不正フィールドを検出する', () => {
    const invalidContributor = {
      name: 'ab', // 短すぎ
      github: 'http://github.com/test', // httpスキーマ
      favoriteColor: 'red', // カラーコードではない
      favoriteEmoji: '😀',
      joinedAt: '2026/02/03', // スラッシュ区切り
      prNumber: 0, // 0は無効
    };
    const result = validateContributor(invalidContributor);
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(1);
    expect(result.errors).toContain('name');
    expect(result.errors).toContain('github');
    expect(result.errors).toContain('favoriteColor');
    expect(result.errors).toContain('joinedAt');
    expect(result.errors).toContain('prNumber');
  });

  it('異常系: 必須フィールド不足を検出する', () => {
    const invalidContributor = {
      name: 'taro-yamada',
      // githubが不足
      favoriteColor: '#3B82F6',
      favoriteEmoji: '😀',
      joinedAt: '2026-02-03',
      prNumber: 1,
    };
    const result = validateContributor(invalidContributor);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('github');
  });

  it('異常系: 型が不正な場合を検出する', () => {
    const invalidContributor = {
      name: 123, // 文字列ではない
      github: 'https://github.com/test',
      favoriteColor: '#3B82F6',
      favoriteEmoji: '😀',
      joinedAt: '2026-02-03',
      prNumber: '1', // 数値ではない
    };
    const result = validateContributor(invalidContributor);
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });
});
