<script lang="ts">
	import '@fontsource-variable/geist';
	import '@fontsource-variable/fira-code';
	import '../app.css';
	import * as Sidebar from '$lib/components/ui/sidebar';
	import AppSidebar from '$lib/components/app-sidebar.svelte';
	import SidebarToggle from '$lib/components/sidebar-toggle.svelte';
	import Dock from '$lib/components/dock.svelte';
	import ConfirmDialog from '$lib/components/confirm-dialog.svelte';
	import SettingsDialog from '$lib/components/settings-dialog.svelte';
	import CommandPalette from '$lib/components/command-palette.svelte';
	import Tooltips from '$lib/components/tooltips.svelte';
	import { Toaster } from '$lib/components/ui/sonner';
	import { PALETTE_CSS } from '$lib/palette';
	import { SPRITE } from '$lib/icons';
	import { ui } from '$lib/ui.svelte';
	import { onMount } from 'svelte';
	import { navigating } from '$app/state';

	let { children } = $props();

	// Single-viewport app: the shell is exactly svh tall and never scrolls. The
	// stock sidebar uses min-h-svh, which lets content grow the page instead, so
	// every level below is pinned to a definite height with min-h-0.
	//
	// The provider writes its state to localStorage; this is the read. Without it
	// a folded sidebar comes back unfolded on every refresh.
	let sidebarOpen = $state(true);
	try {
		sidebarOpen = localStorage.getItem('sidebar:state') !== 'false';
	} catch {}

	// Whether a menu is up, said on the page for its styles (`app.css`: the pointer over the rest of the page while one is). Menus are put at the end
	// of the page itself, so it is the page's own children that are watched, and nothing deeper.
	onMount(() => {
		const said = () => document.documentElement.toggleAttribute('data-menu', !!document.querySelector("[role='menu'], [data-slot='select-content']"));
		const seen = new MutationObserver(said);
		seen.observe(document.body, { childList: true });
		return () => seen.disconnect();
	});
</script>

<!-- Every identity color, as it is on a light page and on a dark one (`palette.ts`). -->
<svelte:head>
	{@html `<style>${PALETTE_CSS}</style>`}
</svelte:head>

<!-- Toasts are for things that happen somewhere you are not looking. -->
<Toaster position="bottom-right" richColors closeButton toastOptions={{ duration: 6000 }} />

<SettingsDialog />
<ConfirmDialog />
<Tooltips />
<!-- One thing over the page at a time. A flyout (a popover) is put away by a press outside it, but only by the left button: the right one
     brought a menu up beside it, and there were two. So the right button outside a flyout puts it away first, as Escape does. (Not from
     inside one, whose own menus are part of it; and not while a box is open over the page, which Escape would shut.) -->
<svelte:window
	oncontextmenucapture={(e) => {
		const on = e.target as Element | null;
		if (!document.querySelector('[data-slot=popover-content]') || document.querySelector('[role=dialog]') || on?.closest?.('[data-slot=popover-content], [role=menu]')) return;
		document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
	}}
/>

<!-- The drawing of every icon, once: each icon on the page points at its drawing here (`$lib/icons`). -->
<svg aria-hidden="true" width="0" height="0" class="absolute">{@html SPRITE}</svg>

<Sidebar.Provider bind:open={sidebarOpen} style="--sidebar-width: {ui.sidebarWidth}px;" class="h-svh overflow-hidden">
	<!-- Inside the provider, unlike the other things that open over the page:
	     folding the sidebar is one of the things it does. -->
	<CommandPalette />
	<AppSidebar />
	<SidebarToggle />
	<Sidebar.Inset class="!h-full min-h-0 overflow-hidden">
		<!-- Going somewhere: the page you are on stays, dulled, until the one you are going to is ready, and then that one is there whole. (Dulled only when it is not ready at once.) -->
		<div class="flex min-h-0 flex-1 flex-col transition-opacity {navigating.to ? 'opacity-50 delay-150 duration-150' : 'duration-75'}">
			{@render children()}
		</div>
		<!-- The dock under the page, and not over it: the page is as tall as what is left. -->
		<Dock />
	</Sidebar.Inset>
</Sidebar.Provider>
