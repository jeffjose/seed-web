<script lang="ts">
	import '@fontsource-variable/geist';
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
</script>

<!-- Toasts are for things that happen somewhere you are not looking. -->
<Toaster position="bottom-right" richColors closeButton toastOptions={{ duration: 6000 }} />

<SettingsDialog />
<ConfirmDialog />
<Tooltips />

<Sidebar.Provider bind:open={sidebarOpen} style="--sidebar-width: 17rem;" class="h-svh overflow-hidden">
	<!-- Inside the provider, unlike the other things that open over the page:
	     folding the sidebar is one of the things it does. -->
	<CommandPalette />
	<AppSidebar />
	<SidebarToggle />
	<Sidebar.Inset class="!h-full min-h-0 overflow-hidden">
		{@render children()}
		<!-- The dock under the page, and not over it: the page is as tall as what is left. -->
		<Dock />
	</Sidebar.Inset>
</Sidebar.Provider>
