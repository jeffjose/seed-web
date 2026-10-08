<script lang="ts">
	import { ICONS, type IconName } from '$lib/icons';

	/**
	 * `<Icon name="panel-left" />`. The name is typed against the map, so a
	 * misspelling is a build error rather than a hole in the interface.
	 *
	 * `fill` is for the handful of glyphs that mean something *filled* — a kept
	 * star, a play triangle. Lucide is an outline set, and a filled star is the
	 * one place where outline-vs-filled carries meaning rather than style.
	 */
	let {
		name,
		class: className = 'size-4',
		fill = false
	}: { name: IconName; class?: string; fill?: boolean } = $props();

	const Cmp = $derived(ICONS[name]);
</script>

<Cmp class={className} fill={fill ? 'currentColor' : 'none'} />
