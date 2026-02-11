<script lang="ts">
import {
    DARK_MODE,
    DEFAULT_THEME,
    LIGHT_MODE,
    WALLPAPER_BANNER,
    WALLPAPER_FULLSCREEN,
    WALLPAPER_NONE,
} from "@constants/constants";
import I18nKey from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";
import Icon from "@iconify/svelte";
import {
    getDefaultHue,
    getHue,
    getStoredTheme,
    getStoredWallpaperMode,
    getStoredBlur,
    setHue,
    setTheme,
    setWallpaperMode,
    setBlur,
} from "@utils/setting-utils";
import { onMount } from "svelte";
import type { LIGHT_DARK_MODE, WALLPAPER_MODE } from "@/types/config";
import { siteConfig, sidebarLayoutConfig } from "@/config";

// --- State ---
let hue = 250;
let defaultHue = 250;
let theme: LIGHT_DARK_MODE = DEFAULT_THEME;
let wallpaperMode: WALLPAPER_MODE = WALLPAPER_BANNER;
let blur = 0;
let layout: "list" | "grid" = "list";
let isMounted = false;
let isSmallScreen = false;

// --- Constants ---
const themeOptions = [
    { mode: LIGHT_MODE, icon: "material-symbols:wb-sunny-outline-rounded", label: I18nKey.lightMode },
    { mode: DARK_MODE, icon: "material-symbols:dark-mode-outline-rounded", label: I18nKey.darkMode },
];

const wallpaperOptions = [
    { mode: WALLPAPER_BANNER, icon: "material-symbols:image-outline", label: I18nKey.wallpaperBanner },
    { mode: WALLPAPER_FULLSCREEN, icon: "material-symbols:wallpaper", label: I18nKey.wallpaperFullscreen },
    { mode: WALLPAPER_NONE, icon: "material-symbols:hide-image-outline", label: I18nKey.wallpaperNone },
];

const BREAKPOINT = sidebarLayoutConfig.responsive?.breakpoints?.desktop ?? 1280;

// --- Actions ---

function resetHue() {
    hue = defaultHue;
    setHue(hue);
}

function switchScheme(newMode: LIGHT_DARK_MODE) {
    theme = newMode;
    setTheme(newMode);
}

function switchWallpaper(newMode: WALLPAPER_MODE) {
    wallpaperMode = newMode;
    setWallpaperMode(newMode);
}

function switchLayout(newLayout: "list" | "grid") {
    layout = newLayout;
    
    if (typeof window !== "undefined") {
        sessionStorage.setItem("postListLayout", newLayout);
        localStorage.setItem("postListLayout", newLayout);
        window.dispatchEvent(
            new CustomEvent("layoutChange", {
                detail: { layout: newLayout },
            })
        );
    }
}

// --- Lifecycle ---

onMount(() => {
    isMounted = true;
    defaultHue = getDefaultHue();
    hue = getHue();
    theme = getStoredTheme();
    wallpaperMode = getStoredWallpaperMode();
    blur = getStoredBlur();
    
    // Layout Init
    const sessionLayout = sessionStorage.getItem("postListLayout");
    if (sessionLayout === "list" || sessionLayout === "grid") {
        layout = sessionLayout;
    } else {
        layout = siteConfig.postListLayout.defaultMode as "list" | "grid";
    }

    // Screen size check
    const mediaQueryList = window.matchMedia(`(min-width: ${BREAKPOINT}px)`);
    isSmallScreen = !mediaQueryList.matches;
    const handleMediaQueryChange = (e: MediaQueryListEvent | MediaQueryList) => {
        isSmallScreen = !e.matches;
    };
    if (mediaQueryList.addEventListener) {
        mediaQueryList.addEventListener("change", handleMediaQueryChange);
    } else {
        mediaQueryList.addListener(handleMediaQueryChange);
    }

    // Swup Hooks for Theme Sync
    if (typeof window !== "undefined") {
        const handleContentReplace = () => {
            requestAnimationFrame(() => {
                const newMode = getStoredTheme();
                if (theme !== newMode) {
                    theme = newMode;
                }
                const newWallpaperMode = getStoredWallpaperMode();
                if (wallpaperMode !== newWallpaperMode) {
                    wallpaperMode = newWallpaperMode;
                }
            });
        };

        if ((window as any).swup && (window as any).swup.hooks) {
            (window as any).swup.hooks.on("content:replace", handleContentReplace);
        }
    }
});

$: if (isMounted) {
    setHue(hue);
    setBlur(blur);
}

</script>

<div id="display-setting" class="float-panel float-panel-closed absolute transition-all w-80 right-4 px-4 py-4">
    
    <!-- 1. Theme Mode -->
    <div class="flex flex-row gap-2 mb-3 items-center justify-between">
        <div class="flex gap-2 font-bold text-lg text-neutral-900 dark:text-neutral-100 transition relative ml-3
            before:w-1 before:h-4 before:rounded-md before:bg-[var(--primary)]
            before:absolute before:-left-3 before:top-[0.33rem]">
            {i18n(I18nKey.themeMode)}
        </div>
        <div class="flex gap-1 bg-[var(--btn-regular-bg)] rounded-lg p-1">
            {#each themeOptions as option}
                <button 
                    aria-label={i18n(option.label)}
                    class="btn-plain w-9 h-9 rounded-md active:scale-90 flex items-center justify-center transition-all"
                    class:bg-[var(--primary)]={theme === option.mode}
                    class:text-white={theme === option.mode}
                    on:click={() => switchScheme(option.mode)}
                >
                    <Icon icon={option.icon} class="text-[1.25rem]"></Icon>
                </button>
            {/each}
        </div>
    </div>

    <!-- 2. Theme Color -->
    <div class="flex flex-row gap-2 mb-3 items-center justify-between">
        <div class="flex gap-2 font-bold text-lg text-neutral-900 dark:text-neutral-100 transition relative ml-3
            before:w-1 before:h-4 before:rounded-md before:bg-[var(--primary)]
            before:absolute before:-left-3 before:top-[0.33rem]"
        >
            {i18n(I18nKey.themeColor)}
            <button aria-label="Reset to Default" class="btn-regular w-7 h-7 rounded-md active:scale-90 flex items-center justify-center"
                    class:opacity-0={hue === defaultHue} class:pointer-events-none={hue === defaultHue} on:click={resetHue}>
                    <div class="text-[var(--btn-content)]">
                        <Icon icon="fa6-solid:arrow-rotate-left" class="text-[0.75rem]"></Icon>
                    </div>
            </button>
        </div>
        <div class="flex gap-1">
            <div id="hueValue" class="transition bg-[var(--btn-regular-bg)] w-10 h-7 rounded-md flex justify-center
            font-bold text-sm items-center text-[var(--btn-content)]">
                {hue}
            </div>
        </div>
    </div>
    <div class="w-full h-6 px-1 bg-[oklch(0.80_0.10_0)] dark:bg-[oklch(0.70_0.10_0)] rounded select-none mb-3">
        <input aria-label={i18n(I18nKey.themeColor)} type="range" min="0" max="360" bind:value={hue}
               class="slider" id="colorSlider" step="5" style="width: 100%">
    </div>

    <!-- 3. Wallpaper Mode -->
    <div class="flex flex-row gap-2 mb-3 items-center justify-between">
        <div class="flex gap-2 font-bold text-lg text-neutral-900 dark:text-neutral-100 transition relative ml-3
            before:w-1 before:h-4 before:rounded-md before:bg-[var(--primary)]
            before:absolute before:-left-3 before:top-[0.33rem]">
            {i18n(I18nKey.wallpaperMode)}
            {#if wallpaperMode === 'fullscreen'}
            <button aria-label="Random Wallpaper" class="btn-regular w-7 h-7 rounded-md active:scale-90 flex items-center justify-center transition-all"
                    on:click={() => (window as any).setRandomWallpaper && (window as any).setRandomWallpaper()}>
                    <div class="text-[var(--btn-content)]">
                        <Icon icon="fa6-solid:arrow-rotate-right" class="text-[0.75rem]"></Icon>
                    </div>
            </button>
            {/if}
        </div>
        <div class="flex gap-1 bg-[var(--btn-regular-bg)] rounded-lg p-1">
            {#each wallpaperOptions as option}
                <button 
                    aria-label={i18n(option.label)}
                    class="btn-plain w-9 h-9 rounded-md active:scale-90 flex items-center justify-center transition-all"
                    class:bg-[var(--primary)]={wallpaperMode === option.mode}
                    class:text-white={wallpaperMode === option.mode}
                    on:click={() => switchWallpaper(option.mode)}
                >
                    <Icon icon={option.icon} class="text-[1.25rem]"></Icon>
                </button>
            {/each}
        </div>
    </div>

    <!-- 4. Background Blur (Only for Fullscreen) -->
    {#if wallpaperMode === 'fullscreen'}
    <div class="flex flex-row gap-2 mb-3 items-center justify-between">
        <div class="flex gap-2 font-bold text-lg text-neutral-900 dark:text-neutral-100 transition relative ml-3
            before:w-1 before:h-4 before:rounded-md before:bg-[var(--primary)]
            before:absolute before:-left-3 before:top-[0.33rem]"
        >
            {i18n(I18nKey.themeBackgroundBlur)}
        </div>
        <div class="flex gap-1">
            <div id="blurValue" class="transition bg-[var(--btn-regular-bg)] w-10 h-7 rounded-md flex justify-center
            font-bold text-sm items-center text-[var(--btn-content)]">
                {blur}
            </div>
        </div>
    </div>
    <div class="w-full h-6 px-1 bg-[oklch(0.80_0.10_0)] dark:bg-[oklch(0.70_0.10_0)] rounded select-none mb-3">
        <input aria-label={i18n(I18nKey.themeBackgroundBlur)} type="range" min="0" max="100" bind:value={blur}
               class="slider" id="blurSlider" step="1" style="width: 100%">
    </div>
    {/if}

    <!-- 5. Layout Mode -->
    {#if siteConfig.postListLayout.allowSwitch && !isSmallScreen}
    <div class="flex flex-row gap-2 mb-3 items-center justify-between">
        <div class="flex gap-2 font-bold text-lg text-neutral-900 dark:text-neutral-100 transition relative ml-3
            before:w-1 before:h-4 before:rounded-md before:bg-[var(--primary)]
            before:absolute before:-left-3 before:top-[0.33rem]">
            {i18n(I18nKey.layoutMode)}
        </div>
        <div class="flex gap-1 bg-[var(--btn-regular-bg)] rounded-lg p-1">
             <button 
                aria-label="List"
                class="btn-plain w-9 h-9 rounded-md active:scale-90 flex items-center justify-center transition-all"
                class:bg-[var(--primary)]={layout === 'list'}
                class:text-white={layout === 'list'}
                on:click={() => switchLayout('list')}
            >
                <Icon icon="material-symbols:view-list-outline-rounded" class="text-[1.25rem]"></Icon>
            </button>
             <button 
                aria-label="Grid"
                class="btn-plain w-9 h-9 rounded-md active:scale-90 flex items-center justify-center transition-all"
                class:bg-[var(--primary)]={layout === 'grid'}
                class:text-white={layout === 'grid'}
                on:click={() => switchLayout('grid')}
            >
                <Icon icon="material-symbols:grid-view-outline-rounded" class="text-[1.25rem]"></Icon>
            </button>
        </div>
    </div>
    {/if}

</div>

<style lang="stylus">
    #display-setting
      input[type="range"]
        -webkit-appearance none
        height 1.5rem
        background-image var(--color-selection-bar)
        transition background-image 0.15s ease-in-out

        /* Input Thumb */
        &::-webkit-slider-thumb
          -webkit-appearance none
          height 1rem
          width 0.5rem
          border-radius 0.125rem
          background rgba(255, 255, 255, 0.7)
          box-shadow none
          &:hover
            background rgba(255, 255, 255, 0.8)
          &:active
            background rgba(255, 255, 255, 0.6)

        &::-moz-range-thumb
          -webkit-appearance none
          height 1rem
          width 0.5rem
          border-radius 0.125rem
          border-width 0
          background rgba(255, 255, 255, 0.7)
          box-shadow none
          &:hover
            background rgba(255, 255, 255, 0.8)
          &:active
            background rgba(255, 255, 255, 0.6)
</style>
