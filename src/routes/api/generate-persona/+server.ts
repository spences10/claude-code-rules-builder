import { json } from '@sveltejs/kit';
import Anthropic from '@anthropic-ai/sdk';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { api_key, prompt, system_prompt } = await request.json();

		if (!api_key) {
			return json({ success: false, error: 'API key is required' }, { status: 400 });
		}

		if (!prompt) {
			return json({ success: false, error: 'Prompt is required' }, { status: 400 });
		}

		const anthropic = new Anthropic({
			apiKey: api_key,
		});

		const messages: Anthropic.MessageParam[] = [
			{ role: 'user', content: prompt }
		];

		const response = await anthropic.messages.create({
			model: 'claude-3-5-sonnet-20241022',
			max_tokens: 4000,
			messages,
			system: system_prompt || undefined
		});

		const content = response.content[0];
		if (content.type !== 'text') {
			throw new Error('Unexpected response type from Anthropic API');
		}

		return json({ 
			success: true, 
			content: content.text,
			usage: response.usage
		});
	} catch (error) {
		console.error('Persona generation error:', error);
		
		if (error instanceof Anthropic.AuthenticationError) {
			return json({ success: false, error: 'Invalid API key' }, { status: 401 });
		}
		
		if (error instanceof Anthropic.PermissionDeniedError) {
			return json({ success: false, error: 'API key lacks required permissions' }, { status: 403 });
		}
		
		if (error instanceof Anthropic.RateLimitError) {
			return json({ success: false, error: 'Rate limit exceeded' }, { status: 429 });
		}
		
		return json({ 
			success: false, 
			error: 'Generation failed: ' + (error instanceof Error ? error.message : 'Unknown error')
		}, { status: 500 });
	}
};