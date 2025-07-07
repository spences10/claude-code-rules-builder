<script lang="ts">
	import { generate_claude_md } from '../services/claude-generator';
	import {
		add_persona,
		config_state,
		get_config_for_generation,
		next_step,
		previous_step,
		remove_persona,
		set_current_step,
		set_generated_content,
		set_generation_error,
		set_generation_state,
		update_activation_rules,
		update_persona,
		update_project_context,
		update_universal_principles,
		type persona,
	} from '../state/config.svelte';
	import { api_key_manager } from '../utils/api-key-manager';

	const total_steps = 4;
	const step_titles = [
		'Universal Principles',
		'Expert Personas',
		'Project Context',
		'Activation Rules',
	];

	function go_to_step(step: number): void {
		set_current_step(step);
	}

	function can_proceed(): boolean {
		switch (config_state.current_step) {
			case 0:
				return config_state.universal_principles.trim() !== '';
			case 1:
				return (
					config_state.personas.length > 0 &&
					config_state.personas.every(
						(p) => p.name.trim() !== '' && p.role.trim() !== '',
					)
				);
			case 2:
				return config_state.project_context.trim() !== '';
			case 3:
				return config_state.activation_rules.trim() !== '';
			default:
				return false;
		}
	}

	function handle_persona_update(
		index: number,
		field: keyof persona,
		value: string,
	): void {
		const updated_persona = {
			...config_state.personas[index],
			[field]: value,
		};
		update_persona(index, updated_persona);
	}

	async function handle_generate(): Promise<void> {
		if (config_state.current_step < 3) {
			next_step();
			return;
		}

		// Check if we have an API key
		const api_key = api_key_manager.get_api_key();
		if (!api_key) {
			set_generation_error(
				'API key is required to generate CLAUDE.md file',
			);
			return;
		}

		// Start generation
		set_generation_state(true);
		set_generation_error(null);

		try {
			const config = get_config_for_generation();
			const result = await generate_claude_md(config, api_key);

			if (result.success && result.content) {
				set_generated_content(result.content);
			} else {
				set_generation_error(
					result.error || 'Failed to generate CLAUDE.md',
				);
			}
		} catch (error) {
			set_generation_error(
				error instanceof Error
					? error.message
					: 'Unknown error occurred',
			);
		} finally {
			set_generation_state(false);
		}
	}
</script>

<div class="card bg-base-100 shadow-xl">
	<div class="card-body">
		<h2 class="card-title mb-4 text-2xl">
			Configure Your CLAUDE.md Personas
		</h2>

		<!-- Step Progress -->
		<div class="steps steps-horizontal mb-8 w-full overflow-x-auto">
			{#each step_titles as title, index}
				<div
					class="step"
					class:step-primary={index <= config_state.current_step}
				>
					{title}
				</div>
			{/each}
		</div>

		<!-- Step Content -->
		<div class="min-h-96">
			{#if config_state.current_step === 0}
				<!-- Step 1: Universal Principles -->
				<div class="space-y-6">
					<h3 class="text-xl font-semibold">Universal Principles</h3>
					<p class="text-base-content/70">
						What are your non-negotiable coding standards and
						practices that apply to all code?
					</p>

					<div class="form-control">
						<label class="label" for="universal-principles">
							<span class="label-text"
								>Core Standards & Quality Principles *</span
							>
						</label>
						<textarea
							id="universal-principles"
							class="textarea textarea-bordered h-32"
							placeholder="e.g., Always write tests, use TypeScript strict mode, follow conventional commits, never compromise on accessibility..."
							bind:value={config_state.universal_principles}
							oninput={(e) =>
								update_universal_principles(
									(e.target as HTMLTextAreaElement).value,
								)}
						></textarea>
						<div class="label">
							<span class="label-text-alt">
								These rules apply to all personas and contexts
							</span>
						</div>
					</div>
				</div>
			{:else if config_state.current_step === 1}
				<!-- Step 2: Expert Personas -->
				<div class="space-y-6">
					<div class="flex items-center justify-between">
						<div>
							<h3 class="text-xl font-semibold">Expert Personas</h3>
							<p class="text-base-content/70">
								Define the expert personas Claude should embody for
								different contexts
							</p>
						</div>
						<button
							class="btn btn-outline btn-sm"
							onclick={add_persona}
						>
							+ Add Persona
						</button>
					</div>

					{#each config_state.personas as persona, index}
						<div class="card bg-base-200 p-4">
							<div class="mb-4 flex items-center justify-between">
								<h4 class="font-semibold">Persona {index + 1}</h4>
								{#if config_state.personas.length > 1}
									<button
										class="btn btn-ghost btn-xs"
										onclick={() => remove_persona(index)}
									>
										Remove
									</button>
								{/if}
							</div>

							<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
								<div class="form-control">
									<label class="label" for="persona-name-{index}">
										<span class="label-text">Persona Name *</span>
									</label>
									<input
										id="persona-name-{index}"
										type="text"
										class="input input-bordered"
										class:input-error={persona.name.trim() === ''}
										placeholder="e.g., Rusty, Francis, Trinity"
										value={persona.name}
										aria-required="true"
										aria-describedby="persona-name-help-{index}"
										oninput={(e) =>
											handle_persona_update(
												index,
												'name',
												(e.target as HTMLInputElement).value,
											)}
									/>
									{#if persona.name.trim() === ''}
										<div class="label">
											<span class="label-text-alt text-error">
												Persona name is required
											</span>
										</div>
									{/if}
								</div>

								<div class="form-control">
									<label class="label" for="persona-role-{index}">
										<span class="label-text">Expert Role *</span>
									</label>
									<input
										id="persona-role-{index}"
										type="text"
										class="input input-bordered"
										class:input-error={persona.role.trim() === ''}
										placeholder="e.g., Backend Engineer, Frontend Architect, QA Engineer"
										value={persona.role}
										aria-required="true"
										aria-describedby="persona-role-help-{index}"
										oninput={(e) =>
											handle_persona_update(
												index,
												'role',
												(e.target as HTMLInputElement).value,
											)}
									/>
									{#if persona.role.trim() === ''}
										<div class="label">
											<span class="label-text-alt text-error">
												Expert role is required
											</span>
										</div>
									{/if}
								</div>

								<div class="form-control">
									<label class="label" for="persona-level-{index}">
										<span class="label-text">Expertise Level</span>
									</label>
									<select
										id="persona-level-{index}"
										class="select select-bordered"
										value={persona.expertise_level}
										onchange={(e) =>
											handle_persona_update(
												index,
												'expertise_level',
												(e.target as HTMLSelectElement).value,
											)}
									>
										<option value="junior">Junior</option>
										<option value="mid">Mid-level</option>
										<option value="senior">Senior</option>
										<option value="principal">Principal</option>
									</select>
								</div>

								<div class="form-control">
									<label
										class="label"
										for="persona-communication-{index}"
									>
										<span class="label-text">Communication Style</span
										>
									</label>
									<input
										id="persona-communication-{index}"
										type="text"
										class="input input-bordered"
										placeholder="e.g., Concise, Teaching-focused, Detailed"
										value={persona.communication_style}
										oninput={(e) =>
											handle_persona_update(
												index,
												'communication_style',
												(e.target as HTMLInputElement).value,
											)}
									/>
								</div>
							</div>

							<div class="form-control mt-4">
								<label class="label" for="persona-principles-{index}">
									<span class="label-text"
										>Core Principles & Philosophy</span
									>
								</label>
								<textarea
									id="persona-principles-{index}"
									class="textarea textarea-bordered h-24"
									placeholder="What principles guide this expert's decisions and approach?"
									value={persona.core_principles}
									oninput={(e) =>
										handle_persona_update(
											index,
											'core_principles',
											(e.target as HTMLTextAreaElement).value,
										)}
								></textarea>
							</div>

							<div class="form-control mt-4">
								<label class="label" for="persona-expertise-{index}">
									<span class="label-text">Technical Expertise</span>
								</label>
								<textarea
									id="persona-expertise-{index}"
									class="textarea textarea-bordered h-24"
									placeholder="What technologies, frameworks, and tools is this expert proficient with?"
									value={persona.tech_expertise}
									oninput={(e) =>
										handle_persona_update(
											index,
											'tech_expertise',
											(e.target as HTMLTextAreaElement).value,
										)}
								></textarea>
							</div>

							<div class="form-control mt-4">
								<label class="label" for="persona-standards-{index}">
									<span class="label-text"
										>Specific Standards & Practices</span
									>
								</label>
								<textarea
									id="persona-standards-{index}"
									class="textarea textarea-bordered h-24"
									placeholder="What coding standards, testing practices, or methodologies does this expert follow?"
									value={persona.specific_standards}
									oninput={(e) =>
										handle_persona_update(
											index,
											'specific_standards',
											(e.target as HTMLTextAreaElement).value,
										)}
								></textarea>
							</div>
						</div>
					{/each}
				</div>
			{:else if config_state.current_step === 2}
				<!-- Step 3: Project Context -->
				<div class="space-y-6">
					<h3 class="text-xl font-semibold">Project Context</h3>
					<p class="text-base-content/70">
						What project and domain context should all personas
						understand?
					</p>

					<div class="form-control">
						<label class="label" for="project-context">
							<span class="label-text">
								Project & Domain Context *
							</span>
						</label>
						<textarea
							id="project-context"
							class="textarea textarea-bordered h-40"
							placeholder="Describe your project: What does it do? What industry/domain? What's the technical architecture? What are the business constraints? What's the team structure?"
							bind:value={config_state.project_context}
							oninput={(e) =>
								update_project_context(
									(e.target as HTMLTextAreaElement).value,
								)}
						></textarea>
						<div class="label">
							<span class="label-text-alt">
								Include: industry, tech stack, business rules, team
								size, constraints
							</span>
						</div>
					</div>
				</div>
			{:else if config_state.current_step === 3}
				<!-- Step 4: Activation Rules -->
				<div class="space-y-6">
					<h3 class="text-xl font-semibold">
						Persona Activation Rules
					</h3>
					<p class="text-base-content/70">
						When should Claude adopt each persona? Define the triggers
						and context clues.
					</p>

					<div class="form-control">
						<label class="label" for="activation-rules">
							<span class="label-text">
								Activation Rules & Triggers *
							</span>
						</label>
						<textarea
							id="activation-rules"
							class="textarea textarea-bordered h-40"
							placeholder="When should each persona activate? e.g., 'Use Rusty for backend/API work, Francis for frontend/UI tasks, Trinity when discussing testing...' Include default persona and context switching rules."
							bind:value={config_state.activation_rules}
							oninput={(e) =>
								update_activation_rules(
									(e.target as HTMLTextAreaElement).value,
								)}
						></textarea>
						<div class="label">
							<span class="label-text-alt">
								Define when each persona should be active and how to
								switch between them
							</span>
						</div>
					</div>

					<div class="alert alert-info">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							class="h-6 w-6 shrink-0 stroke-current"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
							></path>
						</svg>
						<span>
							Ready to generate your persona-based CLAUDE.md file!
						</span>
					</div>

					<!-- Show errors if any -->
					{#if config_state.generation_error}
						<div class="alert alert-error">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-6 w-6 shrink-0 stroke-current"
								fill="none"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
							<span>{config_state.generation_error}</span>
						</div>
					{/if}
				</div>
			{/if}

			<!-- Generated Content Preview -->
			{#if config_state.generated_content}
				<div class="mt-8 space-y-6">
					<div class="divider">Generated CLAUDE.md</div>

					<div class="card bg-base-200">
						<div class="card-body">
							<div class="mb-4 flex items-center justify-between">
								<h3 class="text-lg font-semibold">
									Your Generated CLAUDE.md File
								</h3>
								<div class="flex gap-2">
									<button
										class="btn btn-sm btn-outline"
										onclick={() =>
											navigator.clipboard.writeText(
												config_state.generated_content,
											)}
									>
										📋 Copy
									</button>
									<button
										class="btn btn-sm btn-primary"
										onclick={() => {
											const blob = new Blob(
												[config_state.generated_content],
												{ type: 'text/markdown' },
											);
											const url = URL.createObjectURL(blob);
											const a = document.createElement('a');
											a.href = url;
											a.download = 'CLAUDE.md';
											a.click();
											URL.revokeObjectURL(url);
										}}
									>
										💾 Download
									</button>
								</div>
							</div>

							<pre
								class="bg-base-300 overflow-x-auto rounded-lg p-4 text-sm whitespace-pre-wrap">{config_state.generated_content}</pre>

							<div class="text-base-content/70 mt-4 text-sm">
								<strong>Next steps:</strong>
								<ol class="mt-2 list-inside list-decimal space-y-1">
									<li>Download or copy the CLAUDE.md file above</li>
									<li>Place it in your project's root directory</li>
									<li>
										Open Claude Code in your project: <code
											class="bg-base-300 rounded px-1">claude</code
										>
									</li>
									<li>Your personas will now be active!</li>
								</ol>
							</div>
						</div>
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
				onclick={handle_generate}
				disabled={!can_proceed() || config_state.is_generating}
			>
				{#if config_state.is_generating}
					<span class="loading loading-spinner loading-sm"></span>
					Generating...
				{:else}
					{config_state.current_step === total_steps - 1
						? 'Generate CLAUDE.md'
						: 'Next →'}
				{/if}
			</button>
		</div>
	</div>
</div>
