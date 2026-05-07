import { describe, it, expect, beforeEach, vi } from 'vitest';
import { sampleRandom } from '@/components/home/FloatingBubbles';

describe('sampleRandom (FloatingBubbles 内のサンプリング関数)', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('要求数が配列長以下のとき、要求数の要素を返す', () => {
    const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    expect(sampleRandom(items, 3).length).toBe(3);
    expect(sampleRandom(items, 7).length).toBe(7);
  });

  it('要求数が配列長を超えるとき、配列長で打ち切る', () => {
    const items = [1, 2, 3];
    expect(sampleRandom(items, 100).length).toBe(3);
  });

  it('要求数が 0 以下のとき、空配列を返す', () => {
    const items = [1, 2, 3];
    expect(sampleRandom(items, 0)).toEqual([]);
    expect(sampleRandom(items, -5)).toEqual([]);
  });

  it('元配列を破壊しない', () => {
    const items = [1, 2, 3, 4, 5];
    const original = items.slice();
    sampleRandom(items, 3);
    expect(items).toEqual(original);
  });

  it('返ってきた要素はすべて元配列に含まれる', () => {
    const items = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
    const sampled = sampleRandom(items, 4);
    for (const x of sampled) {
      expect(items).toContain(x);
    }
  });

  it('返ってきた要素は重複しない', () => {
    const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const sampled = sampleRandom(items, 7);
    const unique = new Set(sampled);
    expect(unique.size).toBe(sampled.length);
  });

  it('Math.random をモックすると決定論的に動く', () => {
    // Math.random を 0 固定にすると Fisher-Yates は必ず先頭から順に選ぶ
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const items = [10, 20, 30, 40, 50];
    const sampled = sampleRandom(items, 3);
    // (i + 0 * (length - i)) → i 自身。つまり swap せずそのまま先頭 3 件
    expect(sampled).toEqual([10, 20, 30]);
  });

  it('複数回呼び出すと異なる結果になりうる (反順序依存性の確認)', () => {
    // 旧実装 (i % 10) / 10 < density は決定論的だったため、毎回同じ先頭 7 件を返した。
    // 新実装は Math.random() を使うため、十分大きい配列で複数回サンプリングすると
    // 必ず先頭 N 件にはならない (確率的に検証)。
    const items = Array.from({ length: 100 }, (_, i) => i);
    const headSetReference = new Set([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);

    // 10 回試行して、1 回でも先頭 10 件と異なるサンプルが出ることを期待
    let differentFromHead = false;
    for (let attempt = 0; attempt < 10; attempt++) {
      const sampled = new Set(sampleRandom(items, 10));
      if (![...sampled].every((x) => headSetReference.has(x))) {
        differentFromHead = true;
        break;
      }
    }
    expect(differentFromHead, '10 回試行しても全て先頭 10 件のままなら、ランダム性が機能していない').toBe(true);
  });
});
