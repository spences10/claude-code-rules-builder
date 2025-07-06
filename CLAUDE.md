# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when
working with code in this repository.

## Project Overview

CLAUDE.md Generator - A sophisticated web-based tool that generates
advanced CLAUDE.md files through a guided interface, supporting both
practical project configuration and multi-agent persona systems for
complex development workflows. Based on research revealing that
personas enable sophisticated subagent delegation and coordination.

## Tech Stack

- Framework: SvelteKit 2.x with Svelte 5 runes
- Language: TypeScript 5.x
- Styling: TailwindCSS 4.0 with DaisyUI 5.0
- Testing: Vitest (unit) + Playwright (e2e)
- Package Manager: pnpm preferred
- Build Tool: Vite

## Development Commands

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build
- `npm run check`: Run TypeScript checks and Svelte validation
- `npm run check:watch`: Run TypeScript checks in watch mode
- `npm run format`: Format code with Prettier
- `npm run lint`: Run Prettier check and ESLint
- `npm run test:unit`: Run unit tests with Vitest
- `npm run test:e2e`: Run end-to-end tests with Playwright
- `npm run test`: Run all tests (unit + e2e)

**Important**: Always run `npm run format` and `npm run lint` before
committing.

## Architecture Overview

This is a client-side SvelteKit application with no backend -
generates CLAUDE.md files entirely in the browser based on user
configuration through a multi-step wizard.

### Key Architecture Concepts

- **State Management**: Single global state using Svelte 5 `$state`
  rune in `src/lib/stores/config.svelte.ts`
- **Template System**: Function-based templates in
  `src/lib/templates/` that generate CLAUDE.md content
- **Component Structure**: Wizard-based UI with step navigation and
  real-time preview
- **Storage**: Browser localStorage for drafts and user preferences
  only
- **Icons**: Individual Svelte components in `src/lib/icons/` with
  props support

### Planned Directory Structure

```
src/lib/
├── stores/
│   ├── config.svelte.ts         # Global state management
│   └── persona.svelte.ts        # Persona system state
├── components/                   # UI components
│   ├── ConfigWizard.svelte      # Basic configuration wizard
│   ├── PersonaBuilder.svelte    # Multi-agent persona builder
│   ├── WorkflowDesigner.svelte  # Visual workflow design
│   ├── TemplateLibrary.svelte   # Template selection
│   ├── PreviewPanel.svelte      # Real-time CLAUDE.md preview
│   └── ExportOptions.svelte     # Download and copy options
├── templates/                    # Template generators
│   ├── basic/                   # Basic project templates
│   │   ├── react-typescript.ts # React + TypeScript
│   │   ├── nextjs.ts           # Next.js template
│   │   └── svelte.ts           # SvelteKit template
│   └── personas/               # Persona system templates
│       ├── bmad-method.ts      # BMAD 9-persona system
│       ├── agent-control.ts    # Agent Control Plane
│       └── superclaude.ts      # SuperClaude Framework
├── utils/                       # Core utilities
│   ├── generator.ts             # CLAUDE.md generation engine
│   ├── persona-engine.ts        # Persona system generator
│   ├── validator.ts             # Content validation
│   └── storage.ts               # localStorage utilities
├── copy/                        # Documentation content (mdsvex)
│   ├── about.md                 # About page content
│   ├── research-findings.md     # Research documentation
│   ├── persona-systems.md       # Persona system explanations
│   ├── examples.md              # Real-world examples
│   ├── getting-started.md       # Usage guide
│   └── index.ts                 # Content exports
└── icons/                       # Icon components
    ├── index.ts                 # Icon exports
    └── *.svelte                 # Individual icon components
```

## Code Style

- Use Svelte 5 runes (`$state`, `$derived`, `$effect`) for reactivity
- Prefer TypeScript for all files
- Use absolute imports with `$lib/` alias
- Follow conventional commit messages
- Icon components take props for customization
- Keep template generation functions pure (no side effects)
- Snake case for function and variable names
- Small, pure, functions whenever possible
- Immutable values whenever possible

## Testing Guidelines

- Write tests that test behavior, not implementation
- Never mock in tests - use real data and schemas
- Use real schemas/types in tests, never redefine them
- Files always have a blank line at the end

## Key Implementation Details

### Template System Design

Templates are functions that take configuration objects and return
CLAUDE.md markdown strings. Each template follows research-based
patterns:

```typescript
interface CLAUDETemplate {
	id: string;
	name: string;
	generate: (config: ProjectConfig) => string;
	validate: (content: string) => ValidationResult;
}
```

### State Management Pattern

Single reactive state object using Svelte 5 runes:

```typescript
interface ConfigState {
	projectName: string;
	techStack: TechStack;
	commands: Command[];
	codeStyle: CodeStyle;
	projectStructure: ProjectStructure;
	currentStep: number;
}
```

### Research-Based Approach

All templates and validation logic based on analysis of real-world
CLAUDE.md files, including both practical project configuration and
sophisticated persona systems. Supports basic project configs (25-250
lines) and advanced multi-agent systems with subagent delegation.

### Persona System Integration

Advanced persona templates that support:

- Multi-agent workflow coordination
- Subagent delegation through Claude Code's Task Tool
- Communication protocols (file-based, Git-based, MCP servers)
- Workflow patterns from proven implementations (BMAD Method, Agent
  Control Plane)

## Development Philosophy

- Never take shortcuts - ultra think through problems before taking
  hacky solutions
- Support both practical project configuration and sophisticated
  persona systems
- Keep the application self-contained with no external API
  dependencies
- Maintain static client-side architecture for simple deployment

## Do Not Touch

- Do not modify SvelteKit configuration files without team approval
- Do not add server-side functionality - this must remain a static
  client-side app
- Do not oversimplify persona features - they are sophisticated
  technical systems, not just instruction sets
- Do not add external API dependencies - keep it self-contained
