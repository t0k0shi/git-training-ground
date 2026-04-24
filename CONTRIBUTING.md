# Contributing to Git Training Ground

Thank you for your interest in contributing! This project is designed for beginners to practice Git and Pull Requests.

## How to Contribute

### Adding your entry to `data/contributors.json`

1. **Fork** this repository
2. Open `data/contributors.json` in your fork
3. Click the **pencil icon** (Edit this file) to enter edit mode
4. **Add your entry** to the end of the array:

```json
[
  {
    "name": "ketts",
    "github": "t0k0shi",
    "favoriteColor": "#E63946",
    "favoriteEmoji": "🚀",
    "message": "はじめてのOSS貢献！",
    "joinedAt": "2026-04-24"
  },
  {
    "name": "Your Name",
    "github": "your-github-handle",
    "favoriteColor": "#FF5E5B",
    "favoriteEmoji": "🦊",
    "message": "Nice to meet you!",
    "joinedAt": "2026-04-24"
  }
]
```

5. Choose **"Create a new branch for this commit and start a pull request"**
6. Click **"Propose changes"** to commit
7. Go to the **original repository** (`t0k0shi/git-training-ground`) and click **"Compare & pull request"**
8. Click **"Create pull request"**

### Required Fields

| Field | Description | Example |
|-------|-------------|---------|
| `name` | Display name | `"ketts"` |
| `github` | GitHub handle (or full URL) | `"t0k0shi"` |
| `favoriteColor` | Card border color (`#RRGGBB` hex) | `"#E63946"` |
| `favoriteEmoji` | A single emoji character | `"🚀"` |
| `message` | Short introduction | `"Nice to meet you!"` |
| `joinedAt` | Date you submit the PR (`YYYY-MM-DD`) | `"2026-04-24"` |

### Rules

- Add your entry at **the end of the array**
- Do **not** delete or modify other people's entries
- Each PR should add **exactly one entry**
- Don't forget the **comma** after the previous entry's closing `}`
- `favoriteColor` must match `#RRGGBB` (6 hex characters)
- `favoriteEmoji` must be a single grapheme (1 character); emoji sequences like `👨‍👩‍👧` count as one

### CI Checks

Your PR will be automatically validated:

- JSON parses correctly
- Required fields are present and non-empty
- `favoriteColor` matches `#RRGGBB`
- `joinedAt` matches `YYYY-MM-DD`
- `github` handle is not a duplicate of an existing entry
- `favoriteEmoji` is exactly 1 grapheme cluster
- No existing entries are deleted or modified
- Only 1 entry is added per PR
- The site builds successfully

### AI Review

Pull requests that modify code (not just `contributors.json`) will receive an automated review from **CodeRabbit**. Reviews are posted in Japanese.

- If the `do-not-merge` label is applied, please check and address the AI's feedback
- Mention `@coderabbitai` in a comment to ask the bot for clarification or a re-review
- Feel free to ask for help in the PR comments if you're unsure about anything — a maintainer will help

### Local Validation

Before submitting, you can validate locally:

```bash
npx tsx scripts/validate-contributors.ts
```

### Resolving Conflicts

If your PR has conflicts:

1. Open your fork's `data/contributors.json` on GitHub
2. Edit the file to include both your entry and the latest entries from `main`
3. Watch out for the trailing comma on the previous entry
4. Commit the resolution to your branch

If you're unsure, just comment on the PR — a maintainer will help.

## Code of Conduct

Please read our [Code of Conduct](CODE_OF_CONDUCT.md) before contributing.
