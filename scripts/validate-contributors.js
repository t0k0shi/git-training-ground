const Ajv = require('ajv');

const schema = {
  type: 'object',
  properties: {
    contributors: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: { type: 'string', pattern: '^[a-zA-Z0-9_-]{3,20}$' },
          github: { type: 'string', pattern: '^https://github\\.com/[a-zA-Z0-9_-]+$' },
          favoriteColor: { type: 'string', pattern: '^#[0-9A-Fa-f]{6}$' },
          favoriteEmoji: { type: 'string', maxLength: 10 },
          message: { type: 'string', maxLength: 50 },
          joinedAt: { type: 'string', pattern: '^\\d{4}-\\d{2}-\\d{2}$' },
          prNumber: { type: 'integer', minimum: 1 },
        },
        required: ['name', 'github', 'favoriteColor', 'favoriteEmoji', 'joinedAt', 'prNumber'],
        additionalProperties: false,
      },
    },
  },
  required: ['contributors'],
};

// Ajv インスタンスとバリデータを一度だけ作成
const ajv = new Ajv();
const validate = ajv.compile(schema);

/**
 * Validate contributors data against JSON Schema
 * @param {object} data - Contributors data to validate
 * @returns {object} - { valid: boolean, errors?: array }
 */
function validateContributors(data) {
  const valid = validate(data);

  if (!valid) {
    return {
      valid: false,
      errors: validate.errors,
    };
  }

  return {
    valid: true,
  };
}

// CLI実行時
if (require.main === module) {
  const fs = require('fs');

  try {
    const fileContent = fs.readFileSync('data/contributors.json', 'utf-8');
    const data = JSON.parse(fileContent);
    const result = validateContributors(data);

    if (!result.valid) {
      console.error('❌ バリデーションエラー:');
      result.errors.forEach((err) => {
        console.error(`  - ${err.instancePath}: ${err.message}`);
      });
      process.exit(1);
    }

    console.log('✅ JSON Schema バリデーション成功');
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.error('❌ エラー: data/contributors.json が見つかりません');
    } else if (error instanceof SyntaxError) {
      console.error('❌ エラー: JSON の構文が不正です');
    } else {
      console.error('❌ エラー:', error.message);
    }
    process.exit(1);
  }
}

module.exports = { validateContributors };
