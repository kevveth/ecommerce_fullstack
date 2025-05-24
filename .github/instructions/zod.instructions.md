<!--
For general TypeScript, React, and project-wide coding standards, see the main Copilot instructions file at '../../copilot-instructions.md'.
-->

# Zod v4 Copilot Coding Instructions

## Installation & Import

- Install with `npm i zod`.
- Always import as `import { z } from "zod/v4"`.

## Defining Schemas

- Use `z.object({ ... })` for objects, `z.array(...)` for arrays, `z.union([...])` for unions, `z.enum([...])` for enums.
- Use `.optional()`, `.nullable()`, `.default()`, `.catch()`, and `.coerce` for flexible schemas.
- Use `.refine()` or `.check()` for custom validation logic.
- Compose schemas with `.extend()`, `.merge()`, `.pick()`, `.omit()`, `.partial()`, `.required()`.
- Use `.readonly()` and `.brand()` for readonly and branded types.

## Parsing & Validation

- Use `.parse()` for trusted data, `.safeParse()` for untrusted/user input.
- Use `.parseAsync()`/`.safeParseAsync()` for async refinements or transforms.
- Use `z.infer<typeof Schema>` for static type inference.

## Error Handling

- Use `.safeParse()` to avoid exceptions and handle errors gracefully.
- Use `z.treeifyError()` for nested error reporting, `z.prettifyError()` for human-readable errors.
- Customize error messages with the `error` param or error maps.
- Use schema-level, per-parse, or global error customization as needed.

## TypeScript Integration

- Use `interface` for extendable object shapes, `type` for unions/primitives.
- Use `as const` for literal arrays/enums.
- Prefer type guards over type assertions.
- Use Zod utility types and schema methods for transformations.

## Example Patterns

```typescript
import { z } from "zod/v4";

const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  age: z.number().int().min(0).optional(),
});

type User = z.infer<typeof UserSchema>;

const result = UserSchema.safeParse(data);
if (!result.success) {
  // Handle errors, e.g. z.treeifyError(result.error)
}
```

## Resources

- [Zod Docs](https://zod.dev/)
- [API Reference](https://zod.dev/api)
- [Error Customization](https://zod.dev/error-customization)
- [Error Formatting](https://zod.dev/error-formatting)

<!-- End of Zod custom instructions -->
