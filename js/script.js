// Add a loading animation
document.addEventListener('DOMContentLoaded', function() {
    // Create loading overlay elements
    const loadingOverlay = document.createElement('div');
    loadingOverlay.className = 'loading-overlay';
    
    const loader = document.createElement('div');
    loader.className = 'loader';
    
    loadingOverlay.appendChild(loader);
    document.body.appendChild(loadingOverlay);
    
    // Hide loader after content is loaded
    window.addEventListener('load', function() {
        setTimeout(function() {
            loadingOverlay.classList.add('hide');
            setTimeout(function() {
                loadingOverlay.remove();
            }, 500);
        }, 500);
    });
    
    // Create scroll progress indicator
});

// Smooth scrolling for navigation links (only for hash links)
document.querySelectorAll('nav a[href^="#"]').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            window.scrollTo({
                top: targetSection.offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Update active navigation link based on scroll position
window.addEventListener('scroll', () => {
    const scrollPosition = window.scrollY;
    
    // Update scroll indicator width
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        const scrollPercentage = (scrollPosition / (document.body.scrollHeight - window.innerHeight)) * 100;
        scrollIndicator.style.width = `${scrollPercentage}%`;
    }
    
    // Show/hide header based on scroll direction
    const header = document.querySelector('header');
    if (header) {
        // Add shadow to header when scrolled
        if (scrollPosition > 10) {
            header.classList.add('shadow');
        } else {
            header.classList.remove('shadow');
        }
    }
    
    // Update active navigation link
    document.querySelectorAll('section').forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionBottom = sectionTop + section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            document.querySelectorAll('nav a').forEach(navLink => {
                navLink.classList.remove('active');
                if (navLink.getAttribute('href') === `#${sectionId}`) {
                    navLink.classList.add('active');
                }
            });
        }
    });
});

// Simple fade-in animation for projects
const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Add staggered animation delay for each card
            const index = Array.from(document.querySelectorAll('.project-card')).indexOf(entry.target);
            entry.target.style.transitionDelay = `${index * 0.1}s`;
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.project-card').forEach(card => {
    observer.observe(card);
});

// Animated skill bars (if they exist)
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const skillBar = entry.target;
            const progressValue = skillBar.getAttribute('data-progress') || '0';
            const progressElement = skillBar.querySelector('.skill-progress');
            
            if (progressElement) {
                setTimeout(() => {
                    progressElement.style.width = `${progressValue}%`;
                }, 200);
            }
            
            skillObserver.unobserve(skillBar);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.skill-bar').forEach(skillBar => {
    skillObserver.observe(skillBar);
});

// Add hover effects and animations to social icons
document.querySelectorAll('.social-icon').forEach(icon => {
    icon.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-3px) rotate(360deg)';
    });
    
    icon.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) rotate(0deg)';
    });
});

// Add parallax effect to hero section
const hero = document.querySelector('#hero');
if (hero) {
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;
        if (scrollPosition < hero.offsetHeight) {
            hero.style.backgroundPosition = `50% ${scrollPosition * 0.4}px`;
        }
    });
}

// Add typedjs effect to the hero heading if typed.js is available
if (typeof Typed !== 'undefined') {
    const heroHeading = document.querySelector('#hero h2');
    if (heroHeading) {
        const originalText = heroHeading.textContent;
        heroHeading.textContent = '';
        
        new Typed(heroHeading, {
            strings: [originalText],
            typeSpeed: 50,
            backSpeed: 0,
            loop: false,
            showCursor: true,
            cursorChar: '|',
            onComplete: function() {
                setTimeout(() => {
                    document.querySelector('.typed-cursor').style.display = 'none';
                }, 1500);
            }
        });
    }
}

// Simplified initialization function
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS library
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true
        });
    }
    
    // Initialize typed text if element exists
    const animateText = document.querySelector('.animate-text');
    if (animateText && typeof Typed !== 'undefined') {
        // Get options from JSON if available
        let typeOptions = {
            strings: ['Welcome to my portfolio'],
            typeSpeed: 50,
            backSpeed: 30,
            backDelay: 1500,
            startDelay: 1000,
            loop: true
        };
        
        // Try to get custom options
        const optionsScript = document.getElementById('typed-options');
        if (optionsScript) {
            try {
                const customOptions = JSON.parse(optionsScript.textContent);
                if (customOptions) {
                    typeOptions = Object.assign(typeOptions, customOptions);
                }
            } catch (e) {
                console.warn('Could not parse typed options');
            }
        }
        
        new Typed('.animate-text', typeOptions);
    }
    
    // Hide loading overlay if it exists
    const loadingOverlay = document.querySelector('.loading-overlay');
    if (loadingOverlay) {
        setTimeout(() => {
            loadingOverlay.classList.add('hide');
        }, 500);
    }
    
    // Initialize skill bars
    initSkillBars();
    
    // Add scroll event for header
    initHeaderScrollEffect();
    
    // Initialize project cards animation
    initProjectCardsAnimation();
    
    // Initialize hover effects
    initHoverEffects();
    
    // Initialize optional effects for desktop only
    if (window.innerWidth > 768 && !prefersReducedMotion()) {
        initCustomCursor();
        initParallaxEffect();
    }
});

// Check if user prefers reduced motion
function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Header scroll effects
function initHeaderScrollEffect() {
    const header = document.querySelector('header');
    if (!header) return;
    
    let lastScrollY = window.scrollY;
    let prevScrollY = window.scrollY;
    let ticking = false;
    
    window.addEventListener('scroll', () => {
        lastScrollY = window.scrollY;
        
        if (!ticking) {
            window.requestAnimationFrame(() => {
                if (lastScrollY > 100) {
                    header.classList.add('shadow');
                } else {
                    header.classList.remove('shadow');
                }
                
                if (lastScrollY > 200 && lastScrollY > prevScrollY) {
                    header.classList.add('hide');
                } else {
                    header.classList.remove('hide');
                }
                
                prevScrollY = lastScrollY;
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
}

// Initialize skill bars animation
function initSkillBars() {
    const skillBars = document.querySelectorAll('.skill-bar');
    if (!skillBars.length) return;
    
    skillBars.forEach(bar => {
        const progress = bar.querySelector('.skill-progress');
        const progressValue = bar.dataset.progress || 0;
        
        setTimeout(() => {
            progress.style.width = `${progressValue}%`;
        }, 500);
    });
}

// Initialize project cards animation
function initProjectCardsAnimation() {
    const projectCards = document.querySelectorAll('.project-card');
    if (!projectCards.length) return;
    
    projectCards.forEach((card, index) => {
        setTimeout(() => {
            card.classList.add('fade-in');
        }, 100 + (index * 100)); // Stagger the animations
    });
}

// Initialize custom cursor effect
function initCustomCursor() {
    let cursor = document.querySelector('.animated-cursor');
    
    // Create cursor element if it doesn't exist
    if (!cursor) {
        cursor = document.createElement('div');
        cursor.classList.add('animated-cursor');
        document.body.appendChild(cursor);
    }
    
    // Track mouse movement with throttling
    let throttleTimer;
    
    document.addEventListener('mousemove', (e) => {
        if (!throttleTimer) {
            throttleTimer = setTimeout(() => {
                cursor.style.left = `${e.clientX}px`;
                cursor.style.top = `${e.clientY}px`;
                throttleTimer = null;
            }, 10);
        }
    }, { passive: true });
    
    // Add hover effect for interactive elements
    const interactiveElements = document.querySelectorAll('a, button, input, textarea, .project-card, .social-icon');
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('active'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('active'));
    });
}

// Simple parallax effect for hero section
function initParallaxEffect() {
    const heroSection = document.querySelector('#hero');
    if (!heroSection) return;
    
    const heroTitle = heroSection.querySelector('h2');
    
    document.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        heroSection.style.backgroundPosition = `${50 - mouseX * 5}% ${50 - mouseY * 5}%`;
        
        if (heroTitle) {
            heroTitle.style.transform = `translate(${mouseX * 5 - 2.5}px, ${mouseY * 5 - 2.5}px)`;
        }
    }, { passive: true });
}

// Initialize hover effects for elements
function initHoverEffects() {
    const glowElements = document.querySelectorAll('.project-link, .social-icon, .submit-btn');
    
    glowElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            el.style.boxShadow = 'var(--neon-shadow)';
        });
        
        el.addEventListener('mouseleave', () => {
            el.style.boxShadow = '';
        });
    });
} 