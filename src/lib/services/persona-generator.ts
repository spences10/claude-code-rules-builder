import { api_key_manager } from '../utils/api-key-manager.js';
import { AnthropicAPIError } from '../utils/anthropic-api.js';

export interface PersonaGenerationRequest {
	project_name: string;
	tech_stack: string[];
	project_type:
		| 'web-app'
		| 'api'
		| 'mobile-app'
		| 'desktop-app'
		| 'library'
		| 'cli-tool';
	team_size: 'solo' | 'small' | 'medium' | 'large';
	complexity: 'simple' | 'moderate' | 'complex';
	special_requirements?: string;
	preferred_persona_system?:
		| 'bmad'
		| 'agent-control'
		| 'superclaude'
		| 'custom';
}

export interface PersonaGenerationResult {
	success: boolean;
	content?: string;
	error?: string;
	metadata?: {
		tokens_used: number;
		generation_time: number;
		persona_count: number;
	};
}

export interface PersonaValidationResult {
	is_valid: boolean;
	issues: string[];
	suggestions: string[];
	score: number;
}

function build_project_context(
	request: PersonaGenerationRequest,
): string {
	const context = [
		`Project Name: ${request.project_name}`,
		`Project Type: ${request.project_type}`,
		`Tech Stack: ${request.tech_stack.join(', ')}`,
		`Team Size: ${request.team_size}`,
		`Complexity: ${request.complexity}`,
	];

	if (request.special_requirements) {
		context.push(
			`Special Requirements: ${request.special_requirements}`,
		);
	}

	if (request.preferred_persona_system) {
		context.push(
			`Preferred Persona System: ${request.preferred_persona_system}`,
		);
	}

	return context.join('\n');
}

function build_persona_requirements_for_web_app(): string[] {
	return [
		'Frontend development expertise',
		'UI/UX design considerations',
		'Performance optimization',
		'Cross-browser compatibility',
	];
}

function build_persona_requirements_for_api(): string[] {
	return [
		'API design and development',
		'Security best practices',
		'Performance and scalability',
		'Documentation and testing',
	];
}

function build_persona_requirements_for_mobile_app(): string[] {
	return [
		'Mobile development patterns',
		'Platform-specific considerations',
		'Performance optimization',
		'User experience design',
	];
}

function build_persona_requirements_for_library(): string[] {
	return [
		'API design and documentation',
		'Backward compatibility',
		'Testing and quality assurance',
		'Community support',
	];
}

function get_base_requirements_for_project_type(
	project_type: string,
): string[] {
	switch (project_type) {
		case 'web-app':
			return build_persona_requirements_for_web_app();
		case 'api':
			return build_persona_requirements_for_api();
		case 'mobile-app':
			return build_persona_requirements_for_mobile_app();
		case 'library':
			return build_persona_requirements_for_library();
		default:
			return [];
	}
}

function add_complexity_requirements(
	requirements: string[],
	complexity: string,
): string[] {
	if (complexity === 'complex') {
		return [
			...requirements,
			'Advanced architecture patterns',
			'Multi-agent coordination',
			'Sophisticated testing strategies',
			'Performance monitoring',
		];
	}
	return requirements;
}

function add_team_requirements(
	requirements: string[],
	team_size: string,
): string[] {
	if (team_size !== 'solo') {
		return [
			...requirements,
			'Team coordination and communication',
			'Code review processes',
			'Documentation standards',
			'Knowledge sharing',
		];
	}
	return requirements;
}

function build_persona_requirements(
	request: PersonaGenerationRequest,
): string {
	let requirements = get_base_requirements_for_project_type(
		request.project_type,
	);
	requirements = add_complexity_requirements(
		requirements,
		request.complexity,
	);
	requirements = add_team_requirements(
		requirements,
		request.team_size,
	);

	return requirements.join('\n- ');
}

function estimate_persona_count(content: string): number {
	const persona_markers = content.match(
		/##\s+\w+\s+(Persona|Agent)/gi,
	);
	return persona_markers ? persona_markers.length : 1;
}

function calculate_validation_score(validation: {
	is_valid: boolean;
	issues: string[];
	suggestions: string[];
}): number {
	let score = 100;

	score -= validation.issues.length * 10;

	const critical_issues = validation.issues.filter(
		(issue) =>
			issue.toLowerCase().includes('critical') ||
			issue.toLowerCase().includes('missing') ||
			issue.toLowerCase().includes('invalid'),
	);
	score -= critical_issues.length * 15;

	return Math.max(0, Math.min(100, score));
}

export class PersonaGeneratorService {
	private static instance: PersonaGeneratorService;

	private constructor() {}

	static get_instance(): PersonaGeneratorService {
		if (!PersonaGeneratorService.instance) {
			PersonaGeneratorService.instance =
				new PersonaGeneratorService();
		}
		return PersonaGeneratorService.instance;
	}

	async generate_persona_system(
		request: PersonaGenerationRequest,
	): Promise<PersonaGenerationResult> {
		const api = api_key_manager.get_api();
		if (!api) {
			return {
				success: false,
				error:
					'No API key configured. Please set your Anthropic API key first.',
			};
		}

		const start_time = Date.now();

		try {
			const project_context = build_project_context(request);
			const persona_requirements =
				build_persona_requirements(request);

			const content = await api.generate_persona_system(
				project_context,
				persona_requirements,
			);
			const generation_time = Date.now() - start_time;

			return {
				success: true,
				content,
				metadata: {
					tokens_used: 0,
					generation_time,
					persona_count: estimate_persona_count(content),
				},
			};
		} catch (error) {
			if (error instanceof AnthropicAPIError) {
				return {
					success: false,
					error: `API Error: ${error.message}`,
				};
			}
			return {
				success: false,
				error: `Generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
			};
		}
	}

	async enhance_persona_system(
		existing_persona: string,
		enhancement_request: string,
	): Promise<PersonaGenerationResult> {
		const api = api_key_manager.get_api();
		if (!api) {
			return {
				success: false,
				error:
					'No API key configured. Please set your Anthropic API key first.',
			};
		}

		const start_time = Date.now();

		try {
			const content = await api.enhance_persona(
				existing_persona,
				enhancement_request,
			);
			const generation_time = Date.now() - start_time;

			return {
				success: true,
				content,
				metadata: {
					tokens_used: 0,
					generation_time,
					persona_count: estimate_persona_count(content),
				},
			};
		} catch (error) {
			if (error instanceof AnthropicAPIError) {
				return {
					success: false,
					error: `API Error: ${error.message}`,
				};
			}
			return {
				success: false,
				error: `Enhancement failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
			};
		}
	}

	async validate_persona_system(
		persona_system: string,
	): Promise<PersonaValidationResult> {
		const api = api_key_manager.get_api();
		if (!api) {
			return {
				is_valid: false,
				issues: ['No API key configured'],
				suggestions: ['Please set your Anthropic API key first'],
				score: 0,
			};
		}

		try {
			const validation =
				await api.validate_persona_system(persona_system);
			const score = calculate_validation_score(validation);

			return {
				...validation,
				score,
			};
		} catch (error) {
			return {
				is_valid: false,
				issues: [
					`Validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
				],
				suggestions: ['Please try validation again'],
				score: 0,
			};
		}
	}

	get_persona_system_templates(): Array<{
		id: string;
		name: string;
		description: string;
		persona_count: number;
		complexity: 'simple' | 'moderate' | 'complex';
		use_case: string;
	}> {
		return [
			{
				id: 'bmad',
				name: 'BMAD Method',
				description:
					'Comprehensive 9-persona system with adaptive formality',
				persona_count: 9,
				complexity: 'complex',
				use_case: 'Full development lifecycle coverage',
			},
			{
				id: 'agent-control',
				name: 'Agent Control Plane',
				description:
					'Mandatory 4-persona system with strict transitions',
				persona_count: 4,
				complexity: 'moderate',
				use_case: 'Structured development workflows',
			},
			{
				id: 'superclaude',
				name: 'SuperClaude Framework',
				description: 'Command-flag based persona activation',
				persona_count: 6,
				complexity: 'moderate',
				use_case: 'Flexible specialist coordination',
			},
			{
				id: 'simple-dev',
				name: 'Simple Development',
				description: 'Basic 3-persona system for small projects',
				persona_count: 3,
				complexity: 'simple',
				use_case: 'Small team or solo development',
			},
		];
	}
}

export const persona_generator =
	PersonaGeneratorService.get_instance();
