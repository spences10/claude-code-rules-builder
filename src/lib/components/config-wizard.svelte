<script lang="ts">
	import {
		config_state,
		next_step,
		previous_step,
		set_current_step,
	} from '../state/config.svelte.js';

	const total_steps = 5;
	const step_titles = [
		'Project Basics',
		'Tech Stack',
		'Development Commands',
		'Code Style',
		'Project Structure',
	];

	function go_to_step(step: number): void {
		set_current_step(step);
	}

	function can_proceed(): boolean {
		switch (config_state.current_step) {
			case 0:
				return (
					config_state.project_name.trim() !== '' &&
					config_state.project_type !== ''
				);
			case 1:
				return config_state.tech_stack.length > 0;
			case 2:
				return true; // Commands are optional
			case 3:
				return true; // Code style has defaults
			case 4:
				return true; // Project structure has defaults
			default:
				return false;
		}
	}
</script>

<div class="card bg-base-100 shadow-xl">
	<div class="card-body">
		<h2 class="card-title mb-4 text-2xl">Configure Your CLAUDE.md</h2>

		<!-- Step Progress -->
		<div class="steps steps-horizontal mb-8 w-full">
			{#each step_titles as title, index}
				<div
					class="step {index <= config_state.current_step
						? 'step-primary'
						: ''}"
					class:step-primary={index <= config_state.current_step}
				>
					{title}
				</div>
			{/each}
		</div>

		<!-- Step Content -->
		<div class="min-h-96">
			{#if config_state.current_step === 0}
				<!-- Step 1: Project Basics -->
				<div class="space-y-6">
					<h3 class="text-xl font-semibold">Project Basics</h3>

					<div class="form-control">
						<label class="label" for="project-name">
							<span class="label-text">Project Name *</span>
						</label>
						<input
							id="project-name"
							type="text"
							placeholder="My Awesome Project"
							class="input input-bordered"
							bind:value={config_state.project_name}
						/>
					</div>

					<div class="form-control">
						<label class="label" for="project-type">
							<span class="label-text">Project Type *</span>
						</label>
						<select
							id="project-type"
							class="select select-bordered"
							bind:value={config_state.project_type}
						>
							<option value="web-app">Web Application</option>
							<option value="api">API/Backend Service</option>
							<option value="mobile-app">Mobile Application</option>
							<option value="desktop-app">Desktop Application</option>
							<option value="library">Library/Package</option>
							<option value="cli-tool">CLI Tool</option>
						</select>
					</div>

					<div class="grid grid-cols-2 gap-4">
						<div class="form-control">
							<label class="label" for="team-size">
								<span class="label-text">Team Size</span>
							</label>
							<select
								id="team-size"
								class="select select-bordered"
								bind:value={config_state.team_size}
							>
								<option value="solo">Solo</option>
								<option value="small">Small (2-5)</option>
								<option value="medium">Medium (6-15)</option>
								<option value="large">Large (16+)</option>
							</select>
						</div>

						<div class="form-control">
							<label class="label" for="complexity">
								<span class="label-text">Complexity</span>
							</label>
							<select
								id="complexity"
								class="select select-bordered"
								bind:value={config_state.complexity}
							>
								<option value="simple">Simple</option>
								<option value="moderate">Moderate</option>
								<option value="complex">Complex</option>
							</select>
						</div>
					</div>
				</div>
			{:else if config_state.current_step === 1}
				<!-- Step 2: Tech Stack -->
				<div class="space-y-6">
					<h3 class="text-xl font-semibold">Tech Stack Selection</h3>
					<p class="text-base-content/70">
						Select the technologies your project uses
					</p>

					<!-- TODO: Implement tech stack selection -->
					<div class="alert alert-info">
						<span>Tech stack selection coming soon...</span>
					</div>
				</div>
			{:else}
				<!-- Other steps placeholder -->
				<div class="space-y-6">
					<h3 class="text-xl font-semibold">
						{step_titles[config_state.current_step]}
					</h3>
					<div class="alert alert-info">
						<span
							>Step {config_state.current_step + 1} coming soon...</span
						>
					</div>
				</div>
			{/if}
		</div>

		<!-- Navigation -->
		<div class="card-actions mt-8 justify-between">
			<button
				class="btn btn-outline"
				onclick={previous_step}
				disabled={config_state.current_step === 0}
			>
				← Previous
			</button>

			<div class="text-base-content/70 text-sm">
				Step {config_state.current_step + 1} of {total_steps}
			</div>

			<button
				class="btn btn-primary"
				onclick={next_step}
				disabled={!can_proceed() ||
					config_state.current_step >= total_steps - 1}
			>
				{config_state.current_step === total_steps - 1
					? 'Generate'
					: 'Next →'}
			</button>
		</div>
	</div>
</div>
