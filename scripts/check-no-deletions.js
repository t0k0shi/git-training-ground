/**
 * 既存の貢献者エントリが削除されていないかチェックする
 * PRでcontributors.jsonを変更する際、既存エントリの削除を検知する
 */

const { execSync } = require('child_process');
const fs = require('fs');

/**
 * mainブランチの contributors.json と現在のファイルを比較
 * @returns {{ valid: boolean, deleted: string[], message: string }}
 */
function checkNoDeletions() {
  try {
    // mainブランチのcontributors.jsonを取得
    let mainContent;
    try {
      mainContent = execSync('git show origin/main:data/contributors.json', {
        encoding: 'utf-8',
      });
    } catch {
      // mainブランチにファイルがない場合（初回）はスキップ
      return { valid: true, deleted: [], message: '初回コミット（比較対象なし）' };
    }

    const mainData = JSON.parse(mainContent);
    const mainNames = new Set(mainData.contributors.map((c) => c.name));

    // 現在のcontributors.jsonを読み込み
    const currentContent = fs.readFileSync('data/contributors.json', 'utf-8');
    const currentData = JSON.parse(currentContent);
    const currentNames = new Set(currentData.contributors.map((c) => c.name));

    // mainにあって現在のファイルにないエントリを検出
    const deleted = [...mainNames].filter((name) => !currentNames.has(name));

    if (deleted.length > 0) {
      return {
        valid: false,
        deleted,
        message: `既存の貢献者エントリが削除されています: ${deleted.join(', ')}`,
      };
    }

    return { valid: true, deleted: [], message: '既存エントリの削除なし' };
  } catch (error) {
    return { valid: false, deleted: [], message: `エラー: ${error.message}` };
  }
}

// CLI実行時
if (require.main === module) {
  // origin/mainを取得
  try {
    execSync('git fetch origin main', { stdio: 'pipe' });
  } catch {
    // fetch失敗は無視（ローカルテスト時など）
  }

  const result = checkNoDeletions();

  if (!result.valid) {
    console.error('❌ ' + result.message);
    console.error('');
    console.error('ヒント: Forkを最新のmainブランチに同期してから、エントリを追加してください。');
    console.error('既存の貢献者を削除せず、配列の末尾に自分のエントリを追加してください。');
    process.exit(1);
  }

  console.log('✅ ' + result.message);
}

module.exports = { checkNoDeletions };
