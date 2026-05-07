import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { spawnSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';

// audit-v4 Critical C-3 (Issue #16) 対応のスモークテスト。
// CLI として直接実行されたときに、不正な JSON を食わせると exit 1 を返すことを保証する。
// 旧実装の process.argv[1]?.endsWith('...') が tsx シム経由で false negative になり、
// CI で silent 成功扱いされる事故を防ぐ。

const SCRIPT_PATH = path.resolve(__dirname, '../../scripts/validate-contributors.ts');
const ORIGINAL_DATA_PATH = path.resolve(__dirname, '../../data/contributors.json');

// 元ファイルが存在しないケースでも安全に動くよう、undefined を許容して都度ガードする
let backupContent: string | undefined;
const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'validate-contrib-'));

beforeAll(() => {
  // 元の contributors.json をバックアップ (テスト中に書き換えるため)
  if (fs.existsSync(ORIGINAL_DATA_PATH)) {
    backupContent = fs.readFileSync(ORIGINAL_DATA_PATH, 'utf-8');
  }
});

afterAll(() => {
  // 元に戻す (バックアップが取れた場合のみ)
  if (backupContent !== undefined) {
    fs.writeFileSync(ORIGINAL_DATA_PATH, backupContent);
  }
  fs.rmSync(tempDir, { recursive: true, force: true });
});

function runCli(): { status: number | null; stdout: string; stderr: string } {
  const result = spawnSync('npx', ['tsx', SCRIPT_PATH], {
    cwd: path.resolve(__dirname, '../..'),
    encoding: 'utf-8',
    timeout: 30000,
  });
  return {
    status: result.status,
    stdout: result.stdout || '',
    stderr: result.stderr || '',
  };
}

describe('validate-contributors CLI (smoke)', () => {
  it('正常な contributors.json では exit 0 を返す', () => {
    // backupContent (元データ) を使って実行
    fs.writeFileSync(ORIGINAL_DATA_PATH, backupContent);
    const { status, stdout } = runCli();
    expect(status, `stdout: ${stdout}`).toBe(0);
    expect(stdout).toMatch(/✅|検証が完了しました/);
  });

  it('不正な JSON (構文エラー) では exit 1 を返す', () => {
    fs.writeFileSync(ORIGINAL_DATA_PATH, '{this is not valid json');
    const { status, stderr } = runCli();
    expect(status).toBe(1);
    expect(stderr).toMatch(/CV-01|JSON|正しい|invalid/i);
  });

  it('トップレベルが配列でない場合 (オブジェクト) は exit 1 を返す', () => {
    fs.writeFileSync(ORIGINAL_DATA_PATH, '{"name": "wrong shape"}');
    const { status, stderr } = runCli();
    expect(status).toBe(1);
    expect(stderr).toMatch(/CV-02|配列/);
  });

  it('必須フィールド欠落時は exit 1 を返す (silent success ではない)', () => {
    // name のみ持つ不完全エントリ
    fs.writeFileSync(ORIGINAL_DATA_PATH, JSON.stringify([{ name: 'incomplete' }]));
    const { status, stderr } = runCli();
    expect(status, '不完全エントリで exit 1 を返さないと CI で silent success になる').toBe(1);
    expect(stderr.length).toBeGreaterThan(0);
  });
});
