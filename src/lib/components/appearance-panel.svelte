<script lang="ts">
	import { onDestroy } from 'svelte';
	import SettingGroup from '$lib/components/setting-group.svelte';
	import SettingRow from '$lib/components/setting-row.svelte';
	import { Icon } from '$lib/icon';
	import { ui, appearance, THEMES, type Theme } from '$lib/ui.svelte';
	import { FONTS, fontOf } from '$lib/fonts';
	import * as Select from '$lib/components/ui/select';
	import { Button } from '$lib/components/ui/button';

	/**
	 * How the app looks on this machine: light or dark, in whose colors, and
	 * in what face.
	 *
	 * The theme is not kept until you press Save. Until then it is tried on,
	 * on the whole app (there is no smaller honest picture of light against
	 * dark). Leaving without saving puts it back. The face is kept as soon as
	 * it is chosen: it is gone through one after another to be compared, and
	 * a Save between each would be in the way.
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

	/** The system's look is whichever of the app's own two the system is in. */
	const systemDark = typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches;
	const colors = (t: (typeof THEMES)[number]) => t.swatch ?? THEMES.find((x) => x.value === (systemDark ? 'dark' : 'light'))!.swatch!;
	const shown = $derived(THEMES.find((t) => t.value === theme) ?? THEMES[0]);

	/** The font before or after the one worn, round and round. */
	const fontBy = (step: number) => appearance.setFont(FONTS[(FONTS.findIndex((f) => f.key === appearance.font) + step + FONTS.length) % FONTS.length].key);
</script>

<!-- A look, as a small picture of itself: its page, and two lines of its text. -->
{#snippet tile(t: (typeof THEMES)[number])}
	{@const on = theme === t.value}
	{@const [page, ink] = colors(t)}
	<button onclick={() => tryTheme(t.value)} aria-pressed={on} class="group/look block w-full text-left outline-none">
		<span
			class="relative block h-16 overflow-hidden rounded-xl ring-1 transition-shadow {on
				? 'ring-2 ring-foreground'
				: 'ring-foreground/15 group-hover/look:ring-foreground/40 group-focus-visible/look:ring-foreground/60'}"
			style="background: {page}"
		>
			<span class="absolute left-2.5 top-2.5 flex items-center gap-1.5">
				<span class="size-3 rounded-full" style="background: {ink}; opacity: 0.35"></span>
				<span class="h-1.5 w-14 rounded-full" style="background: {ink}; opacity: 0.7"></span>
			</span>
			<span class="absolute left-[1.6rem] top-[1.55rem] h-1.5 w-20 rounded-full" style="background: {ink}; opacity: 0.3"></span>
			<span class="absolute left-[1.6rem] top-[2.4rem] h-1.5 w-12 rounded-full" style="background: {ink}; opacity: 0.3"></span>
			{#if t.value === 'system'}
				<span class="absolute bottom-1.5 right-2" style="color: {ink}; opacity: 0.6"><Icon name="monitor" class="size-3.5" /></span>
			{/if}
			{#if on}
				<span class="absolute right-1.5 top-1.5 grid size-4 place-items-center rounded-full bg-foreground text-background">
					<Icon name="check" class="size-3" />
				</span>
			{/if}
		</span>
		<span class="mt-1.5 block truncate text-[13px] {on ? 'font-medium' : 'text-muted-foreground'}">{t.label}</span>
	</button>
{/snippet}

<SettingGroup title="Theme">
	{#snippet aside()}
		<span class="text-[13px] text-muted-foreground">{shown.label}</span>
	{/snippet}
	<div class="mt-2 grid grid-cols-[repeat(auto-fill,minmax(9rem,1fr))] gap-3">
		{#each THEMES as t (t.value)}
			{@render tile(t)}
		{/each}
	</div>
</SettingGroup>

<SettingGroup title="Type">
	<!-- The face it is set in: chosen from the list, or gone through one at a time with the arrows, the whole app set in each as it is come to. -->
	<SettingRow title="Font" description={fontOf(appearance.font).google ? 'Fetched from Google Fonts each time the app comes up.' : 'Kept with the app.'}>
		<div class="flex items-center gap-1">
			<Button variant="ghost" size="icon-sm" onclick={() => fontBy(-1)} aria-label="The font before" data-tip="The font before"><Icon name="chevron-left" class="size-4" /></Button>
			<Select.Root type="single" value={appearance.font} onValueChange={(key) => key && appearance.setFont(key)}>
				<Select.Trigger size="sm" aria-label="Font" class="h-8 w-52 text-[13px]"><span class="truncate">{fontOf(appearance.font).label}</span></Select.Trigger>
				<Select.Content class="max-h-80">
					{#each FONTS as f (f.key)}<Select.Item value={f.key} label={f.label}>{f.label}</Select.Item>{/each}
				</Select.Content>
			</Select.Root>
			<Button variant="ghost" size="icon-sm" onclick={() => fontBy(1)} aria-label="The font after" data-tip="The font after"><Icon name="chevron-right" class="size-4" /></Button>
		</div>
	</SettingRow>
</SettingGroup>
