# User Behavior & Operations Tests

## Overview

This test suite focuses on **real user behavior and operations**, not just unit testing of isolated components. These tests simulate how actual users interact with the Git Training Ground website.

## Philosophy

- **User-Centric**: Tests are written from the user's perspective, not the developer's
- **Journey-Based**: Complete user flows from start to finish
- **Interaction-Focused**: Emphasis on clicks, hovers, scrolls, keyboard navigation
- **Accessibility-First**: Includes keyboard navigation and screen reader support tests
- **Real-World Scenarios**: Edge cases and complex behaviors users might exhibit

## Test Structure

```
tests/
├── e2e/                                    # End-to-End Tests (Playwright)
│   ├── home.spec.ts                        # Original home page tests
│   ├── tutorial.spec.ts                    # Original tutorial page tests
│   ├── user-journeys.spec.ts               # NEW: Complete user journeys
│   └── real-world-scenarios.spec.ts        # NEW: Edge cases & realistic scenarios
│
├── integration/                            # Component Integration Tests
│   └── user-interactions.test.tsx          # NEW: User interaction patterns
│
└── unit/                                   # Unit Tests (existing)
    └── components/...
```

## New Test Files

### 1. `tests/e2e/user-journeys.spec.ts`

**Purpose**: Test complete user flows through the application

**Key Scenarios**:
- **First-time visitor journey**: Landing → Features → CTA → Tutorial → Emoji gallery
- **Tutorial deep-dive**: Reading steps, opening FAQs, copying code blocks
- **Navigation patterns**: Header navigation, logo clicks, scrolling behavior
- **Emoji gallery browsing**: Card viewing, hover interactions
- **Mobile experience**: Touch interactions, responsive layout
- **Accessibility**: Keyboard navigation, focus management, ARIA attributes
- **Performance**: Page load times, transition smoothness

**Example Test**:
```typescript
test('ランディング → チュートリアル → 絵文字確認の完全フロー', async ({ page }) => {
  // User lands on homepage
  await page.goto('/');

  // Scrolls through features
  await page.evaluate(() => window.scrollBy(0, 300));

  // Clicks CTA
  await page.getByRole('link', { name: /参加する/ }).first().click();

  // Arrives at tutorial
  await expect(page).toHaveURL(/\/tutorial/);

  // Reads steps sequentially
  for (let i = 1; i <= 8; i++) {
    await page.locator(`text=Step ${i}`).scrollIntoViewIfNeeded();
  }

  // Returns to view emoji cards
  await page.getByRole('link', { name: /Home/ }).click();
});
```

### 2. `tests/e2e/real-world-scenarios.spec.ts`

**Purpose**: Simulate realistic edge cases and complex user behaviors

**Key Scenarios**:
- **Lost users**: User navigates away and comes back, browser back/forward
- **Cautious users**: Reading all FAQs, checking all code blocks before copying
- **Rushed users**: Quick scrolling, skipping to CTA, minimal reading
- **Mobile users**: One-handed scrolling, tap targets, screen rotation
- **Accessibility users**: Keyboard-only navigation, screen reader structure
- **Slow network**: Priority content loading, image blocking
- **Link validation**: Internal links work, external links open in new tabs
- **Browser compatibility**: Progressive enhancement, JavaScript disabled
- **Multi-tab usage**: User opens multiple tabs simultaneously
- **Long sessions**: User keeps page open for extended time

**Example Test**:
```typescript
test('ユーザーが全FAQを開いて内容を熟読する', async ({ page }) => {
  await page.goto('/tutorial');

  const faqButtons = [
    'GitHubアカウントが必要ですか？',
    'Forkって何ですか？',
    // ... all FAQs
  ];

  for (const questionText of faqButtons) {
    const button = page.getByRole('button', { name: new RegExp(questionText) });
    await button.click();
    await expect(button).toHaveAttribute('aria-expanded', 'true');
    await page.waitForTimeout(100); // User reads
    await button.click();
  }
});
```

### 3. `tests/integration/user-interactions.test.tsx`

**Purpose**: Test user interactions with components (using React Testing Library)

**Key Scenarios**:
- **FAQ interaction sequences**: Open → Close → Open, Multiple FAQ toggling
- **CodeBlock copy operations**: Click to copy, verify clipboard, visual feedback
- **EmojiCard display & hover**: Different sizes, hover effects, multiple cards
- **Header navigation**: Logo click, nav links, external link attributes
- **StepGuide rendering**: Sequential steps, long content
- **Multi-component integration**: FAQ + CodeBlock + StepGuide together
- **Accessibility checks**: ARIA attributes, keyboard focus, screen reader support
- **Error handling**: Clipboard unavailable, empty content

**Example Test**:
```typescript
it('ユーザーが複数のFAQを順番に開いて閉じる', async () => {
  const user = userEvent.setup();
  render(<FAQ />);

  // Open FAQ 1
  const faq1 = screen.getByRole('button', { name: /GitHubアカウント/ });
  await user.click(faq1);
  expect(screen.getByText(/github.com で無料アカウント/)).toBeInTheDocument();

  // Open FAQ 2 (FAQ 1 auto-closes)
  const faq2 = screen.getByRole('button', { name: /Forkって何/ });
  await user.click(faq2);
  expect(screen.queryByText(/github.com で無料アカウント/)).not.toBeInTheDocument();
  expect(screen.getByText(/リポジトリの個人コピー/)).toBeInTheDocument();
});
```

## Running the Tests

### Install Missing Dependencies

First, install the required testing library:

```bash
npm install --save-dev @testing-library/user-event
```

### Run All Tests

```bash
# Unit + Integration tests (Vitest)
npm test

# E2E tests (Playwright)
npm run test:e2e

# Interactive test UI
npm run test:ui
```

### Run Specific Test Files

```bash
# Run only user journey E2E tests
npx playwright test user-journeys

# Run only real-world scenario tests
npx playwright test real-world-scenarios

# Run only integration tests
npx vitest run user-interactions
```

### Run Tests in Watch Mode

```bash
# Watch mode for unit/integration tests
npm test -- --watch

# Headed mode for E2E tests (see browser)
npx playwright test --headed
```

## Test Coverage Analysis

### User Journeys Covered

| Journey | Coverage |
|---------|----------|
| First-time visitor flow | ✅ Complete |
| Tutorial reading & interaction | ✅ Complete |
| Navigation (header, footer, links) | ✅ Complete |
| Emoji gallery browsing | ✅ Complete |
| Mobile responsive experience | ✅ Complete |
| Keyboard-only navigation | ✅ Complete |
| FAQ accordion operations | ✅ Complete |
| Code block copying | ✅ Complete |
| Multi-tab usage | ✅ Complete |
| Browser back/forward | ✅ Complete |

### User Types Covered

| User Type | Characteristics | Tests |
|-----------|----------------|-------|
| **First-time visitor** | Exploring, learning | Landing → CTA → Tutorial journey |
| **Cautious user** | Reads everything, checks carefully | All FAQs, all code blocks |
| **Rushed user** | Quick scan, minimal reading | Fast scroll → CTA |
| **Mobile user** | Touch, small screen | Tap targets, responsive layout |
| **Accessibility user** | Keyboard, screen reader | Tab navigation, ARIA checks |
| **Lost user** | Navigation confusion | Back/forward, re-navigation |
| **Technical user** | Wants CLI, checks links | External links, code copying |

### Interaction Patterns Covered

- ✅ Click & tap
- ✅ Hover & focus
- ✅ Keyboard navigation (Tab, Enter, Space)
- ✅ Scroll behavior
- ✅ Form interactions (future: if added)
- ✅ Multi-step sequences
- ✅ Error recovery
- ✅ Clipboard operations
- ✅ Link following
- ✅ Page transitions

## Accessibility Testing

### WCAG 2.1 Compliance Checks

- **Keyboard Navigation**: All interactive elements accessible via keyboard
- **Focus Management**: Visible focus indicators, logical tab order
- **ARIA Attributes**: `aria-expanded`, `role`, proper semantics
- **Screen Reader Support**: Heading hierarchy, descriptive labels
- **Touch Targets**: Minimum 44x44px for mobile (WCAG 2.5.5)
- **Color Contrast**: Not tested here (use axe-core for visual tests)

### Tests Included

```typescript
test('キーボードナビゲーションでページを操作', async ({ page }) => {
  await page.goto('/');

  // Tab through interactive elements
  await page.keyboard.press('Tab');
  const focusedElement = page.locator(':focus');
  await expect(focusedElement).toBeVisible();

  // Activate with Enter
  await page.keyboard.press('Enter');
});
```

## Performance Testing

### Metrics Tracked

- **Page Load Time**: < 3 seconds (Lighthouse target)
- **Page Transition**: < 2 seconds
- **First Contentful Paint**: Measured implicitly
- **Time to Interactive**: Measured by element visibility

### Tests Included

```typescript
test('ページロードが高速（3秒以内）', async ({ page }) => {
  const startTime = Date.now();
  await page.goto('/');
  await expect(page.getByRole('heading')).toBeVisible();
  const loadTime = Date.now() - startTime;
  expect(loadTime).toBeLessThan(3000);
});
```

## Mobile Testing

### Viewports Tested

- **iPhone SE**: 375 x 667 (small phone)
- **Landscape**: 667 x 375 (rotation)
- Future: iPad, large phones

### Tests Included

- Tap target sizing (minimum 40-44px)
- Scroll behavior
- FAQ accordion on touch
- Button visibility
- Content readability

## Browser Compatibility

### Browsers Tested (via Playwright)

- Chromium (Chrome, Edge)
- Firefox
- WebKit (Safari)

### Progressive Enhancement

```typescript
test('基本機能がJavaScript無効でも動作', async ({ page }) => {
  // Static content visible
  await expect(page.getByRole('heading')).toBeVisible();

  // Links functional (SSR/SSG)
  const link = page.getByRole('link', { name: /Tutorial/ });
  await expect(link).toHaveAttribute('href', '/tutorial');
});
```

## Edge Cases & Error Handling

### Covered Scenarios

- Clipboard API unavailable
- Empty component content
- Slow network connections
- Image loading failures
- 404 pages
- Long session times
- Multiple tabs open
- Browser back/forward
- Direct URL access

## Best Practices Followed

1. **User-Centric Naming**: Test names describe user actions, not implementation
2. **Real Interaction Patterns**: Use `userEvent` over `fireEvent` when possible
3. **Async Handling**: Proper `await` and `waitFor` usage
4. **Isolation**: Tests don't depend on each other
5. **Cleanup**: Proper unmounting and state reset
6. **Accessibility**: Test keyboard and screen reader paths
7. **Mobile-First**: Include mobile viewport tests
8. **Error Boundaries**: Test error states and edge cases

## Future Enhancements

### Planned Tests

- [ ] Form validation (when forms are added)
- [ ] Image loading and lazy loading
- [ ] Internationalization (i18n) switching
- [ ] Dark mode toggle
- [ ] Analytics event tracking
- [ ] Service worker / offline mode
- [ ] Drag & drop interactions (if added)
- [ ] Animation completion checks

### Tools to Consider

- **axe-core**: Automated accessibility testing
- **Percy/Chromatic**: Visual regression testing
- **Lighthouse CI**: Performance monitoring
- **BrowserStack**: Real device testing

## Contributing

When adding new features, please:

1. **Write user journey tests first** (TDD approach)
2. **Test from the user's perspective**, not implementation details
3. **Include mobile and accessibility scenarios**
4. **Document edge cases** in real-world-scenarios.spec.ts
5. **Update this README** with new coverage

## Questions?

- **"Why so many E2E tests?"**: E2E tests catch integration bugs that unit tests miss
- **"Why test user behavior?"**: Users don't care about implementation, they care about experience
- **"Should I test every component?"**: Test user-facing behavior, not internal implementation
- **"What about visual regression?"**: Consider adding Percy/Chromatic for visual tests

## References

- [Playwright Documentation](https://playwright.dev/)
- [Testing Library Best Practices](https://testing-library.com/docs/guiding-principles)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [User Event Documentation](https://testing-library.com/docs/user-event/intro/)
