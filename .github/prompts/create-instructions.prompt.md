---
mode: agent
description: "Template for creating comprehensive instruction files for AI agents"
---

Analyze the codebase and create `.github/instructions/{topic}.instructions.md`. The file guides future AI coding agents working in this repository.

## Requirements

- **Core Commands**: Include essential CLI commands, build processes, and development workflows
- **High-Level Architecture**: Document key patterns, file organization, and integration points detected in the codebase
- **Repository-Specific Rules**: Extract style guidelines, naming conventions, and configuration patterns from actual code
- **Agent Guidelines**: Add specific rules for AI agents working with this technology stack

## Style Guidelines

- **Be Concise**: Skip boilerplate, generic advice, or exhaustive file listings
- **Never Overwrite Blindly**: Always analyze existing patterns before suggesting changes
- **Use Structured Markdown**: Organize with headings (`##`, `###`) and bullet points
- **Minimal Prose**: Keep explanations brief and actionable
- **Cite Facts Only**: Reference actual code, configurations, and documented practices - don't invent information

## Research Instructions

Use #fetch_webpage to gather up-to-date information and best practices from official documentation. You have permission to crawl through multiple subdirectories and pages to ensure comprehensive coverage.

## Output Structure

```markdown
---
description: "Brief description of the technology/topic"
applyTo: "file patterns where this applies"
---

# {Topic} Development Guidelines

## Architecture

- Key structural patterns
- Integration points
- Configuration details

## CLI Commands

- Essential commands
- Development workflows
- Build processes

## Configuration

- Key settings and files
- Environment setup
- Integration patterns

## Development Rules

- Code standards
- Import/export patterns
- AI agent specific guidelines
```
