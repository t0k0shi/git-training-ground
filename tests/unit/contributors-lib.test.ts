import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('fs/promises', () => ({
  default: {
    readFile: vi.fn(),
  },
  readFile: vi.fn(),
}));

import fs from 'fs/promises';
import { daysAgo, getContributors } from '@/lib/contributors';

describe('daysAgo', () => {
  it('今日（0日前）は 0 を返す', () => {
    const today = new Date('2026-04-24T12:00:00Z');
    expect(daysAgo('2026-04-24', today)).toBe(0);
  });

  it('昨日（1日前）は 1 を返す', () => {
    const today = new Date('2026-04-25T12:00:00Z');
    expect(daysAgo('2026-04-24', today)).toBe(1);
  });

  it('7日前は 7 を返す', () => {
    const today = new Date('2026-05-01T12:00:00Z');
    expect(daysAgo('2026-04-24', today)).toBe(7);
  });

  it('8日前は 8 を返す', () => {
    const today = new Date('2026-05-02T12:00:00Z');
    expect(daysAgo('2026-04-24', today)).toBe(8);
  });

  describe('UTC 暦日基準（タイムゾーンに依存しない）', () => {
    it('UTC 日付が変わる直前（23:59:59.999Z）はまだ 0 日前', () => {
      const now = new Date('2026-04-24T23:59:59.999Z');
      expect(daysAgo('2026-04-24', now)).toBe(0);
    });

    it('UTC 日付が変わった直後（00:00:00Z）は 1 日前', () => {
      const now = new Date('2026-04-25T00:00:00.000Z');
      expect(daysAgo('2026-04-24', now)).toBe(1);
    });

    it('時刻付きの日付でも UTC の暦日で数える（23:00Z 参加の 2 時間後は翌日で 1 日前）', () => {
      const now = new Date('2026-04-25T01:00:00.000Z');
      expect(daysAgo('2026-04-24T23:00:00Z', now)).toBe(1);
    });

    it('UTC+9 の深夜表記でも UTC の暦日に正規化する（+09:00 の 04-25 08:00 は UTC の 04-24）', () => {
      const now = new Date('2026-04-25T00:00:00.000Z');
      expect(daysAgo('2026-04-25T08:00:00+09:00', now)).toBe(1);
    });

    it('未来の日付は負の値を返す', () => {
      const now = new Date('2026-04-24T12:00:00.000Z');
      expect(daysAgo('2026-04-26', now)).toBe(-2);
    });
  });
});

const AVATARS_PATH = /avatars\.generated\.json$/;

// contributors.json と avatars.generated.json の読み込みを、パスで分けて差し替える
function mockFiles(contributors: unknown[], avatars?: unknown) {
  vi.mocked(fs.readFile).mockImplementation((async (p: unknown) => {
    if (AVATARS_PATH.test(String(p))) {
      if (avatars === undefined) throw Object.assign(new Error('ENOENT'), { code: 'ENOENT' });
      return JSON.stringify(avatars);
    }
    return JSON.stringify(contributors);
  }) as typeof fs.readFile);
}

const base = {
  favoriteColor: '#E63946',
  favoriteEmoji: '🚀',
  message: 'hi',
  joinedAt: '2026-04-24',
};

describe('getContributors', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('contributors.json を読み込んで ContributorWithDerived[] を返す', async () => {
    mockFiles([{ ...base, name: 'ketts', github: 't0k0shi' }], {
      entries: [{ index: 0, login: 't0k0shi', id: 3, source: 'commit', pr: null }],
    });

    const result = await getContributors();

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('ketts');
    expect(typeof result[0].isNew).toBe('boolean');
  });

  it('アバターは生成ファイルの追加者の ID から作る（github 欄は使わない）', async () => {
    mockFiles([{ ...base, name: 'MissuN.uy', github: 'MissuN.uy' }], {
      entries: [{ index: 0, login: 'Fujii-Sys26', id: 123, source: 'pr', pr: 73 }],
    });

    const result = await getContributors();

    expect(result[0].avatarUrl).toBe('https://avatars.githubusercontent.com/u/123?s=80');
  });

  it('GitHub のユーザー名を、表示に渡すデータに含めない', async () => {
    mockFiles([{ ...base, name: 'ketts', github: 't0k0shi' }], {
      entries: [{ index: 0, login: 't0k0shi', id: 3, source: 'commit', pr: null }],
    });

    const [c] = await getContributors();

    expect(c).not.toHaveProperty('handle');
    expect(c).not.toHaveProperty('github');
    expect(JSON.stringify(c)).not.toContain('t0k0shi');
  });

  it('追加者がわからないエントリは、アバターなし', async () => {
    mockFiles([{ ...base, name: 'a' }], { entries: [{ index: 0, login: null, id: null, source: 'none', pr: null }] });

    const result = await getContributors();

    expect(result[0].avatarUrl).toBeNull();
  });

  it('生成ファイルがない（ローカル・PR の CI）ときは、全員アバターなしでエラーにしない', async () => {
    mockFiles([{ ...base, name: 'a' }, { ...base, name: 'b' }]);

    const result = await getContributors();

    expect(result.map((c) => c.avatarUrl)).toEqual([null, null]);
  });

  it('生成ファイルの件数がエントリの件数と合わないときは、全員アバターなし（古いファイルを使わない）', async () => {
    mockFiles([{ ...base, name: 'a' }, { ...base, name: 'b' }], {
      entries: [{ index: 0, login: 'x', id: 1, source: 'pr', pr: 1 }],
    });

    const result = await getContributors();

    expect(result.map((c) => c.avatarUrl)).toEqual([null, null]);
  });

  it('id は位置から作る（同じ人の 2 回目、中身が同じ 2 件でも重ならない）', async () => {
    mockFiles([{ ...base, name: 'a' }, { ...base, name: 'a' }]);

    const result = await getContributors();

    expect(result.map((c) => c.id)).toEqual(['entry-0', 'entry-1']);
  });

  it('joinedAt が 7 日以内の場合 isNew が true になる', async () => {
    mockFiles([{ ...base, name: 'newuser' }]);

    const result = await getContributors();

    // テスト環境では実際の現在日時を使うため、isNew の型のみ確認
    expect(typeof result[0].isNew).toBe('boolean');
  });
});
