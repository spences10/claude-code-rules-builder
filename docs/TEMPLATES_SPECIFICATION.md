# CLAUDE.md Templates Specification

## Template System Design

Based on research of real CLAUDE.md files, this specification defines
the template system for generating effective project-specific
CLAUDE.md files.

## Template Structure (Research-Based)

All templates follow this proven structure from successful CLAUDE.md
files:

```markdown
# [Project Name]

[Brief project description - 1 line]

## Tech Stack

- Framework: [Framework and version]
- Language: [Language and version]
- [Additional stack components]

## Development Commands

- `command`: Description
- `command`: Description
- `command`: Description

## Code Style

- [Style rule 1]
- [Style rule 2]
- [Style rule 3]

## Project Structure

- `directory/`: Description
- `directory/`: Description
- `directory/`: Description

## [Optional Sections]

## Do Not Touch

- [Restriction 1]
- [Restriction 2]
```

## Template Interface

```typescript
interface CLAUDETemplate {
	id: string;
	name: string;
	description: string;
	category:
		| 'frontend'
		| 'backend'
		| 'fullstack'
		| 'mobile'
		| 'data'
		| 'cli';
	tags: string[];
	generate: (config: ProjectConfig) => string;
	validate: (content: string) => ValidationResult;
}

interface ProjectConfig {
	projectName: string;
	projectDescription?: string;
	techStack: TechStackConfig;
	commands: CommandConfig[];
	codeStyle: CodeStyleConfig;
	projectStructure: ProjectStructureConfig;
	customSections?: CustomSection[];
	restrictions?: string[];
}

interface TechStackConfig {
	framework: string;
	language: string;
	version?: string;
	database?: string;
	styling?: string;
	testing?: string;
	deployment?: string;
}
```

## Core Templates

### 1. React + TypeScript Template

**ID**: `react-typescript` **Category**: `frontend` **Tags**:
`['react', 'typescript', 'frontend', 'spa']`

**Generated Structure**:

```markdown
# [Project Name]

React application with TypeScript for type-safe frontend development.

## Tech Stack

- Framework: React 18
- Language: TypeScript 5.x
- Styling: [CSS framework]
- Build Tool: Vite
- Testing: Jest + React Testing Library

## Development Commands

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run test`: Run unit tests
- `npm run lint`: Run ESLint
- `npm run type-check`: Run TypeScript compiler

## Code Style

- Use functional components with hooks
- Prefer arrow functions for components
- Use TypeScript strict mode
- Follow conventional commit messages
- Use absolute imports with @ alias

## Project Structure

- `src/components/`: Reusable UI components
- `src/pages/`: Page components
- `src/hooks/`: Custom React hooks
- `src/utils/`: Utility functions
- `src/types/`: TypeScript type definitions

## Do Not Touch

- Do not modify files in `public/` directory
- Do not commit without running lint and type-check
```

### 2. Next.js Template

**ID**: `nextjs` **Category**: `fullstack` **Tags**:
`['nextjs', 'react', 'typescript', 'fullstack', 'ssr']`

**Generated Structure** (based on danielbergholz/bergdaniel.com.br):

```markdown
# [Project Name]

Next.js application with App Router and TypeScript.

## Tech Stack

- Framework: Next.js 15
- Language: TypeScript 5.x
- Styling: Tailwind CSS
- Database: [Database choice]
- Deployment: Vercel

## Development Commands

- `npm run dev`: Start development server on http://localhost:3000
- `npm run build`: Build for production
- `npm run format`: Format code with Prettier
- `npm run lint`: Run ESLint and type checking
- `npm run check`: Run lint and typecheck (run before committing)

**IMPORTANT**: After code changes, always run:

1. `npm run format` - Format the code
2. `npm run check` - Verify no errors

## Code Style

- Use App Router patterns (not Pages Router)
- Prefer Server Components when possible
- Use TypeScript strict mode
- Follow conventional commit messages
- Use absolute imports with @ alias

## Project Structure

- `src/app/`: Next.js App Router pages and layouts
- `src/components/`: Reusable UI components
- `src/lib/`: Utilities and API clients
- `src/types/`: TypeScript type definitions

## Do Not Touch

- Do not modify Next.js configuration files without team approval
- Do not commit directly to main branch
```

### 3. Python Project Template

**ID**: `python` **Category**: `backend` **Tags**:
`['python', 'backend', 'api']`

**Generated Structure**:

```markdown
# [Project Name]

Python project using modern development practices.

## Tech Stack

- Language: Python 3.11+
- Package Manager: uv (recommended) or pip
- Framework: [FastAPI/Django/Flask]
- Database: [Database choice]
- Testing: pytest

## Development Commands

- `uv run main.py`: Start development server
- `uv run pytest`: Run test suite
- `uv run ruff check`: Run linting
- `uv run ruff format`: Format code
- `uv add package-name`: Add new dependency

## Code Style

- Follow PEP 8 style guidelines
- Use type hints for all functions
- Prefer f-strings for string formatting
- Use descriptive variable names
- Write docstrings for public functions

## Project Structure

- `src/`: Main application code
- `tests/`: Test files
- `requirements.txt` or `pyproject.toml`: Dependencies
- `README.md`: Project documentation

## Environment Setup

- Python 3.11+ required
- Use virtual environment: `python -m venv venv`
- Install dependencies: `pip install -r requirements.txt`

## Do Not Touch

- Do not modify .gitignore without team approval
- Do not commit without running tests and linting
```

### 4. SvelteKit Template

**ID**: `sveltekit` **Category**: `fullstack` **Tags**:
`['svelte', 'sveltekit', 'typescript', 'fullstack']`

**Generated Structure**:

```markdown
# [Project Name]

SvelteKit application with TypeScript and modern tooling.

## Tech Stack

- Framework: SvelteKit 2.x
- Language: TypeScript 5.x
- Styling: TailwindCSS
- Build Tool: Vite
- Testing: Vitest + Playwright

## Development Commands

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build
- `npm run test`: Run unit tests
- `npm run test:e2e`: Run end-to-end tests
- `npm run lint`: Run ESLint and Prettier

## Code Style

- Use Svelte 5 runes for reactivity
- Prefer TypeScript for all files
- Follow conventional commit messages
- Use absolute imports with $lib alias
- Write component props with TypeScript interfaces

## Project Structure

- `src/routes/`: SvelteKit pages and layouts
- `src/lib/`: Reusable components and utilities
- `src/app.html`: App shell template
- `static/`: Static assets

## Do Not Touch

- Do not modify svelte.config.js without team approval
- Do not commit without running lint and tests
```

### 5. Generic Web App Template

**ID**: `generic-webapp` **Category**: `frontend` **Tags**:
`['generic', 'webapp', 'starter']`

**Generated Structure**:

```markdown
# [Project Name]

Modern web application following current best practices.

## Tech Stack

- Language: [Selected language]
- Framework: [Selected framework]
- Styling: [Selected styling approach]
- Build Tool: [Selected build tool]

## Development Commands

- `[dev command]`: Start development server
- `[build command]`: Build for production
- `[test command]`: Run tests
- `[lint command]`: Run linting

## Code Style

- [Framework-specific style guidelines]
- Use consistent naming conventions
- Write meaningful commit messages
- Include documentation for complex functions

## Project Structure

- `[source directory]/`: Main application code
- `[components directory]/`: Reusable components
- `[utils directory]/`: Utility functions

## Do Not Touch

- [Project-specific restrictions]
```

## Template Categories

### Frontend Templates

- React + TypeScript
- Vue.js + TypeScript
- Angular
- Vanilla JavaScript
- Static Site Generators (Astro, 11ty)

### Backend Templates

- Node.js + Express
- Python + FastAPI
- Python + Django
- Go + Gin
- Rust + Axum

### Fullstack Templates

- Next.js
- SvelteKit
- Remix
- T3 Stack
- MEAN/MERN Stack

### Mobile Templates

- React Native
- Flutter
- Swift (iOS)
- Kotlin (Android)

### Data & ML Templates

- Jupyter Notebook
- Python Data Science
- R Projects
- Machine Learning

### CLI & Tools Templates

- Node.js CLI
- Python CLI
- Go CLI
- Rust CLI

## Template Validation Rules

### Content Requirements

1. **Required sections**: Tech Stack, Development Commands, Code Style
2. **Optimal length**: 25-250 lines (based on research)
3. **Command format**: All commands must use backticks and include
   descriptions
4. **Structure clarity**: Use bullet points and clear headings

### Quality Checks

1. **No verbose descriptions**: Keep content concise and actionable
2. **Specific over generic**: Include specific versions and tools
3. **Actionable instructions**: Every line should provide actionable
   guidance
4. **Team-focused**: Include collaborative elements (commit messages,
   workflows)

### Anti-Patterns to Avoid

1. **Long paragraphs**: Use bullet points instead
2. **Obvious explanations**: Don't explain what's obvious from
   directory names
3. **Generic advice**: Provide project-specific guidance
4. **Missing restrictions**: Include "Do Not Touch" section when
   relevant

## Template Generation Algorithm

```typescript
function generateCLAUDEmd(
	template: CLAUDETemplate,
	config: ProjectConfig,
): string {
	const sections = [
		generateHeader(config.projectName, config.projectDescription),
		generateTechStack(config.techStack),
		generateCommands(config.commands),
		generateCodeStyle(config.codeStyle),
		generateProjectStructure(config.projectStructure),
		...generateCustomSections(config.customSections || []),
		generateRestrictions(config.restrictions || []),
	];

	return sections.filter(Boolean).join('\n\n');
}
```

## Template Extension System

Templates can be extended with:

- **Custom sections**: Domain-specific content
- **Tool integrations**: MCP servers, browser automation
- **Team workflows**: Git conventions, review processes
- **Environment setup**: Installation and configuration instructions

---

_This specification ensures all templates follow research-based best
practices for effective CLAUDE.md files that improve Claude Code
assistance quality._
