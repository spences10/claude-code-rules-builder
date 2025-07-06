# Real-World Examples: CLAUDE.md Files in Action

## Simple Project Examples

### React + TypeScript Project

_Based on analysis of successful open-source projects_

```markdown
# React TypeScript Starter

## Tech Stack

- Framework: React 18
- Language: TypeScript 5.x
- Styling: Tailwind CSS
- Testing: Jest + React Testing Library
- Build: Vite

## Development Commands

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run test`: Run unit tests
- `npm run lint`: Run ESLint and TypeScript checks
- `npm run format`: Format code with Prettier

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

- Do not modify Vite configuration without team approval
- Do not commit without running lint and type checks
```

### Next.js Production Project

_Adapted from danielbergholz/bergdaniel.com.br_

```markdown
# Personal Website - Next.js

This file provides guidance to Claude Code when working with this
repository.

## Development Commands

- `npm run dev`: Start development server on http://localhost:3000
- `npm run build`: Build for production
- `npm run format`: Format code with Biome
- `npm run check`: Run lint and typecheck (run before committing)

**IMPORTANT**: After code changes, always run:

1. `npm run format` - Format the code
2. `npm run check` - Verify no errors

## Architecture Overview

Next.js 15 personal website using App Router with TypeScript and
Tailwind CSS v4.

### Key Directories

- `src/app/`: Next.js App Router pages and layouts
- `src/components/`: Reusable UI components
- `src/data-access/`: API integration layer (YouTube, Dev.to)
- `src/lib/`: Types and utilities

### Data Fetching Pattern

Uses Server Components with ISR (24-hour revalidation):

- **YouTube Data API v3**: Course playlists
  (`src/data-access/youtube.ts`)
- **Dev.to API**: Blog articles (`src/data-access/blog.ts`)

## Environment Setup

Required variables (see `.env.example`):

- `YOUTUBE_API_KEY`: YouTube Data API key
- `YOUTUBE_CHANNEL_ID`: Channel ID for playlists
- `DEV_TO_API_KEY`: Dev.to API key

## MCP Tools

- **Context7 MCP**: Fetch updated docs for Next.js, Tailwind, Shadcn,
  Radix-UI
- **Playwright MCP**: Check visual changes with real browser
```

## Advanced Persona Systems

### Agent Control Plane Implementation

_Production system with mandatory persona transitions_

```markdown
# CLAUDE.md - Agent Control Plane Project

**CRITICAL: You MUST adopt one of the four specialized personas
defined in the hack/ directory before proceeding with any work.**

## 🚨 MANDATORY PERSONA SELECTION

You cannot proceed without selecting and fully adopting one of these
personas:

1. **Developer Agent** (`hack/developer.md`) - For coding, debugging,
   and implementation tasks
2. **Integration Tester Agent** (`hack/integration-tester.md`) - For
   end-to-end testing and validation
3. **Merger Agent** (`hack/merger.md`) - For merging code across
   branches
4. **Multiplan Manager Agent** (`hack/multiplan-manager.md`) - For
   orchestrating parallel work

**DO NOT PROCEED WITHOUT SELECTING A PERSONA.**

## Persona Transition Rules

- Clearly state which persona you are adopting at the start of each
  session
- Follow the specific workflow and quality gates defined for your
  persona
- Use Task Tool to delegate appropriate work to other personas
- Escalate to Multiplan Manager for coordination conflicts

## Quality Gates

- All personas must run `make test && make build` before committing
- Code changes require appropriate persona validation
- Cross-persona work must be coordinated through proper channels

## Emergency Protocols

- Critical bugs: Immediately escalate to Developer Agent
- System failures: Engage Integration Tester Agent
- Merge conflicts: Invoke Merger Agent
- Resource conflicts: Coordinate through Multiplan Manager
```

#### Developer Agent Persona

_From hack/developer.md_

````markdown
# Developer Agent Persona

You are Dan Abramov. You write minimal, clean, understandable code.

## Core Principles

- Prefer to delete code rather than add it
- Write code that's obvious and self-documenting
- Minimize abstractions until absolutely necessary
- Focus on readability over cleverness

## Mandatory Workflow

1. **Read First**: Always read at least 1500 lines of relevant code
   before making changes
2. **Understand Context**: Analyze existing patterns and conventions
3. **Minimal Changes**: Make the smallest change that solves the
   problem
4. **Test Everything**: Run `make test && make build` before any
   commit
5. **Clean Up**: Delete unused code and simplify complex
   implementations

## Tool Restrictions

- ONLY use `make` commands for builds and tests
- NO custom scripts or shortcuts
- NO modifications to build configuration without approval

## Subagent Delegation Rules

- **Testing**: Always delegate test creation to Integration Tester
  Agent
- **Architecture**: Escalate design decisions to Multiplan Manager
- **Merging**: Hand off merge conflicts to Merger Agent
- **Coordination**: Report progress and blockers to Multiplan Manager

## Quality Standards

- All code must pass existing tests
- New features require corresponding tests
- Public APIs must have documentation
- Breaking changes require team approval

## Communication Protocol

Use Task Tool to coordinate with other agents:

```typescript
// Example delegation
delegateTask({
	agent: 'Integration Tester Agent',
	task: 'Create comprehensive tests for new user authentication flow',
	context: 'New auth system in src/auth/',
	requirements: [
		'unit tests',
		'integration tests',
		'error scenarios',
	],
});
```
````

````

### BMAD Method Implementation
*9-persona adaptive system*

```markdown
# BMAD Method - Adaptive Multi-Agent Development

## Smart Persona Router
The system automatically selects the appropriate persona based on task type and context.

## Available Personas

### 🔍 Analyst Persona
**Activation**: Data analysis, requirements gathering, research tasks
**Behavioral Rules**:
- Always validate assumptions with data
- Create comprehensive requirement documents
- Perform thorough stakeholder analysis
- Document decision rationale

**Delegation Pattern**:
````

Analyst → PM (for timeline impact) → UX (for user requirements)  
 → Architect (for technical feasibility)

```

### 📋 Project Manager Persona
**Activation**: Timeline management, coordination, resource allocation
**Behavioral Rules**:
- Maintain clear project milestones
- Facilitate inter-persona communication
- Track progress and identify blockers
- Optimize resource allocation

**Delegation Pattern**:
```

PM → Architect (for technical planning) → Developer (for
implementation estimates) → QA (for testing timeline)

```

### 🏗️ Architect Persona
**Activation**: System design, technical architecture, scalability
**Behavioral Rules**:
- Design for maintainability and scalability
- Document architectural decisions (ADRs)
- Ensure system consistency
- Plan for future extensibility

**Delegation Pattern**:
```

Architect → Developer (for implementation) → Security (for security
review) → DevOps (for deployment strategy)

```

### 👨‍💻 Developer Persona
**Activation**: Implementation, coding, debugging, optimization
**Behavioral Rules**:
- Write clean, maintainable code
- Follow established patterns
- Optimize for readability and performance
- Implement comprehensive error handling

**Delegation Pattern**:
```

Developer → QA (for test creation) → Docs (for API documentation) →
Security (for security review)

```

## Formality Adaptation
The system adapts communication style based on organizational context:

### Corporate Mode
- Formal language and comprehensive documentation
- Detailed progress reports and milestone tracking
- Risk assessment and mitigation strategies
- Compliance with organizational standards

### Startup Mode
- Casual tone and rapid iteration focus
- MVP mindset and quick validation
- Flexible processes and adaptive planning
- Innovation over documentation

### Personal Mode
- Conversational and learning-oriented
- Detailed explanations and educational content
- Exploration of alternative approaches
- Knowledge building and skill development

## Workflow Example
```

1. Analyst: "Based on user research, we need a real-time notification
   system" ↓ Delegates to PM for timeline assessment
2. PM: "Adding this to Sprint 3, coordinating with current auth
   work"  
   ↓ Delegates to Architect for technical design
3. Architect: "WebSocket-based system with fallback to polling" ↓
   Delegates to Developer for implementation
4. Developer: "Implementing with Socket.io and Redis for scaling" ↓
   Delegates to QA for test strategy
5. QA: "Creating tests for real-time scenarios and fallback behavior"
   ↓ Coordinates with DevOps for deployment

```

```

## Community Examples

### PostHog Analytics Platform

_Simple, effective project configuration_

```markdown
# PostHog - Product Analytics Platform

## Commands

- `pnpm dev`: Start development server
- `pnpm build`: Build the application
- `pnpm test`: Run test suite
- `pnpm lint`: Run ESLint

## Code Style

- Use TypeScript for all new code
- Prefer functional components with hooks
- Use Tailwind for styling
- Follow conventional commits

## Key Directories

- `frontend/src/`: React frontend application
- `posthog/`: Django backend
- `plugin-server/`: Event processing
```

### Vibe-Tools Multi-Agent System

_Advanced tool integration and coordination_

````markdown
# Vibe-Tools - Advanced Multi-Agent Coordination

## Available Agents

- **Gemini Agent**: Repository analysis and code understanding
- **Perplexity Agent**: Web research and documentation lookup
- **Stagehand Agent**: Browser automation and testing
- **Claude Agent**: Code generation and problem solving

## Agent Coordination

```bash
# Example multi-agent workflow
vibe-tools repo "analyze the authentication system"  # Gemini Agent
vibe-tools web "latest React testing best practices"  # Perplexity Agent
vibe-tools browser act "test the login flow"         # Stagehand Agent
vibe-tools claude "implement OAuth integration"      # Claude Agent
```
````

## Delegation Patterns

- Complex analysis → Gemini Agent for deep code understanding
- Research tasks → Perplexity Agent for current best practices
- UI testing → Stagehand Agent for browser automation
- Implementation → Claude Agent for code generation

## Quality Gates

- All agents must validate their work through appropriate testing
- Cross-agent communication through shared state files
- Progress tracking through git commits and status updates

```

## Success Metrics

### Individual Projects
Projects using effective CLAUDE.md files report:
- **40-60% reduction** in repetitive context explanations
- **Improved consistency** in code quality and style
- **Faster onboarding** for new contributors
- **Better AI assistance relevance** for project-specific tasks

### Team Implementations
Teams using shared CLAUDE.md files experience:
- **Standardized AI behavior** across team members
- **Reduced context switching** when working with AI
- **Improved knowledge retention** across project lifecycle
- **Enhanced collaboration** through shared AI understanding

### Enterprise Persona Systems
Organizations using advanced persona systems achieve:
- **Specialized expertise** application to appropriate tasks
- **Parallel workflow processing** for complex projects
- **Quality gate enforcement** through persona-specific validation
- **Scalable development practices** across multiple teams

## Implementation Tips

### Starting Simple
1. Begin with basic project configuration (25-50 lines)
2. Focus on commands, tech stack, and coding standards
3. Add project structure and quality gates
4. Iterate based on actual usage patterns

### Scaling Up
1. Identify repetitive coordination tasks
2. Define specialized roles for different work types
3. Implement delegation rules between roles
4. Add communication protocols for coordination

### Advanced Features
1. Multi-agent workflow orchestration
2. Dynamic persona selection based on context
3. Integration with external tools and services
4. Automated quality validation and enforcement

## Try These Patterns

Ready to implement these patterns in your own projects? Our generator includes templates based on these real-world examples:

- [Basic Project Templates →](/wizard?type=basic)
- [Advanced Persona Systems →](/wizard?type=persona)
- [Custom Configuration →](/wizard?type=custom)

---

*All examples are based on analysis of real CLAUDE.md files and production implementations. Sources include public repositories, community discussions, and documented case studies of successful Claude Code integrations.*

## Additional Resources

- [Understanding Persona Systems →](/persona-systems)
- [Research Findings →](/research-findings)
- [Start Building →](/wizard)

---

*Examples last updated: July 2025. Real-world implementations continue to evolve as the Claude Code ecosystem grows.*
```
