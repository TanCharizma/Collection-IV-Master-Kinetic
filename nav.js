/**
 * Shared Navigation Component
 * Injects the global navigation into the page and handles dynamic states.
 */
(function() {
    const isHomePage = window.location.pathname === '/' || window.location.pathname.endsWith('/index.html');
    const currentPage = window.location.pathname.split('/').pop(); // e.g., "about.html"

    let navClass = '';
    let logoHref = 'index.html'; // Default for non-homepage

    if (isHomePage) { // Homepage specific setup
        navClass = 'on-hero'; // Apply on-hero class for transparent state
        logoHref = '#hero'; // Logo scrolls to hero section on homepage
    } else { // Non-homepage setup
        navClass = 'scrolled';
    }

    // Automatically format the document title
    const currentTitle = document.title;
    if (currentTitle.includes('|')) {
        document.title = currentTitle.split('|')[0].trim() + ' | ' + window.CLIENT_CONFIG.name;
    } else {
        document.title = currentTitle + ' | ' + window.CLIENT_CONFIG.name;
    }

    const isInternalNav = sessionStorage.getItem('internalNav_MotionStudy') === 'true';
    sessionStorage.removeItem('internalNav_MotionStudy');
    const pendingAnchor = sessionStorage.getItem('pendingAnchor_MotionStudy');
    sessionStorage.removeItem('pendingAnchor_MotionStudy');

    const startClass = (!isHomePage || isInternalNav) ? 'start-covered' : '';

    const navHTML = `
    <div class="app-transition-curtain ${startClass}" id="appCurtain"></div>
    <nav class="${navClass}">
        <a href="${logoHref}" class="logo">${window.CLIENT_CONFIG.name}</a>
        <div class="nav-links">
            <div class="dropdown">
                <a href="${logoHref}" class="dropdown-trigger">
                    <span lang="en">Home</span>
                    <span lang="th">หน้าหลัก</span>
                </a>
                <div class="dropdown-content">
                    <a href="${isHomePage ? '#highlights' : 'index.html#highlights'}">
                        <span lang="en">Highlights</span>
                        <span lang="th">ไฮไลต์</span>
                    </a>
                    <a href="${isHomePage ? '#portfolio' : 'index.html#portfolio'}">
                        <span lang="en">Portfolio</span>
                        <span lang="th">ผลงาน</span>
                    </a>
                    <a href="${isHomePage ? '#motion' : 'index.html#motion'}">
                        <span lang="en">Videos</span>
                        <span lang="th">วิดีโอ</span>
                    </a>
                    <a href="${isHomePage ? '#measurements' : 'index.html#measurements'}">
                        <span lang="en">Measurements</span>
                        <span lang="th">สัดส่วน</span>
                    </a>
                    <a href="${isHomePage ? '#digitals' : 'index.html#digitals'}">
                        <span lang="en">Digitals</span>
                        <span lang="th">สแนปช็อต</span>
                    </a>
                </div>
            </div>
            <a href="about.html">
                <span lang="en">About</span>
                <span lang="th">เกี่ยวกับฉัน</span>
            </a>
            <a href="booking.html">
                <span lang="en">Booking</span>
                <span lang="th">จองคิว</span>
            </a>
            <span class="lang-switch" id="langToggle">
                <span class="en">EN</span> / 
                <span class="th">TH</span>
            </span>
            <span class="theme-toggle" id="themeToggle">
                <span lang="en">Dark</span>
                <span lang="th">โหมดมืด</span>
            </span>
        </div>
        <div class="mobile-toggle" id="mobileToggle">
            <span></span>
            <span></span>
        </div>
    </nav>`;

    // Inject the navigation HTML
    document.currentScript.insertAdjacentHTML('beforebegin', navHTML);

    // After injection, get the nav element
    const navElement = document.querySelector('nav');

    // Handle active class for non-homepage links
    if (!isHomePage) {
        const currentLink = navElement.querySelector(`a[href="${currentPage}"]`);
        if (currentLink) {
            currentLink.classList.add('active');
        }
    }

    // Handle scroll-triggered 'scrolled' class for homepage
    if (isHomePage) {
        window.addEventListener('scroll', () => {
            window.scrollY > 50 ? navElement.classList.add('scrolled') : navElement.classList.remove('scrolled');
        }, { passive: true }); /* Unblocks iOS scrolling thread */
    }

    // Shared Collection IV Anchor Glide + Mobile Menu Logic
    const mobileToggle = navElement.querySelector('#mobileToggle');
    const getHeaderOffset = () => Math.ceil((navElement && navElement.getBoundingClientRect().height) || 64);
    const getAnchorTargetY = (targetElement) => {
        const targetTop = targetElement.getBoundingClientRect().top + window.scrollY;
        return Math.max(0, targetTop - getHeaderOffset() - 10);
    };
    let savedInlineScrollBehavior = null;
    const forceInstantScrollBehavior = () => {
        const root = document.documentElement;
        if (savedInlineScrollBehavior === null) savedInlineScrollBehavior = root.style.scrollBehavior;
        root.style.scrollBehavior = 'auto';
    };
    const restoreInstantScrollBehavior = () => {
        if (savedInlineScrollBehavior === null) return;
        const root = document.documentElement;
        if (savedInlineScrollBehavior) {
            root.style.scrollBehavior = savedInlineScrollBehavior;
        } else {
            root.style.removeProperty('scroll-behavior');
        }
        savedInlineScrollBehavior = null;
    };
    const instantScrollTo = (top) => {
        forceInstantScrollBehavior();
        window.scrollTo(0, top);
        restoreInstantScrollBehavior();
    };
    const closeMobileMenu = () => {
        navElement.classList.remove('nav-open');
        document.body.style.overflow = '';
    };
    const runAfterViewportSettles = (callback, delay = 0) => {
        const run = () => requestAnimationFrame(() => requestAnimationFrame(callback));
        delay > 0 ? setTimeout(run, delay) : run();
    };
    let activeAnchorScroll = 0;
    function scrollToAnchor(targetId, behavior = 'smooth') {
        if (!targetId || targetId === '#') return;
        const target = document.querySelector(targetId);
        if (!target) return;

        const scrollRun = ++activeAnchorScroll;
        history.replaceState(null, null, targetId);

        if (behavior === 'auto' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            instantScrollTo(getAnchorTargetY(target));
            return;
        }

        forceInstantScrollBehavior();
        const restoreScrollBehavior = () => {
            if (scrollRun !== activeAnchorScroll) return;
            restoreInstantScrollBehavior();
        };

        let isUserScrolling = false;
        const stopCorrection = () => {
            isUserScrolling = true;
            restoreScrollBehavior();
        };
        ['wheel', 'touchstart', 'mousedown', 'keydown'].forEach(evt => {
            window.addEventListener(evt, stopCorrection, { once: true, passive: true });
        });

        const startTime = performance.now();
        const minTrackTime = window.innerWidth <= 768 ? 1100 : 650;
        let stableFrames = 0;
        let lastTime = startTime;
        let currentY = window.scrollY;

        const scrollLoop = (time) => {
            if (isUserScrolling || scrollRun !== activeAnchorScroll) {
                restoreScrollBehavior();
                return;
            }

            const isMobileScroll = window.innerWidth <= 768;
            const dt = Math.min(isMobileScroll ? 24 : 32, time - lastTime || 16);
            lastTime = time;
            const targetY = getAnchorTargetY(target);
            const diff = targetY - currentY;
            const elapsed = time - startTime;
            const distance = Math.abs(diff);
            const stopThreshold = isMobileScroll ? 0.8 : 0.6;

            if (distance < stopThreshold) {
                stableFrames++;
                if (isMobileScroll) {
                    if (elapsed >= minTrackTime && stableFrames >= 5) {
                        restoreScrollBehavior();
                        return;
                    }
                    requestAnimationFrame(scrollLoop);
                    return;
                }

                window.scrollTo(0, targetY);
                if (elapsed >= minTrackTime && stableFrames >= 8) {
                    restoreScrollBehavior();
                    return;
                }
                requestAnimationFrame(scrollLoop);
                return;
            }

            stableFrames = 0;
            const lerpFactor = 1 - Math.exp(-0.002 * dt);
            currentY += diff * lerpFactor;
            window.scrollTo(0, currentY);
            requestAnimationFrame(scrollLoop);
        };

        requestAnimationFrame((time) => {
            lastTime = time;
            scrollLoop(time);
        });
    }

    const glideToAnchor = (targetId, delay = 0) => {
        runAfterViewportSettles(() => scrollToAnchor(targetId), delay);
    };

    window.FolioLabScrollToAnchor = glideToAnchor;
    window.MotionStudyScrollToAnchor = glideToAnchor;

    let menuTouchStartX = 0;
    let menuTouchStartY = 0;
    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            navElement.classList.toggle('nav-open');
            document.body.style.overflow = navElement.classList.contains('nav-open') ? 'hidden' : '';
        });

        const navLinks = navElement.querySelector('.nav-links');
        if (navLinks) {
            navLinks.addEventListener('click', (e) => {
                if (e.target.closest('a, .lang-switch, .theme-toggle')) return;
                closeMobileMenu();
            });

            navLinks.addEventListener('touchstart', (e) => {
                if (!navElement.classList.contains('nav-open') || e.touches.length !== 1) return;
                menuTouchStartX = e.touches[0].screenX;
                menuTouchStartY = e.touches[0].screenY;
            }, { passive: true });

            navLinks.addEventListener('touchend', (e) => {
                if (!navElement.classList.contains('nav-open') || !e.changedTouches.length) return;
                const deltaX = e.changedTouches[0].screenX - menuTouchStartX;
                const deltaY = e.changedTouches[0].screenY - menuTouchStartY;
                if (deltaX > 70 && Math.abs(deltaX) > Math.abs(deltaY) * 1.4) closeMobileMenu();
            }, { passive: true });
        }

        // Close menu when a link is clicked
        navElement.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                const href = link.getAttribute('href');
                // If it's a home page hash link, let the interceptor handle the closing to prevent iOS GPU panic
                if (href && (href.startsWith('#') || (isHomePage && href.startsWith('index.html#')))) return;

                closeMobileMenu();
            });
        });

        // Cleanup: Ensure body scroll is restored if window is resized while menu is open
        window.addEventListener('resize', () => {
            if (window.innerWidth > 1024 && navElement.classList.contains('nav-open')) {
                closeMobileMenu();
            }
        });
    }

    document.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (!link || link.classList.contains('back-to-top')) return;

        const href = link.getAttribute('href');
        const isSamePageHash = href && (href.startsWith('#') || (isHomePage && href.startsWith('index.html#')));
        if (!isSamePageHash) return;

        const targetId = href.substring(href.indexOf('#'));
        if (!document.querySelector(targetId)) return;

        e.preventDefault();

        const wasMenuOpen = navElement.classList.contains('nav-open');
        if (wasMenuOpen) closeMobileMenu();

        glideToAnchor(targetId, wasMenuOpen ? 320 : 0);
    });

    // Theme Switching Logic
    const themeToggle = navElement.querySelector('#themeToggle');
    const updateThemeUI = (theme) => {
        document.documentElement.setAttribute('data-theme', theme);
        const enSpan = themeToggle.querySelector('[lang="en"]');
        const thSpan = themeToggle.querySelector('[lang="th"]');
        if (theme === 'dark') {
            enSpan.textContent = 'Light';
            thSpan.textContent = 'โหมดสว่าง';
        } else {
            enSpan.textContent = 'Dark';
            thSpan.textContent = 'โหมดมืด';
        }
        localStorage.setItem('preferredTheme', theme);
    };

    themeToggle.addEventListener('click', () => {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        updateThemeUI(isDark ? 'light' : 'dark');
    });

    // Initialize theme on load
    updateThemeUI(localStorage.getItem('preferredTheme') || 'light');

    // Language Switching Logic
    const setLanguage = (lang) => {
        if (lang === 'th') {
            document.body.classList.add('lang-th');
        } else {
            document.body.classList.remove('lang-th');
        }
        localStorage.setItem('preferredLang', lang);
    };

    navElement.querySelector('.lang-switch .en').addEventListener('click', () => setLanguage('en'));
    navElement.querySelector('.lang-switch .th').addEventListener('click', () => setLanguage('th'));

    // Initialize language on load
    setLanguage(localStorage.getItem('preferredLang') || 'en');

    // Dynamic Layout-Aware Hash Navigation Fix (Homepage Only)
    if (isHomePage) {
        window.addEventListener('load', () => {
            const targetHash = pendingAnchor || window.location.hash;
            if (targetHash) {
                glideToAnchor(targetHash, isInternalNav || pendingAnchor ? 420 : 160);
            }
        }, { once: true });
    }

    // --- NATIVE APP TRANSITION LOGIC ---
    document.addEventListener('DOMContentLoaded', () => {
        const curtain = document.getElementById('appCurtain');
        
        // Bypass Splash Screen immediately if navigating back to the home page internally
        if (isHomePage && isInternalNav) {
            const splash = document.getElementById('splash-screen');
            if (splash) {
                splash.removeAttribute('id'); // Disconnect from main.js timer
                splash.style.display = 'none'; // Hide visually
            }
        }

        // Page Entrance: Slide curtain out to reveal the new page
        if ((!isHomePage || isInternalNav) && curtain) {
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    curtain.style.transition = 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.8s';
                    curtain.classList.remove('start-covered', 'curtain-cover');
                    document.body.classList.add('page-entrance');
                });
            });
        }

        // Intercept all clicks to trigger the slide-over effect
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (!link || !curtain) return;
            
            const href = link.getAttribute('href');
            
            // Ignore external links, mailto, phone numbers, new tabs, and hashes
            if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || href.includes('http') || link.getAttribute('target') === '_blank' || link.classList.contains('back-to-top') || e.ctrlKey || e.metaKey) {
                return;
            }

            // Ignore if linking to the exact same page
            const currentPath = window.location.pathname.split('/').pop() || 'index.html';
            let targetPath = href.split('/').pop().split('#')[0] || 'index.html';
            if (currentPath === targetPath) return;

            e.preventDefault();

            // Store navigation intent for the next page load
            sessionStorage.setItem('internalNav_MotionStudy', 'true');
            const hashIndex = href.indexOf('#');
            let navigationHref = href;
            if (hashIndex !== -1 && targetPath === 'index.html') {
                sessionStorage.setItem('pendingAnchor_MotionStudy', href.substring(hashIndex));
                navigationHref = href.substring(0, hashIndex) || 'index.html';
            }

            // Close mobile menu if it's open so it doesn't glitch during transition
            if (navElement && navElement.classList.contains('nav-open')) {
                navElement.classList.remove('nav-open');
                document.body.style.overflow = '';
            }

            // Cover screen with cinematic fade
            curtain.style.transition = 'none';
            curtain.classList.remove('start-covered');
            
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    curtain.style.transition = 'opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.5s';
                    curtain.classList.add('curtain-cover');
                });
            });

            // Wait for curtain to fully cover the screen, then navigate
            setTimeout(() => window.location.href = navigationHref, 500);
        });

        // Failsafe for iOS Swipe-Back gesture (BFCache reset)
        window.addEventListener('pageshow', (e) => {
            if (e.persisted && curtain) {
                curtain.classList.remove('start-covered', 'curtain-cover');
            }
        });
    });

    // Auto-inject Config Data into HTML placeholders
    document.addEventListener('DOMContentLoaded', () => {
        const inject = (id, value) => {
            const el = document.getElementById(id);
            if (el) el.textContent = value;
        };
        const injectHTML = (id, value) => {
            const el = document.getElementById(id);
            if (el) el.innerHTML = value;
        };
        const injectParagraphs = (id, enParagraphs = [], thParagraphs = []) => {
            const el = document.getElementById(id);
            if (!el) return;
            el.innerHTML = '';

            enParagraphs.forEach(text => {
                if (!text) return;
                const paragraph = document.createElement('p');
                paragraph.lang = 'en';
                paragraph.textContent = text;
                el.appendChild(paragraph);
            });

            thParagraphs.forEach(text => {
                if (!text) return;
                const paragraph = document.createElement('p');
                paragraph.lang = 'th';
                paragraph.textContent = text;
                el.appendChild(paragraph);
            });
        };

        inject('clientNameHero', window.CLIENT_CONFIG.name);
        inject('splashClientName', window.CLIENT_CONFIG.name);
        injectHTML('taglineEn', window.CLIENT_CONFIG.taglineEn);
        injectHTML('taglineTh', window.CLIENT_CONFIG.taglineTh);
        injectParagraphs('aboutBio', window.CLIENT_CONFIG.aboutBioEn, window.CLIENT_CONFIG.aboutBioTh);
        inject('manifestoEn', window.CLIENT_CONFIG.manifestoEn);
        inject('manifestoTh', window.CLIENT_CONFIG.manifestoTh);
        
        if (window.CLIENT_CONFIG.measurements) {
            inject('val-height', window.CLIENT_CONFIG.measurements.height);
            inject('val-bust', window.CLIENT_CONFIG.measurements.bust);
            inject('val-waist', window.CLIENT_CONFIG.measurements.waist);
            inject('val-hips', window.CLIENT_CONFIG.measurements.hips);
            inject('val-shoes', window.CLIENT_CONFIG.measurements.shoes);
            inject('val-hairEn', window.CLIENT_CONFIG.measurements.hairEn);
            inject('val-hairTh', window.CLIENT_CONFIG.measurements.hairTh);
            inject('val-eyesEn', window.CLIENT_CONFIG.measurements.eyesEn);
            inject('val-eyesTh', window.CLIENT_CONFIG.measurements.eyesTh);
        }
    });
})();
