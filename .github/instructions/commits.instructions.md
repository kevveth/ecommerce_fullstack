# Commit Message Instructions

## Format

Use conventional commit format: `type(scope): description`

## Types

- **feat**: A new feature for the user
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that do not affect the meaning of the code (white-space, formatting, etc.)
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **test**: Adding missing tests or correcting existing tests
- **chore**: Changes to build process, auxiliary tools, or maintenance
- **perf**: A code change that improves performance
- **ci**: Changes to CI configuration files and scripts
- **build**: Changes that affect the build system or external dependencies

## Scope Guidelines

- **client**: Changes to the React frontend application
- **server**: Changes to the Express.js backend
- **shared**: Changes to shared types/schemas
- **db**: Database-related changes
- **auth**: Authentication/authorization changes
- **api**: API endpoints or middleware
- **ui**: UI/UX components or styling
- **config**: Configuration changes

## Rules

1. Keep the first line under 50 characters
2. Use present tense ("Add feature" not "Added feature")
3. Use imperative mood ("Fix bug" not "Fixes bug")
4. Capitalize the first letter of the description
5. Do not end with a period
6. Include a scope when the change affects a specific area
7. Use body for additional context when needed (separate with blank line)

## Examples

```
feat(auth): Add JWT refresh token mechanism
fix(client): Resolve navigation state persistence issue
docs(api): Update authentication endpoint documentation
refactor(server): Extract user validation to shared schema
test(client): Add unit tests for useUserProfile hook
chore(deps): Update React Router to v6.8
```

## Breaking Changes

For breaking changes, add `!` after the scope:

```
feat(api)!: Change user profile endpoint response format

BREAKING CHANGE: The user profile endpoint now returns nested user data structure
```
