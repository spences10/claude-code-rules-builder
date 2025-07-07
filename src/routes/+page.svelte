<script lang="ts">
	import ApiKeyManager from '$lib/components/api-key-manager.svelte';
	import ConfigWizard from '$lib/components/config-wizard.svelte';
</script>

<div class="container mx-auto max-w-4xl p-4 space-y-8">
	<h1 class="mb-8 text-center text-4xl font-bold">CLAUDE.md Generator</h1>
	
	<ApiKeyManager />
	
	<ConfigWizard />
</div>
