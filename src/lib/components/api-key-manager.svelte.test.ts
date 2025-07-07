import { page } from '@vitest/browser/context';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { reset_api_key_ui_state } from '../state/api-key.svelte.js';
import { api_key_manager } from '../utils/api-key-manager.js';
import ApiKeyManager from './api-key-manager.svelte';

// Mock the api key manager
vi.mock('../utils/api-key-manager.js', () => ({
	api_key_manager: {
		has_api_key: vi.fn(() => false),
		set_api_key: vi.fn(),
		clear_api_key: vi.fn(),
		test_api_key: vi.fn(),
		get_security_info: vi.fn(() => ({
			storage_method: 'Memory only (not persisted)',
			data_stored: 'API key hash and usage metadata in localStorage',
			recommendations: [
				'API key is never stored in localStorage or browser storage',
				'You will need to re-enter your API key each session',
			],
		})),
	},
}));

describe('ApiKeyManager component', () => {
	beforeEach(() => {
		reset_api_key_ui_state();
		vi.clearAllMocks();
	});

	it('should show api key input form when no key is set', async () => {
		vi.mocked(api_key_manager.has_api_key).mockReturnValue(false);

		render(ApiKeyManager);

		await expect
			.element(page.getByText('Anthropic API Key'))
			.toBeInTheDocument();
		await expect
			.element(page.getByLabelText('API Key'))
			.toBeInTheDocument();
		await expect
			.element(page.getByRole('button', { name: /Set API Key/ }))
			.toBeInTheDocument();
	});

	it('should show configured state when key is set', async () => {
		vi.mocked(api_key_manager.has_api_key).mockReturnValue(true);

		render(ApiKeyManager);

		await expect
			.element(page.getByText('✅ API key is configured'))
			.toBeInTheDocument();
		await expect
			.element(page.getByRole('button', { name: /Test Key/ }))
			.toBeInTheDocument();
		await expect
			.element(page.getByRole('button', { name: /Clear Key/ }))
			.toBeInTheDocument();
	});

	it('should disable set button when input is empty', async () => {
		vi.mocked(api_key_manager.has_api_key).mockReturnValue(false);

		render(ApiKeyManager);

		const set_button = page.getByRole('button', {
			name: /Set API Key/,
		});
		await expect.element(set_button).toBeDisabled();
	});

	it('should enable set button when input has value', async () => {
		vi.mocked(api_key_manager.has_api_key).mockReturnValue(false);

		render(ApiKeyManager);

		const api_key_input = page.getByLabelText('API Key');
		await api_key_input.fill('sk-ant-test123');

		const set_button = page.getByRole('button', {
			name: /Set API Key/,
		});
		await expect.element(set_button).toBeEnabled();
	});

	it('should call api_key_manager.set_api_key when set button clicked', async () => {
		vi.mocked(api_key_manager.has_api_key).mockReturnValue(false);

		render(ApiKeyManager);

		const api_key_input = page.getByLabelText('API Key');
		await api_key_input.fill('sk-ant-test123');

		const set_button = page.getByRole('button', {
			name: /Set API Key/,
		});
		await set_button.click();

		expect(api_key_manager.set_api_key).toHaveBeenCalledWith(
			'sk-ant-test123',
		);
	});

	it('should toggle password visibility', async () => {
		vi.mocked(api_key_manager.has_api_key).mockReturnValue(false);

		render(ApiKeyManager);

		const api_key_input = page.getByLabelText('API Key');
		const toggle_button = page.getByRole('button', { name: /👁️/ });

		// Should start as password type
		await expect
			.element(api_key_input)
			.toHaveAttribute('type', 'password');

		await toggle_button.click();

		// Should become text type
		await expect
			.element(api_key_input)
			.toHaveAttribute('type', 'text');
	});

	it('should call test_api_key when test button clicked', async () => {
		vi.mocked(api_key_manager.has_api_key).mockReturnValue(true);
		vi.mocked(api_key_manager.test_api_key).mockResolvedValue(true);

		render(ApiKeyManager);

		const test_button = page.getByRole('button', {
			name: /Test Key/,
		});
		await test_button.click();

		expect(api_key_manager.test_api_key).toHaveBeenCalled();
	});

	it('should call clear_api_key when clear button clicked', async () => {
		vi.mocked(api_key_manager.has_api_key).mockReturnValue(true);

		render(ApiKeyManager);

		const clear_button = page.getByRole('button', {
			name: /Clear Key/,
		});
		await clear_button.click();

		expect(api_key_manager.clear_api_key).toHaveBeenCalled();
	});

	it('should show security information in collapsible section', async () => {
		vi.mocked(api_key_manager.has_api_key).mockReturnValue(false);

		render(ApiKeyManager);

		await expect
			.element(page.getByText('🔒 Security Information'))
			.toBeInTheDocument();

		// Expand section
		const security_section = page.getByText(
			'🔒 Security Information',
		);
		await security_section.click();

		await expect
			.element(page.getByText('Memory only (not persisted)'))
			.toBeInTheDocument();
	});

	it('should show error messages in state', async () => {
		vi.mocked(api_key_manager.has_api_key).mockReturnValue(false);
		vi.mocked(api_key_manager.set_api_key).mockImplementation(() => {
			throw new Error('Invalid API key format');
		});

		render(ApiKeyManager);

		const api_key_input = page.getByLabelText('API Key');
		await api_key_input.fill('invalid-key');

		const set_button = page.getByRole('button', {
			name: /Set API Key/,
		});
		await set_button.click();

		await expect
			.element(page.getByText('Invalid API key format'))
			.toBeInTheDocument();
	});
});
