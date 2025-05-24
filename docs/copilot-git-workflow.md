# Copilot Git Workflow Quick Reference

This document explains how to use GitHub Copilot's enhanced Git workflow features in this project.

## Commit Message Generation

1. **Stage your changes** in the Source Control view (`Cmd+Shift+G`)
2. **Click the sparkle icon (✨)** next to the commit message field
3. **Copilot will analyze your changes** and suggest a commit message following conventional commit format

### Manual Copilot Chat for Commits

You can also ask Copilot Chat to generate commit messages:

```
@github Generate a commit message for my staged changes using conventional commit format
```

## Pull Request Creation

1. **Create a branch** and make your changes
2. **Push your branch** to the remote repository
3. **Use the GitHub: Create Pull Request command** (`Cmd+Shift+P` → "GitHub: Create Pull Request")
4. **Click the sparkle icon (✨)** next to the title and description fields
5. **Copilot will generate** a comprehensive PR title and description

### Manual Copilot Chat for PRs

You can also ask Copilot Chat to help with PRs:

```
@github Help me write a pull request description for the changes in this branch
@github What should I include in this PR description?
```

## Code Reviews with Copilot

1. **Open a pull request** in the GitHub Pull Requests view
2. **Navigate to the "Files Changed" tab**
3. **Click "Copilot Code Review"** button
4. **Review Copilot's suggestions** and comments

### Manual Code Review

You can also ask Copilot to review specific code:

```
@github Review this code for potential issues
@github Check this code for security vulnerabilities
@github Suggest improvements for this function
```

## Repository Insights

Use the `@github` participant to get insights about your repository:

```
@github What are all of the open PRs assigned to me?
@github Show me the recent merged PRs
@github Summarize the changes in PR #123
@github What issues are currently open?
@github Show me the commit history for this file
```

## Smart Actions

Right-click on code to access Copilot smart actions:

- **Copilot** → **Fix** - Resolve errors and issues
- **Copilot** → **Generate Tests** - Create test coverage
- **Copilot** → **Generate Docs** - Add documentation
- **Copilot** → **Explain** - Get explanations of complex code

## Custom Instructions

This project uses custom instruction files to ensure Copilot generates code that follows our standards:

- **Commits:** `.github/instructions/commits.instructions.md`
- **Pull Requests:** `.github/instructions/pull-requests.instructions.md`
- **React:** `.github/instructions/react.instructions.md`
- **Zod:** `.github/instructions/zod.instructions.md`
- **React Router:** `.github/instructions/react-router.instructions.md`
- **TanStack Query:** `.github/instructions/tanstack-react-query.instructions.md`
- **Turborepo:** `.github/instructions/turbo.instructions.md`

## Configuration

All Copilot settings are configured in `.vscode/settings.json` including:

- Custom instruction file references
- Commit message generation settings
- Pull request description generation settings
- Code review settings

## Tips

1. **Be specific** when asking Copilot for help
2. **Reference files or functions** by name when asking questions
3. **Use conventional commit prefixes** (feat, fix, docs, etc.) for better commit suggestions
4. **Stage only related changes** for more accurate commit message generation
5. **Review suggestions** before accepting them
