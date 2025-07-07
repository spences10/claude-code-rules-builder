import { page } from '@vitest/browser/context';
import { beforeEach, describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { config_state, reset_config } from '../state/config.svelte';
import ConfigWizard from './config-wizard.svelte';

describe('ConfigWizard component', () => {
	beforeEach(() => {
		reset_config();
	});

	it('should render first step with universal principles form', async () => {
		render(ConfigWizard);

		await expect
			.element(page.getByText('Configure Your CLAUDE.md'))
			.toBeInTheDocument();
		await expect
			.element(
				page.getByRole('heading', { name: 'Universal Principles' }),
			)
			.toBeInTheDocument();

		const principles_textarea = page.getByLabelText(
			'Core Standards & Quality Principles *',
		);
		await expect.element(principles_textarea).toBeInTheDocument();
	});

	it('should show step progress indicators', async () => {
		render(ConfigWizard);

		await expect
			.element(page.getByText('Step 1 of 4'))
			.toBeInTheDocument();
	});

	it('should disable next button when required fields are empty', async () => {
		render(ConfigWizard);

		const next_button = page.getByRole('button', { name: /Next →/ });
		await expect.element(next_button).toBeDisabled();
	});

	it('should enable next button when universal principles are filled', async () => {
		render(ConfigWizard);

		const principles_textarea = page.getByLabelText(
			'Core Standards & Quality Principles *',
		);
		await principles_textarea.fill('Always write tests');

		const next_button = page.getByRole('button', { name: /Next →/ });
		await expect.element(next_button).toBeEnabled();
	});

	it('should advance to step 2 when next is clicked', async () => {
		render(ConfigWizard);

		const principles_textarea = page.getByLabelText(
			'Core Standards & Quality Principles *',
		);
		await principles_textarea.fill('Always write tests');

		const next_button = page.getByRole('button', { name: /Next →/ });
		await next_button.click();

		await expect
			.element(page.getByRole('heading', { name: 'Expert Personas' }))
			.toBeInTheDocument();
		await expect
			.element(page.getByText('Step 2 of 4'))
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
		const principles_textarea = page.getByLabelText(
			'Core Standards & Quality Principles *',
		);
		await principles_textarea.fill('Always write tests');

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
		const principles_textarea = page.getByLabelText(
			'Core Standards & Quality Principles *',
		);
		await principles_textarea.fill('Always write tests');

		const next_button = page.getByRole('button', { name: /Next →/ });
		await next_button.click();

		// Go back
		const previous_button = page.getByRole('button', {
			name: /← Previous/,
		});
		await previous_button.click();

		await expect
			.element(
				page.getByRole('heading', { name: 'Universal Principles' }),
			)
			.toBeInTheDocument();
		await expect
			.element(page.getByText('Step 1 of 4'))
			.toBeInTheDocument();
	});

	it('should update config state when form fields change', async () => {
		render(ConfigWizard);

		const principles_textarea = page.getByLabelText(
			'Core Standards & Quality Principles *',
		);
		await principles_textarea.fill('Always write tests');

		expect(config_state.universal_principles).toBe(
			'Always write tests',
		);
	});

	it('should show step counter', async () => {
		render(ConfigWizard);

		await expect
			.element(page.getByText('Step 1 of 5'))
			.toBeInTheDocument();

		// Advance to step 2
		const principles_textarea = page.getByLabelText(
			'Core Standards & Quality Principles *',
		);
		await principles_textarea.fill('Always write tests');

		const next_button = page.getByRole('button', { name: /Next →/ });
		await next_button.click();

		await expect
			.element(page.getByText('Step 2 of 4'))
			.toBeInTheDocument();
	});

	it('should show generate button on final step', async () => {
		render(ConfigWizard);

		// Mock advancing to final step
		config_state.current_step = 3;
		config_state.universal_principles = 'Always write tests';

		await expect
			.element(page.getByRole('button', { name: /Generate/ }))
			.toBeInTheDocument();
	});

	it('should show form validation errors for empty persona fields', async () => {
		render(ConfigWizard);

		// Navigate to personas step
		const principles_textarea = page.getByLabelText(
			'Core Standards & Quality Principles *',
		);
		await principles_textarea.fill('Always write tests');

		const next_button = page.getByRole('button', { name: /Next →/ });
		await next_button.click();

		// Check that error messages appear for empty persona fields
		await expect
			.element(page.getByText('Persona name is required'))
			.toBeInTheDocument();
		await expect
			.element(page.getByText('Expert role is required'))
			.toBeInTheDocument();
	});

	it('should apply error styling to invalid persona inputs', async () => {
		render(ConfigWizard);

		// Navigate to personas step
		const principles_textarea = page.getByLabelText(
			'Core Standards & Quality Principles *',
		);
		await principles_textarea.fill('Always write tests');

		const next_button = page.getByRole('button', { name: /Next →/ });
		await next_button.click();

		// Check that inputs have error styling
		const persona_name_input = page.getByLabelText('Persona Name *');
		await expect
			.element(persona_name_input)
			.toHaveClass('input-error');

		const persona_role_input = page.getByLabelText('Expert Role *');
		await expect
			.element(persona_role_input)
			.toHaveClass('input-error');
	});
});
