import { describe, it, expect } from 'vitest';
// @ts-expect-error -- .mjs ESM import in vitest
import { validateLine, validateFile } from '../../scripts/validate-emojis.mjs';

describe('validateLine', () => {
  describe('正常系', () => {
    it('単一絵文字を受け入れる', () => {
      expect(validateLine('🚀', 1)).toBeNull();
    });

    it('2つの同じ絵文字を受け入れる', () => {
      expect(validateLine('🎉🎉', 1)).toBeNull();
    });

    it('3つの同じ絵文字を受け入れる', () => {
      expect(validateLine('🌟🌟🌟', 1)).toBeNull();
    });

    it('空行はスキップする', () => {
      expect(validateLine('', 1)).toBeNull();
    });

    it('ZWJ 絵文字を1文字として扱う', () => {
      expect(validateLine('👨‍👩‍👧', 1)).toBeNull();
    });

    it('肌色修飾子付き絵文字を1文字として扱う', () => {
      expect(validateLine('👋🏽', 1)).toBeNull();
    });

    it('CR を除去して処理する', () => {
      expect(validateLine('🚀\r', 1)).toBeNull();
    });
  });

  describe('異常系: 非絵文字', () => {
    it('テキストを拒否する', () => {
      const result = validateLine('hello', 1);
      expect(result).not.toBeNull();
      expect(result!.type).toBe('not-emoji');
    });

    it('数字を拒否する', () => {
      const result = validateLine('123', 1);
      expect(result).not.toBeNull();
      expect(result!.type).toBe('not-emoji');
    });

    it('絵文字とテキストの混在を拒否する', () => {
      const result = validateLine('🚀abc', 1);
      expect(result).not.toBeNull();
      expect(result!.type).toBe('not-emoji');
    });

    it('スペース混入を拒否する', () => {
      const result = validateLine('🚀 🚀', 1);
      expect(result).not.toBeNull();
      expect(result!.type).toBe('not-emoji');
    });

    it('日本語テキストを拒否する', () => {
      const result = validateLine('あいう', 1);
      expect(result).not.toBeNull();
      expect(result!.type).toBe('not-emoji');
    });
  });

  describe('異常系: 上限超過', () => {
    it('4文字以上の絵文字を拒否する', () => {
      const result = validateLine('🚀🚀🚀🚀', 1);
      expect(result).not.toBeNull();
      expect(result!.type).toBe('too-many');
    });
  });

  describe('異常系: 異種絵文字混在', () => {
    it('異なる絵文字の混在を拒否する', () => {
      const result = validateLine('🚀🎉', 1);
      expect(result).not.toBeNull();
      expect(result!.type).toBe('mixed-emoji');
    });
  });

  describe('エラーメッセージ', () => {
    it('非絵文字のエラーメッセージに行番号と内容が含まれる', () => {
      const result = validateLine('hello', 5);
      expect(result!.message).toContain('5行目');
      expect(result!.message).toContain('hello');
      expect(result!.message).toContain('絵文字以外');
    });

    it('上限超過のエラーメッセージに行番号が含まれる', () => {
      const result = validateLine('🚀🚀🚀🚀', 3);
      expect(result!.message).toContain('3行目');
      expect(result!.message).toContain('4文字以上');
    });

    it('混在のエラーメッセージに行番号が含まれる', () => {
      const result = validateLine('🚀🎉', 7);
      expect(result!.message).toContain('7行目');
      expect(result!.message).toContain('混在');
    });
  });
});

describe('validateFile', () => {
  it('正常なファイルでエラーが0件', () => {
    const content = '🚀\n🎉🎉\n🌟🌟🌟\n';
    const errors = validateFile(content);
    expect(errors).toHaveLength(0);
  });

  it('空行を含むファイルでエラーが0件', () => {
    const content = '🚀\n\n🎉🎉\n';
    const errors = validateFile(content);
    expect(errors).toHaveLength(0);
  });

  it('不正行が複数あれば全てのエラーを返す', () => {
    const content = 'hello\n🚀\nworld\n';
    const errors = validateFile(content);
    expect(errors).toHaveLength(2);
    expect(errors[0].line).toBe(1);
    expect(errors[1].line).toBe(3);
  });

  it('空ファイルでエラーが0件', () => {
    const errors = validateFile('');
    expect(errors).toHaveLength(0);
  });
});
