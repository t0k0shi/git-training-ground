/**
 * バリデーションヘルパー関数
 */

const NAME_REGEX = /^[a-zA-Z0-9_-]{3,20}$/;
const GITHUB_REGEX = /^https:\/\/github\.com\/[a-zA-Z0-9_-]+$/;
const COLOR_REGEX = /^#[0-9A-Fa-f]{6}$/;
const JOINED_AT_REGEX = /^\d{4}-\d{2}-\d{2}$/;

const MAX_EMOJI_LENGTH = 10;
const MAX_MESSAGE_LENGTH = 50;

/**
 * 名前のバリデーション
 * 3-20文字、英数字+ハイフン+アンダースコア
 */
export function validateName(name: string): boolean {
  return NAME_REGEX.test(name);
}

/**
 * GitHub URLのバリデーション
 * https://github.com/{username} 形式
 */
export function validateGithub(github: string): boolean {
  return GITHUB_REGEX.test(github);
}

/**
 * お気に入りカラーのバリデーション
 * #XXXXXX 形式（16進数6桁）
 */
export function validateFavoriteColor(color: string): boolean {
  return COLOR_REGEX.test(color);
}

/**
 * お気に入り絵文字のバリデーション
 * 文字列で maxLength 10
 */
export function validateFavoriteEmoji(emoji: string): boolean {
  return emoji.length > 0 && emoji.length <= MAX_EMOJI_LENGTH;
}

/**
 * メッセージのバリデーション
 * オプショナル、maxLength 50
 */
export function validateMessage(message: string | undefined): boolean {
  if (message === undefined) {
    return true;
  }
  return message.length <= MAX_MESSAGE_LENGTH;
}

/**
 * 参加日のバリデーション
 * YYYY-MM-DD 形式
 */
export function validateJoinedAt(date: string): boolean {
  return JOINED_AT_REGEX.test(date);
}

/**
 * PR番号のバリデーション
 * 1以上の整数
 */
export function validatePrNumber(prNumber: number): boolean {
  return Number.isInteger(prNumber) && prNumber >= 1;
}

/**
 * Contributorオブジェクト全体のバリデーション
 */
export function validateContributor(contributor: unknown): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // 型チェック
  if (typeof contributor !== 'object' || contributor === null) {
    return { valid: false, errors: ['Contributor must be an object'] };
  }

  const c = contributor as Record<string, unknown>;

  // name
  if (typeof c.name !== 'string') {
    errors.push('name');
  } else if (!validateName(c.name)) {
    errors.push('name');
  }

  // github
  if (typeof c.github !== 'string') {
    errors.push('github');
  } else if (!validateGithub(c.github)) {
    errors.push('github');
  }

  // favoriteColor
  if (typeof c.favoriteColor !== 'string') {
    errors.push('favoriteColor');
  } else if (!validateFavoriteColor(c.favoriteColor)) {
    errors.push('favoriteColor');
  }

  // favoriteEmoji
  if (typeof c.favoriteEmoji !== 'string') {
    errors.push('favoriteEmoji');
  } else if (!validateFavoriteEmoji(c.favoriteEmoji)) {
    errors.push('favoriteEmoji');
  }

  // message (optional)
  if (c.message !== undefined) {
    if (typeof c.message !== 'string') {
      errors.push('message');
    } else if (!validateMessage(c.message)) {
      errors.push('message');
    }
  }

  // joinedAt
  if (typeof c.joinedAt !== 'string') {
    errors.push('joinedAt');
  } else if (!validateJoinedAt(c.joinedAt)) {
    errors.push('joinedAt');
  }

  // prNumber
  if (typeof c.prNumber !== 'number') {
    errors.push('prNumber');
  } else if (!validatePrNumber(c.prNumber)) {
    errors.push('prNumber');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
