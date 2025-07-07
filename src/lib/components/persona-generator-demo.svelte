<script lang="ts">
	import type { PersonaGenerationResult } from '../services/persona-generator.js';
	import { persona_generator } from '../services/persona-generator.js';
	import { api_key_manager } from '../utils/api-key-manager.js';

	let is_generating = $state(false);
	let generation_result = $state<PersonaGenerationResult | null>(
		null,
	);
	let project_name = $state('My Awesome Project');
	let tech_stack = $state(['TypeScript', 'Svelte', 'TailwindCSS']);
	let project_type = $state<
		| 'web-app'
		| 'api'
		| 'mobile-app'
		| 'desktop-app'
		| 'library'
		| 'cli-tool'
	>('web-app');

	async function generate_demo_persona(): Promise<void> {
		if (!api_key_manager.has_api_key()) {
			generation_result = {
				success: false,
				error: 'Please set your API key first',
			};
			return;
		}

		is_generating = true;
		generation_result = null;

		try {
			const request = {
				project_name,
				tech_stack,
				project_type,
				team_size: 'solo' as const,
				complexity: 'simple' as const,
				special_requirements:
					'Demo project for testing persona generation',
			};

			generation_result =
				await persona_generator.generate_persona_system(request);
		} catch (err) {
			generation_result = {
				success: false,
				error: err instanceof Error ? err.message : 'Unknown error',
			};
		} finally {
			is_generating = false;
		}
	}
</script>

<div class="card bg-base-100 shadow-xl">
	<div class="card-body">
		<h2 class="card-title">
			<span class="text-2xl">🤖</span>
			Persona Generator Demo
		</h2>

		<div class="form-control">
			<label class="label" for="project-name">
				<span class="label-text">Project Name</span>
			</label>
			<input
				id="project-name"
				type="text"
				class="input input-bordered"
				bind:value={project_name}
				disabled={is_generating}
			/>
		</div>

		<div class="form-control">
			<label class="label" for="project-type">
				<span class="label-text">Project Type</span>
			</label>
			<select
				id="project-type"
				class="select select-bordered"
				bind:value={project_type}
				disabled={is_generating}
			>
				<option value="web-app">Web App</option>
				<option value="api">API</option>
				<option value="mobile-app">Mobile App</option>
				<option value="desktop-app">Desktop App</option>
				<option value="library">Library</option>
				<option value="cli-tool">CLI Tool</option>
			</select>
		</div>

		<div class="card-actions justify-end">
			<button
				class="btn btn-primary"
				onclick={generate_demo_persona}
				disabled={is_generating || !api_key_manager.has_api_key()}
			>
				{#if is_generating}
					<span class="loading loading-spinner loading-sm"></span>
					Generating...
				{:else}
					Generate Persona System
				{/if}
			</button>
		</div>

		{#if generation_result}
			{#if generation_result.success}
				<div class="alert alert-success">
					<span class="text-sm"
						>✅ Persona system generated successfully!</span
					>
					{#if generation_result.metadata}
						<span class="text-xs">
							({generation_result.metadata.persona_count} personas, {generation_result
								.metadata.generation_time}ms)
						</span>
					{/if}
				</div>

				{#if generation_result.content}
					<div class="mockup-code">
						<pre><code>{generation_result.content}</code></pre>
					</div>
				{/if}
			{:else}
				<div class="alert alert-error">
					<span class="text-sm">❌ {generation_result.error}</span>
				</div>
			{/if}
		{/if}
	</div>
</div>
