---
description: "shadcn/ui component system and development guidelines"
applyTo: "packages/ui/**, apps/client/**"
---

# shadcn/ui Development Guidelines

## Architecture

### Monorepo Setup

- Components located in `packages/ui/src/components/`
- Import via `@workspace/ui/components/[component]`
- Configuration in `packages/ui/components.json`
- Theme: "new-york" style with neutral base color
- CSS variables enabled for theming

### Component Organization

```typescript
// Import pattern
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardHeader } from "@workspace/ui/components/card";
import { cn } from "@workspace/ui/lib/utils";
```

## CLI Commands

### Initial Setup

```bash
# Add new components to packages/ui
cd packages/ui
pnpm dlx shadcn@latest add [component]

# Add all available components
pnpm dlx shadcn@latest add --all
```

### Component Management

```bash
# Add specific components
pnpm dlx shadcn@latest add button card form input

# Force overwrite existing
pnpm dlx shadcn@latest add button --overwrite

# Add with custom path
pnpm dlx shadcn@latest add button --path src/components/ui
```

## Configuration

### components.json

- Style: `"new-york"`
- Base color: `"neutral"`
- CSS variables: `true`
- RSC enabled: `true`
- Icon library: `"lucide"`

### Aliases

- Components: `@workspace/ui/components`
- Utils: `@workspace/ui/lib/utils`
- Hooks: `@workspace/ui/hooks`

## Component Development

### Form Integration

```typescript
// Standard form pattern with React Hook Form + Zod
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";

const schema = z.object({
  email: z.email("Invalid email"),
  password: z.string().min(6, "Password too short"),
});

const form = useForm<z.infer<typeof schema>>({
  resolver: zodResolver(schema),
});
```

### Styling Patterns

```typescript
// Use cn() utility for conditional classes
import { cn } from "@workspace/ui/lib/utils";

const buttonVariants = cva("inline-flex items-center justify-center gap-2", {
  variants: {
    variant: {
      default: "bg-primary text-primary-foreground",
      destructive: "bg-destructive text-destructive-foreground",
    },
  },
});
```

### Component Composition

```typescript
// Proper component composition
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    <Form {...form}>
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </Form>
  </CardContent>
</Card>
```

## Theming

### CSS Variables

- Uses CSS variables for theming (`--background`, `--foreground`, etc.)
- Supports light/dark mode via `.dark` class
- Global styles in `packages/ui/src/styles/globals.css`

### Color System

```css
:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
  --primary-foreground: oklch(0.985 0 0);
  /* ... */
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  /* ... */
}
```

### Custom Colors

```css
/* Add new color variables */
:root {
  --warning: oklch(0.84 0.16 84);
  --warning-foreground: oklch(0.28 0.07 46);
}

/* Use in Tailwind */
@theme inline {
  --color-warning: var(--warning);
  --color-warning-foreground: var(--warning-foreground);
}
```

## Available Components

### Current Components

- avatar
- button
- card
- checkbox
- dropdown-menu
- form
- input
- label
- navigation-menu
- sheet

### Dependencies

- Radix UI primitives
- Lucide icons
- class-variance-authority (cva)
- tailwind-merge + clsx (cn utility)
- React Hook Form integration

## Development Rules

### Import Standards

- Always use workspace aliases: `@workspace/ui/components/[component]`
- Import utils from `@workspace/ui/lib/utils`
- Use named imports for component parts

### Component Guidelines

- Follow shadcn/ui composition patterns
- Use `cn()` for conditional styling
- Maintain TypeScript interfaces for all props
- Include proper accessibility attributes
- Use React Hook Form for form components

### Styling Rules

- Use CSS variables for theming
- Follow background/foreground naming convention
- Maintain design system consistency
- Test in both light and dark modes

### Form Patterns

- Use React Hook Form with Zod validation
- Integrate Form components for consistency
- Handle loading and error states
- Implement proper form accessibility

### AI Agent Guidelines

- Prefer existing shadcn/ui components over custom implementations
- Use composition over modification when possible
- Maintain component API consistency
- Follow established patterns for new components
- Test components in isolation and within forms
