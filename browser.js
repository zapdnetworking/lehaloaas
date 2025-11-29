/**
 * LeHalo Browser - Tab System & Features
 * 
 * Full-featured tabbed browser interface with:
 * - Multiple tab management
 * - Bookmarks and history
 * - Settings panel
 * - Keyboard shortcuts
 * - Session persistence
 * 
 * @version 1.0.2
 */

// LeHalo Browser - Tab System & Features

class LeHaloBrowser {
    constructor() {
        this.tabs = [];
        this.activeTabId = null;
        this.tabCounter = 0;
        this.bookmarks = this.loadBookmarks();
        this.history = this.loadHistory();
        this.settings = this.loadSettings();
        this.sidebarOpen = false;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupKeyboardShortcuts();
        
        // Check if URL parameter is provided
        const urlParams = new URLSearchParams(window.location.search);
        const initialUrl = urlParams.get('url');
        
        // Create first tab with homepage
        this.createNewTab(initialUrl || '/', true);
        if (!initialUrl) {
            this.loadSavedTabs();
        }
        this.updateUI();
    }

    setupEventListeners() {
        // Navigation buttons
        document.getElementById('btn-back').addEventListener('click', () => this.goBack());
        document.getElementById('btn-forward').addEventListener('click', () => this.goForward());
        document.getElementById('btn-refresh').addEventListener('click', () => this.refresh());
        document.getElementById('btn-home').addEventListener('click', () => this.goHome());

        // Address bar
        const addressInput = document.getElementById('address-input');
        addressInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.navigate();
            }
        });
        document.getElementById('btn-go').addEventListener('click', () => this.navigate());

        // Tab management
        document.getElementById('btn-new-tab').addEventListener('click', () => this.createNewTab());

        // Sidebar
        document.getElementById('btn-sidebar').addEventListener('click', () => this.toggleSidebar());
        document.getElementById('btn-sidebar-close').addEventListener('click', () => this.toggleSidebar());

        // Sidebar tabs
        document.querySelectorAll('.sidebar-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                this.switchSidebarPanel(tab.dataset.panel);
            });
        });

        // Bookmarks
        document.getElementById('btn-bookmark').addEventListener('click', () => this.toggleBookmark());
        document.getElementById('btn-add-bookmark').addEventListener('click', () => this.addBookmarkPrompt());

        // History
        document.getElementById('btn-history').addEventListener('click', () => {
            this.toggleSidebar();
            this.switchSidebarPanel('history');
        });
        document.getElementById('btn-clear-history').addEventListener('click', () => this.clearHistory());

        // Settings
        document.getElementById('btn-settings').addEventListener('click', () => {
            this.toggleSidebar();
            this.switchSidebarPanel('settings');
        });

        // Settings checkboxes
        document.getElementById('setting-tab-cloaking').addEventListener('change', (e) => {
            this.settings.tabCloaking = e.target.checked;
            this.saveSettings();
        });
        document.getElementById('setting-save-tabs').addEventListener('change', (e) => {
            this.settings.saveTabs = e.target.checked;
            this.saveSettings();
        });
        document.getElementById('setting-ad-block').addEventListener('change', (e) => {
            this.settings.adBlock = e.target.checked;
            this.saveSettings();
        });
        document.getElementById('setting-proxy-service').addEventListener('change', (e) => {
            this.settings.proxyService = e.target.value;
            this.saveSettings();
        });
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd combinations
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case 't':
                        e.preventDefault();
                        this.createNewTab();
                        break;
                    case 'w':
                        e.preventDefault();
                        if (this.tabs.length > 1) {
                            this.closeTab(this.activeTabId);
                        }
                        break;
                    case 'r':
                    case 'R':
                        e.preventDefault();
                        this.refresh();
                        break;
                    case 'd':
                        e.preventDefault();
                        this.toggleBookmark();
                        break;
                    case 'h':
                        e.preventDefault();
                        this.toggleSidebar();
                        this.switchSidebarPanel('history');
                        break;
                    case 'b':
                        e.preventDefault();
                        this.toggleSidebar();
                        this.switchSidebarPanel('bookmarks');
                        break;
                    case '1':
                    case '2':
                    case '3':
                    case '4':
                    case '5':
                    case '6':
                    case '7':
                    case '8':
                    case '9':
                        e.preventDefault();
                        const index = parseInt(e.key) - 1;
                        if (this.tabs[index]) {
                            this.switchTab(this.tabs[index].id);
                        }
                        break;
                }
            }

            // Alt combinations
            if (e.altKey) {
                switch (e.key) {
                    case 'ArrowLeft':
                        e.preventDefault();
                        this.goBack();
                        break;
                    case 'ArrowRight':
                        e.preventDefault();
                        this.goForward();
                        break;
                }
            }

            // F5 refresh
            if (e.key === 'F5') {
                e.preventDefault();
                this.refresh();
            }
        });
    }

    createNewTab(url = null, isActive = false) {
        const tabId = `tab-${++this.tabCounter}`;
        // Use homepage for new tabs instead of blank
        const defaultUrl = url || '/';
        const tab = {
            id: tabId,
            url: defaultUrl,
            title: 'LeHalo Home',
            favicon: '/assets/lehalo-icon.png',
            loading: false,
            canGoBack: false,
            canGoForward: false,
            history: [],
            historyIndex: -1
        };

        this.tabs.push(tab);
        
        if (isActive || this.tabs.length === 1) {
            this.activeTabId = tabId;
        }

        this.renderTab(tab);
        this.renderTabContent(tab);
        this.updateUI();

        if (defaultUrl === '/' || defaultUrl === 'about:blank') {
            // Load homepage
            this.loadHomepage(tabId);
        } else {
            this.navigateToUrl(defaultUrl, tabId);
        }

        return tabId;
    }

    renderTab(tab) {
        const tabsContainer = document.getElementById('tabs-container');
        const tabElement = document.createElement('div');
        tabElement.className = `tab ${tab.id === this.activeTabId ? 'active' : ''}`;
        tabElement.dataset.tabId = tab.id;
        tabElement.innerHTML = `
            ${tab.loading ? '<div class="tab-loading"></div>' : `<img src="${tab.favicon || '/assets/lehalo-icon.png'}" class="tab-icon" onerror="this.src='/assets/lehalo-icon.png'">`}
            <span class="tab-title">${this.escapeHtml(tab.title)}</span>
            <button class="tab-close" data-tab-id="${tab.id}">
                <i class="fas fa-times"></i>
            </button>
        `;

        tabElement.addEventListener('click', (e) => {
            if (!e.target.closest('.tab-close')) {
                this.switchTab(tab.id);
            }
        });

        const closeBtn = tabElement.querySelector('.tab-close');
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.closeTab(tab.id);
        });

        tabsContainer.appendChild(tabElement);
    }

    renderTabContent(tab) {
        const contentArea = document.getElementById('browser-content');
        const contentDiv = document.createElement('div');
        contentDiv.className = `tab-content ${tab.id === this.activeTabId ? 'active' : ''}`;
        contentDiv.id = `content-${tab.id}`;
        
        const loadingOverlay = document.createElement('div');
        loadingOverlay.className = `tab-loading-overlay ${tab.loading ? '' : 'hidden'}`;
        loadingOverlay.innerHTML = `
            <div class="loader-pulse"></div>
            <p style="margin-top: 1rem; color: var(--accent-primary);">Loading...</p>
        `;

        const iframe = document.createElement('iframe');
        iframe.className = 'tab-iframe';
        iframe.id = `iframe-${tab.id}`;
        // Enhanced sandbox permissions for full website compatibility
        iframe.sandbox = 'allow-same-origin allow-scripts allow-forms allow-popups allow-modals allow-top-navigation allow-downloads allow-presentation';
        iframe.setAttribute('allow', 'autoplay; encrypted-media; fullscreen; microphone; camera; geolocation');
        
        iframe.addEventListener('load', () => {
            this.onTabLoad(tab.id);
        });

        contentDiv.appendChild(loadingOverlay);
        contentDiv.appendChild(iframe);
        contentArea.appendChild(contentDiv);
    }

    switchTab(tabId) {
        if (!this.tabs.find(t => t.id === tabId)) return;

        this.activeTabId = tabId;
        const tab = this.tabs.find(t => t.id === tabId);

        // Update tab UI
        document.querySelectorAll('.tab').forEach(t => {
            t.classList.remove('active');
            if (t.dataset.tabId === tabId) {
                t.classList.add('active');
            }
        });

        // Update content UI
        document.querySelectorAll('.tab-content').forEach(c => {
            c.classList.remove('active');
            if (c.id === `content-${tabId}`) {
                c.classList.add('active');
            }
        });

        // Update address bar
        this.updateAddressBar(tab.url);
        this.updateNavigationButtons();

        // Tab cloaking
        if (this.settings.tabCloaking) {
            document.title = (tab.title === 'New Tab' || tab.title === 'LeHalo Home') ? 'LeHalo Browser' : tab.title;
        } else {
            document.title = `${tab.title} - LeHalo Browser`;
        }
    }

    closeTab(tabId) {
        if (this.tabs.length <= 1) {
            // Don't close the last tab, just navigate to home
            this.goHome();
            return;
        }

        const tabIndex = this.tabs.findIndex(t => t.id === tabId);
        this.tabs.splice(tabIndex, 1);

        // Remove tab element
        document.querySelector(`[data-tab-id="${tabId}"]`)?.remove();
        document.getElementById(`content-${tabId}`)?.remove();

        // Switch to another tab
        if (this.activeTabId === tabId) {
            const newActiveIndex = Math.min(tabIndex, this.tabs.length - 1);
            this.switchTab(this.tabs[newActiveIndex].id);
        }

        this.updateUI();
    }

    navigate() {
        const addressInput = document.getElementById('address-input');
        const url = addressInput.value.trim();
        
        if (!url) return;

        this.navigateToUrl(url, this.activeTabId);
    }

    navigateToUrl(url, tabId = null) {
        const tab = tabId ? this.tabs.find(t => t.id === tabId) : this.tabs.find(t => t.id === this.activeTabId);
        if (!tab) return;

        // Handle homepage
        if (url === '/' || url === 'about:blank' || url === '') {
            this.loadHomepage(tab.id);
            return;
        }

        // Format URL
        let formattedUrl = url;
        if (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('about:') && !url.startsWith('/')) {
            // Check if it's a search query or URL
            if (url.includes('.') && !url.includes(' ')) {
                formattedUrl = 'https://' + url;
            } else {
                // Search with Google
                formattedUrl = `https://www.google.com/search?q=${encodeURIComponent(url)}`;
            }
        }

        // Add to history
        this.addToHistory(formattedUrl);

        // Update tab
        tab.url = formattedUrl;
        tab.loading = true;
        tab.history.push(formattedUrl);
        tab.historyIndex = tab.history.length - 1;

        // Update UI
        this.updateTabLoading(tab.id, true);
        this.updateAddressBar(formattedUrl);
        this.updateNavigationButtons();

        // Load in iframe
        const iframe = document.getElementById(`iframe-${tab.id}`);
        const proxyService = this.settings.proxyService || 'light';
        const proxyUrl = `/${proxyService}/${encodeURIComponent(formattedUrl)}`;
        iframe.src = proxyUrl;

        // Update title after load
        setTimeout(() => {
            try {
                const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                tab.title = iframeDoc.title || new URL(formattedUrl).hostname;
                this.updateTabTitle(tab.id, tab.title);
            } catch (e) {
                tab.title = new URL(formattedUrl).hostname;
                this.updateTabTitle(tab.id, tab.title);
            }
        }, 1000);
    }

    onTabLoad(tabId) {
        const tab = this.tabs.find(t => t.id === tabId);
        if (!tab) return;

        tab.loading = false;
        this.updateTabLoading(tabId, false);

        const iframe = document.getElementById(`iframe-${tab.id}`);
        try {
            const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
            tab.title = iframeDoc.title || new URL(tab.url).hostname;
            this.updateTabTitle(tabId, tab.title);

            // Try to get favicon
            const faviconLink = iframeDoc.querySelector('link[rel*="icon"]');
            if (faviconLink) {
                tab.favicon = faviconLink.href;
                this.updateTabFavicon(tabId, tab.favicon);
            }
        } catch (e) {
            // Cross-origin restrictions
            tab.title = new URL(tab.url).hostname;
            this.updateTabTitle(tabId, tab.title);
        }

        this.updateNavigationButtons();
    }

    updateTabLoading(tabId, loading) {
        const tab = this.tabs.find(t => t.id === tabId);
        if (!tab) return;

        tab.loading = loading;
        const tabElement = document.querySelector(`[data-tab-id="${tabId}"]`);
        const loadingOverlay = document.getElementById(`content-${tabId}`)?.querySelector('.tab-loading-overlay');
        
        if (tabElement) {
            const icon = tabElement.querySelector('.tab-icon');
            const loadingIndicator = tabElement.querySelector('.tab-loading');
            
            if (loading) {
                if (icon) icon.style.display = 'none';
                if (!loadingIndicator) {
                    const loadingDiv = document.createElement('div');
                    loadingDiv.className = 'tab-loading';
                    tabElement.insertBefore(loadingDiv, tabElement.querySelector('.tab-title'));
                }
            } else {
                if (loadingIndicator) loadingIndicator.remove();
                if (icon) icon.style.display = 'block';
            }
        }

        if (loadingOverlay) {
            loadingOverlay.classList.toggle('hidden', !loading);
        }
    }

    updateTabTitle(tabId, title) {
        const tab = this.tabs.find(t => t.id === tabId);
        if (tab) tab.title = title;

        const tabElement = document.querySelector(`[data-tab-id="${tabId}"]`);
        if (tabElement) {
            const titleElement = tabElement.querySelector('.tab-title');
            if (titleElement) {
                titleElement.textContent = title;
            }
        }

        if (tabId === this.activeTabId) {
            if (this.settings.tabCloaking) {
                document.title = (title === 'New Tab' || title === 'LeHalo Home') ? 'LeHalo Browser' : title;
            } else {
                document.title = `${title} - LeHalo Browser`;
            }
        }
    }

    updateTabFavicon(tabId, favicon) {
        const tab = this.tabs.find(t => t.id === tabId);
        if (tab) tab.favicon = favicon;

        const tabElement = document.querySelector(`[data-tab-id="${tabId}"]`);
        if (tabElement) {
            const iconElement = tabElement.querySelector('.tab-icon');
            if (iconElement && favicon) {
                iconElement.src = favicon;
            }
        }
    }

    updateAddressBar(url) {
        const addressInput = document.getElementById('address-input');
        const addressIcon = document.getElementById('address-icon');
        
        addressInput.value = url === 'about:blank' ? '' : url;
        
        if (url.startsWith('https://')) {
            addressIcon.className = 'fas fa-lock address-icon';
            addressIcon.style.color = 'var(--accent-primary)';
        } else if (url.startsWith('http://')) {
            addressIcon.className = 'fas fa-unlock address-icon';
            addressIcon.style.color = 'var(--text-secondary)';
        } else {
            addressIcon.className = 'fas fa-globe address-icon';
            addressIcon.style.color = 'var(--text-secondary)';
        }
    }

    updateNavigationButtons() {
        const tab = this.tabs.find(t => t.id === this.activeTabId);
        if (!tab) return;

        document.getElementById('btn-back').disabled = !tab.canGoBack;
        document.getElementById('btn-forward').disabled = !tab.canGoForward;
    }

    goBack() {
        const tab = this.tabs.find(t => t.id === this.activeTabId);
        if (!tab || tab.historyIndex <= 0) return;

        tab.historyIndex--;
        const url = tab.history[tab.historyIndex];
        this.navigateToUrl(url, tab.id);
    }

    goForward() {
        const tab = this.tabs.find(t => t.id === this.activeTabId);
        if (!tab || tab.historyIndex >= tab.history.length - 1) return;

        tab.historyIndex++;
        const url = tab.history[tab.historyIndex];
        this.navigateToUrl(url, tab.id);
    }

    refresh() {
        const tab = this.tabs.find(t => t.id === this.activeTabId);
        if (!tab) return;

        const iframe = document.getElementById(`iframe-${tab.id}`);
        if (iframe) {
            iframe.src = iframe.src;
            this.updateTabLoading(tab.id, true);
        }
    }

    goHome() {
        this.loadHomepage(this.activeTabId);
        const addressInput = document.getElementById('address-input');
        addressInput.value = '';
        addressInput.focus();
    }

    loadHomepage(tabId) {
        const tab = this.tabs.find(t => t.id === tabId);
        if (!tab) return;

        tab.url = '/';
        tab.title = 'LeHalo Home';
        tab.loading = true;
        tab.favicon = '/assets/lehalo-icon.png';
        tab.history.push('/');
        tab.historyIndex = tab.history.length - 1;

        this.updateTabLoading(tabId, true);
        this.updateAddressBar('/');
        this.updateTabTitle(tabId, 'LeHalo Home');
        this.updateTabFavicon(tabId, '/assets/lehalo-icon.png');
        this.updateNavigationButtons();

        // Load homepage in iframe
        const iframe = document.getElementById(`iframe-${tab.id}`);
        if (iframe) {
            iframe.src = '/';
            // Set up load handler if not already set
            iframe.onload = () => {
                tab.loading = false;
                this.updateTabLoading(tabId, false);
                this.updateNavigationButtons();
            };
        }
    }

    toggleSidebar() {
        this.sidebarOpen = !this.sidebarOpen;
        const sidebar = document.getElementById('browser-sidebar');
        sidebar.classList.toggle('open', this.sidebarOpen);
        
        if (this.sidebarOpen) {
            this.updateBookmarksList();
            this.updateHistoryList();
        }
    }

    switchSidebarPanel(panelName) {
        document.querySelectorAll('.sidebar-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.panel === panelName);
        });

        document.querySelectorAll('.sidebar-panel').forEach(panel => {
            panel.classList.toggle('active', panel.id === `panel-${panelName}`);
        });
    }

    // Bookmarks
    toggleBookmark() {
        const tab = this.tabs.find(t => t.id === this.activeTabId);
        if (!tab || tab.url === 'about:blank') return;

        const bookmarkIndex = this.bookmarks.findIndex(b => b.url === tab.url);
        if (bookmarkIndex >= 0) {
            this.removeBookmark(tab.url);
        } else {
            this.addBookmark(tab.title, tab.url);
        }
    }

    addBookmark(title, url) {
        if (this.bookmarks.find(b => b.url === url)) return;

        this.bookmarks.push({ title, url, date: Date.now() });
        this.saveBookmarks();
        this.updateBookmarksList();
        this.updateBookmarkButton();
    }

    removeBookmark(url) {
        this.bookmarks = this.bookmarks.filter(b => b.url !== url);
        this.saveBookmarks();
        this.updateBookmarksList();
        this.updateBookmarkButton();
    }

    addBookmarkPrompt() {
        const tab = this.tabs.find(t => t.id === this.activeTabId);
        if (!tab || tab.url === 'about:blank') {
            alert('No page to bookmark');
            return;
        }

        const title = prompt('Bookmark title:', tab.title);
        if (title) {
            this.addBookmark(title, tab.url);
        }
    }

    updateBookmarksList() {
        const list = document.getElementById('bookmarks-list');
        if (!list) return;

        list.innerHTML = '';

        if (this.bookmarks.length === 0) {
            list.innerHTML = '<p style="color: var(--text-secondary); text-align: center; padding: 2rem;">No bookmarks yet</p>';
            return;
        }

        this.bookmarks.forEach(bookmark => {
            const item = document.createElement('div');
            item.className = 'bookmark-item';
            item.innerHTML = `
                <div class="bookmark-icon">
                    <i class="fas fa-star"></i>
                </div>
                <div class="bookmark-info">
                    <div class="bookmark-title">${this.escapeHtml(bookmark.title)}</div>
                    <div class="bookmark-url">${this.escapeHtml(bookmark.url)}</div>
                </div>
                <div class="bookmark-actions">
                    <button onclick="browser.navigateToUrl('${this.escapeHtml(bookmark.url)}')" title="Open">
                        <i class="fas fa-external-link-alt"></i>
                    </button>
                    <button onclick="browser.removeBookmark('${this.escapeHtml(bookmark.url)}')" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            list.appendChild(item);
        });
    }

    updateBookmarkButton() {
        const tab = this.tabs.find(t => t.id === this.activeTabId);
        if (!tab) return;

        const btn = document.getElementById('btn-bookmark');
        const isBookmarked = this.bookmarks.find(b => b.url === tab.url);
        btn.innerHTML = isBookmarked ? '<i class="fas fa-star"></i>' : '<i class="far fa-star"></i>';
    }

    // History
    addToHistory(url) {
        this.history.unshift({
            url,
            title: url,
            date: Date.now()
        });

        // Keep last 100 entries
        if (this.history.length > 100) {
            this.history.pop();
        }

        this.saveHistory();
    }

    clearHistory() {
        if (confirm('Clear all browsing history?')) {
            this.history = [];
            this.saveHistory();
            this.updateHistoryList();
        }
    }

    updateHistoryList() {
        const list = document.getElementById('history-list');
        if (!list) return;

        list.innerHTML = '';

        if (this.history.length === 0) {
            list.innerHTML = '<p style="color: var(--text-secondary); text-align: center; padding: 2rem;">No history</p>';
            return;
        }

        this.history.slice(0, 50).forEach(item => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            const date = new Date(item.date);
            historyItem.innerHTML = `
                <div class="history-icon">
                    <i class="fas fa-globe"></i>
                </div>
                <div class="history-info">
                    <div class="history-title">${this.escapeHtml(item.title)}</div>
                    <div class="history-url">${this.escapeHtml(item.url)}</div>
                    <div style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 0.25rem;">
                        ${date.toLocaleString()}
                    </div>
                </div>
                <div class="history-actions">
                    <button onclick="browser.navigateToUrl('${this.escapeHtml(item.url)}')" title="Open">
                        <i class="fas fa-external-link-alt"></i>
                    </button>
                </div>
            `;
            list.appendChild(historyItem);
        });
    }

    // Settings
    loadSettings() {
        const saved = localStorage.getItem('lehalo_settings');
        if (saved) {
            return JSON.parse(saved);
        }
        return {
            proxyService: 'light',
            tabCloaking: true,
            saveTabs: true,
            adBlock: false
        };
    }

    saveSettings() {
        localStorage.setItem('lehalo_settings', JSON.stringify(this.settings));
        
        // Update UI
        document.getElementById('setting-proxy-service').value = this.settings.proxyService;
        document.getElementById('setting-tab-cloaking').checked = this.settings.tabCloaking;
        document.getElementById('setting-save-tabs').checked = this.settings.saveTabs;
        document.getElementById('setting-ad-block').checked = this.settings.adBlock;
    }

    loadBookmarks() {
        const saved = localStorage.getItem('lehalo_bookmarks');
        return saved ? JSON.parse(saved) : [];
    }

    saveBookmarks() {
        localStorage.setItem('lehalo_bookmarks', JSON.stringify(this.bookmarks));
    }

    loadHistory() {
        const saved = localStorage.getItem('lehalo_history');
        return saved ? JSON.parse(saved) : [];
    }

    saveHistory() {
        localStorage.setItem('lehalo_history', JSON.stringify(this.history));
    }

    loadSavedTabs() {
        if (this.settings.saveTabs) {
            const saved = localStorage.getItem('lehalo_tabs');
            if (saved) {
                try {
                    const tabs = JSON.parse(saved);
                    tabs.forEach((tab, index) => {
                        if (index === 0) {
                            this.navigateToUrl(tab.url, this.activeTabId);
                        } else {
                            this.createNewTab(tab.url, false);
                        }
                    });
                } catch (e) {
                    console.error('Failed to load saved tabs:', e);
                }
            }
        }
    }

    saveTabs() {
        if (this.settings.saveTabs) {
            const tabsData = this.tabs.map(tab => ({
                url: tab.url,
                title: tab.title
            }));
            localStorage.setItem('lehalo_tabs', JSON.stringify(tabsData));
        }
    }

    updateUI() {
        this.updateBookmarkButton();
        this.updateNavigationButtons();
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize browser when page loads
let browser;
document.addEventListener('DOMContentLoaded', () => {
    browser = new LeHaloBrowser();
    
    // Save tabs before unload
    window.addEventListener('beforeunload', () => {
        browser.saveTabs();
    });

    // Update settings UI
    browser.saveSettings();
});

