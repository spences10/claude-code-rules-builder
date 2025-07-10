import type { ConfigState } from '../state/config.svelte';

export interface GenerationResult {
	success: boolean;
	content?: string;
	error?: string;
}

export async function get_next_question(
	conversation_data: any,
	conversation_history: Array<{ role: string; content: string }>,
	api_key: string,
): Promise<GenerationResult> {
	try {
		const prompt = build_conversation_prompt(conversation_data, conversation_history);

		const response = await fetch('/api/generate-claude-md', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				prompt,
				api_key,
			}),
		});

		if (!response.ok) {
			const error_data = await response.json();
			return {
				success: false,
				error: error_data.error || 'Failed to get next question',
			};
		}

		const data = await response.json();
		return {
			success: true,
			content: data.content,
		};
	} catch (error) {
		return {
			success: false,
			error:
				error instanceof Error
					? error.message
					: 'Unknown error occurred',
		};
	}
}

export async function generate_claude_md(
	config: ConfigState,
	api_key: string,
): Promise<GenerationResult> {
	try {
		const prompt = build_generation_prompt(config);

		const response = await fetch('/api/generate-claude-md', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				prompt,
				api_key,
			}),
		});

		if (!response.ok) {
			const error_data = await response.json();
			return {
				success: false,
				error: error_data.error || 'Failed to generate CLAUDE.md',
			};
		}

		const data = await response.json();
		return {
			success: true,
			content: data.content,
		};
	} catch (error) {
		return {
			success: false,
			error:
				error instanceof Error
					? error.message
					: 'Unknown error occurred',
		};
	}
}

function build_conversation_prompt(
	conversation_data: any, 
	conversation_history: Array<{ role: string; content: string }>
): string {
	const history_text = conversation_history
		.map(msg => `${msg.role}: ${msg.content}`)
		.join('\n');

	return `You are helping create a CLAUDE.md file. Follow this EXACT script:

SCRIPT TO FOLLOW:
1. If no universal principles yet → Ask: "What are your unbreakable coding rules?"
2. If have principles but no project description → Ask: "What does your project do? (one sentence)"
3. If have project description but no tech stack → Ask: "What's your tech stack? (languages, frameworks, tools)"
4. If have tech stack but no development commands → Ask: "What commands do you use? (build, test, dev, etc.)"
5. If have commands but no persona decision → Ask: "Want personas? (yes/no)"  
6. If they said yes to personas but no personas collected → Ask: "What experts do you want?"
7. If they said yes to personas and have 1+ personas → Ask: "Want another persona? (yes/no or 'done')"
8. If they said no to more personas OR said "done" OR they said no to personas initially → Say: "READY_TO_GENERATE"

CURRENT DATA:
- Universal Principles: ${conversation_data.universal_principles ? 'COLLECTED' : 'MISSING'}
- Project Description: ${conversation_data.project_description ? 'COLLECTED' : 'MISSING'}
- Tech Stack: ${conversation_data.tech_stack ? 'COLLECTED' : 'MISSING'}
- Development Commands: ${conversation_data.development_commands ? 'COLLECTED' : 'MISSING'}
- Wants Personas: ${conversation_data.wants_personas !== undefined ? conversation_data.wants_personas : 'NOT_ASKED'}
- Personas: ${conversation_data.personas.length} collected
- Wants More Personas: ${conversation_data.wants_more_personas !== undefined ? conversation_data.wants_more_personas : 'NOT_ASKED'}

CONVERSATION HISTORY:
${history_text}

DECISION LOGIC:
- If Universal Principles = MISSING → Ask step 1
- If Universal Principles = COLLECTED but Project Description = MISSING → Ask step 2
- If Project Description = COLLECTED but Tech Stack = MISSING → Ask step 3
- If Tech Stack = COLLECTED but Development Commands = MISSING → Ask step 4
- If Development Commands = COLLECTED but Wants Personas = NOT_ASKED → Ask step 5
- If Wants Personas = true but 0 personas collected → Ask step 6
- If Wants Personas = true and 1+ personas collected and Wants More Personas = NOT_ASKED → Ask step 7
- If Wants More Personas = false OR Wants Personas = false → Say "READY_TO_GENERATE"

Follow the script exactly. Ask ONE question at a time.

CRITICAL: Only ask what the user specifies. Do NOT invent, suggest, or hallucinate any technical details, frameworks, or tools. Use EXACTLY what the user tells you.`;
}

function build_generation_prompt(config: ConfigState): string {
	return `You are generating a CLAUDE.md file for a developer using Claude Code with an advanced persona-based system.

CONTEXT: CLAUDE.md files are "persistent prompts" that provide project-specific context to Claude Code, reducing repetitive explanations and ensuring consistent AI behavior. This implementation uses a sophisticated multi-agent persona system where Claude can embody different expert roles and coordinate complex workflows through intelligent task delegation.

COMPREHENSIVE RESEARCH FINDINGS:

### Technical Specifications
- Three-tier memory hierarchy: Global (~/.claude/CLAUDE.md), Project (./CLAUDE.md), Local
- Import system with @path/to/file syntax (max depth 5 hops)
- Runtime discovery of CLAUDE.md files in subdirectories
- Token budget optimization: aim for 25-250 lines
- Average cost impact: $6 per developer per day

### Proven Structure Patterns
- Brief project description (1 line)
- Tech stack with specific versions
- Development commands with descriptions
- Code style rules (concise, actionable)
- Project structure overview
- Domain-specific restrictions

### Advanced Persona System Capabilities
- Multi-agent workflow orchestration
- Intelligent task delegation between personas
- Subagent capabilities and communication protocols
- Quality gates and workflow pattern enforcement
- Context-aware persona switching
- Sequential and parallel development workflows

### Persona Template Systems
- BMAD Method (9-persona comprehensive system)
- Agent Control Plane (4-persona with mandatory transitions)
- SuperClaude Framework (command-driven activation)
- Custom hybrid approaches based on project needs

### Communication Protocols
- File-based communication (agent-state.json, task-queue.json)
- Git-based communication (branch strategies, commit protocols)
- MCP server integration (real-time coordination)
- Automatic failover and task reassignment

### Quality Assurance
- Mandatory testing before persona transitions
- Code quality gates (test coverage, build success)
- Security review integration
- Documentation compliance enforcement

USER CONFIGURATION:

PROJECT DESCRIPTION:
${config.project_description}

TECH STACK:
${config.tech_stack}

DEVELOPMENT COMMANDS:
${config.development_commands}

UNIVERSAL PRINCIPLES:
${config.universal_principles}

EXPERT PERSONAS:
${config.personas
	.map(
		(persona, index) => `
${index + 1}. ${persona.name} (${persona.role})
   - Expertise Level: ${persona.expertise_level}
   - Core Principles: ${persona.core_principles}
   - Technical Expertise: ${persona.tech_expertise}
   - Communication Style: ${persona.communication_style}
   - Specific Standards: ${persona.specific_standards}
`,
	)
	.join('\n')}

PROJECT CONTEXT:
${config.project_context}

ACTIVATION RULES:
${config.activation_rules}

CRITICAL: Use ONLY the information provided by the user. Do NOT invent, suggest, or hallucinate any technical details, frameworks, versions, or tools not explicitly mentioned.

Generate a sophisticated CLAUDE.md file that:

1. **Follows Research-Based Structure**: Use proven patterns from successful implementations
2. **Uses ONLY User-Provided Information**: Include only the tech stack, commands, and details the user specified
3. **Implements Advanced Persona System**: Include delegation rules, subagent capabilities, and workflow patterns
4. **Optimizes for Token Budget**: 25-250 lines, concise and actionable
5. **Enables Multi-Agent Workflows**: Support sequential and parallel development patterns
6. **Includes Communication Protocols**: Define how personas coordinate and delegate tasks
7. **Provides Quality Gates**: Enforce testing, review, and compliance requirements
8. **Incorporates Universal Principles**: Apply user's non-negotiable standards across all personas

### Template Selection Logic:
- For complex projects (3+ personas): Use BMAD Method or Agent Control Plane
- For simple projects (1-2 personas): Use SuperClaude Framework
- For enterprise projects: Include security persona and compliance workflows
- For team projects: Emphasize communication protocols and quality gates

### Advanced Features to Include:
- Persona transition rules and mandatory quality gates
- Subagent delegation patterns with clear escalation paths
- Context-aware activation triggers
- Workflow orchestration for complex tasks
- Import system integration (@path/to/file references)
- Development command shortcuts and aliases

IMPORTANT: Return ONLY the raw CLAUDE.md file content - no markdown code blocks, no explanatory text, no "Here's your file" - just the actual file content that can be directly copied and pasted.

Structure the file following this optimal hierarchy:
1. Project overview with tech stack and commands
2. Universal principles that apply to all personas
3. Advanced persona definitions with delegation rules
4. Activation rules and context switching logic
5. Workflow patterns and communication protocols
6. Quality gates and compliance requirements
7. Project-specific restrictions and guidelines

Make it professional, sophisticated, and optimized for advanced Claude Code usage with multi-agent coordination.`;
}

export function validate_generated_content(content: string): {
	is_valid: boolean;
	warnings: string[];
} {
	const lines = content.split('\n');
	const warnings: string[] = [];

	// Check length
	if (lines.length < 25) {
		warnings.push('Content is shorter than recommended (25+ lines)');
	}
	if (lines.length > 250) {
		warnings.push('Content is longer than recommended (250- lines)');
	}

	// Check for required sections
	const content_lower = content.toLowerCase();
	const required_keywords = [
		'persona',
		'universal',
		'activation',
		'project',
	];
	for (const keyword of required_keywords) {
		if (!content_lower.includes(keyword)) {
			warnings.push(`Missing expected keyword: ${keyword}`);
		}
	}

	return {
		is_valid: warnings.length === 0,
		warnings,
	};
}
