/**
 * Pagefind Search Loader - 简化版
 * 负责加载和初始化 Pagefind 搜索引擎
 */

// 全局状态
let pagefindInstance = null;
let isLoading = false;
let isLoaded = false;

/**
 * 加载 Pagefind 库
 */
async function loadPagefind() {
	// 如果已经加载完成，直接返回实例
	if (isLoaded && pagefindInstance) {
		console.log('✅ Pagefind already loaded');
		return pagefindInstance;
	}

	// 如果正在加载中，等待加载完成
	if (isLoading) {
		console.log('⏳ Pagefind is loading, waiting...');
		return new Promise((resolve, reject) => {
			const checkInterval = setInterval(() => {
				if (isLoaded && pagefindInstance) {
					clearInterval(checkInterval);
					resolve(pagefindInstance);
				}
			}, 100);

			// 10秒超时
			setTimeout(() => {
				clearInterval(checkInterval);
				reject(new Error('Pagefind loading timeout'));
			}, 10000);
		});
	}

	// 开始加载
	isLoading = true;
	console.log('🔄 Loading Pagefind...');

	try {
		// 使用 fetch + eval 的方式动态加载（避免构建时解析）
		// 或者使用动态 import 字符串
		const pagefindPath = '/pagefind/pagefind.js';

		// 创建动态 import - 使用字符串拼接避免构建时解析
		const importPath = pagefindPath;
		const pagefindModule = await import(/* @vite-ignore */ importPath);

		// 保存实例
		pagefindInstance = pagefindModule;

		// 初始化 Pagefind
		if (pagefindModule.init) {
			await pagefindModule.init();
		}

		// 挂载到 window 对象
		window.pagefind = pagefindModule;

		isLoaded = true;
		isLoading = false;

		console.log('✅ Pagefind loaded successfully');

		// 触发自定义事件通知其他组件
		document.dispatchEvent(new CustomEvent('pagefindready', {
			detail: { pagefind: pagefindModule }
		}));

		return pagefindModule;
	} catch (error) {
		isLoading = false;
		console.error('❌ Failed to load Pagefind:', error);

		// 触发错误事件
		document.dispatchEvent(new CustomEvent('pagefindloaderror', {
			detail: { error }
		}));

		throw error;
	}
}

/**
 * 执行搜索
 * @param {string} query - 搜索关键词
 * @returns {Promise<Array>} 搜索结果
 */
async function search(query) {
	if (!query || typeof query !== 'string') {
		return [];
	}

	try {
		// 确保 Pagefind 已加载
		const pagefind = await loadPagefind();

		// 执行搜索
		console.log(`🔍 Searching for: "${query}"`);
		const response = await pagefind.search(query);

		// 获取完整的搜索结果数据
		const results = await Promise.all(
			response.results.map(result => result.data())
		);

		console.log(`📝 Found ${results.length} results for "${query}"`);

		return results;
	} catch (error) {
		console.error('❌ Search error:', error);
		return [];
	}
}

/**
 * 初始化 - 在页面加载时预加载 Pagefind
 */
function init() {
	// 生产环境才加载 Pagefind
	if (typeof window === 'undefined') {
		return;
	}

	// 检查是否在开发环境
	// 只有当 URL 包含 astro-dev-toolbar 或 vite 相关标识时才认为是开发环境
	// 预览服务器虽然是 localhost，但应该视为生产环境
	const isDev = document.querySelector('astro-dev-toolbar') !== null ||
	              window.location.search.includes('astro-dev');

	if (isDev) {
		console.log('⚠️ Pagefind is disabled in development mode');
		return;
	}

	// 使用 requestIdleCallback 在浏览器空闲时预加载
	if ('requestIdleCallback' in window) {
		requestIdleCallback(() => {
			loadPagefind().catch(err => {
				console.warn('Pagefind preload failed:', err);
			});
		}, { timeout: 2000 });
	} else {
		// 降级方案：延迟 2 秒后加载
		setTimeout(() => {
			loadPagefind().catch(err => {
				console.warn('Pagefind preload failed:', err);
			});
		}, 2000);
	}
}

// 页面加载完成后初始化
if (typeof document !== 'undefined') {
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	} else {
		init();
	}
}

// 导出 API（虽然在浏览器环境中不会被使用，但保持一致性）
export { loadPagefind, search };
