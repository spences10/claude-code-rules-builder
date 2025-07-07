interface ApiKeyState {
	has_key: boolean;
	key_hash?: string;
	last_used?: Date;
}

function hash_api_key(api_key: string): string {
	let hash = 0;
	for (let i = 0; i < api_key.length; i++) {
		const char = api_key.charCodeAt(i);
		hash = (hash << 5) - hash + char;
		hash = hash & hash;
	}
	return hash.toString(16);
}

function create_api_key_state(api_key: string): ApiKeyState {
	return {
		has_key: true,
		key_hash: hash_api_key(api_key),
		last_used: new Date(),
	};
}

function validate_api_key(api_key: string): boolean {
	return api_key.startsWith('sk-ant-') && api_key.length > 20;
}

function sanitize_api_key(api_key: string): string {
	return api_key.trim();
}

function save_api_key_state(state: ApiKeyState): void {
	try {
		localStorage.setItem(
			ApiKeyManager.STATE_KEY,
			JSON.stringify(state),
		);
	} catch (error) {
		console.warn(
			'Failed to save API key state to localStorage:',
			error,
		);
	}
}

function load_api_key_state(): ApiKeyState {
	try {
		const state_str = localStorage.getItem(ApiKeyManager.STATE_KEY);
		if (state_str) {
			return JSON.parse(state_str);
		}
	} catch (error) {
		console.warn(
			'Failed to read API key state from localStorage:',
			error,
		);
	}

	return { has_key: false };
}

function clear_api_key_state(): void {
	try {
		localStorage.removeItem(ApiKeyManager.STATE_KEY);
	} catch (error) {
		console.warn(
			'Failed to clear API key state from localStorage:',
			error,
		);
	}
}

function calculate_days_since_last_use(last_used?: Date): number {
	if (!last_used) return 0;

	const now = new Date();
	const last_used_date = new Date(last_used);
	return (
		(now.getTime() - last_used_date.getTime()) / (1000 * 60 * 60 * 24)
	);
}

export class ApiKeyManager {
	private static readonly STORAGE_KEY = 'claude-generator-api-key';
	static readonly STATE_KEY = 'claude-generator-api-state';
	private static instance: ApiKeyManager;
	private api_key: string | null = null;

	private constructor() {}

	static get_instance(): ApiKeyManager {
		if (!ApiKeyManager.instance) {
			ApiKeyManager.instance = new ApiKeyManager();
		}
		return ApiKeyManager.instance;
	}

	set_api_key(api_key: string): boolean {
		const clean_key = sanitize_api_key(api_key);

		if (!validate_api_key(clean_key)) {
			throw new Error(
				'Invalid API key format. Anthropic API keys should start with "sk-ant-"',
			);
		}

		this.api_key = clean_key;

		const state = create_api_key_state(clean_key);
		save_api_key_state(state);

		return true;
	}

	get_api_key(): string | null {
		return this.api_key;
	}

	has_api_key(): boolean {
		return this.api_key !== null;
	}

	clear_api_key(): void {
		this.api_key = null;
		clear_api_key_state();
	}

	get_api_key_state(): ApiKeyState {
		return load_api_key_state();
	}

	async test_api_key(): Promise<boolean> {
		if (!this.api_key) {
			return false;
		}

		try {
			const response = await fetch('/api/test-key', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ api_key: this.api_key }),
			});

			const data = await response.json();
			return data.success && data.valid;
		} catch (error) {
			console.error('API key test failed with error:', error);
			return false;
		}
	}

	is_api_key_expired(): boolean {
		const state = this.get_api_key_state();
		if (!state.last_used) return false;

		const days_since_last_use = calculate_days_since_last_use(
			state.last_used,
		);
		return days_since_last_use > 30;
	}

	get_security_info(): {
		storage_method: string;
		data_stored: string;
		recommendations: string[];
	} {
		return {
			storage_method: 'Memory only (not persisted)',
			data_stored: 'API key hash and usage metadata in localStorage',
			recommendations: [
				'API key is never stored in localStorage or browser storage',
				'You will need to re-enter your API key each session',
				'Only non-sensitive metadata (hash, last used date) is stored',
				'Clear browser data to remove all stored metadata',
				'Use a dedicated API key with minimal permissions',
			],
		};
	}
}

export const api_key_manager = ApiKeyManager.get_instance();
