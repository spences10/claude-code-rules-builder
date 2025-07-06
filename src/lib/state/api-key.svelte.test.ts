import { describe, expect, it, beforeEach } from 'vitest';
import {
	api_key_ui_state,
	set_api_key_error,
	clear_api_key_error,
	set_testing_state,
	set_test_result,
	reset_api_key_ui_state,
} from './api-key.svelte.js';

describe('api-key state management', () => {
	beforeEach(() => {
		reset_api_key_ui_state();
	});

	it('should initialize with default state', () => {
		expect(api_key_ui_state.is_testing).toBe(false);
		expect(api_key_ui_state.test_result).toBe(null);
		expect(api_key_ui_state.error).toBe('');
	});

	it('should set and clear error messages', () => {
		const error_message = 'Invalid API key format';

		set_api_key_error(error_message);
		expect(api_key_ui_state.error).toBe(error_message);

		clear_api_key_error();
		expect(api_key_ui_state.error).toBe('');
	});

	it('should manage testing state', () => {
		set_testing_state(true);
		expect(api_key_ui_state.is_testing).toBe(true);

		set_testing_state(false);
		expect(api_key_ui_state.is_testing).toBe(false);
	});

	it('should set test results', () => {
		set_test_result('success');
		expect(api_key_ui_state.test_result).toBe('success');

		set_test_result('error');
		expect(api_key_ui_state.test_result).toBe('error');

		set_test_result(null);
		expect(api_key_ui_state.test_result).toBe(null);
	});

	it('should reset state to defaults', () => {
		set_api_key_error('Some error');
		set_testing_state(true);
		set_test_result('success');

		reset_api_key_ui_state();

		expect(api_key_ui_state.is_testing).toBe(false);
		expect(api_key_ui_state.test_result).toBe(null);
		expect(api_key_ui_state.error).toBe('');
	});
});
