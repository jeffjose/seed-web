<script lang="ts">
	import { onMount, tick } from 'svelte';

	/**
	 * The app's tooltips: one layer, mounted once.
	 *
	 * Anything with a `data-tip` gets one. The browser's own (`title`) arrives
	 * late, in the system's font, at a size and place of its choosing, and is
	 * gone on some platforms before it is read; this one is ours — the same
	 * type, the same surface as a menu, above the thing it is about.
	 *
	 * There are two sizes, and which is not chosen where the hint is written:
	 * a thing with no words on it gets the larger one, at once; a thing with
	 * words gets the smaller, after a pause.
	 *
	 * One listener on the document rather than a wrapper per button: there are
	 * a hundred of these, and a hundred components to say "this has a hint"
	 * would be a hundred places to forget.
	 */
	let text = $state('');
	let x = $state(0);
	let y = $state(0);
	let below = $state(false);
	/** Beside what it is about and not over it: for a column of things (a rail of icons), where it is a label that goes with you down the column. */
	let beside = $state(false);
	/** The name of a thing that has no words of its own (an icon, a swatch): larger, and there at once, since without it you are guessing. */
	let name = $state(false);
	let shown = $state(false);
	let bubble = $state<HTMLElement | null>(null);

	const WAIT = 350;
	let timer: ReturnType<typeof setTimeout> | undefined;
	let target: Element | null = null;
	/**
	 * What has just been pressed: its hint has been read, and is not said again
	 * until the pointer has been away and come back. Pressing a thing often
	 * changes what is in it (the refresh arrow becomes a spinner, a toggle its
	 * other icon), which the browser reports as the pointer arriving afresh; a
	 * hint that came back on each press would blink at every one.
	 */
	let pressed: Element | null = null;

	function press(e: Event) {
		pressed = target ?? (e.target as Element | null)?.closest?.('[data-tip]') ?? null;
		hide();
	}

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
		if (beside) {
			x = r.right + 12;
			y = Math.min(window.innerHeight - h - 8, Math.max(8, r.top + r.height / 2 - h / 2));
			return;
		}
		below = r.top - h - 10 < 0;
		x = Math.min(window.innerWidth - w - 8, Math.max(8, r.left + r.width / 2 - w / 2));
		y = below ? r.bottom + 8 : r.top - h - 8;
	}

	function over(e: Event) {
		const el = (e.target as Element | null)?.closest?.('[data-tip]') ?? null;
		if (el === target) return;
		// The keys coming to a thing say its hint only where they were brought there by the keyboard. A flyout that opens puts
		// them on its first button by itself, with the pointer nowhere near: that is not somebody asking what the button is.
		if (e.type === 'focusin' && !(e.target as Element | null)?.matches?.(':focus-visible')) return;
		if (pressed) {
			// Still on what was pressed (or on what took its place, where pressing it drew it again): nothing to say.
			// (The press also puts the keys on it, which arrives here as well.)
			if (!pressed.isConnected) pressed = el;
			if (el && el === pressed) return;
			pressed = null;
		}
		// In a group (`data-tip-group`: a rail of icons), the hint is there at once and stays as you go from one thing to
		// the next, over the gaps between them too: it changes what it says, and does not go and come back.
		const group = (e.target as Element | null)?.closest?.('[data-tip-group]') ?? null;
		if (group && target && shown && group.contains(target) && !el) return;
		const tip = el?.getAttribute('data-tip')?.trim();
		if (group && el && tip) {
			clearTimeout(timer);
			[target, text, beside, name, shown] = [el, tip, true, true, true];
			void tick().then(place);
			return;
		}
		hide();
		if (!el || !tip) return;
		beside = false;
		// Nothing written on it: the hint is its label, and a label does not keep you waiting.
		// (One with words on it says what it is already; its hint is an aside, small and after a pause.)
		name = !el.textContent?.trim();
		if (name) {
			[target, text, shown] = [el, tip, true];
			void tick().then(place);
			return;
		}
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
			// Gone from what was pressed: the next time over it is a new one.
			if (pressed && to && !pressed.contains(to)) pressed = null;
			if (!target || (to && target.contains(to))) return;
			// (Still within its group: it stays, until the next thing says otherwise.)
			const group = target.closest('[data-tip-group]');
			if (group && shown && to && group.contains(to)) return;
			hide();
		};
		document.addEventListener('pointerover', over);
		document.addEventListener('pointerout', out);
		document.addEventListener('focusin', over);
		document.addEventListener('focusout', hide);
		// A hint is for before you act, not during.
		document.addEventListener('pointerdown', press, true);
		document.addEventListener('keydown', hide, true);
		window.addEventListener('scroll', hide, true);
		return () => {
			document.removeEventListener('pointerover', over);
			document.removeEventListener('pointerout', out);
			document.removeEventListener('focusin', over);
			document.removeEventListener('focusout', hide);
			document.removeEventListener('pointerdown', press, true);
			document.removeEventListener('keydown', hide, true);
			window.removeEventListener('scroll', hide, true);
		};
	});
</script>

{#if shown}
	<div
		bind:this={bubble}
		role="tooltip"
		class="tip-in pointer-events-none fixed z-[100] w-max max-w-64 font-medium leading-snug shadow-lg {name ? 'rounded-lg px-3 py-2 text-[13.5px] font-semibold' : 'rounded-md px-2.5 py-1.5 text-[12px]'}"
		style="left: {x}px; top: {y}px; background: oklch(0.2 0.006 286); color: oklch(0.96 0.003 286); box-shadow: 0 0 0 1px oklch(1 0 0 / 0.1), 0 8px 24px -8px oklch(0 0 0 / 0.6)"
	>
		{text}
	</div>
{/if}
