// Auto-populate Master Template variables from config.js
document.addEventListener('DOMContentLoaded', () => {
    if (window.CLIENT_CONFIG) {
        const isAboutPage = window.location.pathname.includes('about.html');
        const isBookingPage = window.location.pathname.includes('booking.html');
        
        let pageTitle = "Portfolio | ";
        if (isAboutPage) pageTitle = "About | ";
        if (isBookingPage) pageTitle = "Booking | ";
        document.title = pageTitle + window.CLIENT_CONFIG.name;
        
        if (document.getElementById('clientNameHero')) document.getElementById('clientNameHero').textContent = window.CLIENT_CONFIG.name;
        if (document.getElementById('taglineEn')) document.getElementById('taglineEn').textContent = window.CLIENT_CONFIG.taglineEn;
        if (document.getElementById('taglineTh')) document.getElementById('taglineTh').textContent = window.CLIENT_CONFIG.taglineTh;
        
        const m = window.CLIENT_CONFIG.measurements;
        if (m) {
            ['height', 'bust', 'waist', 'hips', 'shoes', 'hairEn', 'hairTh', 'eyesEn', 'eyesTh'].forEach(key => {
                if (document.getElementById('val-' + key)) document.getElementById('val-' + key).textContent = m[key];
            });
        }

        // Booking Config Links
        const lnkLine = document.getElementById('link-line');
        const lnkEmail = document.getElementById('link-email');
        const lnkWa = document.getElementById('link-wa');
        const lnkIg = document.getElementById('link-ig');
        
        const setupLink = (el, url, prefix = "") => {
            if (el) {
                if (url && url.trim() !== "") {
                    el.href = prefix + url;
                } else {
                    el.style.display = "none";
                }
            }
        };

        setupLink(lnkLine, window.CLIENT_CONFIG.line);
        setupLink(lnkEmail, window.CLIENT_CONFIG.email, "mailto:");
        setupLink(lnkWa, window.CLIENT_CONFIG.whatsapp);
        setupLink(lnkIg, window.CLIENT_CONFIG.instagram);
    }
});

// Intersection Observer for Active Nav Links
const navOptions = {
    root: null,
    threshold: 0,
    rootMargin: "-80px 0px -80% 0px" // High-precision sensing at the landing point
};

const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');

            if (['hero', 'highlights', 'portfolio', 'motion', 'measurements', 'digitals'].includes(id)) {
                // Only reset and update when we hit a valid section
                document.querySelectorAll('.nav-links a, .dropdown-trigger').forEach(el => el.classList.remove('active'));
                
                const trigger = document.querySelector('.dropdown-trigger');
                if (trigger) trigger.classList.add('active');
                
                // Highlight the specific sub-link in the dropdown
                const subLink = document.querySelector(`.dropdown-content a[href="#${id}"], .dropdown-content a[href="index.html#${id}"]`);
                if (subLink) subLink.classList.add('active');
            }
        }
    });
}, navOptions);

document.querySelectorAll('header[id], section[id]').forEach(section => navObserver.observe(section));

// Reveal Sections on Scroll
// Wait for the Hero Image to fully download before triggering the entrance animations
const heroSection = document.getElementById('hero');
const heroBg = document.querySelector('.hero-bg');

// Automatically extract the image URL defined in the HTML inline style
let heroImgUrl = 'image/hero/hero.webp';
if (heroBg && heroBg.style.backgroundImage) {
    const bgUrlMatch = heroBg.style.backgroundImage.match(/url\(['"]?(.*?)['"]?\)/);
    if (bgUrlMatch) heroImgUrl = bgUrlMatch[1];
}

const triggerHeroEntrance = () => {
    if (heroSection) {
        heroSection.classList.add('loaded');
        document.querySelectorAll('.hero .reveal').forEach(el => el.classList.add('active'));
    }
};

const splashScreen = document.getElementById('splash-screen');
const minSplashTime = new Promise(resolve => setTimeout(resolve, 2000)); // Minimum 2s immersive brand entrance

const heroImageLoad = new Promise(resolve => {
    const heroImgLoader = new Image();
    
    heroImgLoader.onload = resolve;
    heroImgLoader.onerror = resolve; // Proceed even if there is a loading error
    
    heroImgLoader.src = heroImgUrl;
    
    if (heroImgLoader.complete) resolve(); // Instant resolution if cached
    setTimeout(resolve, 3000); // 3-second hard failsafe in case browser swallows the load event
});

if (splashScreen) {
    document.body.style.overflow = 'hidden'; // Lock screen during splash
    Promise.all([minSplashTime, heroImageLoad]).then(() => {
        splashScreen.classList.add('hidden');
        setTimeout(() => {
            document.body.style.overflow = ''; // Unlock scrolling
            triggerHeroEntrance();
        }, 400); // Trigger hero text reveal exactly halfway through the splash screen fade-out
    });
} else {
    heroImageLoad.then(triggerHeroEntrance);
}

const revealOptions = {
    threshold: 0,
    rootMargin: "0px 0px -200px 0px" // Triggers animation 200px before it enters the viewport
};

const revealObserver = new IntersectionObserver((entries) => {
    let toReveal = entries.filter(e => e.isIntersecting && !e.target.classList.contains('active'));
    
    // For Safari's sake, sort the elements by their visual position to ensure a smooth, predictable stagger.
    if (toReveal.length > 1) {
        toReveal.sort((a, b) => {
            // Use pre-calculated observer properties to completely eliminate layout thrashing
            const rectA = a.boundingClientRect;
            const rectB = b.boundingClientRect;
            if (Math.abs(rectA.top - rectB.top) > 1) { // Use a small threshold
                return rectA.top - rectB.top;
            }
            return rectA.left - rectB.left;
        });
    }
    
    toReveal.forEach((entry, index) => {
        const el = entry.target;
        // Automatically stagger elements appearing at once, unless they have a manual delay class
        if (!Array.from(el.classList).some(cls => cls.startsWith('delay-'))) {
            // Use a faster stagger for large grids to feel responsive
            el.style.transitionDelay = `${index * 0.1}s`;
        }

        const images = el.tagName === 'IMG' ? [el] : Array.from(el.querySelectorAll('img'));
        const pendingImages = images.filter(img => !img.complete);

        const triggerActive = () => {
            requestAnimationFrame(() => {
                requestAnimationFrame(() => el.classList.add('active'));
            });
            revealObserver.unobserve(el); // Safely drop the element from memory once animated
        };

        if (pendingImages.length > 0) {
            let loadedCount = 0;
            pendingImages.forEach(img => {
                const checkLoad = () => {
                    loadedCount++;
                    if (loadedCount === pendingImages.length) triggerActive();
                };
                img.addEventListener('load', checkLoad, { once: true });
                img.addEventListener('error', checkLoad, { once: true });
            });
        } else {
            triggerActive();
        }
    });
}, revealOptions);

document.querySelectorAll('.reveal:not(.hero .reveal)').forEach(el => revealObserver.observe(el));

// Subtle Parallax & Zoom Effect for Hero
const heroContent = document.querySelector('.hero-content');
const backToTop = document.querySelector('.back-to-top');

// Cache viewport height to strictly prevent layout thrashing on scroll
let vh = window.innerHeight;
window.addEventListener('resize', () => vh = window.innerHeight, { passive: true });

let isScrollingToTop = false;
let scrollCheckInterval = null;
let scrollTimeout = null;

const evaluateBackToTop = () => {
    if (!backToTop || isScrollingToTop) return;
    if (window.scrollY > (vh * 0.5)) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
};

if (backToTop) {
    backToTop.addEventListener('click', (e) => {
        e.preventDefault();
        isScrollingToTop = true;
        
        // Immediately force inline styles to beat iOS Safari's sticky :active state
        backToTop.style.opacity = '0';
        backToTop.style.pointerEvents = 'none';
        backToTop.classList.remove('visible');
        
        // Use native CSS smooth scrolling for hardware acceleration on mobile
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        
        clearInterval(scrollCheckInterval);
        clearTimeout(scrollTimeout);

        const unlockButton = () => {
            isScrollingToTop = false;
            backToTop.style.opacity = '';
            backToTop.style.pointerEvents = '';
            evaluateBackToTop();
        };

        // Watch for the scroll to hit absolute zero (successful completion)
        scrollCheckInterval = setInterval(() => {
            if (window.scrollY <= 0) {
                clearInterval(scrollCheckInterval);
                clearTimeout(scrollTimeout);
                unlockButton();
            }
        }, 100);

        // Failsafe unlock after 2 seconds
        scrollTimeout = setTimeout(() => {
            clearInterval(scrollCheckInterval);
            unlockButton();
        }, 2000);
    });

    // Detect if the user physically interrupts the smooth scroll
    const interruptScroll = () => {
        if (isScrollingToTop) {
            clearInterval(scrollCheckInterval);
            clearTimeout(scrollTimeout);
            isScrollingToTop = false;
            backToTop.style.opacity = '';
            backToTop.style.pointerEvents = '';
            evaluateBackToTop();
        }
    };

    // Listen for manual user scrolling (touch or trackpad/mouse wheel)
    window.addEventListener('touchstart', interruptScroll, { passive: true });
    window.addEventListener('wheel', interruptScroll, { passive: true });
}

let ticking = false;
window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            const scrollOffset = window.scrollY;

            evaluateBackToTop();

            if (scrollOffset <= vh) {
                // Disable the load animation if the user starts scrolling so the JS transform isn't blocked
                if (heroBg) {
                    if (scrollOffset > 0 && heroBg.style.animation !== 'none') {
                        heroBg.style.animation = 'none';
                    }

                    // Calculate subtle zoom factor (grows by 15% over the height of the screen)
                    const scale = 1 + (scrollOffset / vh) * 0.15;

                    // Optimize Parallax for Mobile
                    if (window.innerWidth > 768) {
                        const parallax = scrollOffset * 0.15;
                        heroBg.style.transform = `translate3d(0, ${parallax}px, 0) scale(${scale})`;
                    } else {
                        heroBg.style.transform = `translateZ(0) scale(${scale})`;
                    }
                }
                
                // Fade out hero content smoothly
                if (heroContent) {
                    const opacity = 1 - (scrollOffset / (vh * 0.6));
                    heroContent.style.opacity = Math.max(0, opacity);
                }
            }
            ticking = false;
        });
        ticking = true;
    }
}, { passive: true }); // Crucial for buttery smooth mobile scrolling

// Modal Logic
const modal = document.getElementById("imageModal");
const modalImg = document.getElementById("img01");
let currentSectionImages = [];
let currentImgIndex = 0;

document.querySelectorAll('section img').forEach((img) => {
    img.style.cursor = 'pointer';
    img.addEventListener('click', () => {
        const parentSection = img.closest('section');
        // Sort images by visual position: top-to-bottom, then left-to-right
        currentSectionImages = Array.from(parentSection.querySelectorAll('img'))
            .sort((a, b) => {
                const rectA = a.getBoundingClientRect();
                const rectB = b.getBoundingClientRect();
                // If images are on significantly different vertical levels (threshold of 100px)
                if (Math.abs(rectA.top - rectB.top) > 100) {
                    return rectA.top - rectB.top;
                }
                // If images are on the same "row", sort by left-to-right
                return rectA.left - rectB.left;
            });

        modal.style.display = "block";
        updateModal(currentSectionImages.indexOf(img));
        document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
    });
});

const updateModal = (index) => {
    currentImgIndex = index;
    modalImg.src = currentSectionImages[currentImgIndex].src;

    // Update button visibility based on position within the current section
    if(document.querySelector('.modal-prev')) document.querySelector('.modal-prev').style.visibility = currentImgIndex === 0 ? 'hidden' : 'visible';
    if(document.querySelector('.modal-next')) document.querySelector('.modal-next').style.visibility = currentImgIndex === currentSectionImages.length - 1 ? 'hidden' : 'visible';
};

if(document.querySelector('.modal-prev')) {
    document.querySelector('.modal-prev').onclick = (e) => {
        e.stopPropagation();
        updateModal(currentImgIndex - 1);
    };
}

if(document.querySelector('.modal-next')) {
    document.querySelector('.modal-next').onclick = (e) => {
        e.stopPropagation();
        updateModal(currentImgIndex + 1);
    };
}

if(modalImg) modalImg.onclick = (e) => e.stopPropagation();

if(modal) {
    modal.onclick = () => {
        modal.style.display = "none";
        document.body.style.overflow = 'auto'; // Restore scrolling
    };

    // Mobile Swipe Logic for Galleries
    let touchStartX = 0;
    let touchEndX = 0;
    modal.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    modal.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        const swipeThreshold = 50;
        if (touchEndX < touchStartX - swipeThreshold && currentImgIndex < currentSectionImages.length - 1) updateModal(currentImgIndex + 1);
        if (touchEndX > touchStartX + swipeThreshold && currentImgIndex > 0) updateModal(currentImgIndex - 1);
    }, { passive: true });
}

// Comp Card Logic
const compCardBtn = document.getElementById('compCardBtn');
const compCardModal = document.getElementById('compCardModal');
const compCardImg = document.getElementById('compCardImg');
const compCardDownload = document.getElementById('compCardDownload');

if (compCardBtn) {
    compCardBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if(compCardImg) compCardImg.src = 'image/comp-card.webp'; 
        if(compCardDownload) compCardDownload.href = 'image/comp-card.pdf'; 
        if(compCardModal) compCardModal.style.display = "block";
        document.body.style.overflow = 'hidden';
    });
}

if (compCardModal) {
    compCardModal.addEventListener('click', (e) => {
        if (e.target !== compCardImg && e.target !== compCardDownload && (!compCardDownload || !compCardDownload.contains(e.target))) {
            compCardModal.style.display = "none";
            document.body.style.overflow = 'auto';
        }
    });
}

// Keyboard Navigation for Modals
document.addEventListener('keydown', (e) => {
    const isImageModalOpen = modal && modal.style.display === "block";
    const isCompCardOpen = compCardModal && compCardModal.style.display === "block";

    if (e.key === 'Escape') {
        if (isImageModalOpen) {
            modal.style.display = "none";
            document.body.style.overflow = 'auto';
        }
        if (isCompCardOpen) {
            compCardModal.style.display = "none";
            document.body.style.overflow = 'auto';
        }
    }

    if (isImageModalOpen) {
        if (e.key === 'ArrowRight' && currentImgIndex < currentSectionImages.length - 1) updateModal(currentImgIndex + 1);
        if (e.key === 'ArrowLeft' && currentImgIndex > 0) updateModal(currentImgIndex - 1);
    }
});

// Custom Cursor Logic
document.addEventListener('DOMContentLoaded', () => {
    // Only activate on devices with a mouse (ignores touchscreens & mobiles)
    if (window.matchMedia("(pointer: fine)").matches) {
        const cursor = document.createElement('div');
        cursor.classList.add('cursor-dot');
        document.body.appendChild(cursor);

        document.addEventListener('mousemove', (e) => {
            // Hardware-accelerated movement to prevent jank
            cursor.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
        });

        // Add magnetic hover effect for all interactive elements
        const interactiveElements = 'a, button, .dropdown, img, .theme-toggle, .lang-switch span, .modal-nav';
        
        document.addEventListener('mouseover', (e) => {
            let target = e.target;
            if (target && target.nodeType === 3) target = target.parentNode; // Failsafe for text nodes
            if (target && target.closest(interactiveElements)) cursor.classList.add('hover');
        });
        
        document.addEventListener('mouseout', (e) => {
            let related = e.relatedTarget;
            if (related && related.nodeType === 3) related = related.parentNode; // Failsafe for text nodes
            if (!related || !related.closest(interactiveElements)) cursor.classList.remove('hover');
        });
    }
});

// Service Worker Registration for Progressive Web App (PWA) capabilities
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js').catch(error => {
            console.log('ServiceWorker registration failed: ', error);
        });
    });
}