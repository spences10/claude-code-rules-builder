interface ApiKeyUiState {
	is_testing: boolean;
	test_result: 'success' | 'error' | null;
	error: string;
}

function create_default_api_key_ui_state(): ApiKeyUiState {
	return {
		is_testing: false,
		test_result: null,
		error: '',
	};
}

export const api_key_ui_state = $state(
	create_default_api_key_ui_state(),
);

export function set_api_key_error(error: string): void {
	api_key_ui_state.error = error;
}

export function clear_api_key_error(): void {
	api_key_ui_state.error = '';
}

export function set_testing_state(is_testing: boolean): void {
	api_key_ui_state.is_testing = is_testing;
}

export function set_test_result(
	result: 'success' | 'error' | null,
): void {
	api_key_ui_state.test_result = result;
}

export function reset_api_key_ui_state(): void {
	Object.assign(api_key_ui_state, create_default_api_key_ui_state());
}
