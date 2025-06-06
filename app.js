// DOM Elements
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');
const closeNav = document.getElementById('closeNav');
const backToTop = document.getElementById('backToTop');
const indicators = document.querySelectorAll('.indicator');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section');

// Mobile Navigation Toggle
function toggleMobileNav() {
    mobileNav.classList.toggle('open');
    hamburger.classList.toggle('active');
    document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
}

function closeMobileNav() {
    mobileNav.classList.remove('open');
    hamburger.classList.remove('active');
    document.body.style.overflow = '';
}

// Event Listeners for Mobile Navigation
hamburger.addEventListener('click', toggleMobileNav);
closeNav.addEventListener('click', closeMobileNav);

// Close mobile nav when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
        
        closeMobileNav();
    });
});

// Close mobile nav when clicking outside
document.addEventListener('click', (e) => {
    if (mobileNav.classList.contains('open') && 
        !mobileNav.contains(e.target) && 
        !hamburger.contains(e.target)) {
        closeMobileNav();
    }
});

// Back to Top Button
function toggleBackToTop() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > 300) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
}

backToTop.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Section Indicators
function updateActiveIndicator() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    
    let activeSection = null;
    
    sections.forEach((section, index) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        // Check if section is currently in view
        if (scrollTop >= sectionTop - windowHeight/3 && 
            scrollTop < sectionTop + sectionHeight - windowHeight/3) {
            activeSection = index;
        }
    });
    
    // Update indicators
    indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === activeSection);
    });
}

// Add click handlers to indicators
indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
        const targetSection = sections[index];
        if (targetSection) {
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Scroll Event Listener
let ticking = false;

function onScroll() {
    if (!ticking) {
        requestAnimationFrame(() => {
            toggleBackToTop();
            updateActiveIndicator();
            ticking = false;
        });
        ticking = true;
    }
}

window.addEventListener('scroll', onScroll);

// Intersection Observer for Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animationPlayState = 'running';
        }
    });
}, observerOptions);

// Observe all animated elements
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.chart-wrapper, .card, .stat-card-large, .tooling-card');
    animatedElements.forEach(el => {
        el.style.animationPlayState = 'paused';
        observer.observe(el);
    });
    
    // Initial calls
    toggleBackToTop();
    updateActiveIndicator();
});

// Keyboard Navigation
document.addEventListener('keydown', (e) => {
    // ESC key closes mobile nav
    if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
        closeMobileNav();
    }
    
    // Arrow keys for section navigation
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        const activeIndicator = document.querySelector('.indicator.active');
        if (activeIndicator) {
            const currentIndex = Array.from(indicators).indexOf(activeIndicator);
            let nextIndex;
            
            if (e.key === 'ArrowDown') {
                nextIndex = Math.min(currentIndex + 1, sections.length - 1);
            } else {
                nextIndex = Math.max(currentIndex - 1, 0);
            }
            
            if (nextIndex !== currentIndex) {
                e.preventDefault();
                sections[nextIndex].scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    }
});

// Touch/Swipe Navigation for Mobile
let touchStartY = 0;
let touchEndY = 0;

function handleSwipe() {
    const swipeThreshold = 50;
    const deltaY = touchStartY - touchEndY;
    
    if (Math.abs(deltaY) > swipeThreshold) {
        const activeIndicator = document.querySelector('.indicator.active');
        if (activeIndicator) {
            const currentIndex = Array.from(indicators).indexOf(activeIndicator);
            let nextIndex;
            
            if (deltaY > 0) { // Swipe up
                nextIndex = Math.min(currentIndex + 1, sections.length - 1);
            } else { // Swipe down
                nextIndex = Math.max(currentIndex - 1, 0);
            }
            
            if (nextIndex !== currentIndex) {
                sections[nextIndex].scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    }
}

document.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
});

document.addEventListener('touchend', (e) => {
    touchEndY = e.changedTouches[0].clientY;
    handleSwipe();
});

// Prevent default touch behavior on indicators and buttons
indicators.forEach(indicator => {
    indicator.addEventListener('touchstart', (e) => {
        e.preventDefault();
    });
});

backToTop.addEventListener('touchstart', (e) => {
    e.preventDefault();
});

// Resize handler
window.addEventListener('resize', () => {
    // Close mobile nav on resize to larger screen
    if (window.innerWidth > 768 && mobileNav.classList.contains('open')) {
        closeMobileNav();
    }
    
    // Recalculate active indicator on resize
    updateActiveIndicator();
});

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimized scroll handler for better performance
const optimizedScrollHandler = debounce(onScroll, 10);
window.removeEventListener('scroll', onScroll);
window.addEventListener('scroll', optimizedScrollHandler);

// Preload critical elements
document.addEventListener('DOMContentLoaded', () => {
    // Add loading completed class for animations
    document.body.classList.add('loaded');
    
    // Initialize tooltips for mobile indicators
    indicators.forEach((indicator, index) => {
        indicator.setAttribute('title', sections[index].id.charAt(0).toUpperCase() + sections[index].id.slice(1));
    });
    
    // Add focus management for accessibility
    const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    
    // Trap focus in mobile nav when open
    mobileNav.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            const focusable = mobileNav.querySelectorAll(focusableElements);
            const firstFocusable = focusable[0];
            const lastFocusable = focusable[focusable.length - 1];
            
            if (e.shiftKey) {
                if (document.activeElement === firstFocusable) {
                    lastFocusable.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastFocusable) {
                    firstFocusable.focus();
                    e.preventDefault();
                }
            }
        }
    });
});

// Add visual feedback for interactive elements
function addRippleEffect(element, event) {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');
    
    element.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Add ripple effect to buttons
document.querySelectorAll('.btn, .indicator, .back-to-top').forEach(button => {
    button.addEventListener('click', (e) => {
        if (!button.classList.contains('no-ripple')) {
            addRippleEffect(button, e);
        }
    });
});

// CSS for ripple effect
const style = document.createElement('style');
style.textContent = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .btn, .indicator, .back-to-top {
        position: relative;
        overflow: hidden;
    }
`;
document.head.appendChild(style);

// Initialize everything when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('Solidity vs Cosmos Developer Ecosystem Analysis - App Loaded');
    });
} else {
    console.log('Solidity vs Cosmos Developer Ecosystem Analysis - App Loaded');
}