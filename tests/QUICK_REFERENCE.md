# Test Commands Quick Reference

## 🚀 Quick Start

```bash
# Install missing dependency
npm install --save-dev @testing-library/user-event

# Run all tests
npm test                    # Unit + Integration
npm run build               # Build for E2E
npm run test:e2e           # E2E tests
```

## 📦 Installation

```bash
# Install dependencies
npm install

# Install Playwright browsers (first time only)
npx playwright install --with-deps

# Install missing test library
npm install --save-dev @testing-library/user-event
```

## 🧪 Running Tests

### All Tests

```bash
# Unit + Integration tests (Vitest)
npm test

# E2E tests (Playwright)
npm run test:e2e

# Interactive test UI
npm run test:ui
```

### Specific Test Files

```bash
# User journey tests
npx playwright test user-journeys

# Real-world scenarios
npx playwright test real-world-scenarios

# Integration tests
npx vitest run user-interactions

# Specific test by name
npx playwright test -g "ユーザーがチュートリアル"
```

### Watch Mode

```bash
# Watch unit/integration tests
npm test -- --watch

# Watch specific file
npx vitest watch user-interactions
```

### Debug Mode

```bash
# Open Playwright in headed mode (see browser)
npx playwright test --headed

# Debug specific test
npx playwright test --debug user-journeys

# Vitest debug mode
npx vitest run --inspect-brk
```

## 📊 Test Reports

```bash
# Generate coverage report
npm test -- --coverage

# Open Playwright HTML report
npx playwright show-report

# Vitest UI (interactive)
npm run test:ui
```

## 🎯 Common Tasks

### Add New Test

```typescript
// E2E test (Playwright)
test('ユーザーが...', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading')).toBeVisible();
});

// Integration test (Vitest + RTL)
it('ユーザーが...', async () => {
  const user = userEvent.setup();
  render(<Component />);
  await user.click(screen.getByRole('button'));
  expect(screen.getByText('...')).toBeInTheDocument();
});
```

### Run Tests by Type

```bash
# Only E2E tests
npm run test:e2e

# Only unit tests (exclude E2E)
npm test

# Only tests matching pattern
npx playwright test tutorial
npx vitest run FAQ
```

### Run Tests on Specific Browser

```bash
# Chromium only
npx playwright test --project=chromium

# Firefox only
npx playwright test --project=firefox

# WebKit only
npx playwright test --project=webkit

# All browsers
npx playwright test
```

### Mobile Testing

```bash
# Run mobile viewport tests
npx playwright test --grep "モバイル"

# Run specific viewport
npx playwright test --project="Mobile Safari"
```

## 🐛 Troubleshooting

### Tests Won't Run

```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Reinstall Playwright browsers
npx playwright install --with-deps
```

### TypeScript Errors

```bash
# Check TypeScript
npx tsc --noEmit

# Install missing types
npm install --save-dev @types/node @types/react
```

### Port Already in Use

```bash
# Kill process on port 3333
kill -9 $(lsof -ti:3333)

# Or use different port in playwright.config.ts
```

### Slow Tests

```bash
# Run tests in parallel (default)
npx playwright test --workers=4

# Run in sequence
npx playwright test --workers=1

# Increase timeout
npx playwright test --timeout=60000
```

## 📁 Test File Locations

```
tests/
├── e2e/
│   ├── home.spec.ts                    # Original
│   ├── tutorial.spec.ts                # Original
│   ├── user-journeys.spec.ts           # NEW
│   └── real-world-scenarios.spec.ts    # NEW
├── integration/
│   └── user-interactions.test.tsx      # NEW
└── unit/
    └── components/...                  # Original
```

## 🔍 Finding Tests

```bash
# List all test files
find tests -name "*.spec.ts" -o -name "*.test.tsx"

# Search for specific test
grep -r "ユーザーが" tests/

# Count test cases
grep -r "test\|it" tests/ | wc -l
```

## 📝 Test Patterns

### E2E Test Structure

```typescript
test.describe('グループ名', () => {
  test('テスト名', async ({ page }) => {
    // Setup
    await page.goto('/');

    // Action
    await page.click('button');

    // Assert
    await expect(page.getByText('...')).toBeVisible();
  });
});
```

### Integration Test Structure

```typescript
describe('グループ名', () => {
  it('テスト名', async () => {
    // Arrange
    const user = userEvent.setup();
    render(<Component />);

    // Act
    await user.click(screen.getByRole('button'));

    // Assert
    expect(screen.getByText('...')).toBeInTheDocument();
  });
});
```

## 🎨 Interactive Tools

```bash
# Vitest UI (best for development)
npm run test:ui

# Playwright Test Generator
npx playwright codegen http://localhost:3000

# Playwright Inspector
npx playwright test --debug
```

## 📊 CI/CD Commands

```bash
# Typical CI flow
npm ci                      # Clean install
npm test                    # Unit + Integration
npm run build               # Build static site
npx playwright install --with-deps
npm run test:e2e           # E2E tests
```

## 🔗 Quick Links

- **Full Documentation**: `tests/USER_BEHAVIOR_TESTS.md`
- **Summary**: `NEW_TESTS_SUMMARY.md`
- **Checklist**: `TEST_IMPLEMENTATION_CHECKLIST.md`
- **Setup Script**: `setup-user-tests.sh`

## 💡 Tips

1. **Write tests first** (TDD) - Start with E2E user journey
2. **Run tests often** - Use watch mode during development
3. **Debug visually** - Use `--headed` and `--debug` flags
4. **Test real behavior** - Focus on user actions, not implementation
5. **Keep tests fast** - Mock slow operations, use fixtures
6. **Isolate tests** - Each test should be independent
7. **Use descriptive names** - Test name = user story

## 🆘 Help

```bash
# Playwright help
npx playwright test --help

# Vitest help
npx vitest --help

# List available commands
npm run
```

## 📞 Support

- **Playwright Docs**: https://playwright.dev/
- **Vitest Docs**: https://vitest.dev/
- **Testing Library**: https://testing-library.com/
- **Project Issues**: https://github.com/t0k0shi/git-training-ground/issues

---

**Last Updated**: 2026-02-11
