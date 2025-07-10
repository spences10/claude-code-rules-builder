<script lang="ts">
	import { generate_claude_md, get_next_question } from '../services/claude-generator';
	import { api_key_manager } from '../utils/api-key-manager';

	let messages: Array<{ role: 'user' | 'assistant'; content: string }> = $state([
		{
			role: 'assistant',
			content: "Let's create your CLAUDE.md file! First, tell me about your unbreakable coding rules - things like 'always use TypeScript', 'snake_case variables', 'write tests first', etc."
		}
	]);

	let current_input = $state('');
	let conversation_data = $state({
		universal_principles: '',
		project_description: '',
		tech_stack: '',
		development_commands: '',
		wants_personas: undefined,
		personas: [],
		wants_more_personas: undefined,
		project_context: '',
		activation_rules: ''
	});
	let conversation_phase = $state('universal_principles');
	let is_generating = $state(false);
	let generation_error = $state<string | null>(null);
	let generated_content = $state('');

	function add_message(role: 'user' | 'assistant', content: string) {
		messages.push({ role, content });
		// Auto-scroll to bottom after adding message
		setTimeout(() => {
			const chat_container = document.querySelector('.overflow-y-auto');
			if (chat_container) {
				chat_container.scrollTop = chat_container.scrollHeight;
			}
		}, 100);
	}

	function send_message() {
		if (!current_input.trim()) return;

		// Add user message
		add_message('user', current_input);
		
		// Process the response based on current phase
		handle_conversation_phase(current_input);
		
		current_input = '';
	}

	async function handle_conversation_phase(user_input: string) {
		// Update conversation data based on the input
		if (conversation_phase === 'universal_principles') {
			conversation_data.universal_principles = user_input;
		} else if (conversation_phase === 'project_description') {
			conversation_data.project_description = user_input;
		} else if (conversation_phase === 'tech_stack') {
			conversation_data.tech_stack = user_input;
		} else if (conversation_phase === 'development_commands') {
			conversation_data.development_commands = user_input;
		} else if (conversation_phase === 'ask_personas') {
			conversation_data.wants_personas = user_input.toLowerCase().includes('yes');
		} else if (conversation_phase === 'collect_personas') {
			// Check if they're saying no/done to more personas
			if (user_input.toLowerCase().includes('no') || user_input.toLowerCase().includes('done')) {
				conversation_data.wants_more_personas = false;
			} else {
				conversation_data.personas.push(user_input);
			}
		}

		// Get the next question from Claude following the script
		const api_key = api_key_manager.get_api_key();
		if (!api_key) {
			add_message('assistant', 'Error: API key is required');
			return;
		}

		try {
			const result = await get_next_question(conversation_data, messages, api_key);
			
			if (result.success && result.content) {
				console.log('Claude response:', result.content);
				
				if (result.content.trim().includes('READY_TO_GENERATE')) {
					add_message('assistant', 'Perfect! Generating your CLAUDE.md file...');
					generate_claude_file();
				} else {
					add_message('assistant', result.content);
				}
			} else {
				add_message('assistant', `Error: ${result.error}`);
			}
		} catch (error) {
			add_message('assistant', `Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
		}
	}

	async function generate_claude_file() {
		console.log('generate_claude_file called');
		const api_key = api_key_manager.get_api_key();
		if (!api_key) {
			generation_error = 'API key is required';
			add_message('assistant', 'Error: API key is required');
			return;
		}

		is_generating = true;
		generation_error = null;
		console.log('Starting generation, is_generating:', is_generating);

		try {
			// Convert conversation data to the format expected by the generator
			const config = {
				universal_principles: conversation_data.universal_principles,
				project_description: conversation_data.project_description,
				tech_stack: conversation_data.tech_stack,
				development_commands: conversation_data.development_commands,
				project_context: conversation_data.project_context,
				activation_rules: conversation_data.activation_rules,
				personas: conversation_data.personas.map((persona_text, index) => ({
					name: `Expert${index + 1}`,
					role: persona_text,
					expertise_level: 'senior',
					core_principles: '',
					tech_expertise: persona_text,
					communication_style: '',
					specific_standards: ''
				}))
			};

			const result = await generate_claude_md(config, api_key);

			if (result.success && result.content) {
				generated_content = result.content;
				add_message('assistant', "🎉 Your CLAUDE.md file is ready! You can copy or download it below.");
			} else {
				generation_error = result.error || 'Failed to generate CLAUDE.md';
				add_message('assistant', `Sorry, there was an error: ${generation_error}`);
			}
		} catch (error) {
			generation_error = error instanceof Error ? error.message : 'Unknown error occurred';
			add_message('assistant', `Sorry, there was an error: ${generation_error}`);
		} finally {
			is_generating = false;
		}
	}

	function handle_keydown(event: KeyboardEvent) {
		if (event.key === 'Enter' && !event.shiftKey) {
			event.preventDefault();
			send_message();
		}
	}
</script>

<div class="card bg-base-100 shadow-xl">
	<div class="card-body">
		<div class="mb-6 text-center">
			<h2 class="mb-2 text-2xl font-bold">
				Create Your CLAUDE.md
			</h2>
			<p class="text-base-content/60 text-sm">
				Let's have a conversation to build your personalized AI assistant
			</p>
		</div>

		<!-- Chat Messages -->
		<div class="bg-base-200 rounded-lg p-4 min-h-96 max-h-96 overflow-y-auto space-y-4 mb-4">
			{#each messages as message}
				<div class="chat" class:chat-start={message.role === 'assistant'} class:chat-end={message.role === 'user'}>
					<div class="chat-image avatar">
						<div class="w-8 rounded-full bg-primary text-primary-content flex items-center justify-center text-xs">
							{message.role === 'assistant' ? '🤖' : '👤'}
						</div>
					</div>
					<div class="chat-bubble" class:chat-bubble-primary={message.role === 'assistant'}>
						{message.content}
					</div>
				</div>
			{/each}

			{#if is_generating}
				<div class="chat chat-start">
					<div class="chat-image avatar">
						<div class="w-8 rounded-full bg-primary text-primary-content flex items-center justify-center text-xs">
							🤖
						</div>
					</div>
					<div class="chat-bubble chat-bubble-primary">
						<span class="loading loading-dots loading-sm"></span>
						Generating your CLAUDE.md file...
					</div>
				</div>
			{/if}
		</div>

		<!-- Chat Input -->
		{#if !generated_content && !is_generating}
			<div class="flex gap-2">
				<textarea
					class="textarea textarea-bordered flex-1 resize-none"
					placeholder="Type your response..."
					bind:value={current_input}
					onkeydown={handle_keydown}
					rows="2"
				></textarea>
				<button
					class="btn btn-primary"
					onclick={send_message}
					disabled={!current_input.trim()}
				>
					Send
				</button>
			</div>
		{/if}

		<!-- Generated Content -->
		{#if generated_content}
			<div class="mt-8 space-y-6">
				<div class="divider">Your CLAUDE.md File</div>

				<div class="card bg-base-200">
					<div class="card-body">
						<div class="mb-4 flex items-center justify-between">
							<h3 class="text-lg font-semibold">
								Generated CLAUDE.md
							</h3>
							<div class="flex gap-2">
								<button
									class="btn btn-sm btn-outline"
									onclick={() => navigator.clipboard.writeText(generated_content)}
								>
									📋 Copy
								</button>
								<button
									class="btn btn-sm btn-primary"
									onclick={() => {
										const blob = new Blob([generated_content], { type: 'text/markdown' });
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

						<pre class="bg-base-300 overflow-x-auto rounded-lg p-4 text-sm whitespace-pre-wrap">{generated_content}</pre>

						<div class="text-base-content/70 mt-4 text-sm">
							<strong>Next steps:</strong>
							<ol class="mt-2 list-inside list-decimal space-y-1">
								<li>Download or copy the CLAUDE.md file above</li>
								<li>Place it in your project's root directory</li>
								<li>Open Claude Code in your project: <code class="bg-base-300 rounded px-1">claude</code></li>
								<li>Your personas will now be active!</li>
							</ol>
						</div>
					</div>
				</div>
			</div>
		{/if}
	</div>
</div>