/**
 * One icon family: Lucide. One weight, one grid, one stroke.
 *
 * Imported explicitly rather than looked up off the barrel: `icons[name]` is a
 * dynamic access, which defeats tree-shaking and drags all ~1,600 glyphs into
 * the bundle. This costs a line per icon and keeps the build honest — and the
 * compiler checks the spelling, which a string lookup cannot.
 */
import Bell from '@lucide/svelte/icons/bell';
import Check from '@lucide/svelte/icons/check';
import ChevronDown from '@lucide/svelte/icons/chevron-down';
import ChevronLeft from '@lucide/svelte/icons/chevron-left';
import ChevronRight from '@lucide/svelte/icons/chevron-right';
import ChevronUp from '@lucide/svelte/icons/chevron-up';
import House from '@lucide/svelte/icons/house';
import Info from '@lucide/svelte/icons/info';
import Keyboard from '@lucide/svelte/icons/keyboard';
import LoaderCircle from '@lucide/svelte/icons/loader-circle';
import File from '@lucide/svelte/icons/file';
import Maximize from '@lucide/svelte/icons/maximize-2';
import Minimize from '@lucide/svelte/icons/minimize-2';
import Monitor from '@lucide/svelte/icons/monitor';
import Moon from '@lucide/svelte/icons/moon';
import MoreHorizontal from '@lucide/svelte/icons/ellipsis';
import Palette from '@lucide/svelte/icons/palette';
import PanelLeft from '@lucide/svelte/icons/panel-left';
import PanelRight from '@lucide/svelte/icons/panel-right';
import Plus from '@lucide/svelte/icons/plus';
import Search from '@lucide/svelte/icons/search';
import Settings from '@lucide/svelte/icons/settings';
import SlidersHorizontal from '@lucide/svelte/icons/sliders-horizontal';
import Sun from '@lucide/svelte/icons/sun';
import Trash from '@lucide/svelte/icons/trash';
import X from '@lucide/svelte/icons/x';

export const ICONS = {
	bell: Bell,
	check: Check,
	'chevron-down': ChevronDown,
	'chevron-left': ChevronLeft,
	'chevron-right': ChevronRight,
	'chevron-up': ChevronUp,
	house: House,
	info: Info,
	keyboard: Keyboard,
	'loader-circle': LoaderCircle,
	file: File,
	maximize: Maximize,
	minimize: Minimize,
	monitor: Monitor,
	moon: Moon,
	'more-horizontal': MoreHorizontal,
	palette: Palette,
	'panel-left': PanelLeft,
	'panel-right': PanelRight,
	plus: Plus,
	search: Search,
	settings: Settings,
	'sliders-horizontal': SlidersHorizontal,
	sun: Sun,
	trash: Trash,
	x: X
} as const;

export type IconName = keyof typeof ICONS;
