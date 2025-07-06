export interface ConfigState {
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
	commands: Command[];
	code_style: CodeStyle;
	project_structure: ProjectStructure;
	current_step: number;
	special_requirements?: string;
	preferred_persona_system?:
		| 'bmad'
		| 'agent-control'
		| 'superclaude'
		| 'custom';
}

export interface Command {
	name: string;
	command: string;
	description: string;
}

export interface CodeStyle {
	indent_style: 'tabs' | 'spaces';
	indent_size: number;
	max_line_length: number;
	quote_style: 'single' | 'double';
	semicolons: boolean;
	trailing_commas: boolean;
}

export interface ProjectStructure {
	src_directory: string;
	test_directory: string;
	build_directory: string;
	docs_directory: string;
	important_files: string[];
}

function create_default_config(): ConfigState {
	return {
		project_name: '',
		tech_stack: [],
		project_type: 'web-app',
		team_size: 'solo',
		complexity: 'simple',
		commands: [],
		code_style: {
			indent_style: 'tabs',
			indent_size: 2,
			max_line_length: 100,
			quote_style: 'single',
			semicolons: true,
			trailing_commas: true,
		},
		project_structure: {
			src_directory: 'src',
			test_directory: 'tests',
			build_directory: 'dist',
			docs_directory: 'docs',
			important_files: [],
		},
		current_step: 0,
	};
}

export const config_state = $state(create_default_config());

export function reset_config(): void {
	Object.assign(config_state, create_default_config());
}

export function update_project_basics(
	name: string,
	type: ConfigState['project_type'],
	tech_stack: string[],
): void {
	config_state.project_name = name;
	config_state.project_type = type;
	config_state.tech_stack = tech_stack;
}

export function update_team_info(
	team_size: ConfigState['team_size'],
	complexity: ConfigState['complexity'],
): void {
	config_state.team_size = team_size;
	config_state.complexity = complexity;
}

export function update_commands(commands: Command[]): void {
	config_state.commands = commands;
}

export function add_command(command: Command): void {
	config_state.commands.push(command);
}

export function remove_command(index: number): void {
	config_state.commands.splice(index, 1);
}

export function update_code_style(code_style: CodeStyle): void {
	config_state.code_style = code_style;
}

export function update_project_structure(
	project_structure: ProjectStructure,
): void {
	config_state.project_structure = project_structure;
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

export function set_special_requirements(requirements: string): void {
	config_state.special_requirements = requirements;
}

export function set_preferred_persona_system(
	system: ConfigState['preferred_persona_system'],
): void {
	config_state.preferred_persona_system = system;
}

export function get_config_for_generation(): ConfigState {
	return { ...config_state };
}
