import { describe, it, expect, vi } from 'vitest';
import {
  fingerprint,
  attributeEntries,
  resolveAdder,
  buildAvatarFile,
} from '@/scripts/build-avatars.mjs';

const entry = (name: string, extra: Record<string, string> = {}) => ({
  name,
  favoriteColor: '#E63946',
  favoriteEmoji: '🚀',
  message: 'hi',
  joinedAt: '2026-10-15',
  ...extra,
});

describe('fingerprint', () => {
  it('github 欄を除いて比べる（v6 の移行で github 欄を消しても同じ指紋）', () => {
    expect(fingerprint(entry('a', { github: 'alice' }))).toBe(fingerprint(entry('a')));
  });

  it('キーの順番が違っても同じ指紋', () => {
    const { name, ...rest } = entry('a');
    expect(fingerprint({ ...rest, name })).toBe(fingerprint(entry('a')));
  });

  it('中身が違えば別の指紋', () => {
    expect(fingerprint(entry('a'))).not.toBe(fingerprint(entry('b')));
  });
});

describe('attributeEntries', () => {
  it('末尾に追加したエントリは、追加したコミットに対応する', () => {
    const result = attributeEntries([
      { commit: 'c1', entries: [entry('a')] },
      { commit: 'c2', entries: [entry('a'), entry('b')] },
    ]);
    expect(result).toEqual(['c1', 'c2']);
  });

  it('1 件の書き換え（誤字の修正）では、追加者は元のコミットのまま', () => {
    const result = attributeEntries([
      { commit: 'c1', entries: [entry('a'), entry('b')] },
      { commit: 'c2', entries: [entry('a'), entry('b', { message: '直した' })] },
    ]);
    expect(result).toEqual(['c1', 'c1']);
  });

  it('全件から github 欄を消す移行では、全員元のコミットのまま', () => {
    const result = attributeEntries([
      { commit: 'c1', entries: [entry('a', { github: 'alice' })] },
      { commit: 'c2', entries: [entry('a', { github: 'alice' }), entry('b', { github: 'bob' })] },
      { commit: 'c3', entries: [entry('a'), entry('b')] },
    ]);
    expect(result).toEqual(['c1', 'c2']);
  });

  it('中身がまったく同じ 2 件は、それぞれを追加したコミットに分かれる', () => {
    const result = attributeEntries([
      { commit: 'c1', entries: [entry('a')] },
      { commit: 'c2', entries: [entry('a'), entry('a')] },
    ]);
    expect(result).toEqual(['c1', 'c2']);
  });

  it('前のエントリと同じ日付・同じ色でも、直前の人を新しいコミットに付け替えない', () => {
    const same = { joinedAt: '2026-10-15', favoriteColor: '#FF5E5B' };
    const result = attributeEntries([
      { commit: 'c1', entries: [entry('a', same)] },
      { commit: 'c2', entries: [entry('a', same), entry('b', same)] },
    ]);
    expect(result).toEqual(['c1', 'c2']);
  });

  it('削除されたエントリは結果に残らない', () => {
    const result = attributeEntries([
      { commit: 'c1', entries: [entry('a'), entry('b')] },
      { commit: 'c2', entries: [entry('b')] },
    ]);
    expect(result).toEqual(['c1']);
  });

  it('1 つのコミットで 2 件追加すると、2 件ともそのコミット', () => {
    const result = attributeEntries([
      { commit: 'c1', entries: [entry('a')] },
      { commit: 'c2', entries: [entry('a'), entry('b'), entry('c')] },
    ]);
    expect(result).toEqual(['c1', 'c2', 'c2']);
  });

  it('1 件を書き換えて 1 件追加すると、書き換えは元のまま、追加は新しいコミット', () => {
    const result = attributeEntries([
      { commit: 'c1', entries: [entry('a'), entry('b')] },
      { commit: 'c2', entries: [entry('a'), entry('b2'), entry('c')] },
    ]);
    expect(result).toEqual(['c1', 'c1', 'c2']);
  });

  it('JSON が読めない・配列でない版（entries が null）は飛ばす', () => {
    const result = attributeEntries([
      { commit: 'c0', entries: null },
      { commit: 'c1', entries: [entry('a')] },
      { commit: 'c2', entries: null },
      { commit: 'c3', entries: [entry('a'), entry('b')] },
    ]);
    expect(result).toEqual(['c1', 'c3']);
  });

  // 2026-10-15 時点の main の履歴（git log --first-parent --reverse -- data/contributors.json）を、
  // 中身を短くした形で再現する。要件 D の表と同じ追加者になること
  it('実際の履歴の形で、6 件が要件の表と同じコミットに対応する', () => {
    const t0 = entry('ketts', { github: 't0k0shi', joinedAt: '2026-04-24' });
    const sw = entry('washoiTaro', { github: 'Swsafsaij-github-8uhbgv', joinedAt: '2026-10-11' });
    const tt = entry('washoiTaro', { github: 'takashi-tsujimoto-uz', joinedAt: '2026-10-13' });
    const tt2 = entry('washoiTaro', { github: 'takashi-tsujimoto-uz+2', joinedAt: '2026-10-13', message: '時間外' });
    const mo = entry('mori', { github: 'takayuki-mori-ae' });
    const ot = entry('otsuka', { github: 'SeijiOtsuka-vd' });
    const result = attributeEntries([
      { commit: '45d8cbd', entries: null },
      { commit: 'ebedf56', entries: null },
      { commit: 'dcf2792', entries: null },
      { commit: '857abe9', entries: null },
      { commit: '6a17d1e', entries: [t0] },
      { commit: '1b74022', entries: [t0, sw] },
      { commit: '2f7b3df', entries: [t0, sw, tt] },
      { commit: 'b4029ed', entries: [t0, sw, tt, tt2] },
      { commit: 'e801e16', entries: [t0, sw, tt, tt2, mo] },
      { commit: '3f58029', entries: [t0, sw, tt, tt2, mo, ot] },
    ]);
    expect(result).toEqual(['6a17d1e', '1b74022', '2f7b3df', 'b4029ed', 'e801e16', '3f58029']);
  });
});

const user = (login: string, id: number, type = 'User') => ({ login, id, type });

function fakeApi(routes: Record<string, unknown>) {
  return vi.fn(async (path: string) => {
    if (!(path in routes)) throw new Error(`unexpected ${path}`);
    const value = routes[path];
    if (value instanceof Error) throw value;
    return value;
  });
}

describe('resolveAdder', () => {
  it('そのコミットでマージされた PR があれば、PR の作成者', async () => {
    const api = fakeApi({
      'commits/abc/pulls': [{ number: 70, merged_at: '2026-10-15', merge_commit_sha: 'abc', user: user('SeijiOtsuka-vd', 282400093) }],
    });
    expect(await resolveAdder('abc', api)).toEqual({ login: 'SeijiOtsuka-vd', id: 282400093, source: 'pr', pr: 70 });
  });

  it('PR があれば、コミットの作成者より PR の作成者を使う（コミットの作成者は名乗れるため）', async () => {
    const api = fakeApi({
      'commits/abc/pulls': [{ number: 9, merged_at: '2026-10-15', merge_commit_sha: 'other', user: user('real', 1) }],
      'commits/abc': { author: user('spoofed', 2) },
    });
    expect(await resolveAdder('abc', api)).toEqual({ login: 'real', id: 1, source: 'pr', pr: 9 });
  });

  it('マージされていない PR は使わない', async () => {
    const api = fakeApi({
      'commits/abc/pulls': [{ number: 9, merged_at: null, merge_commit_sha: null, user: user('someone', 1) }],
      'commits/abc': { author: user('t0k0shi', 3) },
    });
    expect(await resolveAdder('abc', api)).toEqual({ login: 't0k0shi', id: 3, source: 'commit', pr: null });
  });

  it('PR がなければ、コミットの作成者（main に直接 push できるのは管理人だけ）', async () => {
    const api = fakeApi({ 'commits/abc/pulls': [], 'commits/abc': { author: user('t0k0shi', 3) } });
    expect(await resolveAdder('abc', api)).toEqual({ login: 't0k0shi', id: 3, source: 'commit', pr: null });
  });

  it('PR の作成者が Bot なら、なし', async () => {
    const api = fakeApi({
      'commits/abc/pulls': [{ number: 5, merged_at: '2026-10-15', merge_commit_sha: 'abc', user: user('dependabot[bot]', 4, 'Bot') }],
    });
    expect(await resolveAdder('abc', api)).toEqual({ login: null, id: null, source: 'none', pr: null });
  });

  it('コミットの作成者が GitHub のアカウントに結びつかなければ、なし', async () => {
    const api = fakeApi({ 'commits/abc/pulls': [], 'commits/abc': { author: null } });
    expect(await resolveAdder('abc', api)).toEqual({ login: null, id: null, source: 'none', pr: null });
  });

  it('API が失敗したら、例外を投げずに、なし', async () => {
    const api = fakeApi({ 'commits/abc/pulls': new Error('rate limit') });
    expect(await resolveAdder('abc', api)).toEqual({ login: null, id: null, source: 'none', pr: null });
  });
});

describe('buildAvatarFile', () => {
  it('エントリごとに追加者を引き、同じコミットは 1 回だけ問い合わせる', async () => {
    const api = fakeApi({
      'commits/c1': { author: user('t0k0shi', 3) },
      'commits/c1/pulls': [],
      'commits/c2/pulls': [{ number: 9, merged_at: 'x', merge_commit_sha: 'c2', user: user('bob', 7) }],
    });
    const file = await buildAvatarFile(
      [
        { commit: 'c1', entries: [entry('a')] },
        { commit: 'c2', entries: [entry('a'), entry('b'), entry('c')] },
      ],
      api,
      () => '2026-10-15T00:00:00.000Z',
    );
    expect(file).toEqual({
      generatedAt: '2026-10-15T00:00:00.000Z',
      entries: [
        { index: 0, login: 't0k0shi', id: 3, source: 'commit', pr: null },
        { index: 1, login: 'bob', id: 7, source: 'pr', pr: 9 },
        { index: 2, login: 'bob', id: 7, source: 'pr', pr: 9 },
      ],
    });
    expect(api.mock.calls.filter(([p]) => p === 'commits/c2/pulls')).toHaveLength(1);
  });
});
