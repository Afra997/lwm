// Advanced Animations and Interactions

class AdvancedAnimations {
    constructor() {
        this.init();
    }

    init() {
        this.setupParallaxEffects();
        this.setupGlowEffects();
        this.setupProgressiveReveal();
        this.setupInteractiveElements();
        this.setupPerformanceOptimizations();
    }

    setupParallaxEffects() {
        const parallaxElements = document.querySelectorAll('.hero-background, .vr-headset');
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            
            parallaxElements.forEach(element => {
                if (this.isElementInViewport(element)) {
                    element.style.transform = `translateY(${rate}px)`;
                }
            });
        });
    }

    setupGlowEffects() {
        const glowElements = document.querySelectorAll('.artifact-model, .vr-headset, .feature-icon');
        
        glowElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                this.addGlowEffect(element);
            });
            
            element.addEventListener('mouseleave', () => {
                this.removeGlowEffect(element);
            });
        });
    }

    addGlowEffect(element) {
        element.style.boxShadow = `
            0 0 20px rgba(218, 165, 32, 0.4),
            0 0 40px rgba(218, 165, 32, 0.2),
            0 0 60px rgba(218, 165, 32, 0.1)
        `;
        element.style.transform = element.style.transform + ' scale(1.02)';
    }

    removeGlowEffect(element) {
        element.style.boxShadow = '';
        element.style.transform = element.style.transform.replace(' scale(1.02)', '');
    }

    setupProgressiveReveal() {
        const revealElements = document.querySelectorAll(
            '.feature-card, .artifact-card, .stage, .result-item'
        );
        
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('revealed');
                        this.animateElementReveal(entry.target);
                    }, index * 100);
                    revealObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        revealElements.forEach(element => {
            element.classList.add('reveal-element');
            revealObserver.observe(element);
        });
    }

    animateElementReveal(element) {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
        
        // Add subtle entrance animation
        element.animate([
            { opacity: 0, transform: 'translateY(30px) scale(0.95)' },
            { opacity: 1, transform: 'translateY(0) scale(1)' }
        ], {
            duration: 600,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            fill: 'forwards'
        });
    }

    setupInteractiveElements() {
        this.setupButtonRippleEffect();
        this.setupCardInteractions();
        this.setupSearchEnhancements();
        this.setupScrollIndicators();
    }

    setupButtonRippleEffect() {
        const buttons = document.querySelectorAll('.btn-primary, .btn-secondary, .btn-outline');
        
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                this.createRippleEffect(e, button);
            });
        });
    }

    createRippleEffect(e, element) {
        const ripple = document.createElement('span');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            top: ${y}px;
            left: ${x}px;
            width: ${size}px;
            height: ${size}px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;
        
        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    setupCardInteractions() {
        const cards = document.querySelectorAll('.feature-card, .artifact-card');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                this.animateCardHover(card, true);
            });
            
            card.addEventListener('mouseleave', () => {
                this.animateCardHover(card, false);
            });
        });
    }

    animateCardHover(card, isHovering) {
        const icon = card.querySelector('.feature-icon, .artifact-3d');
        const content = card.querySelector('.feature-description, .artifact-details');
        
        if (isHovering) {
            if (icon) {
                icon.style.transform = 'scale(1.1) rotate(5deg)';
            }
            if (content) {
                content.style.transform = 'translateY(-2px)';
            }
        } else {
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0deg)';
            }
            if (content) {
                content.style.transform = 'translateY(0)';
            }
        }
    }

    setupSearchEnhancements() {
        const searchInput = document.getElementById('archiveSearch');
        if (!searchInput) return;

        // Add search suggestions
        const suggestions = [
            'rifle', 'independence', 'uniform', 'medal', 'document',
            '1971', 'liberation', 'freedom fighter', 'mukti bahini'
        ];

        searchInput.addEventListener('focus', () => {
            this.showSearchSuggestions(searchInput, suggestions);
        });

        searchInput.addEventListener('blur', () => {
            setTimeout(() => this.hideSearchSuggestions(), 200);
        });

        // Enhanced search with debouncing
        let searchTimeout;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                this.performEnhancedSearch(e.target.value);
            }, 300);
        });
    }

    showSearchSuggestions(input, suggestions) {
        const existingSuggestions = document.querySelector('.search-suggestions');
        if (existingSuggestions) return;

        const suggestionsContainer = document.createElement('div');
        suggestionsContainer.className = 'search-suggestions';
        suggestionsContainer.style.cssText = `
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: white;
            border: 1px solid var(--neutral-200);
            border-radius: var(--radius-lg);
            box-shadow: var(--shadow-lg);
            max-height: 200px;
            overflow-y: auto;
            z-index: 100;
        `;

        suggestions.forEach(suggestion => {
            const suggestionItem = document.createElement('div');
            suggestionItem.className = 'suggestion-item';
            suggestionItem.textContent = suggestion;
            suggestionItem.style.cssText = `
                padding: var(--space-3) var(--space-4);
                cursor: pointer;
                transition: var(--transition-base);
                border-bottom: 1px solid var(--neutral-100);
            `;
            
            suggestionItem.addEventListener('mouseenter', () => {
                suggestionItem.style.background = 'var(--heritage-50)';
            });
            
            suggestionItem.addEventListener('mouseleave', () => {
                suggestionItem.style.background = 'transparent';
            });
            
            suggestionItem.addEventListener('click', () => {
                input.value = suggestion;
                this.hideSearchSuggestions();
                this.performEnhancedSearch(suggestion);
            });
            
            suggestionsContainer.appendChild(suggestionItem);
        });

        input.parentElement.appendChild(suggestionsContainer);
    }

    hideSearchSuggestions() {
        const suggestions = document.querySelector('.search-suggestions');
        if (suggestions) {
            suggestions.remove();
        }
    }

    performEnhancedSearch(query) {
        const results = document.querySelectorAll('.result-item');
        let visibleCount = 0;
        
        results.forEach(result => {
            const title = result.querySelector('h4').textContent.toLowerCase();
            const description = result.querySelector('p').textContent.toLowerCase();
            const tags = Array.from(result.querySelectorAll('.tag')).map(tag => tag.textContent.toLowerCase());
            
            const matchesQuery = query === '' || 
                title.includes(query.toLowerCase()) || 
                description.includes(query.toLowerCase()) ||
                tags.some(tag => tag.includes(query.toLowerCase()));
            
            if (matchesQuery) {
                result.style.display = 'flex';
                result.style.animation = `fadeInUp 0.5s ease forwards ${visibleCount * 0.1}s`;
                visibleCount++;
            } else {
                result.style.display = 'none';
            }
        });

        // Show search results count
        this.updateSearchResults(visibleCount, query);
    }

    updateSearchResults(count, query) {
        const searchContainer = document.querySelector('.dashboard-main');
        let resultsInfo = searchContainer.querySelector('.search-results-info');
        
        if (!resultsInfo) {
            resultsInfo = document.createElement('div');
            resultsInfo.className = 'search-results-info';
            resultsInfo.style.cssText = `
                margin-bottom: var(--space-4);
                padding: var(--space-3);
                background: var(--heritage-50);
                border-radius: var(--radius-md);
                color: var(--heritage-700);
                font-weight: 500;
            `;
            searchContainer.insertBefore(resultsInfo, searchContainer.querySelector('.archive-results'));
        }
        
        if (query) {
            resultsInfo.textContent = `Found ${count} results for "${query}"`;
            resultsInfo.style.display = 'block';
        } else {
            resultsInfo.style.display = 'none';
        }
    }

    setupScrollIndicators() {
        // Create scroll progress indicator
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 3px;
            background: linear-gradient(90deg, var(--heritage-500), var(--heritage-600));
            z-index: 9999;
            transition: width 0.1s ease;
        `;
        document.body.appendChild(progressBar);

        window.addEventListener('scroll', () => {
            const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
            progressBar.style.width = `${Math.min(100, Math.max(0, scrollPercent))}%`;
        });
    }

    setupPerformanceOptimizations() {
        // Lazy loading for images and heavy content
        const lazyElements = document.querySelectorAll('.artifact-3d, .preview-scene');
        
        const lazyObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadElement(entry.target);
                    lazyObserver.unobserve(entry.target);
                }
            });
        }, {
            rootMargin: '50px'
        });

        lazyElements.forEach(element => {
            lazyObserver.observe(element);
        });

        // Reduce motion for users who prefer it
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            this.disableAnimations();
        }
    }

    loadElement(element) {
        element.classList.add('loaded');
        
        // Simulate heavy content loading
        setTimeout(() => {
            element.style.opacity = '1';
        }, Math.random() * 300 + 100);
    }

    disableAnimations() {
        const style = document.createElement('style');
        style.textContent = `
            *, *::before, *::after {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }
        `;
        document.head.appendChild(style);
    }

    isElementInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    // Advanced loading states
    createLoadingEffect(element) {
        const loader = document.createElement('div');
        loader.className = 'content-loader';
        loader.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(90deg, 
                transparent 0%, 
                rgba(255, 255, 255, 0.4) 50%, 
                transparent 100%);
            animation: shimmer 1.5s infinite;
            z-index: 10;
        `;
        
        element.style.position = 'relative';
        element.appendChild(loader);
        
        return loader;
    }

    removeLoadingEffect(element) {
        const loader = element.querySelector('.content-loader');
        if (loader) {
            loader.remove();
        }
    }

    // Interactive feedback system
    setupFeedbackSystem() {
        const interactiveElements = document.querySelectorAll(
            'button, .artifact-card, .feature-card, .nav-link'
        );
        
        interactiveElements.forEach(element => {
            element.addEventListener('click', (e) => {
                this.createFeedbackIndicator(e);
            });
        });
    }

    createFeedbackIndicator(event) {
        const indicator = document.createElement('div');
        const rect = event.target.getBoundingClientRect();
        
        indicator.style.cssText = `
            position: fixed;
            top: ${event.clientY}px;
            left: ${event.clientX}px;
            width: 20px;
            height: 20px;
            background: var(--heritage-400);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            animation: feedbackPulse 0.6s ease-out forwards;
        `;
        
        document.body.appendChild(indicator);
        
        setTimeout(() => {
            indicator.remove();
        }, 600);
    }

    // Theme switching capability
    setupThemeToggle() {
        const themeToggle = document.createElement('button');
        themeToggle.className = 'theme-toggle';
        themeToggle.innerHTML = `
            <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3C16.97 3 21 7.03 21 12S16.97 21 12 21C7.03 21 3 16.97 3 12S7.03 3 12 3ZM12 19C15.86 19 19 15.86 19 12S15.86 5 12 5V19Z"/>
            </svg>
        `;
        themeToggle.style.cssText = `
            position: fixed;
            bottom: var(--space-6);
            right: var(--space-6);
            width: 50px;
            height: 50px;
            background: var(--heritage-600);
            color: white;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            box-shadow: var(--shadow-lg);
            z-index: 1000;
            transition: var(--transition-base);
        `;
        
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');
            this.updateThemeColors();
        });
        
        document.body.appendChild(themeToggle);
    }

    updateThemeColors() {
        if (document.body.classList.contains('dark-theme')) {
            document.documentElement.style.setProperty('--neutral-50', '#0f0f0f');
            document.documentElement.style.setProperty('--neutral-100', '#1a1a1a');
            document.documentElement.style.setProperty('--neutral-900', '#ffffff');
        } else {
            document.documentElement.style.setProperty('--neutral-50', '#fafafa');
            document.documentElement.style.setProperty('--neutral-100', '#f5f5f5');
            document.documentElement.style.setProperty('--neutral-900', '#171717');
        }
    }

    // Performance monitoring
    monitorPerformance() {
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (entry.name.includes('animation') && entry.duration > 16) {
                        console.warn('Slow animation detected:', entry.name, entry.duration);
                    }
                }
            });
            
            observer.observe({ entryTypes: ['measure'] });
        }
    }
}

// Enhanced CSS animations
const advancedStyles = document.createElement('style');
advancedStyles.textContent = `
    @keyframes shimmer {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
    }
    
    @keyframes ripple {
        0% {
            transform: scale(0);
            opacity: 1;
        }
        100% {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    @keyframes feedbackPulse {
        0% {
            transform: scale(1);
            opacity: 1;
        }
        50% {
            transform: scale(1.5);
            opacity: 0.7;
        }
        100% {
            transform: scale(2);
            opacity: 0;
        }
    }
    
    .reveal-element {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }
    
    .reveal-element.revealed {
        opacity: 1;
        transform: translateY(0);
    }
    
    .loaded {
        animation: contentLoad 0.8s ease-out forwards;
    }
    
    @keyframes contentLoad {
        from {
            opacity: 0;
            transform: scale(0.95);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }
    
    /* Enhanced hover states */
    .feature-card, .artifact-card {
        transform-origin: center;
        will-change: transform;
    }
    
    .feature-icon, .artifact-3d {
        transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        will-change: transform;
    }
    
    /* Smooth transitions for theme switching */
    * {
        transition-property: background-color, border-color, color, box-shadow;
    }
    
    /* Enhanced focus indicators */
    .keyboard-navigation *:focus {
        outline: 3px solid var(--heritage-400);
        outline-offset: 2px;
        border-radius: var(--radius-md);
    }
    
    /* Micro-interactions */
    .btn-primary:active {
        transform: translateY(1px) scale(0.98);
    }
    
    .control-btn:active {
        transform: translateY(1px) scale(0.95);
    }
    
    .nav-link:hover {
        transform: translateY(-1px);
    }
    
    /* Loading skeletons */
    .loading-skeleton {
        background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
        background-size: 200% 100%;
        animation: loading 1.5s infinite;
    }
    
    @keyframes loading {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
    }
`;
document.head.appendChild(advancedStyles);

// Initialize advanced animations
document.addEventListener('DOMContentLoaded', () => {
    new AdvancedAnimations();
});

// Export for use in other modules
window.AdvancedAnimations = AdvancedAnimations;