interface AnthropicMessage {
	role: 'user' | 'assistant';
	content: string;
}

interface AnthropicResponse {
	content: Array<{
		type: 'text';
		text: string;
	}>;
	id: string;
	model: string;
	role: 'assistant';
	stop_reason: string;
	stop_sequence: string | null;
	type: 'message';
	usage: {
		input_tokens: number;
		output_tokens: number;
	};
}

interface AnthropicRequestBody {
	model: string;
	max_tokens: number;
	messages: AnthropicMessage[];
	temperature?: number;
	system?: string;
}

class AnthropicAPIError extends Error {
	constructor(
		message: string,
		public status?: number,
		public response?: unknown,
	) {
		super(message);
		this.name = 'AnthropicAPIError';
	}
}

function create_request_body(
	prompt: string,
	model: string,
	max_tokens: number,
	system_prompt?: string,
): AnthropicRequestBody {
	const request_body: AnthropicRequestBody = {
		model,
		max_tokens,
		messages: [{ role: 'user', content: prompt }],
		temperature: 0.7,
	};

	if (system_prompt) {
		request_body.system = system_prompt;
	}

	return request_body;
}

function create_headers(api_key: string): Record<string, string> {
	return {
		'Content-Type': 'application/json',
		'x-api-key': api_key,
		'anthropic-version': '2023-06-01',
	};
}

async function make_api_request(
	url: string,
	headers: Record<string, string>,
	body: AnthropicRequestBody,
): Promise<AnthropicResponse> {
	const response = await fetch(url, {
		method: 'POST',
		headers,
		body: JSON.stringify(body),
	});

	if (!response.ok) {
		const error_data = await response.json().catch(() => ({}));
		throw new AnthropicAPIError(
			`API request failed: ${response.status} ${response.statusText}`,
			response.status,
			error_data,
		);
	}

	return await response.json();
}

function extract_text_content(response: AnthropicResponse): string {
	if (
		!response.content ||
		!response.content[0] ||
		response.content[0].type !== 'text'
	) {
		throw new AnthropicAPIError(
			'Invalid response format from Anthropic API',
		);
	}

	return response.content[0].text;
}

function validate_api_key(api_key: string): boolean {
	return api_key.startsWith('sk-ant-') && api_key.length > 20;
}

function sanitize_api_key(api_key: string): string {
	return api_key.trim();
}

export class AnthropicAPI {
	private api_key: string;
	private base_url = 'https://api.anthropic.com/v1/messages';
	private model = 'claude-3-5-sonnet-20241022';

	constructor(api_key: string) {
		this.api_key = api_key;
	}

	async generate_persona(
		prompt: string,
		system_prompt?: string,
	): Promise<string> {
		const request_body = create_request_body(
			prompt,
			this.model,
			4000,
			system_prompt,
		);
		const headers = create_headers(this.api_key);

		try {
			const response = await make_api_request(
				this.base_url,
				headers,
				request_body,
			);
			return extract_text_content(response);
		} catch (error) {
			if (error instanceof AnthropicAPIError) {
				throw error;
			}
			throw new AnthropicAPIError(
				`Network error: ${error instanceof Error ? error.message : 'Unknown error'}`,
			);
		}
	}

	async generate_persona_system(
		project_context: string,
		persona_requirements: string,
	): Promise<string> {
		const system_prompt =
			create_system_prompt_for_persona_generation();
		const user_prompt = create_user_prompt_for_persona_generation(
			project_context,
			persona_requirements,
		);

		return this.generate_persona(user_prompt, system_prompt);
	}

	async enhance_persona(
		existing_persona: string,
		enhancement_request: string,
	): Promise<string> {
		const system_prompt =
			create_system_prompt_for_persona_enhancement();
		const user_prompt = create_user_prompt_for_persona_enhancement(
			existing_persona,
			enhancement_request,
		);

		return this.generate_persona(user_prompt, system_prompt);
	}

	async validate_persona_system(persona_system: string): Promise<{
		is_valid: boolean;
		issues: string[];
		suggestions: string[];
	}> {
		const system_prompt =
			create_system_prompt_for_persona_validation();
		const user_prompt =
			create_user_prompt_for_persona_validation(persona_system);

		try {
			const response = await this.generate_persona(
				user_prompt,
				system_prompt,
			);
			return JSON.parse(response);
		} catch {
			return {
				is_valid: false,
				issues: ['Failed to parse validation response'],
				suggestions: ['Please try validation again'],
			};
		}
	}

	static validate_api_key(api_key: string): boolean {
		return validate_api_key(api_key);
	}

	static sanitize_api_key(api_key: string): string {
		return sanitize_api_key(api_key);
	}
}

function create_system_prompt_for_persona_generation(): string {
	return `You are an expert at creating sophisticated multi-agent persona systems for CLAUDE.md files. 

Your task is to generate advanced persona systems that enable real subagent delegation through Claude Code's Task Tool. These are not simple instruction sets, but technical frameworks for multi-agent coordination.

Key capabilities to include:
- Multi-agent workflow coordination
- Subagent delegation through Claude Code's Task Tool (up to 10 parallel agents)
- Communication protocols (file-based, Git-based, MCP servers)
- Workflow patterns from proven implementations

Follow these research-based patterns:
- BMAD Method (9 specialized personas with adaptive formality)
- Agent Control Plane (4 mandatory personas with strict transitions)
- SuperClaude Framework (command-flag based activation)

Generate a complete CLAUDE.md persona system that includes:
1. Persona selection mechanism
2. Individual persona definitions with behavioral rules
3. Delegation rules and subagent coordination
4. Communication protocols
5. Quality gates and workflow patterns

The output should be a complete, ready-to-use CLAUDE.md file section.`;
}

function create_user_prompt_for_persona_generation(
	project_context: string,
	persona_requirements: string,
): string {
	return `Project Context:
${project_context}

Persona Requirements:
${persona_requirements}

Generate a sophisticated multi-agent persona system for this project that enables effective subagent delegation and coordination.`;
}

function create_system_prompt_for_persona_enhancement(): string {
	return `You are an expert at enhancing and refining persona systems for CLAUDE.md files.

Your task is to improve existing persona definitions while maintaining their core functionality and adding sophisticated multi-agent capabilities.

Focus on:
- Improving delegation rules and subagent coordination
- Adding missing workflow patterns
- Enhancing communication protocols
- Strengthening quality gates
- Ensuring compatibility with Claude Code's Task Tool

Maintain the existing persona structure while making targeted improvements.`;
}

function create_user_prompt_for_persona_enhancement(
	existing_persona: string,
	enhancement_request: string,
): string {
	return `Existing Persona System:
${existing_persona}

Enhancement Request:
${enhancement_request}

Enhance this persona system with the requested improvements while maintaining its core functionality.`;
}

function create_system_prompt_for_persona_validation(): string {
	return `You are an expert at validating persona systems for CLAUDE.md files.

Your task is to analyze persona systems and identify:
1. Missing critical components
2. Ineffective delegation patterns
3. Poor communication protocols
4. Unclear quality gates
5. Potential coordination issues

Provide specific, actionable feedback for improvement.

Respond in JSON format:
{
  "is_valid": boolean,
  "issues": ["list of specific issues found"],
  "suggestions": ["list of specific improvement suggestions"]
}`;
}

function create_user_prompt_for_persona_validation(
	persona_system: string,
): string {
	return `Persona System to Validate:
${persona_system}

Analyze this persona system and provide validation feedback.`;
}

export { AnthropicAPIError };
