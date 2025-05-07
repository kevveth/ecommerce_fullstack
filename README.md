# E-commerce Full-Stack Project

This repository contains a full-stack e-commerce application built as a learning exercise. The project uses a fictional coffee shop as the business model, but the primary focus is on implementing and understanding key web development concepts and technologies.

The application is structured as a monorepo using Turbo and pnpm, with a React/TypeScript frontend, Node.js/Express backend, and PostgreSQL database. Through building this project, I've implemented and gained experience with:

- JWT authentication with access and refresh token handling
- Type safety across frontend and backend using TypeScript and Zod
- RESTful API design with structured error handling
- State management with React Context and React Query

This is my first substantial full-stack application, developed to strengthen my skills in modern web development practices.

![Project Status](https://img.shields.io/badge/status-in%20development-yellow)

## Technologies Used

- **Frontend:**
  - React: A JavaScript library for building user interfaces.
  - TypeScript: A superset of JavaScript that adds static typing for improved code quality.
  - CSS Modules: For styling components with scoped CSS.
  - React Router: For client-side routing.
  - React Query: For asynchronous state management and data fetching.
- **Backend:**
  - Node.js: A JavaScript runtime environment.
  - Express: A web application framework for Node.js.
  - PostgreSQL: A powerful and open-source relational database.
- **DevOps & Tools:**
  - Turbo: For monorepo management.
  - pnpm: As the package manager.
  - Vitest: For testing.
- **Authentication & Security:**
  - Jose: Modern JavaScript library for JSON Object Signing and Encryption (JOSE) standards for JWT handling.
  - JWT: Secure token-based authentication with short-lived access tokens and HTTP-only refresh tokens.
  - bcrypt: For secure password hashing with configurable salt rounds.
  - Passport: For handling Google OAuth authentication flow.
  - Role-based access control: Different permissions for regular users and administrators.
- **Validation & Type Safety:**
  - Zod v4: For schema validation with enhanced error formatting using z.prettifyError.
  - Shared schemas: Common validation schemas used across frontend and backend.
  - TypeScript: For static type checking and code completion.
  - Custom error handling: Structured error responses for validation failures.

## Project Structure

This project is organized as a monorepo with the following structure:

```
ecommerce_fullstack/
├── apps/
│   ├── client/      # React frontend application
│   └── server/      # Express backend API
└── packages/
    └── shared/      # Shared code, types and schemas
```

## Features

- **Product Browsing:** Browse and search for coffee products with detailed information.
- **User Authentication:**
  - Secure user registration and login with email/password
  - Google OAuth integration for social login
  - JWT-based authentication with access and refresh tokens
  - Automatic token refresh using HTTP-only cookies
  - Role-based authorization for protected routes
- **User Profile Management:**
  - View and edit user information
  - Save multiple shipping addresses
  - Username-based profile viewing
- **Security Features:**
  - Protected routes for authenticated users
  - Secure password hashing with bcrypt
  - Input validation using Zod v4 with enhanced error formatting
  - CSRF protection with SameSite cookies
  - HTTP-only cookies for sensitive tokens

## Installation & Setup

### Prerequisites

- Node.js (v16 or newer)
- pnpm package manager
- PostgreSQL database

### Initial Setup

1. Clone the repository:

   ```bash
   git clone [repository-url]
   cd ecommerce_fullstack
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Set up environment variables:

   - Create `.env` files in both `apps/client` and `apps/server` directories
   - Required variables for server:
     ```
     PORT=3001
     DATABASE_URL=postgresql://username:password@localhost:5432/ecommerce
     JWT_SECRET=your_jwt_secret
     JWT_REFRESH_SECRET=your_jwt_refresh_secret
     GOOGLE_CLIENT_ID=your_google_client_id
     GOOGLE_CLIENT_SECRET=your_google_client_secret
     CLIENT_URL=http://localhost:5173
     ```
   - Required variables for client:
     ```
     VITE_SERVER_URL=http://localhost:3001
     ```

4. Initialize the database:

   - Create a PostgreSQL database named 'ecommerce'
   - The application will automatically initialize the database schema when it starts
   - Database schema is defined in `apps/server/src/database/ecommerce.sql`
   - You can start the server with: `pnpm --filter server dev`

## Usage

### Development

To run the project in development mode:

```bash
# From project root
pnpm run dev  # Starts both client and server with Turbo

# Or run individually
pnpm --filter client dev  # Runs Vite dev server on port 5173
pnpm --filter server dev-server  # Compiles TypeScript and runs the server with auto-reload
```

# Alternative development command for server

# Just compiles TypeScript without running the server:

pnpm --filter server dev

### Testing

To run tests:

```bash
# Run all tests
pnpm test

# Run server tests with Vitest
pnpm --filter server test

# Run tests with coverage reporting
pnpm --filter server test:coverage

# Run tests in watch mode
pnpm --filter server test:watch

# Run tests with UI
pnpm --filter server test:ui
```

## Database Structure

The application uses PostgreSQL with the following key tables:

- **Users**: Stores user credentials, profile information, and supports both local and Google authentication
- **RefreshTokens**: Manages JWT refresh tokens for secure authentication
- **Products & Categories**: Organizes the coffee product catalog with relationships
- **Carts & CartItems**: Tracks user shopping carts with product quantities and pricing
- **Orders & OrderItems**: Records completed purchases with customer information
- **Reviews**: Stores product reviews with ratings and text

## Known Limitations

- Checkout functionality is currently in development
- Limited internationalization support
- Error handling for React components could be enhanced with more comprehensive error boundaries
- Frontend state management could benefit from more organization as the application grows
- Current focus is on authentication and user management; product catalog features need expansion

## TODO

- **Deployment Instructions**: Documentation for deploying to production environments
- **License Information**: Add appropriate license for the project
