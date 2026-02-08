(function () {
    if (!window.__SOLARA_IS_MOBILE) {
        return;
    }

    const bridge = window.SolaraMobileBridge || {};
    bridge.handlers = bridge.handlers || {};
    bridge.queue = Array.isArray(bridge.queue) ? bridge.queue : [];
    window.SolaraMobileBridge = bridge;

    const dom = window.SolaraDom || {};
    let initialized = false;

    function updateMobileToolbarTitleImpl() {
        if (!dom.mobileToolbarTitle) {
            return;
        }
        dom.mobileToolbarTitle.textContent = "Solara";
    }

    function updateMobileOverlayScrim() {
        if (!dom.mobileOverlayScrim || !document.body) {
            return;
        }
        const hasOverlay = document.body.classList.contains("mobile-search-open") ||
            document.body.classList.contains("mobile-panel-open");
        dom.mobileOverlayScrim.setAttribute("aria-hidden", hasOverlay ? "false" : "true");
    }

    function openMobileSearchImpl() {
        if (!document.body) {
            return;
        }
        document.body.classList.add("mobile-search-open");
        document.body.classList.remove("mobile-panel-open");
        if (dom.searchArea) {
            dom.searchArea.setAttribute("aria-hidden", "false");
        }
        updateMobileOverlayScrim();
        if (dom.searchInput) {
            window.requestAnimationFrame(() => {
                try {
                    dom.searchInput.focus({ preventScroll: true });
                } catch (error) {
                    dom.searchInput.focus();
                }
            });
        }
    }

    function closeMobileSearchImpl() {
        if (!document.body) {
            return;
        }
        document.body.classList.remove("mobile-search-open");
        const toggleSearchMode = window.toggleSearchMode;
        if (typeof toggleSearchMode === "function") {
            toggleSearchMode(false);
        } else if (typeof window.hideSearchResults === "function") {
            window.hideSearchResults();
        }
        if (dom.searchArea) {
            dom.searchArea.setAttribute("aria-hidden", "true");
        }
        if (dom.searchInput) {
            dom.searchInput.blur();
        }
        updateMobileOverlayScrim();
    }

    function toggleMobileSearchImpl() {
        if (!document.body) {
            return;
        }
        if (document.body.classList.contains("mobile-search-open")) {
            closeMobileSearchImpl();
        } else {
            openMobileSearchImpl();
        }
    }

    function normalizePanelView(view) {
        return view === "lyrics" ? "playlist" : (view || "playlist");
    }

    function openMobilePanelImpl(view = "playlist") {
        if (!document.body) {
            return;
        }
        const targetView = normalizePanelView(view);
        if (typeof window.switchMobileView === "function") {
            window.switchMobileView(targetView);
        }
        closeMobileSearchImpl();
        document.body.classList.add("mobile-panel-open");
        document.body.setAttribute("data-mobile-panel-view", targetView);
        updateMobileOverlayScrim();
    }

    function closeMobilePanelImpl() {
        if (!document.body) {
            return;
        }
        document.body.classList.remove("mobile-panel-open");
        updateMobileOverlayScrim();
    }

    function toggleMobilePanelImpl(view = "playlist") {
        if (!document.body) {
            return;
        }
        const isOpen = document.body.classList.contains("mobile-panel-open");
        const currentView = document.body.getAttribute("data-mobile-panel-view") || "playlist";
        const targetView = normalizePanelView(view);
        if (isOpen && (!targetView || currentView === targetView)) {
            closeMobilePanelImpl();
        } else {
            openMobilePanelImpl(targetView || currentView || "playlist");
        }
    }

    function closeAllMobileOverlaysImpl() {
        closeMobileSearchImpl();
        closeMobilePanelImpl();
    }

    // 新增：初始化设置面板
    function initSettingsPanel() {
        const settingsBtn = document.getElementById("mobileSettingsBtn");
        const settingsPanel = document.getElementById("settingsPanel");
        const settingsClose = document.getElementById("settingsClose");
        const fontSizeSlider = document.getElementById("fontSizeSlider");
        const fontSizeLabel = document.getElementById("fontSizeLabel");
        if (!settingsBtn || !settingsPanel) return;
        
        // 加载保存的设置
        const savedTheme = localStorage.getItem("solara-theme") || "light";
        const savedFontSize = localStorage.getItem("solara-font-size") || "3";
        
        // 应用主题
        document.body.setAttribute("data-theme", savedTheme);
        document.body.setAttribute("data-font-size", savedFontSize);
        
        // 更新主题按钮状态
        document.querySelectorAll(".theme-option").forEach(btn => {
            if (btn.dataset.theme === savedTheme) {
                btn.classList.add("active");
            } else {
                btn.classList.remove("active");
            }
            btn.addEventListener("click", () => {
                const theme = btn.dataset.theme;
                document.body.setAttribute("data-theme", theme);
                localStorage.setItem("solara-theme", theme);
                document.querySelectorAll(".theme-option").forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
            });
        });

        // 字体大小标签
        const fontSizeLabels = ["极小", "小", "适中", "大", "极大"];
        if (fontSizeSlider) {
            fontSizeSlider.value = savedFontSize;
            if (fontSizeLabel) fontSizeLabel.textContent = fontSizeLabels[parseInt(savedFontSize) - 1];
            fontSizeSlider.addEventListener("input", (e) => {
                const size = e.target.value;
                document.body.setAttribute("data-font-size", size);
                localStorage.setItem("solara-font-size", size);
                if (fontSizeLabel) fontSizeLabel.textContent = fontSizeLabels[parseInt(size) - 1];
            });
        }

        // 打开设置
        settingsBtn.addEventListener("click", () => {
            settingsPanel.classList.add("show");
            settingsPanel.setAttribute("aria-hidden", "false");
        });

        // 关闭设置
        if (settingsClose) {
            settingsClose.addEventListener("click", () => {
                settingsPanel.classList.remove("show");
                settingsPanel.setAttribute("aria-hidden", "true");
            });
        }

        // 点击外部关闭
        settingsPanel.addEventListener("click", (e) => {
            if (e.target === settingsPanel) {
                settingsPanel.classList.remove("show");
                settingsPanel.setAttribute("aria-hidden", "true");
            }
        });
    }

    function initializeMobileUIImpl() {
        if (initialized || !document.body) {
            return;
        }
        initialized = true;

        document.body.classList.add("mobile-view");
        const initialView = "playlist";
        document.body.setAttribute("data-mobile-panel-view", initialView);
        if (dom.mobilePanelTitle) {
            dom.mobilePanelTitle.textContent = "播放列表";
        }
        if (dom.lyrics) {
            dom.lyrics.classList.remove("active");
        }
        if (dom.playlist) {
            dom.playlist.classList.add("active");
        }

        updateMobileToolbarTitleImpl();

        if (dom.mobileSearchToggle) {
            dom.mobileSearchToggle.addEventListener("click", toggleMobileSearchImpl);
        }
        if (dom.mobileSearchClose) {
            dom.mobileSearchClose.addEventListener("click", closeMobileSearchImpl);
        }
        if (dom.mobilePanelClose) {
            dom.mobilePanelClose.addEventListener("click", closeMobilePanelImpl);
        }
        if (dom.mobileQueueToggle) {
            dom.mobileQueueToggle.addEventListener("click", () => openMobilePanelImpl("playlist"));
        }

        // 初始化设置面板
        initSettingsPanel();

        const handleGlobalPointerDown = (event) => {
            if (!document.body) {
                return;
            }
            const hasOverlay = document.body.classList.contains("mobile-search-open") ||
                document.body.classList.contains("mobile-panel-open");
            if (!hasOverlay) {
                return;
            }

            const target = event.target;
            if (dom.mobilePanel && (dom.mobilePanel === target || dom.mobilePanel.contains(target))) {
                return;
            }
            if (dom.searchArea && (dom.searchArea === target || dom.searchArea.contains(target))) {
                return;
            }
            if (dom.playerQualityMenu && dom.playerQualityMenu.contains(target)) {
                return;
            }
            if (target && typeof target.closest === "function" && target.closest(".quality-menu")) {
                return;
            }

            closeAllMobileOverlaysImpl();
        };

        document.addEventListener("pointerdown", handleGlobalPointerDown, true);
        if (dom.searchArea) {
            dom.searchArea.setAttribute("aria-hidden", "true");
        }
        if (dom.mobileOverlayScrim) {
            dom.mobileOverlayScrim.setAttribute("aria-hidden", "true");
        }

        updateMobileOverlayScrim();
    }

    bridge.handlers.updateToolbarTitle = updateMobileToolbarTitleImpl;
    bridge.handlers.openSearch = openMobileSearchImpl;
    bridge.handlers.closeSearch = closeMobileSearchImpl;
    bridge.handlers.toggleSearch = toggleMobileSearchImpl;
    bridge.handlers.openPanel = openMobilePanelImpl;
    bridge.handlers.closePanel = closeMobilePanelImpl;
    bridge.handlers.togglePanel = toggleMobilePanelImpl;
    bridge.handlers.closeAllOverlays = closeAllMobileOverlaysImpl;
    bridge.handlers.initialize = initializeMobileUIImpl;

    if (bridge.queue.length) {
        const pending = bridge.queue.splice(0, bridge.queue.length);
        for (const entry of pending) {
            const handler = bridge.handlers[entry.name];
            if (typeof handler === "function") {
                handler(...(entry.args || []));
            }
        }
    }
})();
