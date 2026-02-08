const dom = {
    container: document.getElementById("mainContainer"),
    backgroundStage: document.getElementById("backgroundStage"),
    backgroundBaseLayer: document.getElementById("backgroundBaseLayer"),
    backgroundTransitionLayer: document.getElementById("backgroundTransitionLayer"),
    playlist: document.getElementById("playlist"),
    playlistItems: document.getElementById("playlistItems"),
    favorites: document.getElementById("favorites"),
    favoriteItems: document.getElementById("favoriteItems"),
    lyrics: document.getElementById("lyrics"),
    lyricsScroll: document.getElementById("lyricsScroll"),
    lyricsContent: document.getElementById("lyricsContent"),
    mobileInlineLyrics: document.getElementById("mobileInlineLyrics"),
    mobileInlineLyricsScroll: document.getElementById("mobileInlineLyricsScroll"),
    mobileInlineLyricsContent: document.getElementById("mobileInlineLyricsContent"),
    audioPlayer: document.getElementById("audioPlayer"),
    themeToggleButton: document.getElementById("themeToggleButton"),
    loadOnlineBtn: document.getElementById("loadOnlineBtn"),
    showPlaylistBtn: document.getElementById("showPlaylistBtn"),
    showLyricsBtn: document.getElementById("showLyricsBtn"),
    searchInput: document.getElementById("searchInput"),
    searchBtn: document.getElementById("searchBtn"),
    sourceSelectButton: document.getElementById("sourceSelectButton"),
    sourceSelectLabel: document.getElementById("sourceSelectLabel"),
    sourceMenu: document.getElementById("sourceMenu"),
    searchResults: document.getElementById("searchResults"),
    searchResultsList: document.getElementById("searchResultsList"),
    notification: document.getElementById("notification"),
    albumCover: document.getElementById("albumCover"),
    currentSongTitle: document.getElementById("currentSongTitle"),
    currentSongArtist: document.getElementById("currentSongArtist"),
    debugInfo: document.getElementById("debugInfo"),
    importSelectedBtn: document.getElementById("importSelectedBtn"),
    importSelectedCount: document.getElementById("importSelectedCount"),
    importSelectedMenu: document.getElementById("importSelectedMenu"),
    importToPlaylist: document.getElementById("importToPlaylist"),
    importToFavorites: document.getElementById("importToFavorites"),
    importPlaylistBtn: document.getElementById("importPlaylistBtn"),
    exportPlaylistBtn: document.getElementById("exportPlaylistBtn"),
    importPlaylistInput: document.getElementById("importPlaylistInput"),
    clearPlaylistBtn: document.getElementById("clearPlaylistBtn"),
    mobileImportPlaylistBtn: document.getElementById("mobileImportPlaylistBtn"),
    mobileExportPlaylistBtn: document.getElementById("mobileExportPlaylistBtn"),
    playModeBtn: document.getElementById("playModeBtn"),
    playPauseBtn: document.getElementById("playPauseBtn"),
    progressBar: document.getElementById("progressBar"),
    currentTimeDisplay: document.getElementById("currentTimeDisplay"),
    durationDisplay: document.getElementById("durationDisplay"),
    volumeSlider: document.getElementById("volumeSlider"),
    volumeIcon: document.getElementById("volumeIcon"),
    qualityToggle: document.getElementById("qualityToggle"),
    playerQualityMenu: document.getElementById("playerQualityMenu"),
    qualityLabel: document.getElementById("qualityLabel"),
    mobileToolbarTitle: document.getElementById("mobileToolbarTitle"),
    mobileSearchToggle: document.getElementById("mobileSearchToggle"),
    mobileSearchClose: document.getElementById("mobileSearchClose"),
    mobilePanelClose: document.getElementById("mobilePanelClose"),
    mobileClearPlaylistBtn: document.getElementById("mobileClearPlaylistBtn"),
    mobilePlaylistActions: document.getElementById("mobilePlaylistActions"),
    mobileFavoritesActions: document.getElementById("mobileFavoritesActions"),
    mobileAddAllFavoritesBtn: document.getElementById("mobileAddAllFavoritesBtn"),
    mobileImportFavoritesBtn: document.getElementById("mobileImportFavoritesBtn"),
    mobileExportFavoritesBtn: document.getElementById("mobileExportFavoritesBtn"),
    mobileClearFavoritesBtn: document.getElementById("mobileClearFavoritesBtn"),
    mobileOverlayScrim: document.getElementById("mobileOverlayScrim"),
    mobileExploreButton: document.getElementById("mobileExploreButton"),
    mobileQualityToggle: document.getElementById("mobileQualityToggle"),
    mobileQualityLabel: document.getElementById("mobileQualityLabel"),
    mobilePanel: document.getElementById("mobilePanel"),
    mobileQueueToggle: document.getElementById("mobileQueueToggle"),
    shuffleToggleBtn: document.getElementById("shuffleToggleBtn"),
    searchArea: document.getElementById("searchArea"),
    libraryTabs: Array.from(document.querySelectorAll(".playlist-tab[data-target]")),
    addAllFavoritesBtn: document.getElementById("addAllFavoritesBtn"),
    importFavoritesBtn: document.getElementById("importFavoritesBtn"),
    exportFavoritesBtn: document.getElementById("exportFavoritesBtn"),
    importFavoritesInput: document.getElementById("importFavoritesInput"),
    clearFavoritesBtn: document.getElementById("clearFavoritesBtn"),
    currentFavoriteToggle: document.getElementById("currentFavoriteToggle"),
};

window.SolaraDom = dom;

const isMobileView = Boolean(window.__SOLARA_IS_MOBILE);

const mobileBridge = window.SolaraMobileBridge || {};
mobileBridge.handlers = mobileBridge.handlers || {};
mobileBridge.queue = Array.isArray(mobileBridge.queue) ? mobileBridge.queue : [];
window.SolaraMobileBridge = mobileBridge;

function invokeMobileHook(name, ...args) {
    if (!isMobileView) {
        return undefined;
    }
    const handler = mobileBridge.handlers[name];
    if (typeof handler === "function") {
        return handler(...args);
    }
    mobileBridge.queue.push({ name, args });
    return undefined;
}

function initializeMobileUI() {
    return invokeMobileHook("initialize");
}

function updateMobileToolbarTitle() {
    return invokeMobileHook("updateToolbarTitle");
}

function runAfterOverlayFrame(callback) {
    if (typeof callback !== "function" || !isMobileView) {
        return;
    }
    const runner = () => {
        if (!document.body) {
            return;
        }
        callback();
    };
    if (typeof window.requestAnimationFrame === "function") {
        window.requestAnimationFrame(runner);
    } else {
        window.setTimeout(runner, 0);
    }
}

function syncMobileOverlayVisibility() {
    if (!isMobileView || !document.body) {
        return;
    }
    const searchOpen = document.body.classList.contains("mobile-search-open");
    const panelOpen = document.body.classList.contains("mobile-panel-open");
    if (dom.searchArea) {
        dom.searchArea.setAttribute("aria-hidden", searchOpen ? "false" : "true");
    }
    if (dom.mobileOverlayScrim) {
        dom.mobileOverlayScrim.setAttribute("aria-hidden", (searchOpen || panelOpen) ? "false" : "true");
    }
}

function updateMobileClearPlaylistVisibility() {
    if (!isMobileView) {
        return;
    }
    const button = dom.mobileClearPlaylistBtn;
    if (!button) {
        return;
    }
    const playlistElement = dom.playlist;
    const body = document.body;
    const currentView = body ? body.getAttribute("data-mobile-panel-view") : null;
    const isPlaylistView = !body || !currentView || currentView === "playlist";
    const playlistSongs = (typeof state !== "undefined" && Array.isArray(state.playlistSongs)) ? state.playlistSongs : [];
    const isEmpty = playlistSongs.length === 0 || !playlistElement || playlistElement.classList.contains("empty");
    const isPlaylistVisible = Boolean(playlistElement && !playlistElement.hasAttribute("hidden"));
    const shouldShow = isPlaylistView && isPlaylistVisible && !isEmpty;
    button.hidden = !shouldShow;
    button.setAttribute("aria-hidden", shouldShow ? "false" : "true");
}

function updateMobileLibraryActionVisibility(showFavorites) {
    if (!isMobileView) {
        return;
    }
    const playlistGroup = dom.mobilePlaylistActions;
    const favoritesGroup = dom.mobileFavoritesActions;
    const showFavoritesGroup = Boolean(showFavorites);

    if (playlistGroup) {
        if (showFavoritesGroup) {
            playlistGroup.setAttribute("hidden", "");
            playlistGroup.setAttribute("aria-hidden", "true");
        } else {
            playlistGroup.removeAttribute("hidden");
            playlistGroup.setAttribute("aria-hidden", "false");
        }
    }

    if (favoritesGroup) {
        if (showFavoritesGroup) {
            favoritesGroup.removeAttribute("hidden");
            favoritesGroup.setAttribute("aria-hidden", "false");
        } else {
            favoritesGroup.setAttribute("hidden", "");
            favoritesGroup.setAttribute("aria-hidden", "true");
        }
    }
}

function forceCloseMobileSearchOverlay() {
    if (!isMobileView || !document.body) {
        return;
    }
    document.body.classList.remove("mobile-search-open");
    if (dom.searchInput) {
        dom.searchInput.blur();
    }
    syncMobileOverlayVisibility();
}

function forceCloseMobilePanelOverlay() {
    if (!isMobileView || !document.body) {
        return;
    }
    document.body.classList.remove("mobile-panel-open");
    syncMobileOverlayVisibility();
}

function openMobileSearch() {
    return invokeMobileHook("openSearch");
}

function closeMobileSearch() {
    const result = invokeMobileHook("closeSearch");
    runAfterOverlayFrame(forceCloseMobileSearchOverlay);
    return result;
}

function toggleMobileSearch() {
    return invokeMobileHook("toggleSearch");
}

function openMobilePanel(view = "playlist") {
    return invokeMobileHook("openPanel", view);
}

function closeMobilePanel() {
    const result = invokeMobileHook("closePanel");
    runAfterOverlayFrame(forceCloseMobilePanelOverlay);
    return result;
}

function toggleMobilePanel(view = "playlist") {
    return invokeMobileHook("togglePanel", view);
}

function closeAllMobileOverlays() {
    const result = invokeMobileHook("closeAllOverlays");
    runAfterOverlayFrame(() => {
        forceCloseMobileSearchOverlay();
        forceCloseMobilePanelOverlay();
    });
    return result;
}

function updateMobileInlineLyricsAria(isOpen) {
    if (!dom.mobileInlineLyrics) {
        return;
    }
    dom.mobileInlineLyrics.setAttribute("aria-hidden", isOpen ? "false" : "true");
}

function setMobileInlineLyricsOpen(isOpen) {
    if (!isMobileView || !document.body || !dom.mobileInlineLyrics) {
        return;
    }
    state.isMobileInlineLyricsOpen = Boolean(isOpen);
    document.body.classList.toggle("mobile-inline-lyrics-open", Boolean(isOpen));
    updateMobileInlineLyricsAria(Boolean(isOpen));
}

function hasInlineLyricsContent() {
    const content = dom.mobileInlineLyricsContent;
    if (!content) {
        return false;
    }
    return content.textContent.trim().length > 0;
}

function canOpenMobileInlineLyrics() {
    if (!isMobileView || !document.body) {
        return false;
    }
    const hasSong = Boolean(state.currentSong);
    return hasSong && hasInlineLyricsContent();
}

function closeMobileInlineLyrics(options = {}) {
    if (!isMobileView || !document.body) {
        return false;
    }
    if (!document.body.classList.contains("mobile-inline-lyrics-open")) {
        updateMobileInlineLyricsAria(false);
        state.isMobileInlineLyricsOpen = false;
        return false;
    }
    setMobileInlineLyricsOpen(false);
    if (options.force) {
        state.userScrolledLyrics = false;
    }
    return true;
}

function openMobileInlineLyrics() {
    if (!isMobileView || !document.body) {
        return false;
    }
    if (!canOpenMobileInlineLyrics()) {
        return false;
    }
    setMobileInlineLyricsOpen(true);
    state.userScrolledLyrics = false;
    window.requestAnimationFrame(() => {
        const container = dom.mobileInlineLyricsScroll || dom.mobileInlineLyrics;
        const activeLyric = dom.mobileInlineLyricsContent?.querySelector(".current") ||
            dom.mobileInlineLyricsContent?.querySelector("div[data-index]");
        if (container && activeLyric) {
            scrollToCurrentLyric(activeLyric, container);
        }
    });
    syncLyrics();
    return true;
}

function toggleMobileInlineLyrics() {
    if (!isMobileView || !document.body) {
        return;
    }
    if (document.body.classList.contains("mobile-inline-lyrics-open")) {
        closeMobileInlineLyrics();
    } else {
        openMobileInlineLyrics();
    }
}

const PLACEHOLDER_HTML = `<div class="placeholder"><i class="fas fa-music"></i></div>`;
const paletteCache = new Map();
const PALETTE_STORAGE_KEY = "paletteCache.v1";
let paletteAbortController = null;
const BACKGROUND_TRANSITION_DURATION = 850;
let backgroundTransitionTimer = null;
const PALETTE_APPLY_DELAY = 140;
let pendingPaletteTimer = null;
let deferredPaletteHandle = null;
let deferredPaletteType = "";
let deferredPaletteUrl = null;
const themeDefaults = {
    light: {
        gradient: "",
        primaryColor: "",
        primaryColorDark: "",
    },
    dark: {
        gradient: "",
        primaryColor: "",
        primaryColorDark: "",
    }
};
let paletteRequestId = 0;

const REMOTE_STORAGE_ENDPOINT = "/api/storage";
let remoteSyncEnabled = false;
const STORAGE_KEYS_TO_SYNC = new Set([
    "playlistSongs",
    "currentTrackIndex",
    "playMode",
    "playbackQuality",
    "playerVolume",
    "currentPlaylist",
    "currentList",
    "currentSong",
    "currentPlaybackTime",
    "favoriteSongs",
    "currentFavoriteIndex",
    "favoritePlayMode",
    "favoritePlaybackTime",
    "searchSource",
    "lastSearchState.v1",
]);

function createPersistentStorageClient() {
    let availabilityPromise = null;
    let remoteAvailable = false;

    const checkAvailability = async () => {
        if (availabilityPromise) {
            return availabilityPromise;
        }
        availabilityPromise = (async () => {
            try {
                const url = new URL(REMOTE_STORAGE_ENDPOINT, window.location.origin);
                url.searchParams.set("status", "1");
                const response = await fetch(url.toString(), { method: "GET" });
                if (!response.ok) {
                    return false;
                }
                const result = await response.json().catch(() => ({}));
                remoteAvailable = Boolean(result && result.d1Available);
                return remoteAvailable;
            } catch (error) {
                console.warn("检查远程存储可用性失败", error);
                return false;
            }
        })();
        return availabilityPromise;
    };

    const getItems = async (keys = []) => {
        const available = await checkAvailability();
        if (!available || !Array.isArray(keys) || keys.length === 0) {
            return null;
        }
        try {
            const url = new URL(REMOTE_STORAGE_ENDPOINT, window.location.origin);
            url.searchParams.set("keys", keys.join(","));
            const response = await fetch(url.toString(), { method: "GET" });
            if (!response.ok) {
                return null;
            }
            return await response.json();
        } catch (error) {
            console.warn("获取远程存储数据失败", error);
            return null;
        }
    };

    const setItems = async (items) => {
        const available = await checkAvailability();
        if (!available || !items || typeof items !== "object") {
            return false;
        }
        try {
            await fetch(REMOTE_STORAGE_ENDPOINT, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ data: items }),
            });
            return true;
        } catch (error) {
            console.warn("写入远程存储失败", error);
            return false;
        }
    };

    const removeItems = async (keys = []) => {
        const available = await checkAvailability();
        if (!available || !Array.isArray(keys) || keys.length === 0) {
            return false;
        }
        try {
            await fetch(REMOTE_STORAGE_ENDPOINT, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ keys }),
            });
            return true;
        } catch (error) {
            console.warn("删除远程存储数据失败", error);
            return false;
        }
    };

    return {
        checkAvailability,
        getItems,
        setItems,
        removeItems,
    };
}

const persistentStorage = createPersistentStorageClient();

function shouldSyncStorageKey(key) {
    return STORAGE_KEYS_TO_SYNC.has(key);
}

function persistStorageItems(items) {
    if (!items || typeof items !== "object") {
        return;
    }
    persistentStorage.setItems(items).catch((error) => {
        console.warn("同步远程存储失败", error);
    });
}

function removePersistentItems(keys = []) {
    if (!Array.isArray(keys) || keys.length === 0) {
        return;
    }
    persistentStorage.removeItems(keys).catch((error) => {
        console.warn("移除远程存储数据失败", error);
    });
}

function safeGetLocalStorage(key) {
    try {
        return localStorage.getItem(key);
    } catch (error) {
        console.warn(`读取本地存储失败: ${key}`, error);
        return null;
    }
}

function safeSetLocalStorage(key, value, options = {}) {
    const { skipRemote = false } = options;
    try {
        localStorage.setItem(key, value);
    } catch (error) {
        console.warn(`写入本地存储失败: ${key}`, error);
    }
    if (!skipRemote && remoteSyncEnabled && shouldSyncStorageKey(key)) {
        persistStorageItems({ [key]: value });
    }
}

function safeRemoveLocalStorage(key, options = {}) {
    const { skipRemote = false } = options;
    try {
        localStorage.removeItem(key);
    } catch (error) {
        console.warn(`移除本地存储失败: ${key}`, error);
    }
    if (!skipRemote && remoteSyncEnabled && shouldSyncStorageKey(key)) {
        removePersistentItems([key]);
    }
}

function parseJSON(value, fallback) {
    if (!value) return fallback;
    try {
        const parsed = JSON.parse(value);
        return parsed;
    } catch (error) {
        console.warn("解析本地存储 JSON 失败", error);
        return fallback;
    }
}

function cloneSearchResults(results) {
    if (!Array.isArray(results)) {
        return [];
    }
    try {
        return JSON.parse(JSON.stringify(results));
    } catch (error) {
        console.warn("复制搜索结果失败，回退到浅拷贝", error);
        return results.map((item) => {
            if (item && typeof item === "object") {
                return { ...item };
            }
            return item;
        });
    };
}

function sanitizeStoredSearchState(data, defaultSource = SOURCE_OPTIONS[0].value) {
    if (!data || typeof data !== "object") {
        return null;
    }

    const keyword = typeof data.keyword === "string" ? data.keyword : "";
    const sourceValue = typeof data.source === "string" ? data.source : defaultSource;
    const source = normalizeSource(sourceValue);
    const page = Number.isInteger(data.page) && data.page > 0 ? data.page : 1;
    const hasMore = typeof data.hasMore === "boolean" ? data.hasMore : true;
    const results = cloneSearchResults(data.results);

    return { keyword, source, page, hasMore, results };
}

function loadStoredPalettes() {
    const stored = safeGetLocalStorage(PALETTE_STORAGE_KEY);
    if (!stored) {
        return;
    }

    try {
        const entries = JSON.parse(stored);
        if (Array.isArray(entries)) {
            for (const entry of entries) {
                if (Array.isArray(entry) && typeof entry[0] === "string" && entry[1] && typeof entry[1] === "object") {
                    paletteCache.set(entry[0], entry[1]);
                }
            }
        }
    } catch (error) {
        console.warn("解析调色板缓存失败", error);
    }
}

function persistPaletteCache() {
    const maxEntries = 20;
    const entries = Array.from(paletteCache.entries()).slice(-maxEntries);
    try {
        safeSetLocalStorage(PALETTE_STORAGE_KEY, JSON.stringify(entries));
    } catch (error) {
        console.warn("保存调色板缓存失败", error);
    }
}

function preferHttpsUrl(url) {
    if (!url || typeof url !== "string") return url;

    try {
        const parsedUrl = new URL(url, window.location.href);
        if (parsedUrl.protocol === "http:" && window.location.protocol === "https:") {
            parsedUrl.protocol = "https:";
            return parsedUrl.toString();
        }
        return parsedUrl.toString();
    } catch (error) {
        if (window.location.protocol === "https:" && url.startsWith("http://")) {
            return "https://" + url.substring("http://".length);
        }
        return url;
    }
}

function toAbsoluteUrl(url) {
    if (!url) {
        return "";
    }

    try {
        const absolute = new URL(url, window.location.href);
        return absolute.href;
    } catch (_) {
        return url;
    }
}

function buildAudioProxyUrl(url) {
    if (!url || typeof url !== "string") return url;

    try {
        const parsedUrl = new URL(url, window.location.href);
        if (parsedUrl.protocol === "https:") {
            return parsedUrl.toString();
        }

        if (parsedUrl.protocol === "http:" && /(^|\.)kuwo\.cn$/i.test(parsedUrl.hostname)) {
            return `${API.baseUrl}?target=${encodeURIComponent(parsedUrl.toString())}`;
        }

        return parsedUrl.toString();
    } catch (error) {
        console.warn("无法解析音频地址，跳过代理", error);
        return url;
    }
}

const SOURCE_OPTIONS = [
    { value: "netease", label: "网易云音乐" },
    { value: "kuwo", label: "酷我音乐" },
    { value: "joox", label: "JOOX音乐" }
];

function normalizeSource(value) {
    const allowed = SOURCE_OPTIONS.map(option => option.value);
    return allowed.includes(value) ? value : SOURCE_OPTIONS[0].value;
}

const QUALITY_OPTIONS = [
    { value: "128", label: "标准音质", description: "128 kbps" },
    { value: "192", label: "高品音质", description: "192 kbps" },
    { value: "320", label: "极高音质", description: "320 kbps" },
    { value: "999", label: "无损音质", description: "FLAC" }
];

function normalizeQuality(value) {
    const match = QUALITY_OPTIONS.find(option => option.value === value);
    return match ? match.value : "320";
}

const savedPlaylistSongs = (() => {
    const stored = safeGetLocalStorage("playlistSongs");
    const playlist = parseJSON(stored, []);
    return Array.isArray(playlist) ? playlist : [];
})();

const PLAYLIST_EXPORT_VERSION = 1;

const savedFavoriteSongs = (() => {
    const stored = safeGetLocalStorage("favoriteSongs");
    const favorites = parseJSON(stored, []);
    return Array.isArray(favorites) ? favorites : [];
})();

const FAVORITE_EXPORT_VERSION = 1;

const savedCurrentFavoriteIndex = (() => {
    const stored = safeGetLocalStorage("currentFavoriteIndex");
    const index = Number.parseInt(stored, 10);
    return Number.isInteger(index) && index >= 0 ? index : 0;
})();

const savedFavoritePlayMode = (() => {
    const stored = safeGetLocalStorage("favoritePlayMode");
    const normalized = stored === "order" ? "list" : stored;
    const modes = ["list", "single", "random"];
    return modes.includes(normalized) ? normalized : "list";
})();

const savedFavoritePlaybackTime = (() => {
    const stored = safeGetLocalStorage("favoritePlaybackTime");
    const time = Number.parseFloat(stored);
    return Number.isFinite(time) && time >= 0 ? time : 0;
})();

const savedCurrentList = (() => {
    const stored = safeGetLocalStorage("currentList");
    return stored === "favorite" ? "favorite" : "playlist";
})();

const savedCurrentTrackIndex = (() => {
    const stored = safeGetLocalStorage("currentTrackIndex");
    const index = Number.parseInt(stored, 10);
    return Number.isInteger(index) ? index : -1;
})();

const savedPlayMode = (() => {
    const stored = safeGetLocalStorage("playMode");
    const modes = ["list", "single", "random"];
    return modes.includes(stored) ? stored : "list";
})();

const savedPlaybackQuality = normalizeQuality(safeGetLocalStorage("playbackQuality"));

const savedVolume = (() => {
    const stored = safeGetLocalStorage("playerVolume");
    const volume = Number.parseFloat(stored);
    if (Number.isFinite(volume)) {
        return Math.min(Math.max(volume, 0), 1);
    }
    return 0.8;
})();

const savedSearchSource = (() => {
    const stored = safeGetLocalStorage("searchSource");
    return normalizeSource(stored);
})();

const LAST_SEARCH_STATE_STORAGE_KEY = "lastSearchState.v1";

const savedLastSearchState = (() => {
    const stored = safeGetLocalStorage(LAST_SEARCH_STATE_STORAGE_KEY);
    const parsed = parseJSON(stored, null);
    return sanitizeStoredSearchState(parsed, savedSearchSource || SOURCE_OPTIONS[0].value);
})();

let lastSearchStateCache = savedLastSearchState
    ? { ...savedLastSearchState, results: cloneSearchResults(savedLastSearchState.results) }
    : null;

const savedPlaybackTime = (() => {
    const stored = safeGetLocalStorage("currentPlaybackTime");
    const time = Number.parseFloat(stored);
    return Number.isFinite(time) && time >= 0 ? time : 0;
})();

const savedCurrentSong = (() => {
    const stored = safeGetLocalStorage("currentSong");
    return parseJSON(stored, null);
})();

const savedCurrentPlaylist = (() => {
    const stored = safeGetLocalStorage("currentPlaylist");
    const playlists = ["playlist", "online", "search", "favorites"];
    return playlists.includes(stored) ? stored : "playlist";
})();

// API配置 - 修改为多源自动切换
const API_ENDPOINTS = [
    { name: '默认', url: '/proxy', type: 'proxy' },
    { name: 'qijieya', url: 'https://163api.qijieya.cn', type: 'direct' },
    { name: 'xhily', url: 'https://wyy.xhily.com', type: 'direct' },
    { name: 'armoe', url: 'https://zm.armoe.cn', type: 'direct' },
    { name: 'heheda', url: 'https://music-api.heheda.top', type: 'direct' }
];
let currentApiIndex = 0;
let apiRetryCount = 0;
const MAX_RETRY_PER_API = 2;

const API = {
    getCurrentEndpoint: () => API_ENDPOINTS[currentApiIndex],
    switchToNextEndpoint: () => {
        currentApiIndex = (currentApiIndex + 1) % API_ENDPOINTS.length;
        apiRetryCount = 0;
        const endpoint = API_ENDPOINTS[currentApiIndex];
        console.log(`[API] 切换到: ${endpoint.name} (${endpoint.url})`);
        updateApiStatus();
        return endpoint;
    },
    generateSignature: () => {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    },
    fetchJson: async (url) => {
        try {
            const response = await fetch(url, {
                headers: {
                    "Accept": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error(`Request failed with status ${response.status}`);
            }

            const text = await response.text();
            try {
                return JSON.parse(text);
            } catch (parseError) {
                console.warn("JSON parse failed, returning raw text", parseError);
                return text;
            }
        } catch (error) {
            console.error("API request error:", error);
            throw error;
        }
    },
    search: async (keyword, source = "netease", count = 20, page = 1) => {
        const startIndex = currentApiIndex;
        const errors = [];

        for (let i = 0; i < API_ENDPOINTS.length; i++) {
            const endpoint = API_ENDPOINTS[(startIndex + i) % API_ENDPOINTS.length];
            try {
                let url;
                if (endpoint.type === 'proxy') {
                    const signature = API.generateSignature();
                    url = `${endpoint.url}?types=search&source=${source}&name=${encodeURIComponent(keyword)}&count=${count}&pages=${page}&s=${signature}`;
                } else {
                    // 假设第三方API兼容标准netease格式
                    url = `${endpoint.url}/search?keywords=${encodeURIComponent(keyword)}&limit=${count}&offset=${(page - 1) * count}`;
                }
                console.log(`[API] 尝试搜索: ${endpoint.name}`);
                const data = await API.fetchJson(url);

                // 适配不同返回格式
                let results = [];
                if (Array.isArray(data)) {
                    results = data;
                } else if (data.result && data.result.songs) {
                    results = data.result.songs.map(s => ({
                        id: s.id,
                        name: s.name,
                        artist: s.artists ? s.artists.map(a => a.name).join(' / ') : s.artist,
                        album: s.album ? s.album.name : '',
                        pic_id: s.album ? s.album.picId : '',
                        source: source
                    }));
                } else if (data.data) {
                    results = data.data;
                }

                if (results.length > 0) {
                    console.log(`[API] 搜索成功: ${endpoint.name}, 找到${results.length} 条结果`);
                    // 搜索成功后重置索引，下次优先用默认
                    currentApiIndex = 0;
                    updateApiStatus();
                    return results;
                }
                throw new Error("搜索结果为空");
            } catch (error) {
                errors.push(`${endpoint.name}: ${error.message}`);
                console.warn(`[API] 搜索 ${endpoint.name} 失败`, error.message);
            }
        }
        throw new Error(`所有API源搜索均失败: ${errors.join('; ')}`);
    },
    getRadarPlaylist: async (playlistId = "3778678", options = {}) => {
        const signature = API.generateSignature();
        let limit = 50;
        let offset = 0;
        if (typeof options === "number") {
            limit = options;
        } else if (options && typeof options === "object") {
            if (Number.isFinite(options.limit)) limit = options.limit;
            else if (Number.isFinite(options.count)) limit = options.count;
            if (Number.isFinite(options.offset)) offset = options.offset;
        }
        limit = Math.max(1, Math.min(200, Math.trunc(limit)) || 50);
        offset = Math.max(0, Math.trunc(offset) || 0);
        const params = new URLSearchParams({
            types: "playlist",
            id: playlistId,
            limit: String(limit),
            offset: String(offset),
            s: signature,
        });
        const url = `${API_ENDPOINTS[0].url}?${params.toString()}`;
        try {
            const data = await API.fetchJson(url);
            const tracks = data && data.playlist && Array.isArray(data.playlist.tracks)
                ? data.playlist.tracks.slice(0, limit)
                : [];
            if (tracks.length === 0) throw new Error("No tracks found");
            return tracks.map(track => ({
                id: track.id,
                name: track.name,
                artist: Array.isArray(track.ar) ? track.ar.map(artist => artist.name).join(" / ") : "",
                source: "netease",
                lyric_id: track.id,
                pic_id: track.al?.pic_str || track.al?.pic || track.al?.picUrl || "",
            }));
        } catch (error) {
            console.error("API request failed:", error);
            throw error;
        }
    },
    getAudioUrlWithFallback: async (song, quality = "320") => {
        const errors = [];
        const startIndex = currentApiIndex;

        for (let i = 0; i < API_ENDPOINTS.length; i++) {
            const endpoint = API_ENDPOINTS[(startIndex + i) % API_ENDPOINTS.length];
            try {
                let url;
                if (endpoint.type === 'proxy') {
                    const signature = API.generateSignature();
                    url = `${endpoint.url}?types=url&id=${song.id}&source=${song.source || "netease"}&br=${quality}&s=${signature}`;
                } else {
                    // 适配第三方API格式
                    url = `${endpoint.url}/song/url?id=${song.id}&br=${quality}`;
                }
                console.log(`[API] 尝试获取音频: ${endpoint.name}`);
                const data = await API.fetchJson(url);
                if (data && (data.url || data.data || data.result)) {
                    const actualUrl = data.url || (data.data && data.data.url) || (data.result && data.result.url);
                    if (actualUrl) {
                        console.log(`[API] 成功获取音频: ${endpoint.name}`);
                        return { url: actualUrl, source: endpoint.name };
                    }
                }
                throw new Error("返回数据无效");
            } catch (error) {
                errors.push(`${endpoint.name}: ${error.message}`);
                console.warn(`[API] ${endpoint.name} 失败:`, error.message);
            }
        }
        throw new Error(`所有API源均无法获取音频: ${errors.join('; ')}`);
    },
    getSongUrl: (song, quality = "320") => {
        const signature = API.generateSignature();
        return `${API_ENDPOINTS[0].url}?types=url&id=${song.id}&source=${song.source || "netease"}&br=${quality}&s=${signature}`;
    },
    getLyric: (song) => {
        const signature = API.generateSignature();
        return `${API_ENDPOINTS[0].url}?types=lyric&id=${song.lyric_id || song.id}&source=${song.source || "netease"}&s=${signature}`;
    },
    getPicUrl: (song) => {
        const signature = API.generateSignature();
        return `${API_ENDPOINTS[0].url}?types=pic&id=${song.pic_id}&source=${song.source || "netease"}&size=300&s=${signature}`;
    }
};

Object.freeze(API);

function updateApiStatus() {
    const statusEl = document.getElementById('apiStatus');
    const textEl = document.getElementById('apiStatusText');
    const indicatorEl = document.querySelector('.api-indicator');
    if (statusEl && textEl) {
        const current = API.getCurrentEndpoint();
        textEl.textContent = current.name;
        if (indicatorEl) {
            if (currentApiIndex === 0) indicatorEl.style.background = '#2ecc71'; // 绿色
            else indicatorEl.style.background = '#f39c12'; // 橙色（表示使用了备用API）
        }
    }
}

const state = {
    onlineSongs: [],
    searchResults: cloneSearchResults(savedLastSearchState?.results) || [],
    renderedSearchCount: 0,
    currentTrackIndex: savedCurrentTrackIndex,
    currentAudioUrl: null,
    lyricsData: [],
    currentLyricLine: -1,
    currentPlaylist: savedCurrentPlaylist,
    searchPage: savedLastSearchState?.page || 1,
    searchKeyword: savedLastSearchState?.keyword || "",
    searchSource: savedLastSearchState ? savedLastSearchState.source : savedSearchSource,
    hasMoreResults: typeof savedLastSearchState?.hasMore === "boolean" ? savedLastSearchState.hasMore : true,
    currentSong: savedCurrentSong,
    currentArtworkUrl: null,
    debugMode: false,
    isSearchMode: false,
    playlistSongs: savedPlaylistSongs,
    playMode: savedPlayMode,
    playlistLastNonRandomMode: savedPlayMode === "random" ? "list" : savedPlayMode,
    favoriteSongs: savedFavoriteSongs,
    currentFavoriteIndex: savedCurrentFavoriteIndex,
    currentList: savedCurrentList,
    favoritePlayMode: savedFavoritePlayMode,
    favoriteLastNonRandomMode: savedFavoritePlayMode === "random" ? "list" : savedFavoritePlayMode,
    favoritePlaybackTime: savedFavoritePlaybackTime,
    playbackQuality: savedPlaybackQuality,
    volume: savedVolume,
    currentPlaybackTime: savedPlaybackTime,
    lastSavedPlaybackTime: savedPlaybackTime,
    favoriteLastSavedPlaybackTime: savedFavoritePlaybackTime,
    pendingSeekTime: null,
    isSeeking: false,
    qualityMenuOpen: false,
    sourceMenuOpen: false,
    userScrolledLyrics: false,
    lyricsScrollTimeout: null,
    themeDefaultsCaptured: false,
    dynamicPalette: null,
    currentPaletteImage: null,
    pendingPaletteData: null,
    pendingPaletteImage: null,
    pendingPaletteImmediate: false,
    pendingPaletteReady: false,
    audioReadyForPalette: true,
    currentGradient: '',
    isMobileInlineLyricsOpen: false,
    selectedSearchResults: new Set(),
    searchMode: "song", // 新增：搜索模式，默认歌曲
    favoritePlaylists: [], // 新增：收藏的歌单
    currentPlaylistView: "songs", // 新增：当前视图（songs/playlists）
};

let importSelectedMenuOutsideHandler = null;

if (state.currentList === "favorite" && (!Array.isArray(state.favoriteSongs) || state.favoriteSongs.length === 0)) {
    state.currentList = "playlist";
}
if (state.currentList === "favorite") {
    state.currentPlaylist = "favorites";
}
state.favoriteSongs = state.favoriteSongs
    .map((song) => sanitizeImportedSong(song) || song)
    .filter((song) => song && typeof song === "object");
if (!Array.isArray(state.favoriteSongs) || state.favoriteSongs.length === 0) {
    state.currentFavoriteIndex = 0;
} else if (state.currentFavoriteIndex >= state.favoriteSongs.length) {
    state.currentFavoriteIndex = state.favoriteSongs.length - 1;
}
saveFavoriteState();

// ... (Bootstrap functions kept mostly same, omitted for brevity but present in final file) ...

// 新增：搜索歌单
async function searchPlaylists(keyword) {
    try {
        dom.searchBtn.disabled = true;
        dom.searchBtn.innerHTML = '<span class="loader"></span><span>搜索中...</span>';
        showSearchResults();
        // 调用歌单搜索API（这里使用默认代理接口，实际API格式需确认）
        const source = normalizeSource(state.searchSource);
        const url = `${API_ENDPOINTS[0].url}?types=searchPlaylist&source=${source}&name=${encodeURIComponent(keyword)}`;
        const data = await API.fetchJson(url);
        
        if (!Array.isArray(data)) {
            throw new Error("搜索结果格式错误");
        }
        // 转换为统一格式
        state.searchResults = data.map(pl => ({
            id: pl.id,
            name: pl.name,
            cover: pl.cover,
            source: pl.source || source,
            type: "playlist",
            trackCount: pl.trackCount || 0
        }));
        displayPlaylistResults(state.searchResults);
    } catch (error) {
        console.error("搜索歌单失败:", error);
        showNotification("搜索歌单失败，该音源可能不支持歌单搜索", "error");
    } finally {
        dom.searchBtn.disabled = false;
        dom.searchBtn.innerHTML = '<i class="fas fa-search"></i><span>搜索</span>';
    }
}

// 新增：显示歌单搜索结果
function displayPlaylistResults(playlists) {
    const container = dom.searchResultsList || dom.searchResults;
    if (!container) return;
    container.innerHTML = "";
    if (playlists.length === 0) {
        container.innerHTML = "<div style=\"text-align: center; color: var(--text-secondary-color); padding: 20px;\">未找到相关歌单</div>";
        return;
    }
    playlists.forEach((pl, index) => {
        const item = document.createElement("div");
        item.className = "search-result-item playlist-result";
        item.dataset.index = index;
        item.innerHTML = `
            <div class="search-result-info">
                <div class="search-result-title">${pl.name}</div>
                <div class="search-result-artist">${pl.trackCount} 首歌曲· ${pl.source}</div>
            </div>
            <div class="search-result-actions">
                <button class="action-btn play" onclick="playPlaylist('${pl.id}', '${pl.source}')" title="播放歌单">
                    <i class="fas fa-play"></i>
                </button>
                <button class="action-btn favorite" onclick="favoritePlaylist(${index})" title="收藏歌单">
                    <i class="far fa-heart"></i>
                </button>
            </div>
        `;
        container.appendChild(item);
    });
}

// 新增：播放歌单（加载歌单内歌曲）
async function playPlaylist(playlistId, source) {
    try {
        showNotification("正在加载歌单...");
        // 调用获取歌单详情的API
        const url = `${API_ENDPOINTS[0].url}?types=playlist&id=${playlistId}&source=${source}`;
        const data = await API.fetchJson(url);
        if (data && data.tracks && Array.isArray(data.tracks)) {
            // 将歌单歌曲添加到播放列表
            const songs = data.tracks.map(track => ({
                id: track.id,
                name: track.name,
                artist: track.artist,
                source: track.source || source,
                pic_id: track.pic_id,
                lyric_id: track.lyric_id
            }));
            // 添加到播放列表
            songs.forEach(song => addSongToPlaylist(song));
            renderPlaylist();
            // 播放第一首
            if (songs.length > 0) {
                playSong(songs[0]);
                showNotification(`已加载歌单：${data.name || '未知歌单'}`);
            }
        }
    } catch (error) {
        console.error("加载歌单失败:", error);
        showNotification("加载歌单失败", "error");
    }
}

// 新增：收藏歌单
function favoritePlaylist(index) {
    const playlist = state.searchResults[index];
    if (!playlist || playlist.type !== "playlist") return;
    // 检查是否已收藏
    const exists = state.favoritePlaylists.some(fp => fp.id === playlist.id && fp.source === playlist.source);
    if (exists) {
        showNotification("该歌单已在收藏中", "warning");
        return;
    }
    state.favoritePlaylists.push(playlist);
    saveFavoritePlaylists();
    showNotification("已收藏歌单", "success");
}

// 新增：保存收藏的歌单
function saveFavoritePlaylists() {
    safeSetLocalStorage("favoritePlaylists", JSON.stringify(state.favoritePlaylists));
}

// 新增：渲染收藏的歌单（在歌单收藏标签页中显示）
function renderFavoritePlaylists() {
    const container = document.getElementById("favoritePlaylistItems");
    if (!container) return;
    if (state.favoritePlaylists.length === 0) {
        container.innerHTML = "<div style=\"text-align: center; color: var(--text-secondary-color); padding: 20px;\">暂无收藏的歌单</div>";
        return;
    }
    container.innerHTML = state.favoritePlaylists.map((pl, index) => `
        <div class="playlist-item" data-index="${index}" data-type="playlist">
            <span>${pl.name}</span>
            <span style="color: var(--text-secondary-color); font-size: 0.9em;">(${pl.trackCount}首)</span>
            <button class="playlist-item-favorite" onclick="removeFavoritePlaylist(${index})" style="opacity: 1;" title="取消收藏">
                <i class="fas fa-heart"></i>
            </button>
        </div>
    `).join("");
}

// 新增：移除收藏的歌单
function removeFavoritePlaylist(index) {
    state.favoritePlaylists.splice(index, 1);
    saveFavoritePlaylists();
    renderFavoritePlaylists();
    showNotification("已取消收藏", "success");
}

// 新增：搜索模式切换逻辑
function initSearchModeToggle() {
    const modeBtn = document.getElementById("searchModeButton");
    const modeMenu = document.getElementById("searchModeMenu");
    const modeLabel = document.getElementById("searchModeLabel");
    if (!modeBtn || !modeMenu) return;
    
    // 切换菜单显示
    modeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const isOpen = modeMenu.classList.contains("show");
        if (isOpen) {
            modeMenu.classList.remove("show");
            modeBtn.classList.remove("active");
            modeBtn.setAttribute("aria-expanded", "false");
        } else {
            modeMenu.classList.add("show");
            modeBtn.classList.add("active");
            modeBtn.setAttribute("aria-expanded", "true");
        }
    });

    // 选择模式
    modeMenu.querySelectorAll(".search-mode-option").forEach(option => {
        option.addEventListener("click", (e) => {
            e.stopPropagation();
            const mode = option.dataset.mode;
            state.searchMode = mode;
            // 更新UI
            modeMenu.querySelectorAll(".search-mode-option").forEach(opt => {
                opt.classList.remove("active");
                opt.setAttribute("aria-selected", "false");
                const check = opt.querySelector("i");
                if (check) check.style.visibility = "hidden";
            });
            option.classList.add("active");
            option.setAttribute("aria-selected", "true");
            const check = option.querySelector("i");
            if (check) check.style.visibility = "visible";
            // 更新按钮文字
            modeLabel.textContent = option.querySelector("span").textContent;
            // 关闭菜单
            modeMenu.classList.remove("show");
            modeBtn.classList.remove("active");
            modeBtn.setAttribute("aria-expanded", "false");
            // 切换placeholder
            const searchInput = document.getElementById("searchInput");
            if (searchInput) {
                searchInput.placeholder = mode === "song" ? "搜索歌曲、歌手或专辑..." : "搜索歌单...";
            }
        });
    });

    // 点击外部关闭
    document.addEventListener("click", () => {
        modeMenu.classList.remove("show");
        modeBtn.classList.remove("active");
        modeBtn.setAttribute("aria-expanded", "false");
    });

    // 初始化选中状态
    const defaultOption = modeMenu.querySelector('[data-mode="song"]');
    if (defaultOption) {
        const check = defaultOption.querySelector("i");
        if (check) check.style.visibility = "visible";
    }
}

// ... (Existing functions kept but slightly modified where noted) ...

// 修改 performSearch 以支持歌单
async function performSearch(isLiveSearch = false) {
    const query = dom.searchInput.value.trim();
    if (!query) {
        showNotification("请输入搜索关键词", "error");
        return;
    }

    if (state.sourceMenuOpen) {
        closeSourceMenu();
    }

    const source = normalizeSource(state.searchSource);
    state.searchSource = source;
    safeSetLocalStorage("searchSource", source);
    updateSourceLabel();
    buildSourceMenu();

    if (!isLiveSearch) {
        state.searchPage = 1;
        state.searchKeyword = query;
        state.searchSource = source;
        state.searchResults = [];
        state.hasMoreResults = true;
        state.renderedSearchCount = 0;
        resetSelectedSearchResults();
        const listContainer = dom.searchResultsList || dom.searchResults;
        if (listContainer) {
            listContainer.innerHTML = "";
        }
        debugLog(`开始新搜索: ${query}, 来源: ${source}`);
    } else {
        state.searchKeyword = query;
        state.searchSource = source;
    }

    try {
        dom.searchBtn.disabled = true;
        dom.searchBtn.innerHTML = '<span class="loader"></span><span>搜索中...</span>';

        showSearchResults();
        debugLog("已切换到搜索模式");

        let results;
        try {
            // 新增：根据搜索模式决定搜索类型
            if (state.searchMode === "playlist") {
                await searchPlaylists(query);
                dom.searchBtn.disabled = false;
                dom.searchBtn.innerHTML = '<i class="fas fa-search"></i><span>搜索</span>';
                return;
            }
            
            results = await API.search(query, source, 20, state.searchPage);
            debugLog(`API返回结果数量: ${results.length}`);

            if (state.searchPage === 1) {
                state.searchResults = results;
            } else {
                state.searchResults = [...state.searchResults, ...results];
            }

            state.hasMoreResults = results.length === 20;

            displaySearchResults(results, {
                reset: state.searchPage === 1,
                totalCount: state.searchResults.length,
            });
            persistLastSearchState();
            debugLog(`搜索完成: 总共显示 ${state.searchResults.length} 个结果`);

            if (state.searchResults.length === 0) {
                showNotification("未找到相关歌曲", "error");
            }

        } catch (error) {
            console.error("搜索失败:", error);
            showNotification("搜索失败，请稍后重试", "error");
            hideSearchResults();
            debugLog(`搜索失败: ${error.message}`);
        } finally {
            dom.searchBtn.disabled = false;
            dom.searchBtn.innerHTML = '<i class="fas fa-search"></i><span>搜索</span>';
        }
    } catch (error) {
        console.error("搜索失败:", error);
        showNotification("搜索失败，请稍后重试", "error");
        hideSearchResults();
        debugLog(`搜索失败: ${error.message}`);
    } finally {
        dom.searchBtn.disabled = false;
        dom.searchBtn.innerHTML = '<i class="fas fa-search"></i><span>搜索</span>';
    }
}

// ... (Existing loadMoreResults, createSearchResultItem, etc. remain same) ...

// 修改 playSong 以支持API切换
async function playSong(song, options = {}) {
    const { autoplay = true, startTime = 0, preserveProgress = false } = options;

    window.clearTimeout(pendingPaletteTimer);
    state.audioReadyForPalette = false;
    state.pendingPaletteData = null;
    state.pendingPaletteImage = null;
    state.pendingPaletteImmediate = false;
    state.pendingPaletteReady = false;

    try {
        updateCurrentSongInfo(song, { loadArtwork: false });

        let audioData;
        let usedEndpoint;
        try {
            // 使用新的带fallback 的音频获取方法
            const result = await API.getAudioUrlWithFallback(song, state.playbackQuality);
            audioData = { url: result.url };
            usedEndpoint = result.source;
            debugLog(`使用API 源: ${usedEndpoint}, URL: ${result.url.substring(0, 50)}...`);
        } catch (error) {
            console.error("所有API 源均无法获取音频:", error);
            throw new Error('无法获取音频播放地址，所有API 源均不可用');
        }

        state.currentSong = song;
        state.currentAudioUrl = null;

        dom.audioPlayer.pause();

        if (state.currentList === "favorite") {
            if (!preserveProgress) {
                state.favoritePlaybackTime = 0;
                state.favoriteLastSavedPlaybackTime = 0;
                safeSetLocalStorage('favoritePlaybackTime', '0');
            } else if (startTime > 0) {
                state.favoritePlaybackTime = startTime;
                state.favoriteLastSavedPlaybackTime = startTime;
            }
        } else {
            if (!preserveProgress) {
                state.currentPlaybackTime = 0;
                state.lastSavedPlaybackTime = 0;
                safeSetLocalStorage('currentPlaybackTime', '0');
            } else if (startTime > 0) {
                state.currentPlaybackTime = startTime;
                state.lastSavedPlaybackTime = startTime;
            }
        }

        state.pendingSeekTime = startTime > 0 ? startTime : null;

        let selectedAudioUrl = null;
        let lastAudioError = null;
        let usedFallbackAudio = false;

        selectedAudioUrl = audioData.url;

        if (audioData.url) {
            dom.audioPlayer.src = audioData.url;
            dom.audioPlayer.load();

            try {
                await waitForAudioReady(dom.audioPlayer);
                selectedAudioUrl = audioData.url;
                usedFallbackAudio = false; // Assume success
            } catch (error) {
                lastAudioError = error;
                console.warn('音频元数据加载异常', error);
                // Retry logic is handled inside getAudioUrlWithFallback mostly
            }
        }

        if (!selectedAudioUrl) {
            throw lastAudioError || new Error('音频加载失败');
        }

        state.currentAudioUrl = selectedAudioUrl;

        if (state.pendingSeekTime != null) {
            setAudioCurrentTime(state.pendingSeekTime);
            state.pendingSeekTime = null;
        } else {
            setAudioCurrentTime(dom.audioPlayer.currentTime || 0);
        }

        state.lastSavedPlaybackTime = state.currentPlaybackTime;

        let playPromise = null;

        if (autoplay) {
            playPromise = dom.audioPlayer.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.error('播放失败:', error);
                    showNotification('播放失败，请检查网络连接', 'error');
                });
            } else {
                playPromise = null;
            }
        } else {
            dom.audioPlayer.pause();
            updatePlayPauseButton();
        }

        scheduleDeferredSongAssets(song, playPromise);

        debugLog(`开始播放: ${song.name} @${state.playbackQuality}`);

        if (typeof window.__SOLARA_UPDATE_MEDIA_METADATA === 'function') {
            window.__SOLARA_UPDATE_MEDIA_METADATA();
        }
    } catch (error) {
        console.error('播放歌曲失败:', error);
        throw error;
    } finally {
        savePlayerState();
    }
}

// ... (Existing utility functions: switchLibraryTab, togglePlayMode, etc.) ...

// 修改 switchLibraryTab 支持歌单收藏标签
function switchLibraryTab(target) {
    const showFavorites = target === "favorites";
    const showPlaylistFavorites = target === "playlistFavorites";
    
    if (Array.isArray(dom.libraryTabs) && dom.libraryTabs.length > 0) {
        dom.libraryTabs.forEach((tab) => {
            if (!(tab instanceof HTMLElement)) {
                return;
            }
            const tabTarget = tab.dataset.target === "favorites" ? "favorites" :
                tab.dataset.target === "playlistFavorites" ? "playlistFavorites" : "playlist";
            const isActive = (showFavorites && tabTarget === "favorites") ||
                (showPlaylistFavorites && tabTarget === "playlistFavorites") ||
                (!showFavorites && !showPlaylistFavorites && tabTarget === "playlist");
            tab.classList.toggle("active", isActive);
            tab.setAttribute("aria-selected", isActive ? "true" : "false");
        });
    }

    if (dom.playlist) {
        dom.playlist.classList.toggle("active", !showFavorites && !showPlaylistFavorites);
        dom.playlist.setAttribute("hidden", (showFavorites || showPlaylistFavorites) ? "" : null);
    }

    if (dom.favorites) {
        dom.favorites.classList.toggle("active", showFavorites);
        dom.favorites.setAttribute("hidden", showFavorites ? null : "");
    }
    
    // 新增：歌单收藏面板
    const playlistFavPanel = document.getElementById("playlistFavorites");
    if (playlistFavPanel) {
        playlistFavPanel.classList.toggle("active", showPlaylistFavorites);
        playlistFavPanel.setAttribute("hidden", showPlaylistFavorites ? null : "");
        if (showPlaylistFavorites) {
            renderFavoritePlaylists();
        }
    }

    updateMobileLibraryActionVisibility(showFavorites);
    updateMobileClearPlaylistVisibility();
    closeImportSelectedMenu();
}

// ... (Existing setupInteractions) ...

// 修改 setupInteractions 末尾，添加初始化和事件监听
// ... existing event listeners ...
// 新增：初始化搜索模式切换
initSearchModeToggle();
// 新增：加载收藏的歌单
const savedFavPlaylists = safeGetLocalStorage("favoritePlaylists");
if (savedFavPlaylists) {
    state.favoritePlaylists = parseJSON(savedFavPlaylists, []);
}

// 新增：歌单收藏操作按钮
const importPlFavBtn = document.getElementById("importPlaylistFavoritesBtn");
const exportPlFavBtn = document.getElementById("exportPlaylistFavoritesBtn");
const clearPlFavBtn = document.getElementById("clearPlaylistFavoritesBtn");
if (importPlFavBtn) {
    importPlFavBtn.addEventListener("click", () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".json";
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const data = JSON.parse(event.target.result);
                    if (Array.isArray(data)) {
                        state.favoritePlaylists = data;
                        saveFavoritePlaylists();
                        renderFavoritePlaylists();
                        showNotification("导入成功", "success");
                    }
                } catch (err) {
                    showNotification("导入失败", "error");
                }
            };
            reader.readAsText(file);
        };
        input.click();
    });
}
if (exportPlFavBtn) {
    exportPlFavBtn.addEventListener("click", () => {
        if (state.favoritePlaylists.length === 0) {
            showNotification("没有可导出的歌单", "warning");
            return;
        }
        const blob = new Blob([JSON.stringify(state.favoritePlaylists, null, 2)], {type: "application/json"});
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `solara-playlist-favorites-${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
        showNotification("导出成功", "success");
    });
}
if (clearPlFavBtn) {
    clearPlFavBtn.addEventListener("click", () => {
        if (state.favoritePlaylists.length === 0) return;
        if (confirm("确定清空所有收藏的歌单吗？")) {
            state.favoritePlaylists = [];
            saveFavoritePlaylists();
            renderFavoritePlaylists();
            showNotification("已清空", "success");
        }
    });
}
