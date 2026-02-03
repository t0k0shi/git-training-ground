import { describe, it, expect, beforeAll } from 'vitest';
import fs from 'fs/promises';
import path from 'path';

describe('data/ng-words.json', () => {
  let ngWordsData: any;
  const filePath = path.resolve(__dirname, '../../data/ng-words.json');

  async function loadNgWordsData() {
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content);
  }

  beforeAll(async () => {
    ngWordsData = await loadNgWordsData();
  });

  it('should be a valid JSON file', async () => {
    const content = await fs.readFile(filePath, 'utf-8');
    expect(() => JSON.parse(content)).not.toThrow();
  });

  it('should have categories property', () => {
    expect(ngWordsData).toHaveProperty('categories');
    expect(ngWordsData.categories).toBeDefined();
  });

  it('should have non-empty categories', () => {
    expect(Object.keys(ngWordsData.categories).length).toBeGreaterThan(0);
  });

  it('should have description and words in each category', () => {
    const categories = ngWordsData.categories;

    for (const [categoryName, categoryData] of Object.entries(categories)) {
      expect(categoryData).toHaveProperty('description');
      expect(categoryData).toHaveProperty('words');
      expect((categoryData as any).description).toBeTruthy();
    }
  });

  it('should have non-empty array of words in each category', () => {
    const categories = ngWordsData.categories;

    for (const [categoryName, categoryData] of Object.entries(categories)) {
      const words = (categoryData as any).words;
      expect(Array.isArray(words)).toBe(true);
      expect(words.length).toBeGreaterThan(0);
    }
  });

  it('should have expected categories: profanity, discrimination, violence, spam', () => {
    const categories = ngWordsData.categories;

    expect(categories).toHaveProperty('profanity');
    expect(categories).toHaveProperty('discrimination');
    expect(categories).toHaveProperty('violence');
    expect(categories).toHaveProperty('spam');
  });
});
