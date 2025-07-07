export interface persona {
	name: string;
	role: string;
	expertise_level: 'junior' | 'mid' | 'senior' | 'principal';
	core_principles: string;
	tech_expertise: string;
	communication_style: string;
	specific_standards: string;
	activation_triggers: string;
}

export interface ConfigState {
	// Step 1: Universal Principles
	universal_principles: string;

	// Step 2: Persona Definition
	personas: persona[];

	// Step 3: Project Context
	project_context: string;

	// Step 4: Persona Activation Rules
	activation_rules: string;

	// Generation state
	is_generating: boolean;
	generated_content: string;
	generation_error: string | null;
	current_step: number;
}

function create_default_persona(): persona {
	return {
		name: '',
		role: '',
		expertise_level: 'senior',
		core_principles: '',
		tech_expertise: '',
		communication_style: '',
		specific_standards: '',
		activation_triggers: '',
	};
}

function create_default_config(): ConfigState {
	return {
		universal_principles: '',
		personas: [create_default_persona()],
		project_context: '',
		activation_rules: '',
		is_generating: false,
		generated_content: '',
		generation_error: null,
		current_step: 0,
	};
}

export const config_state = $state(create_default_config());

export function reset_config(): void {
	Object.assign(config_state, create_default_config());
}

export function update_universal_principles(value: string): void {
	config_state.universal_principles = value;
}

export function update_project_context(value: string): void {
	config_state.project_context = value;
}

export function update_activation_rules(value: string): void {
	config_state.activation_rules = value;
}

export function add_persona(): void {
	config_state.personas.push(create_default_persona());
}

export function remove_persona(index: number): void {
	if (config_state.personas.length > 1) {
		config_state.personas.splice(index, 1);
	}
}

export function update_persona(
	index: number,
	persona: persona,
): void {
	config_state.personas[index] = persona;
}

export function set_current_step(step: number): void {
	config_state.current_step = step;
}

export function next_step(): void {
	config_state.current_step += 1;
}

export function previous_step(): void {
	if (config_state.current_step > 0) {
		config_state.current_step -= 1;
	}
}

export function set_generation_state(is_generating: boolean): void {
	config_state.is_generating = is_generating;
}

export function set_generated_content(content: string): void {
	config_state.generated_content = content;
}

export function set_generation_error(error: string | null): void {
	config_state.generation_error = error;
}

export function get_config_for_generation(): ConfigState {
	return { ...config_state };
}
