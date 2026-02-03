# Contributing to Git Training Ground

Thank you for your interest in contributing! This project is designed for beginners to practice Git and Pull Requests.

## How to Contribute

### Adding yourself to contributors.json

1. **Fork** this repository
2. **Clone** your fork locally
3. **Create a branch**: `git checkout -b add-YOUR_NAME`
4. **Edit** `data/contributors.json` - add your entry at the end of the `contributors` array:

```json
{
  "name": "your-github-username",
  "github": "https://github.com/your-github-username",
  "favoriteColor": "#FF6B6B",
  "favoriteEmoji": "🎉",
  "message": "Hello from your-name!",
  "joinedAt": "2026-02-03",
  "prNumber": 0
}
```

5. **Commit**: `git commit -m "Add your-name to contributors"`
6. **Push**: `git push origin add-YOUR_NAME`
7. **Create a Pull Request** against the `main` branch

### Field Requirements

| Field | Rules |
|-------|-------|
| name | 3-20 characters, alphanumeric + hyphens + underscores |
| github | `https://github.com/YOUR_USERNAME` |
| favoriteColor | Hex color code (`#XXXXXX`) |
| favoriteEmoji | Single emoji |
| message | Optional, max 50 characters |
| joinedAt | Today's date (`YYYY-MM-DD`) |
| prNumber | Set to `0` (auto-assigned after merge) |

### CI Checks

Your PR will be automatically checked for:
- Valid JSON format
- Schema compliance
- No duplicate entries
- Author verification
- NG word filter
- Build success

### Resolving Conflicts

If your PR has conflicts:
1. Delete your branch
2. Create a new branch from the latest `main`
3. Re-add your entry
4. Create a new PR

## Code of Conduct

Please read our [Code of Conduct](CODE_OF_CONDUCT.md) before contributing.
