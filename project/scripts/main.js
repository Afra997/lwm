// Main JavaScript Functions

class ArchiveApp {
    constructor() {
        this.currentFilter = 'all';
        this.currentTimeline = '1971';
        this.isModalOpen = false;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeParticles();
        this.setupIntersectionObserver();
        this.animateCounters();
        this.setupNavigation();
    }

    setupEventListeners() {
        // Navigation toggle
        const navToggle = document.getElementById('navToggle');
        const navMenu = document.getElementById('navMenu');
        
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
            });
        }

        // Filter buttons
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.filterGallery(e.target.dataset.filter);
            });
        });

        // Timeline navigation
        const timelineBtns = document.querySelectorAll('.timeline-nav-btn');
        timelineBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchTimeline(e.target.dataset.year);
            });
        });

        // Modal controls
        const modalClose = document.getElementById('modalClose');
        const modalOverlay = document.getElementById('artifactModal');
        
        if (modalClose) {
            modalClose.addEventListener('click', () => this.closeModal());
        }
        
        if (modalOverlay) {
            modalOverlay.addEventListener('click', (e) => {
                if (e.target === modalOverlay) {
                    this.closeModal();
                }
            });
        }

        // Artifact cards
        const artifactCards = document.querySelectorAll('.artifact-card');
        artifactCards.forEach(card => {
            card.addEventListener('click', () => {
                this.openArtifactModal(card);
            });
        });

        // Search functionality
        const searchInput = document.getElementById('archiveSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchArchive(e.target.value);
            });
        }

        // Smooth scrolling for navigation links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    setupNavigation() {
        const navbar = document.querySelector('.navbar');
        let lastScrollY = window.scrollY;

        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            
            if (currentScrollY > 100) {
                navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            } else {
                navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            }

            // Update active nav link based on scroll position
            const sections = document.querySelectorAll('section[id]');
            const navLinks = document.querySelectorAll('.nav-link');
            
            let currentSection = '';
            sections.forEach(section => {
                const rect = section.getBoundingClientRect();
                if (rect.top <= 100 && rect.bottom >= 100) {
                    currentSection = section.id;
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentSection}`) {
                    link.classList.add('active');
                }
            });

            lastScrollY = currentScrollY;
        });
    }

    initializeParticles() {
        const particlesContainer = document.getElementById('heroParticles');
        if (!particlesContainer) return;

        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.cssText = `
                position: absolute;
                width: ${Math.random() * 4 + 2}px;
                height: ${Math.random() * 4 + 2}px;
                background: rgba(218, 165, 32, ${Math.random() * 0.5 + 0.1});
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: float ${Math.random() * 10 + 5}s ease-in-out infinite;
                animation-delay: ${Math.random() * 5}s;
            `;
            particlesContainer.appendChild(particle);
        }
    }

    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'fadeInUp 0.8s ease forwards';
                }
            });
        }, observerOptions);

        // Observe feature cards and other elements
        const elementsToAnimate = document.querySelectorAll(
            '.feature-card, .artifact-card, .timeline-event, .stage'
        );
        
        elementsToAnimate.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            observer.observe(el);
        });
    }

    animateCounters() {
        const counters = document.querySelectorAll('.stat-number[data-target]');
        
        const animateCounter = (counter) => {
            const target = parseFloat(counter.dataset.target);
            const increment = target / 100;
            let current = 0;
            
            const updateCounter = () => {
                if (current < target) {
                    current += increment;
                    counter.textContent = current.toFixed(1);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target.toString();
                }
            };
            
            updateCounter();
        };

        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        });

        counters.forEach(counter => {
            counterObserver.observe(counter);
        });
    }

    filterGallery(filter) {
        this.currentFilter = filter;
        
        // Update filter buttons
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.filter === filter) {
                btn.classList.add('active');
            }
        });

        // Filter artifacts
        const artifactCards = document.querySelectorAll('.artifact-card');
        artifactCards.forEach(card => {
            const category = card.dataset.category;
            if (filter === 'all' || category === filter) {
                card.style.display = 'block';
                card.style.animation = 'fadeInUp 0.5s ease forwards';
            } else {
                card.style.display = 'none';
            }
        });
    }

    switchTimeline(year) {
        this.currentTimeline = year;
        
        // Update navigation buttons
        const navBtns = document.querySelectorAll('.timeline-nav-btn');
        navBtns.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.year === year) {
                btn.classList.add('active');
            }
        });

        // Update timeline content
        const timelineYears = document.querySelectorAll('.timeline-year');
        timelineYears.forEach(yearEl => {
            yearEl.classList.remove('active');
            if (yearEl.dataset.year === year) {
                yearEl.classList.add('active');
            }
        });
    }

    openArtifactModal(card) {
        const modal = document.getElementById('artifactModal');
        const modalTitle = document.getElementById('modalTitle');
        
        if (modal && modalTitle) {
            const title = card.querySelector('h3').textContent;
            modalTitle.textContent = title;
            
            modal.classList.add('active');
            this.isModalOpen = true;
            document.body.style.overflow = 'hidden';
        }
    }

    closeModal() {
        const modal = document.getElementById('artifactModal');
        if (modal) {
            modal.classList.remove('active');
            this.isModalOpen = false;
            document.body.style.overflow = 'auto';
        }
    }

    searchArchive(query) {
        // Simulate search functionality
        console.log('Searching for:', query);
        
        const results = document.querySelectorAll('.result-item');
        results.forEach(result => {
            const title = result.querySelector('h4').textContent.toLowerCase();
            const description = result.querySelector('p').textContent.toLowerCase();
            
            if (query === '' || title.includes(query.toLowerCase()) || description.includes(query.toLowerCase())) {
                result.style.display = 'flex';
            } else {
                result.style.display = 'none';
            }
        });
    }
}

// Global functions for button interactions
function startVirtualTour() {
    alert('Starting virtual tour... This would integrate with VR/AR libraries in a real implementation.');
}

function exploreArchive() {
    const archiveSection = document.getElementById('archive');
    if (archiveSection) {
        archiveSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ArchiveApp();
});

// Handle keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const app = new ArchiveApp();
        if (app.isModalOpen) {
            app.closeModal();
        }
    }
});

// Progress indicator for page loading
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Error handling for missing elements
window.addEventListener('error', (e) => {
    console.warn('Non-critical error:', e.message);
});

// Performance monitoring
const performanceObserver = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
        if (entry.entryType === 'navigation') {
            console.log('Page load time:', entry.loadEventEnd - entry.loadEventStart, 'ms');
        }
    }
});

if ('PerformanceObserver' in window) {
    performanceObserver.observe({ entryTypes: ['navigation'] });
}

// Accessibility enhancements
document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
    }
});

document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-navigation');
});

// Add CSS for keyboard navigation
const style = document.createElement('style');
style.textContent = `
    .keyboard-navigation *:focus {
        outline: 2px solid var(--heritage-500) !important;
        outline-offset: 2px !important;
    }
`;
document.head.appendChild(style);