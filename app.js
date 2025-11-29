/**
 * LeHalo Client-Side Application
 * 
 * Handles homepage functionality:
 * - Funny text randomizer
 * - Search form
 * - Quick links
 * - Session persistence
 * - Tab cloaking
 * 
 * @version 1.0.2
 */

// LeHalo Client-Side Application

// Funny taglines array
const funnyTaglines = [
    "Powered by coffee ☕",
    "Egg 🥚",
    "Remember, your teacher can see your screen 👀",
    "Running on pure chaos ⚡",
    "Certified ZAPD magic ✨",
    "Now with 200% more neon 🌌",
    "LeHalo: Because why not?",
    "Powered by snacks 🍪",
    "Your browser's secret best friend 🤫",
    "Warning: May cause productivity loss 💤",
    "Built on midnight coding sessions 🌙",
    "Proudly glitch-free (most of the time) 🛠️",
    "Fueled by memes 📸",
    "Beta tested by raccoons 🦝",
    "Slightly radioactive glow ☢️",
    "Browser of destiny 🕹️",
    "Sponsored by imaginary sponsors 💸",
    "The halo that never sleeps 😴",
    "100% certified nonsense ✅",
    "LeHalo: Not your average portal 🚪"
];

// Initialize AOS
document.addEventListener('DOMContentLoaded', () => {
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        offset: 100
    });

    // Hide loader after page load
    window.addEventListener('load', () => {
        setTimeout(() => {
            const loader = document.getElementById('loader');
            if (loader) {
                loader.classList.add('hidden');
            }
        }, 500);
    });

    // Initialize funny tagline randomizer
    initTaglineRandomizer();

    // Initialize search form
    initSearchForm();

    // Initialize quick links
    initQuickLinks();

    // Initialize tab cloaking
    initTabCloaking();

    // Initialize session persistence
    initSessionPersistence();
});

// Funny Tagline Randomizer
function initTaglineRandomizer() {
    const taglineElement = document.getElementById('funny-tagline');
    if (!taglineElement) return;

    // Get random tagline
    const randomTagline = funnyTaglines[Math.floor(Math.random() * funnyTaglines.length)];
    
    // Animate text change
    taglineElement.style.opacity = '0';
    setTimeout(() => {
        taglineElement.textContent = randomTagline;
        taglineElement.style.opacity = '1';
    }, 300);

    // Change tagline every 10 seconds
    setInterval(() => {
        const newTagline = funnyTaglines[Math.floor(Math.random() * funnyTaglines.length)];
        if (newTagline !== taglineElement.textContent) {
            taglineElement.style.opacity = '0';
            setTimeout(() => {
                taglineElement.textContent = newTagline;
                taglineElement.style.opacity = '1';
            }, 300);
        }
    }, 10000);
}

// Search Form Handler
function initSearchForm() {
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');

    if (!searchForm || !searchInput) return;

    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const url = searchInput.value.trim();
        
        if (!url) return;

        // Validate and format URL
        let formattedUrl = url;
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            formattedUrl = 'https://' + url;
        }

        try {
            new URL(formattedUrl);
            navigateToUrl(formattedUrl);
        } catch (error) {
            alert('Please enter a valid URL');
        }
    });
}

// Quick Links Handler
function initQuickLinks() {
    const quickLinks = document.querySelectorAll('.quick-link');
    
    quickLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const url = link.getAttribute('data-url');
            if (url) {
                navigateToUrl(url);
            }
        });
    });
}

// Navigate to URL (proxy)
function navigateToUrl(url) {
    // Save to session
    saveToSession(url);
    
    // Navigate to browser with tab system
    window.location.href = `/browser?url=${encodeURIComponent(url)}`;
}

// Tab Cloaking
function initTabCloaking() {
    // Change tab title to something generic
    const originalTitle = document.title;
    
    // Store original title
    sessionStorage.setItem('originalTitle', originalTitle);
    
    // Optional: Change title when tab is blurred
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            document.title = 'Home';
        } else {
            document.title = originalTitle;
        }
    });
}

// Session Persistence
function initSessionPersistence() {
    // Load previous session data
    const sessionData = localStorage.getItem('lehalo_session');
    if (sessionData) {
        try {
            const data = JSON.parse(sessionData);
            // Restore any session state if needed
        } catch (e) {
            console.error('Failed to parse session data:', e);
        }
    }

    // Save session on unload
    window.addEventListener('beforeunload', () => {
        const sessionData = {
            timestamp: Date.now(),
            lastUrl: window.location.href
        };
        localStorage.setItem('lehalo_session', JSON.stringify(sessionData));
    });
}

// Save URL to session
function saveToSession(url) {
    const history = JSON.parse(localStorage.getItem('lehalo_history') || '[]');
    history.unshift({
        url: url,
        timestamp: Date.now()
    });
    
    // Keep only last 50 entries
    if (history.length > 50) {
        history.pop();
    }
    
    localStorage.setItem('lehalo_history', JSON.stringify(history));
}

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

