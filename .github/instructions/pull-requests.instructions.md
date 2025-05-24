# Pull Request Instructions

## Title Format

Use conventional commit format for PR titles: `type(scope): description`

Follow the same type and scope guidelines as commits, but make the description more comprehensive since PRs can contain multiple commits.

## Description Template

### Summary

Provide a clear, concise summary of what this PR accomplishes.

### Changes Made

- List the key changes in bullet points
- Focus on what was added, modified, or removed
- Mention affected components, files, or systems

### Type of Change

- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update
- [ ] Performance improvement
- [ ] Code refactoring
- [ ] Test coverage improvement

### Testing

- Describe how the changes were tested
- Include any new test cases added
- Mention manual testing performed
- List any edge cases considered

### Related Issues

- Link to related issues using `Fixes #123` or `Closes #123`
- Reference any related PRs or discussions

### Screenshots/Videos

Include screenshots or videos for UI changes (when applicable).

### Checklist

- [ ] Code follows the project's coding standards
- [ ] Self-review of code completed
- [ ] Tests added/updated and passing
- [ ] Documentation updated (if needed)
- [ ] No breaking changes (or breaking changes documented)
- [ ] Lint and type checks pass

### Breaking Changes

If this PR introduces breaking changes, describe:

- What breaks
- Why the change was necessary
- Migration steps for users

### Additional Notes

Any additional context, concerns, or considerations for reviewers.

## Examples

### Feature PR

```
feat(auth): Implement JWT refresh token mechanism

## Summary
Adds automatic token refresh functionality to maintain user sessions without requiring manual login.

## Changes Made
- Added refresh token endpoint in auth controller
- Implemented token rotation strategy
- Updated client-side auth context to handle token refresh
- Added middleware for automatic token validation
- Updated user model to include refresh token storage

## Type of Change
- [x] New feature (non-breaking change which adds functionality)

## Testing
- Added unit tests for refresh token controller
- Added integration tests for token rotation
- Manually tested token expiry scenarios
- Verified cross-browser compatibility

## Related Issues
Fixes #45
Related to #23

## Checklist
- [x] Code follows the project's coding standards
- [x] Self-review of code completed
- [x] Tests added/updated and passing
- [x] Documentation updated
- [x] No breaking changes
- [x] Lint and type checks pass
```

### Bug Fix PR

```
fix(client): Resolve navigation state persistence issue

## Summary
Fixes issue where navigation state was lost after page refresh, causing users to be redirected incorrectly.

## Changes Made
- Updated useRoutePersistence hook to handle edge cases
- Added localStorage fallback for navigation state
- Fixed race condition in AuthContext initialization

## Type of Change
- [x] Bug fix (non-breaking change which fixes an issue)

## Testing
- Verified fix across different browser refresh scenarios
- Added regression tests for navigation persistence
- Tested with different authentication states

## Related Issues
Fixes #67

## Checklist
- [x] Code follows the project's coding standards
- [x] Self-review of code completed
- [x] Tests added/updated and passing
- [x] No breaking changes
- [x] Lint and type checks pass
```
