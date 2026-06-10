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

    const isInternalNav = sessionStorage.getItem('internalNav_Kinetic') === 'true';
    sessionStorage.removeItem('internalNav_Kinetic');

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

    // Mobile Menu Logic
    const mobileToggle = navElement.querySelector('#mobileToggle');
    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            navElement.classList.toggle('nav-open');
            document.body.style.overflow = navElement.classList.contains('nav-open') ? 'hidden' : '';
        });

        // Close menu when a link is clicked
        navElement.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                const href = link.getAttribute('href');
                // If it's a home page hash link, let the interceptor handle the closing to prevent iOS GPU panic
                if (isHomePage && href && href.startsWith('#')) return;

                navElement.classList.remove('nav-open');
                document.body.style.overflow = '';
            });
        });

        // Cleanup: Ensure body scroll is restored if window is resized while menu is open
        window.addEventListener('resize', () => {
            if (window.innerWidth > 1024 && navElement.classList.contains('nav-open')) {
                navElement.classList.remove('nav-open');
                document.body.style.overflow = '';
            }
        });
    }

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

    // Dynamic Layout-Aware Smooth Scroll & Hash Navigation Fix (Homepage Only)
    if (isHomePage) {
        document.addEventListener('DOMContentLoaded', () => {
            // 1. Intercept standard on-page clicks
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                if (anchor.classList.contains('back-to-top')) return;
                
                anchor.addEventListener('click', function(e) {
                    const targetId = this.getAttribute('href');
                    const targetElement = document.querySelector(targetId);
                    
                    if (targetElement) {
                        e.preventDefault();
                        
                        const executeScroll = () => {
                            // Calculate target destination ONCE to prevent layout thrashing and freezing
                            let targetY = Math.max(0, targetElement.getBoundingClientRect().top + window.scrollY - 64);
        
                            // Use native CSS smooth scrolling for hardware-accelerated, buttery smooth performance
                            window.scrollTo({
                                top: targetY,
                                behavior: 'smooth'
                            });
                            
                            history.replaceState(null, null, targetId);
                        };

                        if (navElement.classList.contains('nav-open')) {
                            navElement.classList.remove('nav-open');
                            document.body.style.overflow = '';
                            // Delay scroll by 100ms to prevent iOS Safari compositor crash after body unlock reflow
                            setTimeout(executeScroll, 100);
                        } else {
                            executeScroll();
                        }
                    }
                });
            });

            // 2. Fix cross-page navigation when arriving with a hash (e.g. index.html#motion)
            if (window.location.hash) {
                const targetElement = document.querySelector(window.location.hash);
                
                if (targetElement) {
                    let isUserScrolling = false;
                    
                    // Stop correcting if the user manually tries to scroll
                    const stopCorrection = () => isUserScrolling = true;
                    ['wheel', 'touchstart', 'mousedown', 'keydown'].forEach(evt => {
                        window.addEventListener(evt, stopCorrection, { once: true, passive: true });
                    });

                    let trackingActive = true;
                    
                    const trackTarget = () => {
                        if (isUserScrolling || !trackingActive) return;
                        
                        const rectTop = targetElement.getBoundingClientRect().top;
                        
                        // If layout shifts push the target away from the header, immediately correct it
                        if (Math.abs(rectTop - 64) > 2) {
                            window.scrollTo(0, rectTop + window.scrollY - 64);
                        }
                        
                        if (trackingActive) {
                            requestAnimationFrame(trackTarget);
                        }
                    };

                    // Start stapling the viewport to the target immediately
                    trackTarget();

                    // Safely disconnect the tracker once the page fully resolves
                    window.addEventListener('load', () => { 
                        setTimeout(() => trackingActive = false, 500); // Allow brief buffer for final renders
                    });
                    
                    // Failsafe disconnect after 3 seconds
                    setTimeout(() => trackingActive = false, 3000);
                }
            }
        });
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
            sessionStorage.setItem('internalNav_Kinetic', 'true');

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
            setTimeout(() => window.location.href = href, 500);
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

        inject('clientNameHero', window.CLIENT_CONFIG.name);
        inject('splashClientName', window.CLIENT_CONFIG.name);
        inject('taglineEn', window.CLIENT_CONFIG.taglineEn);
        inject('taglineTh', window.CLIENT_CONFIG.taglineTh);
        
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