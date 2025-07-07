import Anthropic from '@anthropic-ai/sdk';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { api_key, prompt } = await request.json();

		if (!api_key) {
			return json(
				{ success: false, error: 'API key is required' },
				{ status: 400 },
			);
		}

		if (!prompt) {
			return json(
				{ success: false, error: 'Prompt is required' },
				{ status: 400 },
			);
		}

		const anthropic = new Anthropic({
			apiKey: api_key,
		});

		const system_prompt = `You are an expert at creating CLAUDE.md files for Claude Code users. You understand persona-based systems and how to structure effective project memory files that enable sophisticated AI assistance workflows.

Create a well-structured, actionable CLAUDE.md file that will serve as persistent context for Claude Code sessions. Focus on clarity, specificity, and practical guidance.`;

		const messages: Anthropic.MessageParam[] = [
			{ role: 'user', content: prompt },
		];

		const response = await anthropic.messages.create({
			model: 'claude-3-5-sonnet-20241022',
			max_tokens: 4000,
			messages,
			system: system_prompt,
		});

		const content = response.content[0];
		if (content.type !== 'text') {
			throw new Error('Unexpected response type from Anthropic API');
		}

		return json({
			success: true,
			content: content.text,
			usage: response.usage,
		});
	} catch (error) {
		console.error('CLAUDE.md generation error:', error);

		if (error instanceof Anthropic.AuthenticationError) {
			return json(
				{ success: false, error: 'Invalid API key' },
				{ status: 401 },
			);
		}

		if (error instanceof Anthropic.PermissionDeniedError) {
			return json(
				{
					success: false,
					error: 'API key lacks required permissions',
				},
				{ status: 403 },
			);
		}

		if (error instanceof Anthropic.RateLimitError) {
			return json(
				{ success: false, error: 'Rate limit exceeded' },
				{ status: 429 },
			);
		}

		return json(
			{
				success: false,
				error:
					'Generation failed: ' +
					(error instanceof Error ? error.message : 'Unknown error'),
			},
			{ status: 500 },
		);
	}
};
