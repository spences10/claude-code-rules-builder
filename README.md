# CLAUDE.md Generator

A sophisticated web application that generates high-quality CLAUDE.md
files for Claude Code users, featuring advanced persona-based AI
assistance systems.

## What is CLAUDE.md?

CLAUDE.md files are "persistent prompts" that provide project-specific
context to Claude Code, transforming Claude from a generic coding
assistant into a project-aware team member. This generator creates
persona-based systems where Claude can embody different expert roles
(Backend Engineer, Frontend Architect, QA Engineer, etc.) and switch
between them based on context.

## Features

- **🎭 Multi-Persona System**: Define expert personas with specific
  roles, expertise, and communication styles
- **🤖 AI-Powered Generation**: Uses Anthropic's Claude API to
  generate optimized CLAUDE.md files
- **📋 Research-Based**: Built on analysis of real-world successful
  CLAUDE.md implementations
- **⚡ Copy & Paste Ready**: Generates clean, ready-to-use content
  without markdown wrappers
- **🎯 Context-Aware**: Incorporates universal principles, project
  context, and activation rules
- **💾 Export Options**: Download as file or copy to clipboard

## Quick Start

1. **Clone and Install**

   ```bash
   git clone <repository-url>
   cd claude-code-rules-builder
   npm install
   ```

2. **Start Development Server**

   ```bash
   npm run dev
   ```

3. **Get an Anthropic API Key**
   - Visit [Anthropic Console](https://console.anthropic.com/)
   - Generate an API key
   - Enter it in the application

4. **Generate Your CLAUDE.md**
   - Define universal coding principles
   - Create expert personas (Backend Engineer, Frontend Architect,
     etc.)
   - Add project context
   - Set persona activation rules
   - Generate and download your CLAUDE.md file

## How It Works

### 1. Universal Principles

Define core standards that apply to all code and contexts.

### 2. Expert Personas

Create specialized AI personas with:

- **Role & Expertise Level**: Backend Engineer (Senior), QA Engineer
  (Principal), etc.
- **Core Principles**: Guiding philosophy and approach
- **Technical Expertise**: Specific technologies and frameworks
- **Communication Style**: How they interact and respond
- **Standards & Practices**: Role-specific coding standards

### 3. Project Context

Provide domain knowledge, technical architecture, and business
constraints.

### 4. Activation Rules

Define when Claude should adopt each persona based on context clues.

## Example Personas

- **Rusty**: Senior Backend Engineer specializing in Rust/systems
  programming
- **Francis**: Frontend Architect focused on React/TypeScript and UX
- **Trinity**: Principal QA Engineer with testing expertise
- **Parker**: Product-focused engineer understanding business
  requirements

## Tech Stack

- **Framework**: SvelteKit with Svelte 5
- **Styling**: TailwindCSS + DaisyUI
- **AI Integration**: Anthropic Claude API
- **State Management**: Svelte 5 runes
- **Deployment**: Static hosting compatible

## Project Structure

```
src/
├── lib/
│   ├── components/
│   │   ├── api-key-manager.svelte    # API key management
│   │   └── config-wizard.svelte      # Persona configuration wizard
│   ├── services/
│   │   └── claude-generator.ts       # AI generation service
│   ├── state/
│   │   ├── api-key.svelte.ts        # API key state
│   │   └── config.svelte.ts         # Configuration state
│   └── utils/
│       └── api-key-manager.ts       # API key utilities
├── routes/
│   ├── api/
│   │   ├── generate-claude-md/      # Generation endpoint
│   │   └── test-key/               # API key testing
│   └── +page.svelte                # Main application
└── docs/                           # Research and specifications
```

## Research Foundation

This generator is built on comprehensive research of effective
CLAUDE.md files:

- **Token Budget Optimization**: 25-250 lines for cost efficiency
- **Proven Structures**: Based on successful real-world
  implementations
- **Anti-Pattern Prevention**: Avoids verbose documentation and
  generic advice
- **Persona Systems**: Enables sophisticated multi-agent workflows
- **Best Practices**: Actionable, specific guidance over generic rules

## Development

### Building for Production

```bash
npm run build
```

### Linting and Type Checking

```bash
npm run lint
npm run check
```

### Testing

```bash
npm test
```

## Deployment

The application is designed for static hosting and can be deployed to:

- Vercel
- Netlify
- GitHub Pages
- Any static hosting provider

## Security

- API keys are stored in memory only (not persisted)
- Only metadata (hash, usage date) stored in localStorage
- Client-side only - no server storage of user data
- Uses secure API communication with Anthropic

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

[Add your chosen license here]

## Acknowledgments

Built on research of advanced CLAUDE.md patterns including:

- BMAD Method
- SuperClaude Framework
- Agent Control Plane
- Community best practices

---

Transform your Claude Code experience with intelligent, context-aware
AI assistance through sophisticated persona systems.
