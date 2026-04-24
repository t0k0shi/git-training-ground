import { describe, it, expect } from 'vitest';
import { validateContributors } from '@/scripts/validate-contributors';

const validEntry = {
  name: 'ketts',
  github: 't0k0shi',
  favoriteColor: '#E63946',
  favoriteEmoji: '🚀',
  message: 'はじめてのOSS貢献！',
  joinedAt: '2026-04-24',
};

describe('validateContributors', () => {
  describe('CV-01: JSON パース可能性', () => {
    it('有効なデータは エラーなし', () => {
      expect(validateContributors([validEntry])).toHaveLength(0);
    });
  });

  describe('CV-02: トップレベルが配列', () => {
    it('オブジェクトはエラー', () => {
      const errors = validateContributors({});
      expect(errors.some((e) => e.check === 'CV-02')).toBe(true);
    });

    it('null はエラー', () => {
      const errors = validateContributors(null);
      expect(errors.some((e) => e.check === 'CV-02')).toBe(true);
    });

    it('配列はOK', () => {
      const errors = validateContributors([validEntry]);
      expect(errors.some((e) => e.check === 'CV-02')).toBe(false);
    });
  });

  describe('CV-03: 全フィールド存在', () => {
    const requiredFields = ['name', 'github', 'favoriteColor', 'favoriteEmoji', 'message', 'joinedAt'];

    for (const field of requiredFields) {
      it(`${field} が欠けているとエラー`, () => {
        const entry = { ...validEntry };
        delete (entry as Record<string, unknown>)[field];
        const errors = validateContributors([entry]);
        expect(errors.some((e) => e.check === 'CV-03')).toBe(true);
      });
    }
  });

  describe('CV-04: 各フィールドが空でない', () => {
    it('空文字列はエラー', () => {
      const errors = validateContributors([{ ...validEntry, name: '' }]);
      expect(errors.some((e) => e.check === 'CV-04')).toBe(true);
    });

    it('null はエラー', () => {
      const errors = validateContributors([{ ...validEntry, name: null }]);
      expect(errors.some((e) => e.check === 'CV-04')).toBe(true);
    });

    it('undefined はエラー', () => {
      const errors = validateContributors([{ ...validEntry, message: undefined }]);
      expect(errors.some((e) => e.check === 'CV-04')).toBe(true);
    });
  });

  describe('CV-05: favoriteColor が #RRGGBB 形式', () => {
    it('正常な16進数色はOK', () => {
      const errors = validateContributors([{ ...validEntry, favoriteColor: '#1A2B3C' }]);
      expect(errors.some((e) => e.check === 'CV-05')).toBe(false);
    });

    it('小文字16進数はOK', () => {
      const errors = validateContributors([{ ...validEntry, favoriteColor: '#aabbcc' }]);
      expect(errors.some((e) => e.check === 'CV-05')).toBe(false);
    });

    it('"red" 等の色名はエラー', () => {
      const errors = validateContributors([{ ...validEntry, favoriteColor: 'red' }]);
      expect(errors.some((e) => e.check === 'CV-05')).toBe(true);
    });

    it('#GGGGGG はエラー（無効な16進数）', () => {
      const errors = validateContributors([{ ...validEntry, favoriteColor: '#GGGGGG' }]);
      expect(errors.some((e) => e.check === 'CV-05')).toBe(true);
    });

    it('#FF は短すぎるのでエラー', () => {
      const errors = validateContributors([{ ...validEntry, favoriteColor: '#FF' }]);
      expect(errors.some((e) => e.check === 'CV-05')).toBe(true);
    });
  });

  describe('CV-06: joinedAt が YYYY-MM-DD 形式', () => {
    it('正常な日付はOK', () => {
      const errors = validateContributors([{ ...validEntry, joinedAt: '2026-04-24' }]);
      expect(errors.some((e) => e.check === 'CV-06')).toBe(false);
    });

    it('"2026/04/24" 形式はエラー', () => {
      const errors = validateContributors([{ ...validEntry, joinedAt: '2026/04/24' }]);
      expect(errors.some((e) => e.check === 'CV-06')).toBe(true);
    });

    it('"26-4-24" 短縮形式はエラー', () => {
      const errors = validateContributors([{ ...validEntry, joinedAt: '26-4-24' }]);
      expect(errors.some((e) => e.check === 'CV-06')).toBe(true);
    });
  });

  describe('CV-07: github ハンドルの重複禁止', () => {
    it('同一ハンドルが 2 件あるとエラー', () => {
      const errors = validateContributors([validEntry, { ...validEntry, name: 'other' }]);
      expect(errors.some((e) => e.check === 'CV-07')).toBe(true);
    });

    it('URL 形式と handle 形式の同一ユーザーもエラー', () => {
      const entry2 = { ...validEntry, name: 'other', github: 'https://github.com/t0k0shi' };
      const errors = validateContributors([validEntry, entry2]);
      expect(errors.some((e) => e.check === 'CV-07')).toBe(true);
    });

    it('異なるハンドルはOK', () => {
      const entry2 = { ...validEntry, github: 'otheruser' };
      const errors = validateContributors([validEntry, entry2]);
      expect(errors.some((e) => e.check === 'CV-07')).toBe(false);
    });
  });

  describe('CV-08: favoriteEmoji が grapheme cluster 1 文字', () => {
    it('単一絵文字はOK', () => {
      const errors = validateContributors([{ ...validEntry, favoriteEmoji: '🚀' }]);
      expect(errors.some((e) => e.check === 'CV-08')).toBe(false);
    });

    it('ZWJ シーケンスは 1 文字として扱いOK', () => {
      const errors = validateContributors([{ ...validEntry, favoriteEmoji: '👨‍👩‍👧' }]);
      expect(errors.some((e) => e.check === 'CV-08')).toBe(false);
    });

    it('複数絵文字はエラー', () => {
      const errors = validateContributors([{ ...validEntry, favoriteEmoji: '🚀🎉' }]);
      expect(errors.some((e) => e.check === 'CV-08')).toBe(true);
    });
  });

  describe('エラーメッセージ', () => {
    it('エラーにはエントリ番号と不正な値が含まれる', () => {
      const errors = validateContributors([{ ...validEntry, favoriteColor: 'red' }]);
      const cv05 = errors.find((e) => e.check === 'CV-05');
      expect(cv05).toBeDefined();
      expect(cv05!.message).toContain('エントリ[0]');
      expect(cv05!.message).toContain('red');
    });
  });
});
