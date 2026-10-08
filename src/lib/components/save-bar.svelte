<script lang="ts">
	import { onDestroy } from 'svelte';
	import { ui } from '$lib/ui.svelte';

	/**
	 * The foot of Settings while anything in it is unsaved, in whichever
	 * section (`ui.unsaved`): it says so, and offers to keep all of it or
	 * throw it away. Closing Settings is stopped until then, and this bar is
	 * what says so: it shakes.
	 *
	 * Save is in the app's own violet while there is something to save: it is
	 * the one thing on the page that has to be noticed.
	 */
	let saving = $state(false);
	async function save() {
		saving = true;
		try {
			for (const s of Object.values(ui.unsaved)) await s.save();
		} finally {
			saving = false;
		}
	}
	/** Throwing it away is being done with Settings: it shuts. */
	function discard() {
		Object.values(ui.unsaved).forEach((s) => s.discard());
		ui.unsaved = {};
		ui.settings = null;
	}

	/**
	 * Closing was tried with something unsaved (`ui.stopped`). There is no second
	 * dialog to ask: this bar is the answer. It shakes, turns red and says what
	 * to do, and goes back to how it was a moment later.
	 */
	let bar = $state<HTMLElement | null>(null);
	let warned = $state(false);
	let calm: ReturnType<typeof setTimeout> | undefined;
	let seen = ui.stopped;
	$effect(() => {
		if (ui.stopped === seen) return;
		seen = ui.stopped;
		if (!bar) return;
		warned = true;
		clearTimeout(calm);
		calm = setTimeout(() => (warned = false), 2500);
		// It is at the foot of what is showing already (sticky): only seen to be.
		if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			bar.animate(
				[0, -9, 9, -7, 7, -4, 4, 0].map((x) => ({ transform: `translateX(${x}px)` })),
				{ duration: 420, easing: 'ease-in-out' }
			);
		}
	});
	$effect(() => {
		if (!ui.dirty) warned = false;
	});
	onDestroy(() => clearTimeout(calm));
</script>

<!-- Only there when there is something to save: it sits over the foot of the
     section, and with nothing to say it would only be in the way of it. -->
{#if ui.dirty}
	<div
		bind:this={bar}
		role="status"
		class="sticky bottom-0 z-10 -mx-2 mt-6 flex h-14 items-center gap-2 rounded-2xl px-4 shadow-[0_-8px_24px_-12px_rgb(0_0_0/0.5)] ring-1 transition-colors duration-200 {warned
			? 'bg-[var(--fail-9)] text-white ring-[var(--fail-9)]'
			: 'bg-card ring-foreground/15'}"
	>
		<p class="min-w-0 flex-1 truncate text-[13px] {warned ? 'font-medium' : ''}">{warned ? 'Save or discard first' : 'Not saved yet'}</p>
		<button
			onclick={discard}
			class="flex h-8 items-center rounded-full px-3.5 text-[13px] font-medium transition-colors {warned
				? 'text-white hover:bg-white/15'
				: 'text-muted-foreground hover:bg-foreground/10 hover:text-foreground'}"
		>
			Discard
		</button>
		<button
			onclick={save}
			disabled={saving}
			class="flex h-8 items-center rounded-full px-5 text-[13px] font-medium transition-[filter,opacity,background-color] hover:brightness-110 disabled:opacity-35 {warned
				? 'bg-white text-black'
				: 'bg-[#6e56cf] text-white'}"
		>
			{saving ? 'Saving…' : 'Save'}
		</button>
	</div>
{/if}
