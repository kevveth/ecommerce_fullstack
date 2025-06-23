# Shared Package

This package contains shared code between the client and server applications in our e-commerce project.

## Features

### Zod v4 Schemas

We use Zod v4 for schema validation throughout the application. The shared schemas ensure consistent validation between the frontend and backend.

Key changes in Zod v4:

1. **New API Format**: Using top-level schema methods like `z.email()` instead of `z.string().email()`
2. **Error Handling**: Using `z.prettifyError()` instead of deprecated `.flatten()` or `.format()` methods
3. **Object Schemas**: Using `z.looseObject()` instead of `.passthrough()`
4. **Transforms**: Using `.pipe(z.transform())` for better composition

### Shared Environment Schemas

The `env.ts` file contains shared environment validation schemas used by both the server and client applications.

### Type Exports

All schemas export their TypeScript types using `z.infer<typeof schemaName>`, ensuring type safety throughout the application.

## Usage

Import schemas and types from this package:

```ts
import {
  userSchema,
  registrationSchema,
  loginSchema,
  type User,
  type RegistrationInput,
  type LoginInput,
} from "@workspace/schemas";
```

## Error Handling

Zod v4 provides improved error handling through the `z.prettifyError()` function:

```ts
import { z } from "zod/v4";
import { registrationSchema } from "@workspace/schemas";

try {
  const result = registrationSchema.parse(formData);
  // Success - use result
} catch (error) {
  if (error instanceof z.ZodError) {
    // Format errors for UI display
    const formattedErrors = z.prettifyError(error);
    // Handle formatted errors
  }
}
```
