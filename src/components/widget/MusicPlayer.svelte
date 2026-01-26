<script lang="ts">
import Icon from "@iconify/svelte";
import { onDestroy, onMount } from "svelte";
import { slide } from "svelte/transition";
// 从配置文件中导入音乐播放器配置
import { musicPlayerConfig } from "../../config";
// 导入国际化相关的 Key 和 i18n 实例
import Key from "../../i18n/i18nKey";
import { i18n } from "../../i18n/translation";

// 音乐播放器模式，可选 "local" 或 "meting"，从本地配置中获取或使用默认值 "meting"
let mode = musicPlayerConfig.mode ?? "meting";
// Meting API 地址
let meting_api =
	musicPlayerConfig.meting_api ??
	"https://www.bilibili.uno/api?server=:server&type=:type&id=:id&auth=:auth&r=:r";
// Meting API 的 ID
let meting_id = musicPlayerConfig.id ?? "14164869977";
// Meting API 的服务器
let meting_server = musicPlayerConfig.server ?? "netease";
// Meting API 的类型
let meting_type = musicPlayerConfig.type ?? "playlist";

// 播放状态，默认为 false (未播放)
let isPlaying = false;
// 是否显示播放列表，默认为 false
let showPlaylist = false;
// 当前播放时间，默认为 0
let currentTime = 0;
// 歌曲总时长，默认为 0
let duration = 0;
// 音量，默认为 0.7
let volume = 0.7;
// 是否静音，默认为 false
let isMuted = false;
// 是否正在加载，默认为 false
let isLoading = false;
// 是否随机播放，默认为 false
let isShuffled = false;
// 循环模式，0: 不循环, 1: 单曲循环, 2: 列表循环，默认为 0
let isRepeating = 0;
// 错误信息，默认为空字符串
let errorMessage = "";
// 是否显示错误信息，默认为 false
let showError = false;

// 当前歌曲信息
let currentSong = {
	title: "Sample Song",
	artist: "Sample Artist",
	cover: "/favicon/favicon.ico",
	url: "",
	duration: 0,
};

type Song = {
	id: number;
	title: string;
	artist: string;
	cover: string;
	url: string;
	duration: number;
};

let playlist: Song[] = [];
let currentIndex = 0;
let audio: HTMLAudioElement;
let progressBar: HTMLElement;
let volumeBar: HTMLElement;

const localPlaylist = [
	{
		id: 1,
		title: "ひとり上手",
		artist: "Kaya",
		cover: "assets/music/cover/hitori.jpg",
		url: "assets/music/url/hitori.mp3",
		duration: 240,
	},
	{
		id: 2,
		title: "眩耀夜行",
		artist: "スリーズブーケ",
		cover: "assets/music/cover/xryx.jpg",
		url: "assets/music/url/xryx.mp3",
		duration: 180,
	},
	{
		id: 3,
		title: "春雷の頃",
		artist: "22/7",
		cover: "assets/music/cover/cl.jpg",
		url: "assets/music/url/cl.mp3",
		duration: 200,
	},
];

async function fetchMetingPlaylist() {
	if (!meting_api || !meting_id) return;
	isLoading = true;
	const apiUrl = meting_api
		.replace(":server", meting_server)
		.replace(":type", meting_type)
		.replace(":id", meting_id)
		.replace(":auth", "")
		.replace(":r", Date.now().toString());
	try {
		const res = await fetch(apiUrl);
		if (!res.ok) throw new Error("meting api error");
		const list = await res.json();
		playlist = list.map((song: any) => {
			let title = song.name ?? song.title ?? i18n(Key.unknownSong);
			let artist = song.artist ?? song.author ?? i18n(Key.unknownArtist);
			let dur = song.duration ?? 0;
			if (dur > 10000) dur = Math.floor(dur / 1000);
			if (!Number.isFinite(dur) || dur <= 0) dur = 0;
			return {
				id: song.id,
				title,
				artist,
				cover: song.pic ?? "",
				url: song.url ?? "",
				duration: dur,
			};
		});
		if (playlist.length > 0) {
			loadSong(playlist[0]);
		}
		isLoading = false;
	} catch (e) {
		showErrorMessage(i18n(Key.musicPlayerErrorPlaylist));
		isLoading = false;
	}
}

function togglePlay() {
	if (!audio || !currentSong.url) return;
	if (isPlaying) {
		audio.pause();
	} else {
		audio.play().catch(() => {});
	}
}

function togglePlaylist() {
	showPlaylist = !showPlaylist;
}

function toggleShuffle() {
    isShuffled = !isShuffled;
	if (isShuffled) {
        isRepeating = 0;
	}
}

function toggleRepeat() {
    isRepeating = (isRepeating + 1) % 3;
	if (isRepeating !== 0) {
        isShuffled = false;
	}
}

function previousSong() {
	if (playlist.length <= 1) return;
	const newIndex = currentIndex > 0 ? currentIndex - 1 : playlist.length - 1;
	playSong(newIndex);
}

function nextSong(autoPlay: boolean = true) {
	if (playlist.length <= 1) return;
	
	let newIndex: number;
	if (isShuffled) {
		do {
			newIndex = Math.floor(Math.random() * playlist.length);
		} while (newIndex === currentIndex && playlist.length > 1);
	} else {
		newIndex = currentIndex < playlist.length - 1 ? currentIndex + 1 : 0;
	}
	playSong(newIndex, autoPlay);
}

// 记录切歌时的播放意图，用于解决加载失败时的状态传递问题
let willAutoPlay = false;

function playSong(index: number, autoPlay = true) {
	if (index < 0 || index >= playlist.length) return;
	
    willAutoPlay = autoPlay;
	currentIndex = index;
	loadSong(playlist[currentIndex]);
}

function getAssetPath(path: string): string {
	if (path.startsWith("http://") || path.startsWith("https://")) return path;
	if (path.startsWith("/")) return path;
	return `/${path}`;
}

function loadSong(song: typeof currentSong) {
	if (!song) return;
	if (song.url !== currentSong.url) {
		currentSong = { ...song };
		if (song.url) {
			isLoading = true;
		} else {
			isLoading = false;
		}
	}
}

// 标记是否因浏览器策略导致自动播放失败
let autoplayFailed = false;

function handleLoadSuccess() {
	isLoading = false;
	if (audio?.duration && audio.duration > 1) {
		duration = Math.floor(audio.duration);
		if (playlist[currentIndex]) playlist[currentIndex].duration = duration;
		currentSong.duration = duration;
	}

	if (willAutoPlay || isPlaying) {
        const playPromise = audio.play();
		if (playPromise !== undefined) {
            playPromise.catch((error) => {
                console.warn("自动播放被拦截，等待用户交互:", error);
                autoplayFailed = true;
				isPlaying = false;
            });
		}
    }
}

function handleUserInteraction() {
    if (autoplayFailed && audio) {
        const playPromise = audio.play();
		if (playPromise !== undefined) {
            playPromise.then(() => {
                autoplayFailed = false;
            }).catch(() => {});
		}
    }
}

function handleLoadError(_event: Event) {
	if (!currentSong.url) return;
	isLoading = false;
	showErrorMessage(i18n(Key.musicPlayerErrorSong));
	
    const shouldContinue = isPlaying || willAutoPlay;
	if (playlist.length > 1) {
		setTimeout(() => nextSong(shouldContinue), 1000);
	} else {
		showErrorMessage(i18n(Key.musicPlayerErrorEmpty));
	}
}

function handleLoadStart() {}

function handleAudioEnded() {
	if (isRepeating === 1) {
		audio.currentTime = 0;
		audio.play().catch(() => {});
	} else if (
		isRepeating === 2 ||
		isShuffled
	) {
		nextSong(true);
	} else {
		isPlaying = false;
	}
}

function showErrorMessage(message: string) {
	errorMessage = message;
	showError = true;
	setTimeout(() => {
		showError = false;
	}, 3000);
}
function hideError() {
	showError = false;
}

function setProgress(event: MouseEvent) {
	if (!audio || !progressBar) return;
	const rect = progressBar.getBoundingClientRect();
	const percent = (event.clientX - rect.left) / rect.width;
	const newTime = percent * duration;
	audio.currentTime = newTime;
	currentTime = newTime;
}

let isVolumeDragging = false;
let isPointerDown = false;
let volumeBarRect: DOMRect | null = null;
let rafId: number | null = null;

function startVolumeDrag(event: PointerEvent) {
    if (!volumeBar) return;
	event.preventDefault();
    
    isPointerDown = true; 
	volumeBar.setPointerCapture(event.pointerId);

    volumeBarRect = volumeBar.getBoundingClientRect();
    updateVolumeLogic(event.clientX);
}

function handleVolumeMove(event: PointerEvent) {
    if (!isPointerDown) return;
	event.preventDefault();

    isVolumeDragging = true; 
    if (rafId) return;

	rafId = requestAnimationFrame(() => {
        updateVolumeLogic(event.clientX);
        rafId = null;
    });
}

function stopVolumeDrag(event: PointerEvent) {
    if (!isPointerDown) return;
	isPointerDown = false;
    isVolumeDragging = false;
    volumeBarRect = null;
	if (volumeBar) {
		volumeBar.releasePointerCapture(event.pointerId);
	}

	if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
	}
}

function updateVolumeLogic(clientX: number) {
    if (!audio || !volumeBar) return;

    const rect = volumeBarRect || volumeBar.getBoundingClientRect();
	const percent = Math.max(
        0,
        Math.min(1, (clientX - rect.left) / rect.width),
    );
	volume = percent;
}

function toggleMute() {
	isMuted = !isMuted;
}

function formatTime(seconds: number): string {
	if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
	const mins = Math.floor(seconds / 60);
	const secs = Math.floor(seconds % 60);
	return `${mins}:${secs.toString().padStart(2, "0")}`;
}

const interactionEvents = ['click', 'keydown', 'touchstart'];
onMount(() => {
    interactionEvents.forEach(event => {
        document.addEventListener(event, handleUserInteraction, { capture: true });
    });

	if (!musicPlayerConfig.enable) {
		return;
	}
	if (mode === "meting") {
		fetchMetingPlaylist();
	} else {
		// 使用本地播放列表，不发送任何API请求
		playlist = [...localPlaylist];
		if (playlist.length > 0) {
			loadSong(playlist[0]);
		} else {
			showErrorMessage("本地播放列表为空");
		}
	}
});

onDestroy(() => {
    if (typeof document !== 'undefined') {
        interactionEvents.forEach(event => {
            document.removeEventListener(event, handleUserInteraction, { capture: true });
        });
    }
});
</script>

<audio
	bind:this={audio}
	src={getAssetPath(currentSong.url)}
	bind:volume
	bind:muted={isMuted}
	on:play={() => isPlaying = true}
	on:pause={() => isPlaying = false}
	on:timeupdate={() => currentTime = audio.currentTime}
	on:ended={handleAudioEnded}
	on:error={handleLoadError}
	on:loadeddata={handleLoadSuccess}
	on:loadstart={handleLoadStart}
	preload="auto"
></audio>

<svelte:window 
    on:pointermove={handleVolumeMove} 
    on:pointerup={stopVolumeDrag} 
/>

{#if musicPlayerConfig.enable}
{#if showError}
<div class="fixed bottom-20 right-4 z-[60] max-w-sm">
    <div class="bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-slide-up">
        <Icon icon="material-symbols:error" class="text-xl flex-shrink-0" />
        <span class="text-sm flex-1">{errorMessage}</span>
        <button on:click={hideError} class="text-white/80 hover:text-white transition-colors">
            <Icon icon="material-symbols:close" class="text-lg" />
        </button>
    </div>
</div>
{/if}

<div id="music-player-panel" class="float-panel float-panel-closed absolute transition-all w-80 right-4 px-4 py-4 bg-[var(--card-bg)] rounded-xl shadow-xl z-50">
    <div class="flex items-center gap-4 mb-4">
        <div class="cover-container relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
            <img src={getAssetPath(currentSong.cover)} alt={i18n(Key.musicPlayerCover)}
                    class="w-full h-full object-cover transition-transform duration-300"
                    class:spinning={isPlaying && !isLoading}
                    class:animate-pulse={isLoading} />
        </div>
        <div class="flex-1 min-w-0">
            <div class="song-title text-lg font-bold text-90 truncate mb-1">{currentSong.title}</div>
            <div class="song-artist text-sm text-50 truncate">{currentSong.artist}</div>
            <div class="text-xs text-30 mt-1">
                {formatTime(currentTime)} / {formatTime(duration)}
            </div>
        </div>
        <div class="flex items-center gap-1">
            <button class="btn-plain w-8 h-8 rounded-lg flex items-center justify-center"
                    class:text-[var(--primary)]={showPlaylist}
                    on:click={togglePlaylist}
                    title={i18n(Key.musicPlayerPlaylist)}>
                <Icon icon="material-symbols:queue-music" class="text-lg" />
            </button>
        </div>
    </div>
    <div class="progress-section mb-4">
        <div class="progress-bar flex-1 h-2 bg-[var(--btn-regular-bg)] rounded-full cursor-pointer"
                bind:this={progressBar}
                on:click={setProgress}
                on:keydown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        const percent = 0.5;
                        const newTime = percent * duration;
                        if (audio) {
                            audio.currentTime = newTime;
                            currentTime = newTime;
                        }
                    }
                }}
                role="slider"
                tabindex="0"
                aria-label={i18n(Key.musicPlayerProgress)}
                aria-valuemin="0"
                aria-valuemax="100"
                aria-valuenow={duration > 0 ? (currentTime / duration * 100) : 0}>
            <div class="h-full bg-[var(--primary)] rounded-full transition-all duration-100"
                    style="width: {duration > 0 ? (currentTime / duration) * 100 : 0}%"></div>
        </div>
    </div>
    <div class="controls flex items-center justify-center gap-2 mb-4">
        <button class="w-10 h-10 rounded-lg"
                class:btn-regular={isShuffled}
                class:btn-plain={!isShuffled}
                on:click={toggleShuffle}
                disabled={playlist.length <= 1}>
            <Icon icon="material-symbols:shuffle" class="text-lg" />
        </button>
        <button class="btn-plain w-10 h-10 rounded-lg" on:click={previousSong}
                disabled={playlist.length <= 1}>
            <Icon icon="material-symbols:skip-previous" class="text-xl" />
        </button>
        <button class="btn-regular w-12 h-12 rounded-full"
                class:opacity-50={isLoading}
                disabled={isLoading}
                on:click={togglePlay}>
            {#if isLoading}
                <Icon icon="eos-icons:loading" class="text-xl" />
            {:else if isPlaying}
                <Icon icon="material-symbols:pause" class="text-xl" />
            {:else}
                <Icon icon="material-symbols:play-arrow" class="text-xl" />
            {/if}
        </button>
        <button class="btn-plain w-10 h-10 rounded-lg" on:click={() => nextSong()}
                disabled={playlist.length <= 1}>
            <Icon icon="material-symbols:skip-next" class="text-xl" />
        </button>
        <button class="w-10 h-10 rounded-lg"
                class:btn-regular={isRepeating > 0}
                class:btn-plain={isRepeating === 0}
                on:click={toggleRepeat}>
            {#if isRepeating === 1}
                <Icon icon="material-symbols:repeat-one" class="text-lg" />
            {:else if isRepeating === 2}
                <Icon icon="material-symbols:repeat" class="text-lg" />
            {:else}
                <Icon icon="material-symbols:repeat" class="text-lg opacity-50" />
            {/if}
        </button>
    </div>
    <div class="bottom-controls flex items-center gap-2">
        <button class="btn-plain w-8 h-8 rounded-lg" on:click={toggleMute}>
            {#if isMuted || volume === 0}
                <Icon icon="material-symbols:volume-off" class="text-lg" />
            {:else if volume < 0.5}
                <Icon icon="material-symbols:volume-down" class="text-lg" />
            {:else}
                <Icon icon="material-symbols:volume-up" class="text-lg" />
            {/if}
        </button>
        <div class="flex-1 h-2 bg-[var(--btn-regular-bg)] rounded-full cursor-pointer touch-none"
                bind:this={volumeBar}
                on:pointerdown={startVolumeDrag}
                on:keydown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        if (e.key === 'Enter') toggleMute();
                    }
                }}
                role="slider"
                tabindex="0"
                aria-label={i18n(Key.musicPlayerVolume)}
                aria-valuemin="0"
                aria-valuemax="100"
                aria-valuenow={volume * 100}>
            <div class="h-full bg-[var(--primary)] rounded-full transition-all"
                    class:duration-100={!isVolumeDragging}
                    class:duration-0={isVolumeDragging}
                    style="width: {volume * 100}%"></div>
        </div>
    </div>
    {#if showPlaylist}
        <div class="playlist-overlay absolute inset-0 bg-[var(--card-bg)] rounded-xl z-10 flex flex-col overflow-hidden"
                transition:slide={{ duration: 300, axis: 'y' }}>
            <div class="playlist-header flex items-center justify-between p-4 border-b border-[var(--line-divider)]">
                <h3 class="text-lg font-semibold text-90">{i18n(Key.musicPlayerPlaylist)}</h3>
                <button class="btn-plain w-8 h-8 rounded-lg" on:click={togglePlaylist}>
                    <Icon icon="material-symbols:close" class="text-lg" />
                </button>
            </div>
            <div class="playlist-content overflow-y-auto flex-1 hide-scrollbar p-2">
                {#each playlist as song, index}
                    <div class="playlist-item flex items-center gap-3 p-3 hover:bg-[var(--btn-plain-bg-hover)] cursor-pointer transition-colors rounded-lg"
                            class:bg-[var(--btn-plain-bg)]={index === currentIndex}
                            class:text-[var(--primary)]={index === currentIndex}
                            on:click={() => playSong(index)}
                            on:keydown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    playSong(index);
                                }
                            }}
                            role="button"
                            tabindex="0"
                            aria-label="播放 {song.title} - {song.artist}">
                        <div class="w-6 h-6 flex items-center justify-center">
                            {#if index === currentIndex && isPlaying}
                                <Icon icon="material-symbols:graphic-eq" class="text-[var(--primary)] animate-pulse" />
                            {:else if index === currentIndex}
                                <Icon icon="material-symbols:pause" class="text-[var(--primary)]" />
                            {:else}
                                <span class="text-sm text-[var(--content-meta)]">{index + 1}</span>
                            {/if}
                        </div>
                        <div class="flex-1 min-w-0">
                            <div class="font-medium truncate" class:text-[var(--primary)]={index === currentIndex} class:text-90={index !== currentIndex}>
                                {song.title}
                            </div>
                            <div class="text-sm text-[var(--content-meta)] truncate" class:text-[var(--primary)]={index === currentIndex}>
                                {song.artist}
                            </div>
                        </div>
                    </div>
                {/each}
            </div>
        </div>
    {/if}
</div>

<style>
.animate-pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
@keyframes pulse {
    0%, 100% {
        opacity: 1;
	}
    50% {
        opacity: 0.5;
	}
}
.progress-section div:hover,
.bottom-controls > div:hover {
    transform: scaleY(1.2);
    transition: transform 0.2s ease;
}
@media (max-width: 480px) {
    .song-title {
        font-size: 14px;
	}
    .song-artist {
        font-size: 12px;
	}
    .controls {
        gap: 6px;
        margin-bottom: 12px;
	}
    .controls button {
        width: 32px;
        height: 32px;
	}
    .controls button:nth-child(3) {
        width: 40px;
        height: 40px;
	}
    .playlist-item {
        padding: 8px 12px;
	}
}
@keyframes slide-up {
    from {
        transform: translateY(100%);
        opacity: 0;
	}
    to {
        transform: translateY(0);
        opacity: 1;
	}
}
.animate-slide-up {
    animation: slide-up 0.3s ease-out;
}
/* 自定义旋转动画，停止时保持当前位置 */
@keyframes spin-continuous {
    from {
        transform: rotate(0deg);
	}
    to {
        transform: rotate(360deg);
	}
}

.cover-container img {
    animation: spin-continuous 3s linear infinite;
    animation-play-state: paused;
}

.cover-container img.spinning {
    animation-play-state: running;
}

/* 让主题色按钮更有视觉反馈 */
button.bg-\[var\(--primary\)\] {
    box-shadow: 0 0 0 2px var(--primary);
	border: none;
}
</style>
{/if}
