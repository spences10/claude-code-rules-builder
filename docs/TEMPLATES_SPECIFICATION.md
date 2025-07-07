# AI Generation System for CLAUDE.md Files

## Generation Approach

This system uses AI to generate CLAUDE.md files rather than manual
template selection. The AI leverages research-based patterns and user
context to create optimal project-specific files.

## Research-Based Structure

Generated CLAUDE.md files follow this proven structure from successful
real-world implementations:

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

## Generation Process

### Input Collection

The system gathers context through 3-4 conversational questions:

1. **Role & Project Context**
   - Developer's technical role and experience level
   - Project type, scale, and domain
   - Team structure and collaboration needs

2. **Technology Stack**
   - Programming languages and frameworks
   - Databases and infrastructure
   - Development tools and deployment platforms

3. **Coding Standards**
   - Style preferences and formatting rules
   - Testing approaches and quality standards
   - Documentation and review processes

4. **Special Requirements** (optional)
   - Legacy system constraints
   - Compliance requirements
   - Team-specific workflows

### AI Generation Prompt

The system uses a comprehensive prompt that includes:

```
You are generating a CLAUDE.md file for a developer using Claude Code.

CONTEXT: CLAUDE.md files are "persistent prompts" that provide project-specific context to Claude Code, reducing repetitive explanations and ensuring consistent AI behavior.

RESEARCH FINDINGS:
- Files should be 25-250 lines (token budget optimization)
- Use concise, actionable bullet points
- Include specific versions and tools
- Focus on what Claude needs to know, not documentation
- Follow proven structure: Tech Stack → Commands → Code Style → Project Structure → Restrictions

USER CONTEXT:
- Role: [user input]
- Project: [user input]
- Tech Stack: [user input]
- Standards: [user input]
- Requirements: [user input]

Generate a CLAUDE.md file that:
1. Follows the proven structure
2. Is concise and actionable (25-250 lines)
3. Includes specific commands and versions
4. Provides clear restrictions
5. Focuses on guidance Claude needs for this specific project
```

### Output Validation

Generated content is validated against:

1. **Structure Requirements**
   - Contains essential sections (Tech Stack, Commands, Code Style)
   - Uses proper markdown formatting
   - Includes actionable bullet points

2. **Length Optimization**
   - 25-250 lines for token budget efficiency
   - Warnings for content outside optimal range

3. **Content Quality**
   - Specific over generic guidance
   - No verbose explanations
   - Focuses on actionable instructions

## Common Generation Patterns

### Frontend Projects (React, Vue, Angular)

- Framework-specific component patterns
- Build tool configurations
- Styling approach (CSS-in-JS, Tailwind, etc.)
- Testing strategies for components

### Backend Projects (Node.js, Python, Go)

- API framework patterns
- Database connection management
- Environment variable handling
- Testing strategies for services

### Fullstack Projects (Next.js, SvelteKit, Nuxt)

- Server-side rendering patterns
- API route conventions
- Database integration approaches
- Deployment considerations

### Specialized Projects

- CLI tools: Command structure and distribution
- Data science: Notebook organization and dependencies
- Mobile apps: Platform-specific considerations
- DevOps: Infrastructure as code patterns

## Quality Assurance

### Best Practices Enforcement

Generated files automatically include:

- Command descriptions with backticks
- Specific version numbers when available
- Clear directory structure explanations
- Actionable "Do Not Touch" restrictions

### Anti-Pattern Prevention

The system avoids common mistakes:

- Verbose documentation-style explanations
- Generic advice that applies to all projects
- Obvious information (e.g., "components folder contains components")
- Missing development commands

## Example Generation Outputs

### React TypeScript Project

```markdown
# E-commerce Dashboard

React TypeScript application for managing online store operations.

## Tech Stack

- Framework: React 18 with TypeScript 5.x
- Styling: Tailwind CSS 3.4
- State Management: Zustand
- Build Tool: Vite 5.x
- Testing: Jest + React Testing Library

## Development Commands

- `npm run dev`: Start development server on localhost:3000
- `npm run build`: Build for production
- `npm run test`: Run unit tests
- `npm run lint`: Run ESLint with TypeScript checking
- `npm run format`: Format code with Prettier

## Code Style

- Use functional components with hooks
- Prefer TypeScript strict mode
- Follow conventional commit messages
- Use absolute imports with @ alias
- Write tests for business logic components

## Project Structure

- `src/components/`: Reusable UI components
- `src/pages/`: Page-level components
- `src/hooks/`: Custom React hooks
- `src/store/`: Zustand store definitions
- `src/utils/`: Utility functions and helpers

## Do Not Touch

- Do not modify public/index.html without approval
- Do not commit without running lint and tests
- Do not bypass TypeScript strict mode
```

### Python FastAPI Project

```markdown
# Customer API Service

FastAPI microservice for customer data management with PostgreSQL.

## Tech Stack

- Language: Python 3.11
- Framework: FastAPI 0.104
- Database: PostgreSQL 15 with SQLAlchemy
- Testing: pytest with httpx
- Package Manager: uv

## Development Commands

- `uv run main.py`: Start development server on localhost:8000
- `uv run pytest`: Run full test suite
- `uv run ruff check`: Run linting
- `uv run ruff format`: Format code
- `uv run mypy .`: Type checking

## Code Style

- Use type hints for all functions
- Follow PEP 8 guidelines
- Prefer f-strings for formatting
- Write docstrings for public APIs
- Use descriptive variable names

## Project Structure

- `src/api/`: FastAPI route handlers
- `src/models/`: SQLAlchemy models
- `src/services/`: Business logic layer
- `tests/`: Test files matching src structure
- `migrations/`: Database migration files

## Environment Setup

- Python 3.11+ required
- PostgreSQL 15+ for database
- Copy .env.example to .env and configure

## Do Not Touch

- Do not modify database schema directly
- Do not commit without running tests
- Do not expose internal IDs in API responses
```

---

_This system ensures consistent, high-quality CLAUDE.md generation
through AI-powered analysis of user context and application of
research-based best practices._
