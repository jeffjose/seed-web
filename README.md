# seed-web

A personal starting point for web apps: an empty app shell with the layout,
type and color already decided. Copy it, rename it, and put pages in it.

SvelteKit 2 · Svelte 5 (runes) · Tailwind v4 · shadcn-svelte on bits-ui ·
Solar icons · pnpm. Client-rendered (`ssr = false`), built with adapter-node.

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
| Menus: one list, under the right button or dropped from a button | `menus.ts`, `right-click.svelte`, `menu-list.svelte` | |
| Themes and faces: light, dark, named looks of two colors each, a font chosen in Settings | `app.css`, `ui.svelte.ts`, `fonts.ts`, `appearance-panel.svelte` | |
| Motion: how things arrive over the page, open in it, and are scrolled to | `app.css`, `motion.ts`, `glide.ts` | |
| Identity colors: a name hashed to one of 21 hues | `palette.ts` | |

Shell state (panel sizes, what is open, theme) lives in `src/lib/ui.svelte.ts`
and is remembered in `localStorage`. Color tokens, the gray ramp and the base
type are in `src/app.css`; the type scale is in `src/lib/styles.ts`. The font is
Geist, and the theme is light or dark as the system is, until another is chosen.

Why it looks and moves as it does is in [DESIGN.md](DESIGN.md): every choice
with its values and its reason, and what was tried and thrown away.

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
6. Icons are written out one by one in `src/lib/icons.ts`; add what you use
   (copy the `body` of `NAME-linear` from `@iconify-json/solar`, and set its
   `stroke-width` to 2.25).
7. The app's own color is `--brand` in `src/app.css`.

## Credits

Icons are from [Solar](https://www.figma.com/community/file/1166831539721848736)
by 480 Design, [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/), redrawn
here with a heavier line. Colors are from [Radix Colors](https://www.radix-ui.com/colors).
