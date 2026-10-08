<script lang="ts">
	import { onDestroy } from 'svelte';
	import SettingGroup from '$lib/components/setting-group.svelte';
	import SettingRow from '$lib/components/setting-row.svelte';
	import { Icon } from '$lib/icon';
	import { ui, appearance, THEMES, type Theme } from '$lib/ui.svelte';
	import { SEG, SEG_ON, SEG_OFF } from '$lib/seg';

	/**
	 * How the app looks on this machine: light or dark.
	 *
	 * Nothing here is kept until you press Save. Until then it is tried on:
	 * the theme on the whole app (there is no smaller honest picture of light
	 * against dark). Leaving without saving puts everything back.
	 */
	let theme = $state<Theme>(appearance.theme);
	// Changed from somewhere else (the search over everything) with nothing tried on here: follow it.
	let was = appearance.theme;
	$effect(() => {
		const saved = appearance.theme;
		if (theme === was) theme = saved;
		was = saved;
	});

	const dirty = $derived(theme !== appearance.theme);

	function tryTheme(t: Theme) {
		theme = t;
		// What is chosen goes on the whole app at once, to be seen; it is kept on Save.
		appearance.try(theme === appearance.theme ? null : { theme });
	}
	function save() {
		appearance.setTheme(theme);
		appearance.try(null);
	}
	function discard() {
		theme = appearance.theme;
		appearance.try(null);
	}
	// Unsaved here is unsaved in Settings: its one bar keeps it or throws it away.
	$effect(() => ui.pend('appearance', dirty ? { save, discard } : null));
	// Left with a theme tried on and not saved: take it off.
	onDestroy(() => {
		ui.pend('appearance', null);
		appearance.try(null);
	});
</script>

<SettingGroup title="Appearance">
	<SettingRow title="Theme" description="Kept in this browser. Other devices keep their own.">
		<div class={SEG} role="group" aria-label="Theme">
			{#each THEMES as t (t.value)}
				<button
					onclick={() => tryTheme(t.value)}
					aria-pressed={theme === t.value}
					aria-label={t.label}
					data-tip={t.label}
					class="grid h-7 w-9 place-items-center rounded-md transition-colors {theme === t.value ? SEG_ON : SEG_OFF}"
				>
					<Icon name={t.icon} class="size-4" />
				</button>
			{/each}
		</div>
	</SettingRow>
</SettingGroup>
