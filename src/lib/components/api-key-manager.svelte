<script lang="ts">
	import {
		api_key_ui_state,
		clear_api_key_error,
		reset_api_key_ui_state,
		set_api_key_error,
		set_api_key_success,
		clear_api_key_success,
		set_test_result,
		set_testing_state,
	} from '../state/api-key.svelte.js';
	import { api_key_manager } from '../utils/api-key-manager.js';

	let api_key = $state('');
	let is_visible = $state(false);
	let is_loading = $state(false);

	function toggle_visibility(): void {
		is_visible = !is_visible;
	}

	async function set_api_key(): Promise<void> {
		if (!api_key.trim()) {
			set_api_key_error('Please enter an API key');
			return;
		}

		is_loading = true;
		clear_api_key_error();

		try {
			api_key_manager.set_api_key(api_key);
			api_key = '';
			set_api_key_success();
		} catch (err) {
			set_api_key_error(
				err instanceof Error ? err.message : 'Failed to set API key',
			);
		} finally {
			is_loading = false;
		}
	}

	async function test_api_key(): Promise<void> {
		if (!api_key_ui_state.has_key) {
			set_api_key_error('No API key set');
			return;
		}

		set_testing_state(true);
		set_test_result(null);

		try {
			const is_valid = await api_key_manager.test_api_key();
			if (is_valid) {
				set_test_result('success');
			} else {
				set_test_result('error');
				set_api_key_error('API key test failed. Check browser console for details.');
			}
		} catch (err) {
			set_test_result('error');
			set_api_key_error(
				err instanceof Error ? err.message : 'Failed to test API key',
			);
		} finally {
			set_testing_state(false);
		}
	}

	function clear_api_key(): void {
		api_key_manager.clear_api_key();
		api_key = '';
		clear_api_key_success();
	}

	function handle_key_press(event: KeyboardEvent): void {
		if (event.key === 'Enter') {
			set_api_key();
		}
	}

	const security_info = api_key_manager.get_security_info();

	// Initialize state based on existing API key
	if (api_key_manager.has_api_key()) {
		set_api_key_success();
	}
</script>

<div class="card bg-base-100 shadow-xl">
	<div class="card-body">
		<h2 class="card-title">
			<span class="text-2xl">🔑</span>
			Anthropic API Key
		</h2>

		{#if api_key_ui_state.has_key}
			<div class="alert alert-success">
				<span class="text-sm">✅ API key is configured</span>
			</div>

			<div class="flex gap-2">
				<button
					class="btn btn-outline btn-sm"
					onclick={test_api_key}
					disabled={api_key_ui_state.is_testing}
				>
					{#if api_key_ui_state.is_testing}
						<span class="loading loading-spinner loading-xs"></span>
						Testing...
					{:else}
						Test Key
					{/if}
				</button>

				<button
					class="btn btn-outline btn-error btn-sm"
					onclick={clear_api_key}
				>
					Clear Key
				</button>
			</div>

			{#if api_key_ui_state.test_result === 'success'}
				<div class="alert alert-success">
					<span class="text-sm">✅ API key is valid and working</span>
				</div>
			{:else if api_key_ui_state.test_result === 'error'}
				<div class="alert alert-error">
					<span class="text-sm">❌ API key test failed</span>
				</div>
			{/if}
		{:else}
			<p class="text-base-content/70 text-sm">
				To generate intelligent personas, you need to provide your
				Anthropic API key. Your key is stored securely in memory only
				and never persisted.
			</p>

			<div class="form-control w-full">
				<label class="label" for="api-key-input">
					<span class="label-text">API Key</span>
				</label>
				<div class="join">
					<input
						id="api-key-input"
						type={is_visible ? 'text' : 'password'}
						placeholder="sk-ant-..."
						class="input input-bordered join-item flex-1"
						bind:value={api_key}
						onkeypress={handle_key_press}
						disabled={is_loading}
					/>
					<button
						class="btn btn-outline join-item"
						onclick={toggle_visibility}
						type="button"
					>
						{is_visible ? '🙈' : '👁️'}
					</button>
				</div>
				{#if api_key_ui_state.error}
					<div class="label">
						<span class="label-text-alt text-error">
							{api_key_ui_state.error}
						</span>
					</div>
				{/if}
			</div>

			<div class="card-actions justify-end">
				<button
					class="btn btn-primary"
					onclick={set_api_key}
					disabled={is_loading || !api_key.trim()}
				>
					{#if is_loading}
						<span class="loading loading-spinner loading-sm"></span>
						Setting Key...
					{:else}
						Set API Key
					{/if}
				</button>
			</div>
		{/if}

		<!-- Security Information -->
		<div class="collapse-arrow bg-base-200 collapse">
			<input type="checkbox" />
			<div class="collapse-title text-sm font-medium">
				🔒 Security Information
			</div>
			<div class="collapse-content">
				<div class="space-y-2 text-xs">
					<p>
						<strong>Storage:</strong>
						{security_info.storage_method}
					</p>
					<p>
						<strong>Data Stored:</strong>
						{security_info.data_stored}
					</p>
					<div>
						<strong>Security Recommendations:</strong>
						<ul class="mt-1 list-inside list-disc space-y-1">
							{#each security_info.recommendations as recommendation, index (index)}
								<li>{recommendation}</li>
							{/each}
						</ul>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
