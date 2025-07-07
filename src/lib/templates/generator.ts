import type {
	code_style_config,
	command_config,
	custom_section,
	project_config,
	project_structure_config,
	tech_stack_config,
} from './types';

export function generate_claude_md(config: project_config): string {
	const sections = [
		generate_header(config.project_name, config.project_description),
		generate_tech_stack(config.tech_stack),
		generate_commands(config.commands),
		generate_code_style(config.code_style),
		generate_project_structure(config.project_structure),
		...generate_custom_sections(config.custom_sections || []),
		generate_restrictions(config.restrictions || []),
	];

	return sections.filter(Boolean).join('\n\n');
}

function generate_header(
	project_name: string,
	description?: string,
): string {
	let header = `# ${project_name}\n`;
	if (description) {
		header += `\n${description}`;
	}
	return header;
}

function generate_tech_stack(tech_stack: tech_stack_config): string {
	if (!tech_stack.framework && !tech_stack.language) {
		return '';
	}

	let section = '## Tech Stack\n';
	const items = [];

	if (tech_stack.framework) {
		items.push(
			`- Framework: ${tech_stack.framework}${tech_stack.version ? ` ${tech_stack.version}` : ''}`,
		);
	}
	if (tech_stack.language) {
		items.push(`- Language: ${tech_stack.language}`);
	}
	if (tech_stack.styling) {
		items.push(`- Styling: ${tech_stack.styling}`);
	}
	if (tech_stack.database) {
		items.push(`- Database: ${tech_stack.database}`);
	}
	if (tech_stack.testing) {
		items.push(`- Testing: ${tech_stack.testing}`);
	}
	if (tech_stack.build_tool) {
		items.push(`- Build Tool: ${tech_stack.build_tool}`);
	}
	if (tech_stack.package_manager) {
		items.push(`- Package Manager: ${tech_stack.package_manager}`);
	}
	if (tech_stack.deployment) {
		items.push(`- Deployment: ${tech_stack.deployment}`);
	}

	section += items.join('\n');
	return section;
}

function generate_commands(commands: command_config[]): string {
	if (!commands.length) {
		return '';
	}

	let section = '## Development Commands\n';
	const command_items = commands.map(
		(cmd) => `- \`${cmd.command}\`: ${cmd.description}`,
	);
	section += command_items.join('\n');
	return section;
}

function generate_code_style(code_style: code_style_config): string {
	if (!code_style.rules.length) {
		return '';
	}

	let section = '## Code Style\n';
	const style_items = code_style.rules.map((rule) => `- ${rule}`);
	section += style_items.join('\n');
	return section;
}

function generate_project_structure(
	project_structure: project_structure_config,
): string {
	if (!project_structure.directories.length) {
		return '';
	}

	let section = '## Project Structure\n';
	const structure_items = project_structure.directories.map(
		(dir) => `- \`${dir.path}\`: ${dir.description}`,
	);
	section += structure_items.join('\n');
	return section;
}

function generate_custom_sections(
	custom_sections: custom_section[],
): string[] {
	return custom_sections.map((section) => {
		return `## ${section.title}\n\n${section.content}`;
	});
}

function generate_restrictions(restrictions: string[]): string {
	if (!restrictions.length) {
		return '';
	}

	let section = '## Do Not Touch\n';
	const restriction_items = restrictions.map(
		(restriction) => `- ${restriction}`,
	);
	section += restriction_items.join('\n');
	return section;
}
