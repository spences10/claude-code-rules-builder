import { page } from '@vitest/browser/context';
import { beforeEach, describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { config_state, reset_config } from '../state/config.svelte';
import ConfigWizard from './config-wizard.svelte';

describe('ConfigWizard component', () => {
	beforeEach(() => {
		reset_config();
	});

	it('should render first step with project basics form', async () => {
		render(ConfigWizard);

		await expect
			.element(page.getByText('Configure Your CLAUDE.md'))
			.toBeInTheDocument();
		await expect
			.element(page.getByRole('heading', { name: 'Project Basics' }))
			.toBeInTheDocument();

		const project_name_input = page.getByLabelText('Project Name *');
		await expect.element(project_name_input).toBeInTheDocument();

		const project_type_select = page.getByLabelText('Project Type *');
		await expect.element(project_type_select).toBeInTheDocument();
	});

	it('should show step progress indicators', async () => {
		render(ConfigWizard);

		await expect
			.element(page.getByText('Step 1 of 5'))
			.toBeInTheDocument();
	});

	it('should disable next button when required fields are empty', async () => {
		render(ConfigWizard);

		const next_button = page.getByRole('button', { name: /Next →/ });
		await expect.element(next_button).toBeDisabled();
	});

	it('should enable next button when project name is filled', async () => {
		render(ConfigWizard);

		const project_name_input = page.getByLabelText('Project Name *');
		await project_name_input.fill('Test Project');

		const next_button = page.getByRole('button', { name: /Next →/ });
		await expect.element(next_button).toBeEnabled();
	});

	it('should advance to step 2 when next is clicked', async () => {
		render(ConfigWizard);

		const project_name_input = page.getByLabelText('Project Name *');
		await project_name_input.fill('Test Project');

		const next_button = page.getByRole('button', { name: /Next →/ });
		await next_button.click();

		await expect
			.element(
				page.getByRole('heading', { name: 'Tech Stack Selection' }),
			)
			.toBeInTheDocument();
		await expect
			.element(page.getByText('Step 2 of 5'))
			.toBeInTheDocument();
	});

	it('should disable previous button on first step', async () => {
		render(ConfigWizard);

		const previous_button = page.getByRole('button', {
			name: /← Previous/,
		});
		await expect.element(previous_button).toBeDisabled();
	});

	it('should enable previous button on later steps', async () => {
		render(ConfigWizard);

		// Fill form and advance
		const project_name_input = page.getByLabelText('Project Name *');
		await project_name_input.fill('Test Project');

		const next_button = page.getByRole('button', { name: /Next →/ });
		await next_button.click();

		const previous_button = page.getByRole('button', {
			name: /← Previous/,
		});
		await expect.element(previous_button).toBeEnabled();
	});

	it('should go back to previous step when previous button clicked', async () => {
		render(ConfigWizard);

		// Advance to step 2
		const project_name_input = page.getByLabelText('Project Name *');
		await project_name_input.fill('Test Project');

		const next_button = page.getByRole('button', { name: /Next →/ });
		await next_button.click();

		// Go back
		const previous_button = page.getByRole('button', {
			name: /← Previous/,
		});
		await previous_button.click();

		await expect
			.element(page.getByRole('heading', { name: 'Project Basics' }))
			.toBeInTheDocument();
		await expect
			.element(page.getByText('Step 1 of 5'))
			.toBeInTheDocument();
	});

	it('should update config state when form fields change', async () => {
		render(ConfigWizard);

		const project_name_input = page.getByLabelText('Project Name *');
		await project_name_input.fill('My Test Project');

		expect(config_state.project_name).toBe('My Test Project');

		const project_type_select = page.getByLabelText('Project Type *');
		await project_type_select.selectOption('api');

		expect(config_state.project_type).toBe('api');
	});

	it('should show step counter', async () => {
		render(ConfigWizard);

		await expect
			.element(page.getByText('Step 1 of 5'))
			.toBeInTheDocument();

		// Advance to step 2
		const project_name_input = page.getByLabelText('Project Name *');
		await project_name_input.fill('Test Project');

		const next_button = page.getByRole('button', { name: /Next →/ });
		await next_button.click();

		await expect
			.element(page.getByText('Step 2 of 5'))
			.toBeInTheDocument();
	});

	it('should show generate button on final step', async () => {
		render(ConfigWizard);

		// Mock advancing to final step
		config_state.current_step = 4;
		config_state.project_name = 'Test Project';

		await expect
			.element(page.getByRole('button', { name: /Generate/ }))
			.toBeInTheDocument();
	});
});
