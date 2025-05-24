# Modern Authentication with TanStack Query

## Executive Summary

This document describes the authentication system implemented in the e-commerce application. The approach uses TanStack Query for state management, providing secure user authentication while maintaining a smooth user experience. The system handles token refreshing automatically.

## Design Decisions & Notable Features

The authentication system implements a robust authentication flow integrated with TanStack Query for optimized state management. The architecture follows security best practices by separating token storage mechanisms: short-lived access tokens (15 minutes) are stored exclusively in memory to prevent XSS vulnerabilities, while longer-lived refresh tokens (7 days) are stored as HTTP-only cookies inaccessible to JavaScript. This dual-token approach provides strong security while maintaining a seamless user experience. The implementation includes database-backed refresh token tracking that allows for immediate token revocation and account security management. The system is fortified against common attack vectors like CSRF through SameSite cookie attributes and token reuse through a rotation strategy that invalidates tokens after each refresh.

The integration with TanStack Query creates a highly responsive and efficient authentication layer. By treating authentication as a reactive query, the system leverages TanStack's sophisticated caching, stale time management, and automatic refetching capabilities. This approach eliminates redundant network requests while keeping authentication state fresh. The authentication context exposes a simple, consistent API for components while abstracting the complexity of token management. The automatic token refresh mechanism uses axios interceptors to transparently handle token expiration, pausing requests during refresh operations and automatically retrying them once new tokens are obtained. This creates a seamless experience where users rarely encounter authentication errors even during extended sessions.

Type safety and validation are cornerstones of this implementation, with Zod schemas ensuring strict data validation at all critical boundaries. The authentication system gracefully handles edge cases like network failures and token corruption, providing clear error messages while maintaining a secure state. The entire flow supports traditional username/password authentication, with a unified token infrastructure. This architecture demonstrates how modern React patterns, TypeScript, and security best practices can be combined to create a robust authentication system that's both secure and developer-friendly.

## Security Considerations

The authentication flow addresses several important security concerns:

- **XSS Protection**: Access tokens are stored in memory instead of localStorage
- **CSRF Mitigation**: Uses SameSite cookie attributes
- **Token Security**: Keeps refresh tokens in HTTP-only cookies that JavaScript can't access
- **Token Rotation**: Invalidates old tokens when issuing new ones

## TanStack Query vs Axios Refresh: Complementary Roles

The authentication system uses two main technologies for token management:

1. **TanStack Query** handles the high-level authentication state:

   - Manages the user authentication data as a query
   - Provides caching and automatic refetching
   - Controls when data needs to be refreshed (stale time)
   - Makes authentication reactive instead of imperative

2. **Axios-auth-refresh** handles the low-level token renewal:
   - Intercepts 401 (Unauthorized) responses
   - Automatically triggers token refresh
   - Pauses and queues requests during refresh
   - Retries failed requests with the new token

Together, they create a seamless authentication experience with minimal disruptions.

## Key Technologies

- **TanStack Query**: For state management with built-in caching
- **Zod**: Type validation to ensure data integrity
- **Axios + axios-auth-refresh**: HTTP client with automatic token refresh
- **Express/Node.js**: Server-side implementation
- **HTTP-only Cookies**: Secure storage for refresh tokens
- **Memory Storage**: For access tokens to prevent XSS attacks
