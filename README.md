# seed-web

A personal starting point for web apps: an empty app shell with the layout,
type and colour already decided. Copy it, rename it, and put pages in it.

SvelteKit 2 · Svelte 5 (runes) · Tailwind v4 · shadcn-svelte on bits-ui ·
Lucide icons · pnpm. Client-rendered (`ssr = false`), built with adapter-node.

```sh
pnpm install
pnpm dev      # http://localhost:5173
pnpm check    # svelte-check
pnpm build
```

## What is in the shell

| Piece | Where | Keys |
|---|---|---|
| Left sidebar: pinned or gone, hover the corner button to peek | `src/lib/components/app-sidebar.svelte`, `sidebar-shell.svelte`, `sidebar-toggle.svelte` | ⌘/Ctrl+B |
| Right panel: drag its edge to resize, expand to take the middle | `pane.svelte`, `inspector.svelte` | ⌘/Ctrl+I |
| Bottom dock: a thin bar that comes up, folds when you click away | `dock.svelte` | ⌘/Ctrl+` |
| Command palette | `command-palette.svelte` | ⌘/Ctrl+K |
| Settings: a modal over any page, addressed as `#settings/<section>` | `settings-dialog.svelte`, `ui.svelte.ts` | |
| Confirm dialog, tooltips (`data-tip`), toasts, empty state | `confirm-dialog.svelte`, `tooltips.svelte`, `empty.svelte` | |

Shell state (panel sizes, what is open, theme) lives in `src/lib/ui.svelte.ts`
and is remembered in `localStorage`. Colour tokens, the grey ramp and the base
type are in `src/app.css`; the type scale is in `src/lib/styles.ts`. The font is
Geist. Dark is the default theme.

## Starting a project from it

1. Rename: `name` in `package.json`, `<title>` in `src/app.html`, and the
   word "Title" in `app-sidebar.svelte` and `shell-page.svelte`.
2. Places: edit `src/lib/nav.ts`. The sidebar and the palette both read it.
   Add a route under `src/routes/` for each.
3. Pages: `shell-page.svelte` gives a page its header, middle and right panel;
   pass `children` and `side` snippets to fill them.
4. Settings sections: `SETTINGS_SECTIONS` in `ui.svelte.ts`, and a panel for
   each in `settings-dialog.svelte`.
5. Dock tabs: `TABS` in `dock.svelte`.
6. Icons are imported one by one in `src/lib/icons.ts`; add what you use.
