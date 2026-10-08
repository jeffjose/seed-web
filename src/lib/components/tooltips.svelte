<script lang="ts">
	import { onMount } from 'svelte';

	/**
	 * The app's tooltips: one layer, mounted once.
	 *
	 * Anything with a `data-tip` gets one. The browser's own (`title`) arrives
	 * late, in the system's font, at a size and place of its choosing, and is
	 * gone on some platforms before it is read; this one is ours — the same
	 * type, the same surface as a menu, above the thing it is about.
	 *
	 * One listener on the document rather than a wrapper per button: there are
	 * a hundred of these, and a hundred components to say "this has a hint"
	 * would be a hundred places to forget.
	 */
	let text = $state('');
	let x = $state(0);
	let y = $state(0);
	let below = $state(false);
	let shown = $state(false);
	let bubble = $state<HTMLElement | null>(null);

	const WAIT = 350;
	let timer: ReturnType<typeof setTimeout> | undefined;
	let target: Element | null = null;

	function hide() {
		clearTimeout(timer);
		target = null;
		// Only when there is one to hide: a focusout can arrive in the middle of
		// a render (a dialog shutting takes its focused button with it), and
		// state may not be written then.
		if (shown) shown = false;
	}

	function place() {
		if (!target || !bubble) return;
		const r = target.getBoundingClientRect();
		const w = bubble.offsetWidth;
		const h = bubble.offsetHeight;
		// Above, unless there is no room; kept inside the window either way.
		below = r.top - h - 10 < 0;
		x = Math.min(window.innerWidth - w - 8, Math.max(8, r.left + r.width / 2 - w / 2));
		y = below ? r.bottom + 8 : r.top - h - 8;
	}

	function over(e: Event) {
		const el = (e.target as Element | null)?.closest?.('[data-tip]') ?? null;
		if (el === target) return;
		hide();
		const tip = el?.getAttribute('data-tip')?.trim();
		if (!el || !tip) return;
		target = el;
		timer = setTimeout(() => {
			text = tip;
			shown = true;
			// Measured once it has its text, then put in place.
			requestAnimationFrame(place);
		}, WAIT);
	}

	onMount(() => {
		const out = (e: Event) => {
			const to = (e as MouseEvent).relatedTarget as Element | null;
			if (target && !(to && target.contains(to))) hide();
		};
		document.addEventListener('pointerover', over);
		document.addEventListener('pointerout', out);
		document.addEventListener('focusin', over);
		document.addEventListener('focusout', hide);
		// A hint is for before you act, not during.
		document.addEventListener('pointerdown', hide, true);
		document.addEventListener('keydown', hide, true);
		window.addEventListener('scroll', hide, true);
		return () => {
			document.removeEventListener('pointerover', over);
			document.removeEventListener('pointerout', out);
			document.removeEventListener('focusin', over);
			document.removeEventListener('focusout', hide);
			document.removeEventListener('pointerdown', hide, true);
			document.removeEventListener('keydown', hide, true);
			window.removeEventListener('scroll', hide, true);
		};
	});
</script>

{#if shown}
	<div
		bind:this={bubble}
		role="tooltip"
		class="pointer-events-none fixed z-[100] max-w-64 rounded-md px-2.5 py-1.5 text-[12px] font-medium leading-snug shadow-lg"
		style="left: {x}px; top: {y}px; background: oklch(0.2 0.006 286); color: oklch(0.96 0.003 286); box-shadow: 0 0 0 1px oklch(1 0 0 / 0.1), 0 8px 24px -8px oklch(0 0 0 / 0.6)"
	>
		{text}
	</div>
{/if}
