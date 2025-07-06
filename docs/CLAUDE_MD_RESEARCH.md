# Comprehensive CLAUDE.md Research for Claude Code

## Executive Summary

CLAUDE.md files are the cornerstone of effective AI-assisted
development with Claude Code. They serve as "persistent prompts" that
provide project-specific context, reducing the need for repetitive
explanations and ensuring consistent AI behavior across development
sessions. Based on official Anthropic documentation and community best
practices, these files can dramatically improve development
productivity when properly structured.

**Key Findings:**

- No hard file size limits, but token budget constraints apply
- Three-tier memory hierarchy system (Global, Project, Local)
- Advanced import system with @path/to/file syntax
- Average cost impact: $6 per developer per day for Claude Code usage
- Critical for team consistency and AI context retention

## Technical Specifications

### File Locations & Hierarchy

Claude Code uses a cascading memory system with three levels:

| Memory Type        | Location              | Purpose                               | Use Cases                                  |
| ------------------ | --------------------- | ------------------------------------- | ------------------------------------------ |
| **Global Memory**  | `~/.claude/CLAUDE.md` | Personal preferences for all projects | Code style preferences, personal shortcuts |
| **Project Memory** | `./CLAUDE.md`         | Team-shared project instructions      | Architecture, standards, workflows         |
| **Local Memory**   | `./CLAUDE.local.md`   | Personal project-specific preferences | _Deprecated_ - Use imports instead         |

### File Discovery Algorithm

1. **Startup Discovery**: Claude Code recursively searches from
   current working directory up to root (`/`)
2. **Runtime Discovery**: Additional CLAUDE.md files in subdirectories
   are loaded when Claude reads files in those areas
3. **Import Resolution**: Files can import others using
   `@path/to/file` syntax with max depth of 5 hops

### Import System Syntax

```markdown
# Basic Imports

See @README for project overview and @package.json for available
commands.

# Directory Structure Import

- Git workflow: @docs/git-instructions.md

# Home Directory Imports (for individual preferences)

- Personal settings: @~/.claude/my-project-instructions.md

# Import Exclusions

Code spans are ignored: `@anthropic-ai/claude-code` (not treated as
import)
```

## File Structure Guidelines

### Recommended Section Structure

```markdown
# CLAUDE.md

This file provides guidance to Claude Code when working with this
repository.

## Tech Stack

- Framework: [Framework Name and Version]
- Language: [Language and Version]
- Database: [Database Type]
- Styling: [CSS Framework]

## Project Structure

- `src/app/` - Application pages and routing
- `src/components/` - Reusable UI components
- `src/lib/` - Utilities and core logic
- `src/types/` - TypeScript type definitions

## Development Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run test` - Run test suite
- `npm run lint` - Run linting

## Code Style & Conventions

- Use ES modules (import/export)
- Prefer arrow functions for components
- Use TypeScript strict mode
- Follow conventional commit messages

## Environment Setup

Required environment variables (see .env.example):

- `API_KEY` - Service API key
- `DATABASE_URL` - Database connection string

## Do Not Touch

- Do not modify files in `src/legacy/`
- Do not commit directly to main branch
- Do not skip accessibility checks
```

## Best Practices

### 1. Be Lean and Intentional (Token Budget Management)

**The Golden Rule**: CLAUDE.md contents are prepended to every prompt,
consuming tokens.

**Do:**

- Use short, declarative bullet points
- Trim redundancy (if folder is named `components`, don't explain it
  contains components)
- Include only rules Claude _needs_ to know

**Don't:**

- Write long narrative paragraphs
- Include commentary or nice-to-have information
- Over-explain obvious directory structures

### 2. Start with `/init` and Iterate

**Bootstrap Process:**

1. Run `claude` in your project root
2. Use `/init` command to generate boilerplate CLAUDE.md
3. Iteratively refine based on actual usage

**Iterative Improvement:**

1. Add new instruction
2. Test with Claude task
3. Observe results
4. Refine instruction
5. Repeat

**Quick Addition:** Use `#` shortcut during sessions to add
instructions directly to CLAUDE.md

### 3. Structure for Clarity

Use standard Markdown headings for logical organization:

- `#` for major sections
- `##` for subsections
- Bullet points for lists
- Code blocks for commands/examples

### 4. Define Environment and Terminology

**Environment Setup Example:**

```markdown
# Virtual Environment

- Uses pyenv with Python 3.11
- Setup: `pyenv install 3.11.5 && pyenv local 3.11.5`
```

**Terminology Clarification:**

```markdown
# Project Terminology

- "Module" = data-processing pipeline in `src/modules/`, not generic
  JS module
- "Component" = React component with specific props interface
```

### 5. Version Control Integration

**Team Collaboration:**

- Commit main `CLAUDE.md` to Git for team consistency
- Use `CLAUDE.local.md` for personal preferences (add to .gitignore)
- Include CLAUDE.md changes in commit reviews

## Real-World Examples

### Example 1: Next.js Project (from danielbergholz/bergdaniel.com.br)

```markdown
# CLAUDE.md

This file provides guidance to Claude Code when working with this
repository.

## Development Commands

- `npm run dev` - Start development server on http://localhost:3000
- `npm run build` - Build for production
- `npm run format` - Format code with Biome
- `npm run check` - Run lint and typecheck (run before committing)

**IMPORTANT**: After code changes, always run:

1. `npm run format` - Format the code
2. `npm run check` - Verify no errors

## Architecture Overview

Next.js 15 personal website using App Router with TypeScript and
Tailwind CSS v4.

### Key Directories

- `src/app/` - Next.js App Router pages and layouts
- `src/components/` - Reusable UI components
- `src/data-access/` - API integration layer (YouTube, Dev.to)
- `src/lib/` - Types and utilities

### Data Fetching Pattern

Uses Server Components with ISR (24-hour revalidation):

- **YouTube Data API v3** - Course playlists
  (`src/data-access/youtube.ts`)
- **Dev.to API** - Blog articles (`src/data-access/blog.ts`)

### Environment Setup

Required variables (see `.env.example`):

- `YOUTUBE_API_KEY` - YouTube Data API key
- `YOUTUBE_CHANNEL_ID` - Channel ID for playlists
- `DEV_TO_API_KEY` - Dev.to API key

## MCP Tools

- **Context7 MCP** - Fetch updated docs for Next.js, Tailwind, Shadcn,
  Radix-UI
- **Playwright MCP** - Check visual changes with real browser
```

### Example 2: Effective Structure Template

```markdown
# Tech Stack

- Framework: Next.js 14
- Language: TypeScript 5.2
- Styling: Tailwind CSS 3.4

# Project Structure

- `src/app`: Next.js App Router pages
- `src/components`: Reusable React components
- `src/lib`: Core utilities and API clients

# Commands

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run test`: Run unit tests with Jest

# Code Style

- Use ES modules (import/export)
- Function components with Hooks only
- Prefer arrow functions for components

# Do Not Touch

- Do not edit `src/legacy` directory
- Do not commit directly to main branch
```

## Common Mistakes & Anti-Patterns

### Ineffective Patterns to Avoid

1. **Verbose Documentation**
   - ❌ Writing lengthy explanations like onboarding docs
   - ✅ Concise, actionable instructions for Claude

2. **Redundant Information**
   - ❌ Explaining obvious folder purposes
   - ✅ Only essential context Claude needs

3. **Generic Instructions**
   - ❌ "Format code properly"
   - ✅ "Use 2-space indentation for JavaScript"

4. **Missing Critical Commands**
   - ❌ Assuming Claude knows your build process
   - ✅ Explicitly list `npm run build`, test commands

5. **No "Do Not Touch" Section**
   - ❌ Letting Claude modify sensitive files
   - ✅ Clear restrictions on legacy code, configs

6. **Ignoring Token Budget**
   - ❌ Including nice-to-have information
   - ✅ Only essential instructions that affect AI behavior

### Problems with Poor CLAUDE.md Files

- Claude makes incorrect assumptions about project structure
- Repeated explanations needed in every session
- Inconsistent code style across team members
- AI modifies files it shouldn't touch
- Increased token consumption and costs

## Technical Constraints & Limitations

### Token Budget Impact

- **Cost Consideration**: Contents prepended to every prompt
- **Average Usage**: $6 per developer per day (90% of users stay below
  $12/day)
- **Optimization**: Use `ccusage` command to track consumption

### File Size Considerations

- **No Hard Limits**: No specific file size limits found in
  documentation
- **Practical Limits**: Constrained by Claude's context window (200k+
  tokens)
- **Recommendation**: Keep files focused and concise for cost
  efficiency

### Import System Limits

- **Max Depth**: 5-hop import chain maximum
- **Evaluation Context**: Imports not evaluated in code spans/blocks
- **Recursive Support**: Files can import other files that import more
  files

## Advanced Techniques

### Multi-Model Workflow

**Strategy**: Different models for different phases

- **Claude Opus**: Strategic planning and complex problem-solving
- **Claude Sonnet**: Rapid implementation and execution
- **Consistent Context**: CLAUDE.md ensures both models follow same
  project rules

**Implementation**:

1. Use Opus for initial planning phase
2. Switch to Sonnet for implementation (Shift + Tab in Claude Code)
3. Both models operate under same CLAUDE.md constraints

### Team Collaboration Patterns

**Version Control Integration**:

```bash
# Include CLAUDE.md in commits
git add CLAUDE.md
git commit -m "docs: update coding standards in CLAUDE.md"

# Personal overrides (not committed)
echo "# Personal preferences" > CLAUDE.local.md
echo "CLAUDE.local.md" >> .gitignore
```

**Team Onboarding**:

- New developers immediately get AI context through CLAUDE.md
- Consistent AI behavior across team members
- Shared knowledge base for project conventions

### Command Integration

**Memory Management Commands**:

- `/memory` - Edit memory files in system editor
- `/init` - Bootstrap new CLAUDE.md file
- `#` shortcut - Quick memory addition during sessions

**Usage Tracking**:

- `ccusage` - Monitor token consumption
- Track cost per developer for budget planning

## Implementation Guide

### Step 1: Initial Setup

1. **Navigate to project root**:

   ```bash
   cd your-project
   claude
   ```

2. **Bootstrap CLAUDE.md**:

   ```
   > /init
   ```

3. **Review generated file** and customize for your project

### Step 2: Structure Customization

1. **Add project-specific sections**:
   - Tech stack with versions
   - Critical commands
   - Directory structure
   - Environment variables

2. **Define restrictions**:
   - Files not to modify
   - Branches not to commit to
   - Required testing procedures

### Step 3: Team Integration

1. **Commit to version control**:

   ```bash
   git add CLAUDE.md
   git commit -m "feat: add Claude Code project memory"
   ```

2. **Document team workflow**:
   - Include CLAUDE.md updates in code reviews
   - Establish process for memory file maintenance

### Step 4: Iterative Improvement

1. **Monitor usage patterns**:
   - Track which instructions Claude follows/ignores
   - Identify missing context through repeated explanations

2. **Refine regularly**:
   - Update as project evolves
   - Remove outdated instructions
   - Add new patterns and conventions

### Step 5: Advanced Features

1. **Implement import system**:

   ```markdown
   # Import shared standards

   - Coding standards: @docs/coding-standards.md
   - Git workflow: @docs/git-workflow.md
   ```

2. **Create personal overrides**:

   ```markdown
   # CLAUDE.local.md (not committed)

   # Personal preferences for this project

   - Debug with console.log (remove before commit)
   - Use verbose variable names for clarity
   ```

## Conclusion

CLAUDE.md files represent a paradigm shift in AI-assisted development,
transforming Claude from a generic coding assistant into a
project-aware team member. The key to success lies in treating these
files as living documentation that evolves with your project while
maintaining focus on actionable, cost-effective instructions.

**Success Factors**:

1. **Lean and intentional** content respecting token budgets
2. **Clear structure** with logical organization
3. **Team collaboration** through version control
4. **Iterative refinement** based on actual usage
5. **Technical precision** in commands and constraints

When properly implemented, CLAUDE.md files can reduce development
friction, improve code consistency, and enable more effective AI
collaboration across entire development teams.

---

_Research compiled from official Anthropic documentation, community
best practices, and analysis of production CLAUDE.md files. Last
updated: 2025-01-06_
