<script lang="ts">
import I18nKey from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";
import Icon from "@iconify/svelte";
import { navigateToPage } from "@utils/navigation-utils";
import { url } from "@utils/url-utils";
import { onMount, onDestroy } from "svelte";
import type { SearchResult } from "@/global";

let keywordDesktop = $state("");
let keywordMobile = $state("");
let result: SearchResult[] = $state([]);
let pagefindReady = $state(false);
let isDesktopSearchExpanded = $state(false);
let debounceTimer: NodeJS.Timeout;
let windowJustFocused = false;
let focusTimer: NodeJS.Timeout;
let blurTimer: NodeJS.Timeout;

const togglePanel = () => {
	const panel = document.getElementById("search-panel");
	panel?.classList.toggle("float-panel-closed");
};

const toggleDesktopSearch = () => {
	// 如果窗口刚获得焦点，不自动展开搜索框
	if (windowJustFocused) {
		return;
	}
	isDesktopSearchExpanded = !isDesktopSearchExpanded;
	if (isDesktopSearchExpanded) {
		setTimeout(() => {
			const input = document.getElementById("search-input-desktop") as HTMLInputElement;
			input?.focus();
		}, 0);
	}
};

const collapseDesktopSearch = () => {
	if (!keywordDesktop) {
		isDesktopSearchExpanded = false;
	}
};

const handleBlur = () => {
	// 延迟处理以允许搜索结果的点击事件先于折叠逻辑执行
	blurTimer = setTimeout(() => {
		isDesktopSearchExpanded = false;
		// 仅隐藏面板并折叠，保留搜索关键词和结果以便下次展开时查看
		setPanelVisibility(false, true);
	}, 200);
};

const setPanelVisibility = (show: boolean, isDesktop: boolean): void => {
	const panel = document.getElementById("search-panel");
	if (!panel || !isDesktop) return;
	if (show) {
		panel.classList.remove("float-panel-closed");
	} else {
		panel.classList.add("float-panel-closed");
	}
};

const closeSearchPanel = (): void => {
	const panel = document.getElementById("search-panel");
	if (panel) {
		panel.classList.add("float-panel-closed");
	}
	// 清空搜索关键词和结果
	keywordDesktop = "";
	keywordMobile = "";
	result = [];
};

const handleResultClick = (event: Event, url: string): void => {
	event.preventDefault();
	closeSearchPanel();
	navigateToPage(url);
};

/**
 * 新的搜索函数 - 直接使用 window.pagefind
 */
const search = async (keyword: string, isDesktop: boolean): Promise<void> => {
	// 空关键词则清空结果
	if (!keyword) {
		setPanelVisibility(false, isDesktop);
		result = [];
		return;
	}

	// Pagefind 搜索逻辑
	if (!pagefindReady || !window.pagefind) {
		console.warn('⚠️ Pagefind not ready yet');
		return;
	}

	try {
		console.log(`🔍 Searching for: "${keyword}"`);

		// 调用 Pagefind 搜索
		const response = await window.pagefind.search(keyword);

		// 获取完整的搜索结果数据
		const searchResults = await Promise.all(
			response.results.map((item) => item.data()),
		);

		console.log(`📝 Found ${searchResults.length} results`);

		result = searchResults;
		setPanelVisibility(result.length > 0, isDesktop);
	} catch (error) {
		console.error("❌ Search error:", error);
		result = [];
		setPanelVisibility(false, isDesktop);
	}
};

onMount(() => {
	// 监听 Pagefind 加载完成事件
	const handlePagefindReady = () => {
		pagefindReady = true;
		console.log('✅ Search component: Pagefind is ready');
	};

	const handlePagefindError = () => {
		console.error('❌ Search component: Pagefind load failed');
		pagefindReady = false;
	};

	document.addEventListener('pagefindready', handlePagefindReady);
	document.addEventListener('pagefindloaderror', handlePagefindError);

	// 检查 Pagefind 是否已经加载
	if (window.pagefind) {
		pagefindReady = true;
		console.log('✅ Search component: Pagefind already loaded');
	}

	// 监听窗口焦点事件，防止切换窗口时自动展开搜索框
	const handleFocus = () => {
		windowJustFocused = true;
		clearTimeout(focusTimer);
		focusTimer = setTimeout(() => {
			windowJustFocused = false;
		}, 500); // 500ms 后才允许 mouseenter 触发展开
	};

	window.addEventListener('focus', handleFocus);

	return () => {
		document.removeEventListener('pagefindready', handlePagefindReady);
		document.removeEventListener('pagefindloaderror', handlePagefindError);
		window.removeEventListener('focus', handleFocus);
	};
});

$effect(() => {
	const keyword = keywordDesktop || keywordMobile;
	const isDesktop = !!keywordDesktop || isDesktopSearchExpanded;

	clearTimeout(debounceTimer);
	if (keyword) {
		debounceTimer = setTimeout(() => {
			search(keyword, isDesktop);
		}, 300);
	} else {
		result = [];
		setPanelVisibility(false, isDesktop);
	}
});

$effect(() => {
	if (typeof document !== 'undefined') {
		const navbar = document.getElementById('navbar');
		if (isDesktopSearchExpanded) {
			navbar?.classList.add('is-searching');
		} else {
			navbar?.classList.remove('is-searching');
		}
	}
});

onDestroy(() => {
	if (typeof document !== 'undefined') {
		const navbar = document.getElementById('navbar');
		navbar?.classList.remove('is-searching');
	}
	clearTimeout(debounceTimer);
	clearTimeout(focusTimer);
});
</script>

<!-- search bar for desktop view (collapsed by default) -->
<div
    id="search-bar"
    class="hidden lg:flex transition-all items-center h-11 rounded-lg relative shrink-0
        {isDesktopSearchExpanded ? 'bg-black/[0.04] hover:bg-black/[0.06] focus-within:bg-black/[0.06] dark:bg-white/5 dark:hover:bg-white/10 dark:focus-within:bg-white/10' : 'btn-plain active:scale-90'}
        {isDesktopSearchExpanded ? 'w-48' : 'w-11'}"
    role="button"
    tabindex="0"
    aria-label="Search"
    onmouseenter={() => {if (!isDesktopSearchExpanded) toggleDesktopSearch()}}
    onmouseleave={collapseDesktopSearch}
    onclick={() => {
        const input = document.getElementById("search-input-desktop") as HTMLInputElement;
        input?.focus();
    }}
>
    <Icon icon="material-symbols:search" class="absolute text-[1.25rem] pointer-events-none {isDesktopSearchExpanded ? 'left-3' : 'left-1/2 -translate-x-1/2'} transition top-1/2 -translate-y-1/2 {isDesktopSearchExpanded ? 'text-black/30 dark:text-white/30' : ''}"></Icon>
    <input id="search-input-desktop" placeholder={i18n(I18nKey.search)} bind:value={keywordDesktop}
        onfocus={() => {
            clearTimeout(blurTimer);
            if (!isDesktopSearchExpanded) toggleDesktopSearch(); 
            search(keywordDesktop, true);
        }}
        onblur={handleBlur}
        class="transition-all pl-10 text-sm bg-transparent outline-0
            h-full {isDesktopSearchExpanded ? 'w-36' : 'w-0'} text-black/50 dark:text-white/50"
    >
</div>

<!-- toggle btn for phone/tablet view -->
<button onclick={togglePanel} aria-label="Search Panel" id="search-switch"
        class="btn-plain scale-animation lg:!hidden rounded-lg w-11 h-11 active:scale-90">
    <Icon icon="material-symbols:search" class="text-[1.25rem]"></Icon>
</button>

<!-- search panel -->
<div id="search-panel" class="float-panel float-panel-closed absolute md:w-[30rem] top-20 left-4 md:left-[unset] right-4 z-50 search-panel shadow-2xl rounded-2xl p-2">
    <!-- search bar inside panel for phone/tablet -->
    <div id="search-bar-inside" class="flex relative lg:hidden transition-all items-center h-11 rounded-xl
      bg-black/[0.04] hover:bg-black/[0.06] focus-within:bg-black/[0.06]
      dark:bg-white/5 dark:hover:bg-white/10 dark:focus-within:bg-white/10
  ">
        <Icon icon="material-symbols:search" class="absolute text-[1.25rem] pointer-events-none ml-3 transition my-auto text-black/30 dark:text-white/30"></Icon>
        <input placeholder={i18n(I18nKey.search)} bind:value={keywordMobile}
               class="pl-10 absolute inset-0 text-sm bg-transparent outline-0
               focus:w-60 text-black/50 dark:text-white/50"
        >
    </div>
    <!-- search results -->
    {#each result as item}
        <a href={item.url}
           onclick={(e) => handleResultClick(e, item.url)}
           class="transition first-of-type:mt-2 lg:first-of-type:mt-0 group block
       rounded-xl text-lg px-3 py-2 hover:bg-[var(--btn-plain-bg-hover)] active:bg-[var(--btn-plain-bg-active)]">
            <div class="transition text-90 inline-flex font-bold group-hover:text-[var(--primary)]">
                {item.meta.title}<Icon icon="fa6-solid:chevron-right" class="transition text-[0.75rem] translate-x-1 my-auto text-[var(--primary)]"></Icon>
            </div>
            <div class="transition text-sm text-50">
                {@html item.excerpt}
            </div>
        </a>
    {/each}
</div>

<style>
    input:focus {
        outline: 0;
    }
    :global(.search-panel) {
        max-height: calc(100vh - 100px);
        overflow-y: auto;
    }
</style>
