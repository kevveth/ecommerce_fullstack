# Zod v4 Migration Guide

This document provides guidance for developers on our migration to Zod v4 from earlier versions.

## Key Changes

### 1. Schema Definition

#### Top-level Type Constructors

Use the new top-level string format constructors:

```ts
// OLD (Zod v3)
z.string().email();
z.string().url();
z.string().uuid();

// NEW (Zod v4)
z.email();
z.url();
z.uuid();
```

### 2. Object Schemas

Use the new object schema constructors:

```ts
// OLD (Zod v3)
z.object({...}).passthrough()
z.object({...}).strict()

// NEW (Zod v4)
z.looseObject({...})
z.strictObject({...})
```

### 3. Error Handling

Use the new error formatting functions:

```ts
// OLD (Zod v3)
result.error.format();
result.error.flatten();

// NEW (Zod v4)
z.prettifyError(result.error);
z.treeifyError(result.error);
```

### 4. Transforms

Use `.pipe()` for better composition with transforms:

```ts
// OLD (Zod v3)
schema.transform((data) => {...})

// NEW (Zod v4)
schema.pipe(z.transform((data) => {...}))
```

### 5. Custom Error Messages

Use the `error` parameter instead of `errorMap`:

```ts
// OLD (Zod v3)
z.string({
  errorMap: (issue, ctx) => ({ message: "Custom message" }),
});

// NEW (Zod v4)
z.string({
  error: () => "Custom message",
});
```

### 6. Enum Handling

Use `z.enum()` directly for TypeScript enums:

```ts
// OLD (Zod v3)
z.nativeEnum(MyEnum);

// NEW (Zod v4)
z.enum(MyEnum);
```

## Benefits

- **Better Performance**: Zod v4 is optimized for performance
- **Improved Error Handling**: More consistent error output with `prettifyError`
- **Enhanced Type Safety**: Better TypeScript integration
- **Cleaner API**: More intuitive API design

## Additional Resources

- [Zod v4 Documentation](https://v4.zod.dev/basics)
- [Zod v4 Migration Guide](https://v4.zod.dev/v4/changelog)
