import type { ConfigState } from '../state/config.svelte';

export interface GenerationResult {
	success: boolean;
	content?: string;
	error?: string;
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

function build_generation_prompt(config: ConfigState): string {
	return `You are generating a CLAUDE.md file for a developer using Claude Code with a persona-based system.

CONTEXT: CLAUDE.md files are "persistent prompts" that provide project-specific context to Claude Code, reducing repetitive explanations and ensuring consistent AI behavior. This implementation uses a sophisticated persona system where Claude can embody different expert roles based on context.

RESEARCH FINDINGS:
- Files should be 25-250 lines (token budget optimization)
- Use concise, actionable bullet points
- Include specific versions and tools when available
- Focus on what Claude needs to know, not documentation
- Persona systems enable sophisticated multi-agent workflows
- Clear activation rules help Claude switch between expert roles

USER CONFIGURATION:

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

Generate a CLAUDE.md file that:
1. Follows proven structure with persona system integration
2. Is concise and actionable (25-250 lines)
3. Includes clear persona definitions and activation rules
4. Incorporates universal principles that apply to all personas
5. Provides project-specific context for all personas
6. Uses specific, actionable guidance rather than generic advice

IMPORTANT: Return ONLY the raw CLAUDE.md file content - no markdown code blocks, no explanatory text, no "Here's your file" - just the actual file content that can be directly copied and pasted.

Structure the file with:
- Project overview and universal principles
- Persona definitions with clear roles and expertise
- Activation rules and context switching
- Project-specific technical details
- Clear restrictions and guidelines

Make it professional, actionable, and optimized for Claude Code usage.`;
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
