import { json } from '@sveltejs/kit';
import Anthropic from '@anthropic-ai/sdk';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { api_key } = await request.json();

		if (!api_key) {
			return json({ success: false, error: 'API key is required' }, { status: 400 });
		}

		const anthropic = new Anthropic({
			apiKey: api_key,
		});

		// Make a minimal test call
		const response = await anthropic.messages.create({
			model: 'claude-3-5-sonnet-20241022',
			max_tokens: 10,
			messages: [{ role: 'user', content: 'Test' }]
		});

		return json({ success: true, valid: true });
	} catch (error) {
		console.error('API key test error:', error);
		
		if (error instanceof Anthropic.AuthenticationError) {
			return json({ success: false, error: 'Invalid API key' }, { status: 401 });
		}
		
		if (error instanceof Anthropic.PermissionDeniedError) {
			return json({ success: false, error: 'API key lacks required permissions' }, { status: 403 });
		}
		
		return json({ 
			success: false, 
			error: 'API test failed: ' + (error instanceof Error ? error.message : 'Unknown error')
		}, { status: 500 });
	}
};