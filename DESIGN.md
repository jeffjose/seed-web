# Design

How an app started from this seed looks, moves and reads, and why. Each choice
has its values, the reason it was made, and the file it lives in.

The rules are mostly written down already, as comments beside the code that
keeps them. This is those comments gathered into one place, with what was
tried and thrown away on the way. They were worked out in apps built on this
shell and brought back here.

## Contents

1. [Principles](#1-principles)
2. [Stack](#2-stack)
3. [Type](#3-type)
4. [Color](#4-color)
5. [Layout](#5-layout)
6. [Icons](#6-icons)
7. [Tooltips](#7-tooltips)
8. [Motion](#8-motion)
9. [Pointer, cursor and selection](#9-pointer-cursor-and-selection)
10. [Components](#10-components)
11. [Patterns for what you build](#11-patterns-for-what-you-build)
12. [Words](#12-words)
13. [Tried and thrown away](#13-tried-and-thrown-away)

---

## 1. Principles

These are the ideas the specific choices keep coming back to.

- **Said once.** A size, a row, a button, a motion is defined in one place and
  used by name (`styles.ts`, `seg.ts`, `app.css`), "so a page cannot drift into
  its own padding and its own header, which is how five pages got five looks."
- **Rules by what a thing is, not by opting in.** A tooltip is big because the
  control has no text; a menu animates because it is a menu; a button has the
  hand because it is a button. A new one behaves without being told to.
- **Nothing moves that you did not move.** The page keeps room for a scrollbar
  whether or not there is one, a pane you closed stays closed over a reload,
  what comes under the pointer on a row takes no room in it, a tooltip does
  not come back on the thing you just pressed.
- **Quiet until it matters.** Chrome sits back (muted line icons, hidden
  scrollbars). One color is the app's own. Status colors are reserved for
  status.
- **Few words.** A heading is enough when you know; the rest is behind an (i).
- **Motion is felt, not watched.** Nothing travels far, nothing bounces,
  nothing waits for it, and it is off for anyone who asked for less.
- **One thing over the page at a time.**

---

## 2. Stack

| Part | Choice | Notes |
|---|---|---|
| Framework | SvelteKit 2, Svelte 5 (runes), Vite 7, TypeScript | Client-rendered (`ssr = false`), `adapter-node` |
| CSS | Tailwind 4 via `@tailwindcss/vite` | No config file. Tokens are in `@theme inline` in `src/app.css` |
| Primitives | shadcn-svelte on bits-ui 2 | Vendored in `src/lib/components/ui/`. Right-click menus use bits-ui `ContextMenu` directly |
| Icons | Solar (CC BY 4.0), copied from `@iconify-json/solar` | See [Icons](#6-icons). `@lucide/svelte` survives only inside stock `ui/` parts |
| Fonts | `@fontsource-variable/geist`, `@fontsource-variable/fira-code` | Self-hosted. A font `<link>` only where another face was chosen in Settings |
| Color source | `@radix-ui/colors` | Read at build time in `src/lib/palette.ts` |
| Toasts | `svelte-sonner` | Mounted once, bottom right, 6 s, close button |

Animation has no library. `tw-animate-css` is not installed, so the
`animate-in` classes on the stock shadcn parts do nothing; the motion is a
small block of plain CSS (see [Motion](#8-motion)).

---

## 3. Type

### Faces

- **Interface:** `var(--app-font, 'Geist Variable'), 'Geist Variable',
  ui-sans-serif, system-ui, sans-serif`, with antialiased smoothing.
- **Fixed width:** `'Fira Code Variable', ui-monospace, 'SF Mono', Menlo,
  monospace`, as `--font-mono`. One face for whatever is set in a fixed width.
- **Mono is opt-in by class, never by element.** `code, kbd, samp, pre` inherit
  the page's face. "Nothing in the app is set in a typewriter face: an address,
  a name to type, a number in a control are all in the face of the page." Use
  `font-mono` where a fixed width is really wanted.
- **No tabular figures.** Numbers are set as the face sets them.

### Another face (`src/lib/fonts.ts`)

Geist is the face the app comes in and the only one kept with it. Another can
be chosen in Settings, from a list or gone through with the arrows.

- **One variable says which:** `--app-font`. Where the chosen face cannot be
  had (no network), the page is in Geist.
- **Fetched only when chosen,** from Google Fonts, by a `<link id="app-font">`.
  The inline script in `app.html` asks for it before first paint, "so that the
  page does not come up in one and change to another."
- **The page says which face it is in** (`html[data-font]`), for what has to be
  set differently in one.
- **A face's weights are changed by name, not at the call site.** Google Sans
  Flex is set "regular to read, a little heavier where something is marked out
  and never bold": `--font-weight-medium: 460`, `--font-weight-semibold: 540`,
  `--font-weight-bold: 620`, letters `0.008em` apart. Everything set
  `font-medium` or `font-semibold` anywhere follows, with no class changed.
- **A fetched face is never the default.** The app comes up in the face kept
  with it.
- The list is short on purpose. A new face is a line in `FONTS`.

### One lever

`html { font-size: 100% }`. Tailwind sizes are rem-based, so the root size
moves type, control heights, icons and padding together.

### The scale (`src/lib/styles.ts`)

| Size | Job |
|---|---|
| 15px medium | What a page or pane is (its header bar) |
| 14px | What you read: a row's name, a paragraph |
| 13px | Controls, and what is said about a row |
| 12px | Asides: a count, a place, a date |

**Weight:** medium for chrome; semibold only for a label that has to be found
(the large tooltip, a subject). Nothing is bold.

### Named styles

Use these by name; do not rebuild them at the call site.

| Name | Classes | For |
|---|---|---|
| `TITLE` | `truncate text-[15px] font-medium tracking-tight` | A page's or pane's name |
| `ASIDE` | `text-[12px] text-muted-foreground` | Beside a title: how many, or where |
| `HEADING` | `text-[12px] font-medium text-muted-foreground` | A section's name |
| `NOTE` | `text-[13px] text-muted-foreground` | What is said about a row |
| `CARD` | `overflow-hidden rounded-2xl bg-card ring-1 ring-foreground/10` | A group set apart on a page |
| `ROWS` | `divide-y divide-border/50` + `CARD` | A list is a card of rows; hairlines come from the list |
| `ROW` | `flex min-h-12 items-center gap-3 px-4 py-2 text-[14px]` | One row |
| `FIELD` | bordered, `bg-background/40`, `text-[13px]`, `focus:border-foreground/45` | Somewhere to type |

Buttons, from loudest to quietest. Controls are 32px tall (`h-8`); the page
button is 36px.

| Name | Look | For |
|---|---|---|
| `BTN_PAGE` | `h-9 rounded-lg bg-foreground text-background` | The one filled button on a page |
| `BTN_MAIN` | `h-8 rounded-md bg-foreground/10 font-medium` | The one thing a row is for |
| `BTN_LINE` | `h-8` outline that fills on hover | Undoing what the main one did |
| `BTN` | `h-8 rounded-md px-2.5 text-muted-foreground hover:bg-accent` | A quiet button |
| `BTN_ICON` | `size-8 rounded-md` grid, muted | A button that is only an icon |
| `BTN_DANGER` | Outlined in red, red all through under the pointer | What you would not do by accident |

### Reading text

Where the app shows what somebody wrote, set it for reading: about
`max-w-[68ch] text-[15.5px] leading-[23px]` at 90% ink, 15px between
paragraphs (twice the air between lines, "so the two are never taken for each
other"), and a section's name with 30px over it and 6px under, "so it belongs
to what follows".

---

## 4. Color

### Two layers

1. **Twelve grays, `--g1` to `--g12`**, one block per mode.
2. **Roles mapped onto them once**, the same in both modes, because Radix step
   roles are symmetric: 11 is muted text and 12 is primary text everywhere.

| Role | Step |
|---|---|
| Text, primary | g12 |
| Muted text | g11 |
| Ring | g8 |
| Input border | g7 |
| Border | g6 |
| Accent ground (hover) | g4 |
| Secondary, muted ground | g3 |

**Only elevation differs by mode.** Light lifts cards toward white off a tinted
page; dark lifts them away from black.

| Token | Light | Dark |
|---|---|---|
| `background` | g2 | g1 |
| `card` | g1 | g2 |
| `popover` | g1 | g3 |
| `sidebar` | g3 | g2 |

### The ramps

**Dark** is Radix slate dark in oklch, hue about 286.

**Light is the app's own, hue 140**, not Radix slate. "Slate on a light page
is a cold lilac gray, with a hair between the page and what lies on it, so
that nothing stood off anything else. This one leans a little to green, as
paper does, and has room in it: 1 is paper white, for what is lifted; 2 is the
page; 3 is the sidebar and anything set back; and text is a step deeper than
slate's, to read on all three."

### The app's own color

`--brand`: the one color that is the app's own (the ring round what is picked,
a sign that something changed, a drag target). The seed's is a sage; change it
in `app.css`, with a deeper one for the light page.

`--on-brand` is what is written on brand where it is a fill: white on a light
page, the page's own color on a dark one, because white on brand does not read
on every look.

### Status colors are reserved

Four states (`ok`, `run`, `warn`, `fail`), four hues, and nothing that is not
a status may use them. **9 is a fill, 11 is the only step safe as text.** On a
light page the text steps are made deeper, since an 11 that reads on dark is a
pale wash on light.

Why: identity colors were once picked anywhere on the wheel, so one sat a
hand's breadth from the failure red and another next to the success green. "On
a screen showing a failed run and two project dots, four warm marks meant four
different things and none of them read."

### Identity colors (`src/lib/palette.ts`)

For whatever has a color of its own: a person, a project, a label.

- **Source:** 21 Radix hues in wheel order. The browns are left out: "beside
  the others they read as no color."
- **Step jobs:** 3 for a tinted surface, 9 for a solid fill, 11 for text.
- **Mode-dependent steps are names, not values:** `--hue-blue-ink` and
  `--hue-blue-surface` resolve per mode. Only the solid (9) is one color for
  both.
- **A name is its own key.** `hueOf(name)` hashes the lowercased name onto the
  21: "always the same one for the same name, on any machine and after any
  reload, with nothing kept anywhere."
- **Use:** `style={tone(name)}` on an element, then `var(--who)`,
  `var(--who-surface)`, `var(--who-solid)`, `var(--who-on-solid)` inside it.
- **Text on a solid:** near black on the bright hues (amber, yellow, lime,
  mint, sky), white on the rest.
- **In a menu, a color is shown at full strength** (its 9), as a swatch is: the
  softer step text is set in makes every one look pale beside what choosing it
  gives.

### Themes

- **`dark:` follows the page's class, not the system:** `@custom-variant dark
  (&:where(.dark, .dark *))`. "A light look on a dark machine is light all
  through."
- **The system's light or dark is the default** with no stored preference.
- **No flash:** an inline script in `app.html` sets the class, the look and
  the face before first paint, and an inline style gives `html` its page
  color. "The page is its own color from the first thing drawn."
- **`color-scheme` follows the class,** so the browser's own parts (a
  scrollbar, a date field, autofill) match.
- **A named look is two colors:** its page (`--tb`) and its text (`--tf`). The
  twelve grays are mixed from those two in oklab, "so nothing in a look can be
  a gray that does not belong to its page." Optional: `--tl` (lifted surface on
  light), `--tm` (muted-text strength, for a look whose text is pale to begin
  with), `--brand`.

  | Step | Dark look, % of text in page | Light look |
  |---|---|---|
  | g1 | page | lifted (white) |
  | g2 | 4 | page |
  | g3 | 8 | 5 |
  | g4 | 11 | 8 |
  | g5 | 14 | 11 |
  | g6 | 18 | 15 |
  | g7 | 25 | 21 |
  | g8 | 36 | 32 |
  | g9 | 44 | 48 |
  | g10 | 50 | 54 |
  | g11 | 68 (`--tm`) | 66 (`--tm`) |
  | g12 | text | text |

  The seed has five, to show the ways one can be made. A new look is one line
  in `app.css` and one in `THEMES` (`ui.svelte.ts`).
- **A theme is tried on the whole app** and kept on Save: "there is no smaller
  honest picture of light against dark."
- **Kept in the browser**, since it is about the screen in front of you.

---

## 5. Layout

### The shell

Left to right: **sidebar** (272px, resizable, foldable), **page**, **right
pane** (336px, resizable, closable). A **dock** sits under the page.

- **One viewport.** The shell is exactly `svh` tall and never scrolls; every
  level below is pinned with `min-h-0`.
- **`flex-1 min-h-0`, never `h-full`.** "A full-height child of a column flex
  measures against the whole inset and overflows whatever is beside it."
- **Header bars are 48px (`h-12`)** in the page, the sidebar and the right
  pane, so they read as one bar across the window.
- **Scroll areas keep `scrollbar-gutter: stable`,** so content growing past the
  window does not narrow the page and shift everything in it.
- **Going to a page:** the one you are on stays, dulled to 50% after 150ms,
  until the next is ready, and then that one is there whole (`+layout.svelte`).

### The sidebar (`sidebar-shell.svelte`)

- **Two states, not three.** Pinned, it is a column that costs width; folded,
  it is gone. There is no icon strip: "a rail of unlabeled icons that needed a
  tooltip each to be usable is a menu that costs a column to say less than a
  menu."
- **Folded, it peeks on hover** as a floating panel.
- **The peek closes on distance, not on `mouseleave`.** `mouseleave` "fires on
  every pixel of daylight the pointer finds, and each one reads as a flicker
  you didn't ask for." An open menu holds it open.
- **One fold button, fixed in the corner:** "the button you pressed to fold the
  sidebar is the button under your pointer to open it again."
- **Rows:** the one you are on is told by its ground, not its weight.

### Resizing (all three panes)

- A 12px hit strip straddling the edge, with a 2px line that appears on hover
  (`foreground/40`) and darkens while dragging (`/60`).
- Double-click resets. Arrow keys nudge by 16px. `role="separator"`.
- While dragging, a full-window overlay keeps the resize cursor and stops
  selection wherever the pointer goes; the sidebar's width transition is off.

### The dock (`dock.svelte`)

A thin bar until asked for. Clicked, it comes up to the height it was last
dragged to; clicking anywhere else folds it. Ctrl/⌘ + backtick, "as a
terminal's panel is brought up".

### What is remembered

"Open at first run, and after that however you left it. A reload that puts
back a pane you closed, or closes one you opened, is the app undoing you."

- **Kept:** sidebar open and width, right pane open and width, dock height and
  tab, theme and face.
- **Deliberately not kept:** the right pane's expanded state ("it is for the
  moment") and the dock being open.
- **Settings is the end of the address** (`#settings/shortcuts`), not a route:
  the page under it stays put, and Back shuts it.

---

## 6. Icons

### One family, one line

**Solar**, linear (CC BY 4.0, 480 Design): "one weight of line, for the icons
of the interface, which are to be read and not looked at."

### Line weight: 2.25

Solar draws its line icons at 1.5. Here they are drawn at **2.25**
(`stroke-width` in `src/lib/icons.ts`).

- Why: the icons are shown at 14 to 16 pixels beside text, and at 1.5 the line
  was thinner than the letters, so they read as faint. 1.75 was tried first
  and was still thin.
- Solar publishes no heavier line style; its only heavier style is Bold, which
  is filled and a different look. So this is Solar's own drawings with a
  thicker pen.
- The known cost: busy glyphs (settings, calendar, trash) can close up at 14px.
  The remedy is to draw those a step bigger, not to thin the line.

### How they are drawn

- **A sprite, not a component per icon.** Every drawing is put in the page once
  as `<symbol id="icon-NAME">` (`SPRITE`, in the layout), and an icon anywhere
  is `<svg><use href="#icon-NAME"/></svg>` (`icon.svelte`). "An icon is the
  commonest thing on the page."
- **The name is typed against the map,** so a misspelling is a build error
  rather than a hole in the interface.
- **A hand-picked subset,** written out in the file and not looked up from the
  whole set of thousands. To add one, copy its `body` from
  `@iconify-json/solar` (`NAME-linear`) and set its `stroke-width` to 2.25.
- **Names are Lucide's,** with the Solar glyph noted beside each. Swapping
  packs is a change to one file.

### Sizes

| Size | Where |
|---|---|
| 14px | Chevrons, the (i), row actions |
| 15px | Header buttons |
| 16px | Default |
| 18px | A page header's own icon |
| 22px | Empty states |

---

## 7. Tooltips

One layer for the whole app (`src/lib/components/tooltips.svelte`), mounted
once. Anything with `data-tip` gets one.

**Why not the browser's `title`:** it arrives late, in the system's font, at a
size and place of its choosing, and is gone on some platforms before it is
read.

**Why one listener on the document, not a wrapper per button:** "there are a
hundred of these, and a hundred components to say 'this has a hint' would be a
hundred places to forget."

### Two sizes, chosen by what the control is

| | A control with no text (an icon, a swatch) | A control with text |
|---|---|---|
| What the hint is | Its label | An aside |
| When | At once | After a pause |
| Style | `rounded-lg px-3 py-2 text-[13.5px] font-semibold` | `rounded-md px-2.5 py-1.5 text-[12px] font-medium` |

The test is `!el.textContent.trim()`. Nothing is opted in where the hint is
written, so a new icon button gets the large, immediate one by default.
"Without it you are guessing."

### Placement

- **Above** the control, centered; **below** when there is no room. Kept 8px
  inside the window. As wide as its words (`w-max`, `max-w-64`).
- **In a group (`data-tip-group`, for a column of icons): beside,** 12px to the
  right. It stays up as the pointer moves from one to the next, over the gaps
  too: "it changes what it says, and does not go and come back."
- The same dark surface in every theme.

### When it goes away

- On pointer down, on a key, on scroll, and when the pointer leaves. "A hint is
  for before you act, not during."
- **It does not come back on the thing just pressed** until the pointer has
  left and returned. Pressing a control gives it focus, and often swaps the
  icon inside it (refresh becomes a spinner); both look to the browser like the
  pointer arriving afresh. A hint that returned on each press blinked at every
  one.
- **Not on focus that the keyboard did not bring.** A flyout that opens puts
  focus on its first button by itself: "that is not somebody asking what the
  button is."

### Writing one

- An icon-only control's hint is its **name**: "Refresh", "Close". Status may
  follow: "Refresh · checked 2 min ago".
- A shortcut goes in parentheses: "Close (Esc)".
- Every icon-only control should have one.

---

## 8. Motion

Two halves: things that arrive **over** the page, and things that open **in**
it.

### Over the page (`src/app.css`, "How things arrive")

One motion for hints, menus, popovers and dialogs, defined by what the thing
is (`data-slot`, which every `ui/` part has, or the class `pop` for the ones
that are not from there).

"They come from where they were asked for (a menu grows out of its button, by
a few pixels and a few hundredths), quickly, and leave quicker. It is meant to
be felt and not watched: nothing travels far, nothing bounces, and nothing
waits for it."

| What | In | Out |
|---|---|---|
| Tooltip | fade, scale from 0.97, 120ms | instant |
| Popover, dropdown, select, right-click menu | fade, scale from 0.96, 4px from the side it hangs on, 150ms | fade, scale to 0.98, 90ms |
| Dialog | fade, scale from 0.96 in the center, 180ms | 110ms |
| Dialog backdrop | fade, 180ms | 110ms |

- **Easing:** `--ease-out: cubic-bezier(0.16, 1, 0.3, 1)` in; `ease-in` out.
- **Out is quicker than in.** The thing leaving is no longer what you want.
- **Origin:** `transform-origin: var(--bits-floating-transform-origin)`, so a
  menu grows out of its button.
- **Only `opacity`, `scale` and `translate` move.** That leaves `transform` to
  whatever is positioning the thing. A dialog is centered with `translate`, so
  its keyframe moves scale and opacity only.
- **A dialog is slower** because it is bigger, and it is what you asked for.

### In the page (`src/lib/motion.ts`)

`transition:grow`: a thing that opens in its place grows **down** from the line
that opened it, 170ms, `cubicOut`, and what is under it moves out of the way
instead of jumping.

### When not to expand in place

If opening something would push fixed content down, it is a **flyout to the
side** instead.

### A flyout that goes from one thing to the next

Where one flyout serves many things (a closer look at whichever row the
pointer is on), it is one flyout that morphs: it slides to stand beside the
next (about 200ms on its position), grows or shrinks to what that one says,
and the words fade across. It does not close and reopen.

### Scrolling to a thing (`src/lib/glide.ts`)

`glide(box, to, within)` in place of `behavior: 'smooth'`.

- **A spring, not a curve** (pull 200, hold 35, weight 2): from rest it gathers
  way, lands in about 0.6s and is stopped on the place, with no overshoot and
  no creep at the end. A 320ms ease-out curve covered most of the distance in
  the first tenth and read as frantic.
- **Re-aimed every frame.** The browser's own decides once where it is going;
  when rows are still arriving, it lands somewhere that is no longer the place.
- **One screen's worth and no more.** From far away, put the box one screen
  short first and glide only that; pass `within` to hold it to within a screen
  while it goes. Fading the content up as it starts makes a long jump read as
  a cut and an arrival.

### The rest

| Name | What | Values |
|---|---|---|
| `shake` | "No" to a press, where the press happened | Sideways, 400ms |
| `shimmer` | A line that is working, not stuck | A gradient across the text, 1.8s linear |
| `found` | The thing you asked to go to | Its ground beats twice in brand, 650ms |
| Sidebar peek | The folded sidebar under the pointer | A short fly |

### Reduced motion

Everything above is off under `prefers-reduced-motion: reduce`. Where the
motion carried meaning, something still does: `found` becomes a static ring,
`shimmer` becomes plain muted text, `glide` goes there at once.

---

## 9. Pointer, cursor and selection

- **Anything that can be pressed shows the hand.** Buttons, `role="button"`,
  every menu item role, options, tabs, `summary`. "Tailwind 4 leaves a button
  with the arrow. Anything that can be pressed shows the hand, everywhere, so
  no page has to remember to ask for it." This includes items in right-click
  menus, dropdowns, selects and the command palette, which the stock parts set
  to the arrow.
- **Under an open menu the page has the arrow.** A menu asked for over a
  paragraph would otherwise keep the text cursor until the pointer reached it.
  That a menu is up is said on the page (`html[data-menu]`, kept by the layout)
  and not asked with `body:has(…)`, which had every element looked at again on
  every change and made typing slow on a big page.
- **Controls are not selectable text.** "A second click on a button, close on
  the first, would otherwise paint its word in the browser's selection color.
  What is said in the app is still selectable."
- **Toast text is selectable.** Sonner makes it unselectable so a drag reads as
  a swipe; "that is right for 'Saved' and wrong for anything carrying a detail
  somebody needs."
- **Scrollbars are thin and invisible until the element is hovered.**
- **A sideways-scrolling row always shows its bar:** "it is the only sign
  there are more, and a mouse's only way along."
- **One thing over the page at a time.** A flyout is put away by a press
  outside it; the right button outside one puts it away first, as Escape does,
  and then brings its menu up (`+layout.svelte`).

---

## 10. Components

### Menus

- **One list, two presentations.** A menu is an array of entries (`menus.ts`),
  shown under the right button (`right-click.svelte`) or dropped from a button
  (`menu-list.svelte`). A thing's menu is one menu everywhere.
- **Built when asked for** (`items` is a function), so it says how things
  stand then.
- **Anything under the right button is also reachable by a visible control,**
  usually a "···". Not everyone thinks to right-click.
- Item: `rounded-md px-2 py-1.5 text-[13px]`, a 16px leading slot (an icon at
  70%, or a color dot), a trailing check.
- **Chips** at a row's right are other ways of doing the same thing, each one
  press.
- **Words:** short. "Settings…", "Open", "Mark as read". An ellipsis marks what
  opens something.

### Deleting

One look everywhere: red words on the ordinary ground at rest; a bright red
ground with white words when reached for. "Never red on red." A destructive
icon button is "as quiet as its neighbors at rest, so a row of tools is not
one red one."

The confirm dialog is one for the whole app (`ui.confirm`). Order: Cancel, the
destructive action, then any alternative. Copy is short: `Delete "X"?`.

### Dialogs

"A dialog is the one thing on screen that is above everything else, and it has
to look it: a surface a clear step lighter than the page, a lit top edge, and
a deep shadow under it. A hairline ring on a panel the same color as the page
reads as a rectangle drawn on the page."

- **Dark:** the page's color lifted, a 1px lit top edge, a hairline, a deep
  shadow, and a darker veil behind (`black/40`).
- **Light:** the popover's white, a hairline, and a soft wide shadow at 0.18.
  No lit edge: "the same shadow is a black smear round a white sheet."

### Settings

- A dialog with sections down the left and one of them beside it, "so each is
  short and none is scrolled past."
- A row is a name and, under it, what it does, with the control at the right
  and a hairline between rows, "so the eye runs down the names on the left and
  across to the one it wants." More than a few words goes behind an (i)
  beside the name (`info` on `setting-row`).
- **One Save bar for all sections** (`save-bar.svelte`): a flat strip with a
  quiet green Save. Moving between sections is free; closing with something
  unsaved is refused, and the bar says so, in full weight, for a moment.
  Nothing moves and nothing turns red. No second dialog.

### The (i)

"A sentence of help under every heading is a page of sentences, read once and
then stepped over for ever. The heading is enough when you know; the (i) is
there when you do not." (`info.svelte`, `more-info.svelte`.)

### Segmented control (`seg.ts`)

- The lit choice is "a soft raised chip, not a solid block: it sits inside the
  track with room around it, so two lit neighbors read as two chips and never
  as a slab."
- `min-w-fit`: "never narrower than its own word. Squeezed under that, the
  words ran into each other ('Auto0')."

### The command palette

The row the keys are on has a stronger ground and a 3px edge in brand: the
stock muted ground alone was not found at a glance. Results are one line a
row.

### Empty states

One form everywhere (`empty.svelte`): an icon chip, and under it a few words
at 14px, in the middle. What can be done about it goes under the words.

### Toasts

"Toasts are for things that happen somewhere you are not looking." Bottom
right, 6s. An undo is the toast's action.

---

## 11. Patterns for what you build

Not in the seed as code, because they belong to the pages you add. They held
up, so start from them.

- **Lists:** "one line a row, fixed columns, a small quiet header, a hairline
  between rows." A row is one dense line: who, what, then where and how long
  ago. Never a title over a subtitle. A chevron sits beside what it says, not
  off at the edge.
- **Row tools are laid over the row and take no room in it.** Position them
  over the row's end on the row's own ground, so "nothing in the row moves as
  the pointer comes and goes." Rows are not dulled under the pointer.
- **Weight by importance.** "What only tells you something is a line, not a
  card." A card is as wide as it needs to be, and no wider.
- **Buttons inside content are outlined, not filled:** the likeliest answer a
  shade stronger than the rest, and none of them the loudest thing there.
- **Three weights of text in a row:** the name bright and medium, when it is
  bright and plain, and what happened to it quiet.
- **Quick changes under the right button, the rest in a dialog** behind
  "Settings…". In such a dialog each change is kept as it is made.
- **What was looked for is lit with the CSS Custom Highlight API**
  (`::highlight(find)` is styled in `app.css`), not by wrapping letters in
  elements: the text is not touched, nothing reflows, and a selection is still
  a selection.
- **A picture shown large is shown as itself:** no card, no border, only the
  picture on the veil.
- **Dragging:** the thing dragged stays under the pointer. Others make room,
  and it joins them when let go. A drag under 4px is a press.
- **Each change shows at once, is sent, and then the truth is read again:**
  what the server says is what stands.
- **Faces:** a round mark in the person's own color (`tone(name)`). "The same
  name is the same color wherever it shows."

---

## 12. Words

The comments, the commit messages and the interface are written the same way:
plain, concrete, short words, in the present tense, describing a thing by what
it is and does.

- **Plain names, not UI jargon.** "Under the pointer" (hover), "under the right
  button" (context menu), "a hint" (tooltip), "a look" (theme), "the hand" and
  "the arrow" (cursors), "lit" and "dulled" (active and not), "kept"
  (persisted), "tried on" (previewed), "said once" (single source of truth).
- **A comment gives the rule and then the failure that caused it.** "Squeezed
  under that, the words ran into each other ('Auto0')."
- **A commit subject states the new truth, never the action.** "A hint is as
  wide as its words, however near the window's edge it is." The body says what
  was wrong before.
- **Interface copy:** sentence case, no exclamation marks, contractions mostly
  avoided, US spelling.
  - "Not saved yet"
  - "Nothing selected."
  - "That did not work"
- **Shortcuts in parentheses** after the label. **Relative times are terse:**
  "just now", "4 min ago", "3 h ago". Times are 12-hour by default, with the
  full date under the pointer.

---

## 13. Tried and thrown away

Worth knowing so they are not tried again.

| Tried | Dropped because |
|---|---|
| A collapsed icon strip for the sidebar | A column that says less than a menu |
| Closing the sidebar peek on `mouseleave` | Flickered at every gap |
| Scaling a tile or icon on hover | The glyph was redrawn between two sizes and shimmered. It brightens |
| A thick line set into a row for "you are here" | Read as a border gone wrong. Its ground says it |
| A card and a heading round every item in a list | A line, or a mark it hangs from, is enough |
| A bar of color down the side of a typed item | Read as a thick border; an icon and the ground say it |
| Tabular figures | Numbers are set as the face sets them |
| A typewriter face for `code` | One face for the page |
| A Save bar that shakes and turns red | A calm foot with a green Save |
| Lucide icons | One family, with a line as heavy as the text |
| Solar line icons at 1.5, then 1.75 | Thinner than the text beside them |
| Solar Bold as the "heavier" icon | Filled; a different look from a line icon |
| The browser's `title` tooltips | Late, in the system's font, placed anywhere |
| One tooltip size and delay for everything | An icon's hint is its name and cannot wait; a word's is an aside |
| A tooltip returning after each press | Blinked on every click of refresh or an arrow |
| `tw-animate-css` zoom-in on everything | One small block of CSS, by what the thing is |
| Expanding a long list inside a fixed pane | Pushed what was under it down. A flyout to the side |
| Row tools that took room in the row on hover | Everything in the row moved as the pointer came and went |
| A menu coming up beside an open flyout | Two things over the page |
| A flyout that closed and reopened between neighbors | It morphs from one to the next |
| `behavior: 'smooth'`, then a 320ms ease-out, for scrolling to a thing | Landed in the wrong place; leapt and then crept. A spring |
| Gliding the whole distance from far away | Screens of things went by. One screen's worth |
| `body:has([role=menu])` for the cursor under a menu | Slow by the size of the page. A flag on `html` |
| Repacking a dragged thing among the others mid-drag | Moved it out from under the pointer |
| A fetched face as the default | The app comes up in the face kept with it |
| Dark whatever the system said | Light or dark as the system is, until told |
| Slate as the light ramp | Cold, and nothing stood off anything else |
| White text on brand in every look | Did not read on several. `--on-brand` |
| A picture in a lightbox inside a frame | It is shown as itself |
