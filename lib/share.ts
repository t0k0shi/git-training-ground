const SHARE_TITLE = 'git-training-ground';

/**
 * Web Share API でサイトをシェアする。
 * 非対応ブラウザでは何もしない。ユーザーのキャンセル（AbortError）などの reject は握りつぶす。
 */
export function shareSite(): void {
  if (typeof navigator === 'undefined' || !navigator.share) {
    return;
  }

  navigator
    .share({
      title: SHARE_TITLE,
      url: typeof window !== 'undefined' ? window.location.href : '',
    })
    .catch(() => {
      // キャンセルは正常な操作なので通知しない
    });
}
