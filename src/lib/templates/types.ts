export interface project_config {
	project_name: string;
	project_description?: string;
	project_type: string;
	team_size: string;
	complexity: string;
	tech_stack: tech_stack_config;
	commands: command_config[];
	code_style: code_style_config;
	project_structure: project_structure_config;
	custom_sections?: custom_section[];
	restrictions?: string[];
}

export interface tech_stack_config {
	framework: string;
	language: string;
	version?: string;
	database?: string;
	styling?: string;
	testing?: string;
	deployment?: string;
	build_tool?: string;
	package_manager?: string;
}

export interface command_config {
	command: string;
	description: string;
	is_required?: boolean;
}

export interface code_style_config {
	rules: string[];
	naming_convention?: string;
	formatting_tool?: string;
	linting_tool?: string;
}

export interface project_structure_config {
	directories: directory_config[];
	important_files?: string[];
}

export interface directory_config {
	path: string;
	description: string;
}

export interface custom_section {
	title: string;
	content: string;
}

export interface validation_result {
	is_valid: boolean;
	errors: string[];
	warnings: string[];
	line_count: number;
}

export interface claude_template {
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
	generate: (config: project_config) => string;
	validate: (content: string) => validation_result;
}
