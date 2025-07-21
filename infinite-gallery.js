// JJITA Events & Activities Gallery - Complete Single File Component
// This file contains all CSS, JavaScript, and functionality for the gallery

// Inject CSS styles into the document
function injectGalleryStyles() {
    const styleId = 'jjita-gallery-styles';
    if (document.getElementById(styleId)) return; // Prevent duplicate injection

    const styles = `
/* JJITA Association Gallery - Complete Styles */
.association-gallery {
    padding: 80px 0;
    background: linear-gradient(135deg, var(--bg-secondary, #1e293b) 0%, var(--bg-primary, #0f172a) 50%, var(--bg-secondary, #1e293b) 100%);
    position: relative;
    overflow: hidden;
    min-height: 600px;
}

.association-gallery::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
        url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect fill="none" width="100" height="100"/><rect fill="rgba(100,116,139,0.05)" x="25" y="25" width="50" height="50" transform="rotate(45 50 50)"/></svg>'),
        radial-gradient(circle at 20% 20%, rgba(100, 116, 139, 0.08) 0%, transparent 50%),
        radial-gradient(circle at 80% 80%, rgba(71, 85, 105, 0.06) 0%, transparent 50%);
    opacity: 0.4;
    z-index: 0;
    pointer-events: none;
}

.gallery-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 20px;
}

/* Dynamic Gallery Grid */
.gallery-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 25px;
    opacity: 0;
    transition: opacity 0.6s ease;
}

.gallery-grid.loaded {
    opacity: 1;
}

/* Loading States */
.gallery-loading {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 80px 20px;
    flex-direction: column;
    gap: 20px;
}

.loading-spinner {
    width: 50px;
    height: 50px;
    border: 4px solid #e5e7eb;
    border-top: 4px solid #64748b;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.loading-text {
    color: rgba(255, 255, 255, 0.8);
    font-size: 16px;
    font-weight: 500;
}

/* Gallery Item Styles */
.gallery-item {
    background: rgba(30, 41, 59, 0.9);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 
        0 4px 20px rgba(0, 0, 0, 0.2),
        0 1px 3px rgba(0, 0, 0, 0.3);
    transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
    position: relative;
    transform: translateY(30px) scale(0.95);
    opacity: 0;
    cursor: pointer;
    will-change: transform, opacity, box-shadow;
}

.gallery-item.visible {
    transform: translateY(0) scale(1);
    opacity: 1;
}

.gallery-item:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 
        0 20px 40px rgba(0, 0, 0, 0.3),
        0 8px 16px rgba(0, 0, 0, 0.2);
    border-color: rgba(255, 255, 255, 0.2);
    background: rgba(30, 41, 59, 0.95);
}

.gallery-item:active {
    transform: translateY(-4px) scale(1.01);
    transition: all 0.2s cubic-bezier(0.23, 1, 0.32, 1);
}

/* Dynamic size classes */
.gallery-item.size-large {
    grid-row: span 2;
}

.gallery-item.size-medium {
    grid-row: span 1;
}

.gallery-item.size-small {
    grid-row: span 1;
}

/* Gallery Image Container */
.gallery-image {
    position: relative;
    height: 250px;
    overflow: hidden;
    background: linear-gradient(45deg, #1e293b, #334155);
}

.gallery-item.size-large .gallery-image {
    height: 350px;
}

.gallery-item.size-small .gallery-image {
    height: 200px;
}

.gallery-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    filter: brightness(1.05) contrast(1.05);
}

.gallery-item:hover .gallery-image img {
    transform: scale(1.08);
}

/* Image Loading States */
.gallery-image.loading {
    background: linear-gradient(90deg, 
        #1e293b 25%, 
        #334155 50%, 
        #1e293b 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
}

/* Image Overlay */
.image-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(8px) saturate(120%);
    opacity: 0;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    display: flex;
    align-items: center;
    justify-content: center;
}

.gallery-item:hover .image-overlay {
    opacity: 1;
}

/* Gallery Actions */
.gallery-actions {
    display: flex;
    gap: 15px;
    transform: translateY(20px);
    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.gallery-item:hover .gallery-actions {
    transform: translateY(0);
}

.gallery-btn {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    border: 2px solid rgba(255, 255, 255, 0.8);
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(12px);
    color: white;
    font-size: 18px;
    cursor: pointer;
    transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    transform: scale(1);
    will-change: transform, background-color, box-shadow;
}

.gallery-btn:hover {
    background: rgba(255, 255, 255, 0.95);
    color: #1e293b;
    transform: scale(1.15);
    border-color: rgba(255, 255, 255, 1);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
}

.gallery-btn:active {
    transform: scale(1.05);
    transition: all 0.15s cubic-bezier(0.23, 1, 0.32, 1);
}

/* Gallery Date Badge */
.gallery-date {
    position: absolute;
    top: 20px;
    right: 20px;
    background: rgba(30, 41, 59, 0.9);
    backdrop-filter: blur(12px);
    color: white;
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 13px;
    font-weight: 600;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.1);
}

/* Gallery Content */
.gallery-content {
    padding: 25px;
    background: transparent;
}

.gallery-title {
    font-size: 20px;
    font-weight: 700;
    color: #ffffff;
    margin-bottom: 12px;
    line-height: 1.3;
    transition: color 0.3s ease;
}

.gallery-item:hover .gallery-title {
    color: #ffffff;
}

.gallery-description {
    color: rgba(255, 255, 255, 0.8);
    font-size: 15px;
    line-height: 1.6;
    margin: 0;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    line-clamp: 3;
}

/* Load More Button */
.gallery-load-trigger {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 40px;
    opacity: 0;
    transform: translateY(20px);
    animation: fadeInUp 0.6s ease forwards;
    animation-delay: 0.3s;
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.load-more-btn {
    background: linear-gradient(135deg, #1e293b, #475569);
    color: white;
    border: none;
    padding: 12px 30px;
    border-radius: 25px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    position: relative;
    overflow: hidden;
    transform: translateY(0) scale(1);
    will-change: transform, box-shadow, background;
    min-width: 180px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
}

.load-more-btn::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
    transition: left 0.6s cubic-bezier(0.23, 1, 0.32, 1);
}

.load-more-btn:hover {
    transform: translateY(-3px) scale(1.05);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.3);
    background: linear-gradient(135deg, #334155, #64748b);
    border-color: rgba(255, 255, 255, 0.2);
}

.load-more-btn:hover::before {
    left: 100%;
}

.load-more-btn:active {
    transform: translateY(-1px) scale(1.02);
    transition: all 0.15s cubic-bezier(0.23, 1, 0.32, 1);
}

.load-more-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: translateY(0) scale(1);
    background: linear-gradient(135deg, #374151, #4b5563);
    pointer-events: none;
}

/* Loading state for button */
.load-more-btn.loading {
    position: relative;
    color: transparent;
    pointer-events: none;
}

.load-more-btn.loading::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 20px;
    height: 20px;
    margin: -10px 0 0 -10px;
    border: 2px solid transparent;
    border-top: 2px solid #ffffff;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

/* Error state for button */
.load-more-btn.error {
    background: linear-gradient(135deg, #dc2626, #b91c1c);
    animation: shake 0.5s ease-in-out;
}

@keyframes shake {
    0%, 100% { transform: translateX(0) translateY(-3px); }
    25% { transform: translateX(-5px) translateY(-3px); }
    75% { transform: translateX(5px) translateY(-3px); }
}

.load-more-btn.success {
    background: linear-gradient(135deg, #059669, #047857);
    animation: pulse 0.6s ease-in-out;
}

@keyframes pulse {
    0% { transform: translateY(-3px) scale(1.05); }
    50% { transform: translateY(-3px) scale(1.1); }
    100% { transform: translateY(-3px) scale(1.05); }
}

/* Error States */
.gallery-error {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    padding: 80px 20px;
    color: rgba(255, 255, 255, 0.8);
}

.error-icon {
    font-size: 48px;
    color: #ef4444;
}

.error-message {
    font-size: 18px;
    font-weight: 600;
}

.error-details {
    font-size: 14px;
    opacity: 0.7;
}

.retry-btn {
    background: #ef4444;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 20px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.retry-btn:hover {
    background: #dc2626;
    transform: translateY(-2px);
}

/* Enhanced Lightbox */
.gallery-lightbox {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 9999;
    display: none;
    align-items: center;
    justify-content: center;
    padding: 20px;
    opacity: 0;
    visibility: hidden;
    transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
}

.gallery-lightbox.active {
    display: flex;
    opacity: 1;
    visibility: visible;
}

.lightbox-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0);
    backdrop-filter: blur(0px);
    transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
}

.gallery-lightbox.active .lightbox-overlay {
    background: rgba(0, 0, 0, 0.9);
    backdrop-filter: blur(15px);
}

.lightbox-container {
    position: relative;
    max-width: 1000px;
    max-height: 90vh;
    width: 100%;
    background: rgba(30, 41, 59, 0.95);
    backdrop-filter: blur(20px);
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
    border: 1px solid rgba(255, 255, 255, 0.1);
    transform: scale(0.8) translateY(50px);
    opacity: 0;
    transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
}

.gallery-lightbox.active .lightbox-container {
    transform: scale(1) translateY(0);
    opacity: 1;
}

.lightbox-close {
    position: absolute;
    top: 20px;
    right: 20px;
    width: 40px;
    height: 40px;
    background: rgba(0, 0, 0, 0.7);
    border: none;
    border-radius: 50%;
    color: white;
    cursor: pointer;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
}

.lightbox-close:hover {
    background: rgba(0, 0, 0, 0.9);
    transform: scale(1.1);
}

.lightbox-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    min-height: 500px;
}

.lightbox-image {
    position: relative;
    overflow: hidden;
}

.lightbox-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
    opacity: 1;
    transform: scale(1);
}

.lightbox-image img.changing {
    opacity: 0;
    transform: scale(1.05);
}

.lightbox-info {
    padding: 40px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    color: white;
}

.lightbox-title {
    font-size: 28px;
    font-weight: 700;
    color: white;
    margin-bottom: 15px;
    line-height: 1.2;
}

.lightbox-description {
    color: rgba(255, 255, 255, 0.8);
    line-height: 1.7;
    margin-bottom: 30px;
    font-size: 16px;
}

.lightbox-details {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.detail-item {
    display: flex;
    align-items: center;
    gap: 12px;
    color: rgba(255, 255, 255, 0.9);
    font-size: 15px;
}

.detail-item i {
    color: #64748b;
    width: 20px;
}

/* Navigation Buttons */
.lightbox-navigation {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 100%;
    display: flex;
    justify-content: space-between;
    padding: 0 20px;
    pointer-events: none;
}

.nav-btn {
    width: 50px;
    height: 50px;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    color: white;
    cursor: pointer;
    pointer-events: all;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.nav-btn:hover {
    background: #1e293b;
    color: white;
    transform: scale(1.1);
}

.nav-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

/* Responsive Design */
@media (max-width: 1024px) {
    .gallery-grid {
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 20px;
    }
    
    .lightbox-content {
        grid-template-columns: 1fr;
    }
    
    .lightbox-image {
        max-height: 300px;
    }
}

@media (max-width: 768px) {
    .association-gallery {
        padding: 60px 0;
    }
    
    .gallery-container {
        padding: 0 15px;
    }
    
    .gallery-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 15px;
    }
    
    .gallery-item.size-large,
    .gallery-item.size-medium,
    .gallery-item.size-small {
        grid-row: span 1;
    }
    
    .gallery-item.size-large .gallery-image,
    .gallery-item.size-small .gallery-image {
        height: 250px;
    }
    
    .lightbox-container {
        width: 95%;
        margin: 2.5vh auto;
        max-height: 95vh;
    }
    
    .lightbox-info {
        padding: 30px;
    }
    
    .lightbox-title {
        font-size: 24px;
    }
}

@media (max-width: 480px) {
    .association-gallery {
        padding: 40px 0;
    }
    
    .gallery-container {
        padding: 0 10px;
    }
    
    .gallery-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 10px;
    }
    
    .gallery-content {
        padding: 15px;
    }
    
    .gallery-title {
        font-size: 16px;
        line-height: 1.3;
    }
    
    .gallery-description {
        font-size: 13px;
        line-height: 1.4;
    }
    
    .gallery-btn {
        width: 40px;
        height: 40px;
        font-size: 14px;
    }
    
    .gallery-date {
        font-size: 11px;
        padding: 6px 12px;
    }
    
    .lightbox-info {
        padding: 20px;
    }
    
    .lightbox-title {
        font-size: 20px;
    }
}

/* Accessibility Improvements */
.gallery-btn:focus,
.lightbox-close:focus,
.nav-btn:focus,
.load-more-btn:focus,
.retry-btn:focus {
    outline: 2px solid #64748b;
    outline-offset: 2px;
}

@media (prefers-reduced-motion: reduce) {
    .gallery-item,
    .gallery-image img,
    .image-overlay,
    .gallery-actions,
    .lightbox-container {
        transition: none !important;
        animation: none !important;
    }
}

/* Animation classes */
.gallery-item.animate-in {
    animation: fadeInUp 0.6s ease forwards;
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
`;

    const styleElement = document.createElement('style');
    styleElement.id = styleId;
    styleElement.textContent = styles;
    document.head.appendChild(styleElement);
}

// Infinite Dynamic Gallery System
class InfiniteAssociationGallery {
    constructor(config = {}) {
        // Inject CSS styles first
        injectGalleryStyles();
        
        // Configuration with defaults
        this.config = {
            apiEndpoint: config.apiEndpoint || '/api/gallery-items',
            itemsPerPage: config.itemsPerPage || 6,
            enableInfiniteScroll: config.enableInfiniteScroll !== false,
            enableLoadMore: config.enableLoadMore !== false,
            autoLoad: config.autoLoad !== false,
            mockData: config.mockData !== false, // Enable mock data for demo
            ...config
        };

        // State management
        this.state = {
            items: [],
            currentPage: 1,
            totalPages: 1,
            isLoading: false,
            hasError: false,
            errorMessage: '',
            isInitialized: false
        };

        // DOM elements
        this.elements = {};
        
        // Initialize the gallery
        this.init();
    }

    async init() {
        try {
            this.setupDOMElements();
            this.setupEventListeners();
            this.setupIntersectionObserver();
            
            if (this.config.autoLoad) {
                await this.loadInitialData();
            } else {
                // Show load more button immediately if auto-load is disabled
                this.updateLoadMoreButton();
            }
            
            this.state.isInitialized = true;
            console.log('🚀 Infinite Association Gallery initialized successfully!');
        } catch (error) {
            console.error('Failed to initialize gallery:', error);
            this.handleError('Failed to initialize gallery', error);
        }
    }

    setupDOMElements() {
        // Find the gallery container - look for .gallery-container first, then .container within .association-gallery
        this.elements.container = document.querySelector('.gallery-container') || 
                                  document.querySelector('.association-gallery .container') ||
                                  document.querySelector('.container');
        
        if (!this.elements.container) {
            throw new Error('Gallery container not found');
        }

        // Create gallery grid if it doesn't exist
        this.elements.grid = document.getElementById('galleryGrid') || 
                            this.createElement('div', 'gallery-grid', 'galleryGrid');
        
        // Create loading indicator
        this.elements.loadingIndicator = this.createLoadingIndicator();
        
        // Create error container
        this.elements.errorContainer = this.createErrorContainer();
        
        // Create load more button
        this.elements.loadMoreContainer = this.createLoadMoreContainer();
        
        // Setup lightbox
        this.setupLightbox();
        
        // Append elements to gallery container (not body)
        if (!document.getElementById('galleryGrid')) {
            this.elements.container.appendChild(this.elements.grid);
        }
        
        // Add other elements after the gallery grid within the same container
        this.elements.container.appendChild(this.elements.loadingIndicator);
        this.elements.container.appendChild(this.elements.errorContainer);
        this.elements.container.appendChild(this.elements.loadMoreContainer);
    }

    createElement(tag, className, id = null) {
        const element = document.createElement(tag);
        if (className) element.className = className;
        if (id) element.id = id;
        return element;
    }

    createLoadingIndicator() {
        const container = this.createElement('div', 'gallery-loading');
        container.innerHTML = `
            <div class="loading-spinner"></div>
            <div class="loading-text">Loading gallery items...</div>
        `;
        container.style.display = 'none';
        return container;
    }

    createErrorContainer() {
        const container = this.createElement('div', 'gallery-error');
        container.innerHTML = `
            <div class="error-icon">
                <i class="fas fa-exclamation-triangle"></i>
            </div>
            <div class="error-message">Failed to load gallery</div>
            <div class="error-details"></div>
            <button class="retry-btn">
                <i class="fas fa-redo"></i> Try Again
            </button>
        `;
        container.style.display = 'none';
        return container;
    }

    createLoadMoreContainer() {
        const container = this.createElement('div', 'gallery-load-trigger');
        container.innerHTML = `
            <button class="load-more-btn">
                <i class="fas fa-plus"></i> Load More Events
            </button>
        `;
        // Start with button visible initially
        container.style.display = 'flex';
        return container;
    }

    setupLightbox() {
        // Find existing lightbox or create new one
        this.elements.lightbox = document.getElementById('galleryLightbox');
        
        if (!this.elements.lightbox) {
            this.elements.lightbox = this.createLightbox();
            document.body.appendChild(this.elements.lightbox);
        }

        // Get lightbox elements
        this.elements.lightboxImage = document.getElementById('lightboxImage');
        this.elements.lightboxTitle = document.getElementById('lightboxTitle');
        this.elements.lightboxDescription = document.getElementById('lightboxDescription');
        this.elements.lightboxDate = document.getElementById('lightboxDate');
    }

    createLightbox() {
        const lightbox = this.createElement('div', 'gallery-lightbox');
        lightbox.id = 'galleryLightbox';
        lightbox.innerHTML = `
            <div class="lightbox-overlay"></div>
            <div class="lightbox-container">
                <button class="lightbox-close" id="lightboxClose">
                    <i class="fas fa-times"></i>
                </button>
                <div class="lightbox-content">
                    <div class="lightbox-image">
                        <img id="lightboxImage" src="" alt="">
                    </div>
                    <div class="lightbox-info">
                        <h2 class="lightbox-title" id="lightboxTitle"></h2>
                        <p class="lightbox-description" id="lightboxDescription"></p>
                        <div class="lightbox-details">
                            <div class="detail-item">
                                <i class="fas fa-calendar"></i>
                                <span id="lightboxDate"></span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="lightbox-navigation">
                    <button class="nav-btn prev" id="lightboxPrev">
                        <i class="fas fa-chevron-left"></i>
                    </button>
                    <button class="nav-btn next" id="lightboxNext">
                        <i class="fas fa-chevron-right"></i>
                    </button>
                </div>
            </div>
        `;
        return lightbox;
    }

    setupEventListeners() {
        // Load more button
        const loadMoreBtn = this.elements.loadMoreContainer.querySelector('.load-more-btn');
        loadMoreBtn?.addEventListener('click', () => this.loadMoreItems());

        // Retry button
        const retryBtn = this.elements.errorContainer.querySelector('.retry-btn');
        retryBtn?.addEventListener('click', () => this.retryLoad());

        // Lightbox controls
        const closeBtn = document.getElementById('lightboxClose');
        const prevBtn = document.getElementById('lightboxPrev');
        const nextBtn = document.getElementById('lightboxNext');
        const overlay = this.elements.lightbox?.querySelector('.lightbox-overlay');

        closeBtn?.addEventListener('click', () => this.closeLightbox());
        prevBtn?.addEventListener('click', () => this.previousImage());
        nextBtn?.addEventListener('click', () => this.nextImage());
        overlay?.addEventListener('click', () => this.closeLightbox());

        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeydown(e));

        // Window resize
        window.addEventListener('resize', () => this.handleResize());
    }

    setupIntersectionObserver() {
        if (!this.config.enableInfiniteScroll) return;

        // Observer for infinite scroll - disabled by default to prevent auto-loading
        this.intersectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.state.isLoading && this.config.enableInfiniteScroll) {
                    // Only load more if infinite scroll is explicitly enabled
                    this.loadMoreItems();
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '100px'
        });

        // Observer for item animations
        this.itemObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '50px'
        });
    }

    async loadInitialData() {
        this.showLoading();
        try {
            const data = await this.fetchData(1);
            this.state.items = data.items;
            this.state.currentPage = 1;
            this.state.totalPages = data.totalPages;
            this.renderItems(data.items);
            this.updateLoadMoreButton();
            this.hideLoading();
        } catch (error) {
            this.handleError('Failed to load initial data', error);
        }
    }

    async loadMoreItems() {
        if (this.state.isLoading || this.state.currentPage >= this.state.totalPages) {
            return;
        }

        const loadMoreBtn = this.elements.loadMoreContainer.querySelector('.load-more-btn');
        
        try {
            // Set loading state
            this.setButtonState('loading');
            this.showLoading();
            
            const nextPage = this.state.currentPage + 1;
            const data = await this.fetchData(nextPage);
            
            // Validate the response data
            if (!data || !Array.isArray(data.items)) {
                throw new Error('Invalid response format: missing items array');
            }
            
            if (data.items.length === 0) {
                throw new Error('No more items available');
            }
            
            // Validate required properties for each item
            const invalidItems = data.items.filter(item => 
                !item.id || !item.title || !item.image
            );
            
            if (invalidItems.length > 0) {
                throw new Error(`Invalid item data: ${invalidItems.length} items missing required fields`);
            }
            
            this.state.items.push(...data.items);
            this.state.currentPage = nextPage;
            this.state.totalPages = data.totalPages;
            
            this.renderItems(data.items, true); // Append mode
            
            // Success state
            this.setButtonState('success');
            setTimeout(() => {
                this.setButtonState('normal');
                this.updateLoadMoreButton();
            }, 1000);
            
            this.hideLoading();
            
            // Log success for debugging
            console.log(`✅ Loaded ${data.items.length} more items (Page ${nextPage}/${data.totalPages})`);
            
        } catch (error) {
            console.error('❌ Failed to load more items:', error);
            
            // Set error state
            this.setButtonState('error');
            
            // Show detailed error message
            this.showLoadMoreError(error.message);
            
            // Reset button state after delay
            setTimeout(() => {
                this.setButtonState('normal');
            }, 3000);
            
            this.hideLoading();
            this.handleError('Failed to load more items', error);
        }
    }

    async fetchData(page = 1) {
        if (this.config.mockData) {
            return this.generateMockData(page);
        }

        // Real API call with comprehensive error handling
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
            
            const response = await fetch(`${this.config.apiEndpoint}?page=${page}&limit=${this.config.itemsPerPage}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
                
                // Try to get more specific error message from response
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorData.error || errorMessage;
                } catch (e) {
                    // Use default error message if can't parse response
                }
                
                throw new Error(errorMessage);
            }
            
            const data = await response.json();
            
            // Validate response structure
            if (!data || typeof data !== 'object') {
                throw new Error('Invalid response: not a valid JSON object');
            }
            
            if (!Array.isArray(data.items)) {
                throw new Error('Invalid response: items must be an array');
            }
            
            if (typeof data.totalPages !== 'number' || data.totalPages < 1) {
                throw new Error('Invalid response: totalPages must be a positive number');
            }
            
            return data;
            
        } catch (error) {
            if (error.name === 'AbortError') {
                throw new Error('Request timeout: Server took too long to respond');
            }
            
            if (!navigator.onLine) {
                throw new Error('Network error: Please check your internet connection');
            }
            
            throw error;
        }
    }

    generateMockData(page = 1) {
        // Simulate API delay and occasional failures for testing
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate network failure occasionally (5% chance)
                if (Math.random() < 0.05) {
                    reject(new Error('Simulated network failure: Please try again'));
                    return;
                }
                
                // Validate page number
                if (page < 1) {
                    reject(new Error('Invalid page number: must be greater than 0'));
                    return;
                }
                
                const items = [];
                const startIndex = (page - 1) * this.config.itemsPerPage;
                const totalItems = 50;
                
                // Check if page is beyond available data
                if (startIndex >= totalItems) {
                    resolve({
                        items: [],
                        totalPages: Math.ceil(totalItems / this.config.itemsPerPage),
                        currentPage: page,
                        totalItems: totalItems
                    });
                    return;
                }
                
                for (let i = 0; i < this.config.itemsPerPage; i++) {
                    const index = startIndex + i;
                    if (index >= totalItems) break; // Limit to total items for demo
                    
                    items.push({
                        id: index + 1,
                        title: this.getMockTitle(index),
                        description: this.getMockDescription(index),
                        image: this.getMockImage(index),
                        date: this.getMockDate(index),
                        size: this.getMockSize(index)
                    });
                }

                resolve({
                    items,
                    totalPages: Math.ceil(totalItems / this.config.itemsPerPage),
                    currentPage: page,
                    totalItems: totalItems
                });
            }, Math.random() * 1000 + 500); // Random delay between 500-1500ms
        });
    }

    getMockTitle(index) {
        const titles = [
            'Annual IT Expo 2024', 'Technical Training Session', 'Monthly Members Meetup',
            'Business Development Conference', 'Skill Development Program', 'Innovation Workshop',
            'Community Outreach Program', 'Awards Ceremony', 'Partnership Summit',
            'Technology Showcase', 'Networking Event', 'Product Launch',
            'Industry Forum', 'Digital Transformation Seminar', 'Cybersecurity Workshop',
            'AI and ML Conference', 'Cloud Computing Summit', 'IoT Innovation Meet',
            'Startup Pitch Competition', 'Women in Tech Event'
        ];
        return titles[index % titles.length] + ` #${Math.floor(index / titles.length) + 1}`;
    }

    getMockDescription(index) {
        const descriptions = [
            'Comprehensive event focused on latest technology trends and networking opportunities for JJITA members.',
            'Hands-on training program covering advanced techniques and industry best practices.',
            'Regular gathering for knowledge sharing and collaboration among association members.',
            'Strategic conference featuring industry leaders and growth opportunities.',
            'Professional development initiative for enhancing member skills and capabilities.',
            'Workshop focused on emerging technologies and digital transformation strategies.',
            'Community initiative to give back through technology education and support.',
            'Recognition ceremony celebrating outstanding achievements of JJITA members.'
        ];
        return descriptions[index % descriptions.length];
    }

    getMockImage(index) {
        const images = [
            'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&h=600&fit=crop'
        ];
        return images[index % images.length];
    }

    getMockDate(index) {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const year = 2024;
        const month = months[index % 12];
        return `${month} ${year}`;
    }

    getMockSize(index) {
        const sizes = ['large', 'medium', 'small'];
        return sizes[index % 3];
    }

    renderItems(items, append = false) {
        if (!append) {
            this.elements.grid.innerHTML = '';
        }

        const fragment = document.createDocumentFragment();

        items.forEach((item, index) => {
            const itemElement = this.createGalleryItem(item, this.state.items.length - items.length + index);
            fragment.appendChild(itemElement);
        });

        this.elements.grid.appendChild(fragment);
        
        // Trigger animations
        setTimeout(() => {
            this.elements.grid.classList.add('loaded');
            this.animateNewItems();
        }, 100);
    }

    createGalleryItem(item, globalIndex) {
        const itemElement = this.createElement('div', `gallery-item size-${item.size}`);
        itemElement.dataset.index = globalIndex;
        itemElement.dataset.id = item.id;

        itemElement.innerHTML = `
            <div class="gallery-image">
                <img src="${item.image}" alt="${item.title}" loading="lazy">
                <div class="image-overlay">
                    <div class="gallery-actions">
                        <button class="gallery-btn view-btn">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                </div>
                <div class="gallery-date">${item.date}</div>
            </div>
            <div class="gallery-content">
                <h3 class="gallery-title">${item.title}</h3>
                <p class="gallery-description">${item.description}</p>
            </div>
        `;

        // Add event listeners
        this.addItemEventListeners(itemElement, globalIndex);

        return itemElement;
    }

    addItemEventListeners(itemElement, index) {
        const viewBtn = itemElement.querySelector('.view-btn');
        const imageArea = itemElement.querySelector('.gallery-image');

        [viewBtn, imageArea].forEach(element => {
            element?.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.openLightbox(index);
            });
        });

        // Observe for animations
        this.itemObserver?.observe(itemElement);
    }

    animateNewItems() {
        const newItems = this.elements.grid.querySelectorAll('.gallery-item:not(.visible)');
        newItems.forEach((item, index) => {
            setTimeout(() => {
                item.classList.add('visible');
            }, index * 80); // Reduced delay for smoother cascade effect
        });
    }

    updateLoadMoreButton() {
        // Show button if there are more pages to load
        const hasMoreItems = this.state.currentPage < this.state.totalPages;
        
        if (this.config.enableLoadMore) {
            if (hasMoreItems) {
                this.elements.loadMoreContainer.style.display = 'flex';
                
                // Update button text
                const loadMoreBtn = this.elements.loadMoreContainer.querySelector('.load-more-btn');
                if (loadMoreBtn) {
                    loadMoreBtn.innerHTML = '<i class="fas fa-plus"></i> Load More Events';
                }
            } else {
                this.elements.loadMoreContainer.style.display = 'none';
            }
        } else {
            this.elements.loadMoreContainer.style.display = 'none';
        }
    }

    setButtonState(state) {
        const loadMoreBtn = this.elements.loadMoreContainer.querySelector('.load-more-btn');
        if (!loadMoreBtn) return;

        // Remove all state classes
        loadMoreBtn.classList.remove('loading', 'error', 'success');
        
        switch (state) {
            case 'loading':
                loadMoreBtn.classList.add('loading');
                loadMoreBtn.disabled = true;
                loadMoreBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
                break;
                
            case 'error':
                loadMoreBtn.classList.add('error');
                loadMoreBtn.disabled = false;
                loadMoreBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Try Again';
                break;
                
            case 'success':
                loadMoreBtn.classList.add('success');
                loadMoreBtn.disabled = false;
                loadMoreBtn.innerHTML = '<i class="fas fa-check"></i> Loaded!';
                break;
                
            case 'normal':
            default:
                loadMoreBtn.disabled = false;
                loadMoreBtn.innerHTML = '<i class="fas fa-plus"></i> Load More Events';
                break;
        }
    }

    showLoadMoreError(message) {
        // Create or update error tooltip
        let errorTooltip = document.querySelector('.load-more-error-tooltip');
        
        if (!errorTooltip) {
            errorTooltip = document.createElement('div');
            errorTooltip.className = 'load-more-error-tooltip';
            errorTooltip.style.cssText = `
                position: absolute;
                top: -50px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(220, 38, 38, 0.95);
                color: white;
                padding: 8px 12px;
                border-radius: 8px;
                font-size: 14px;
                white-space: nowrap;
                z-index: 1000;
                opacity: 0;
                transition: opacity 0.3s ease;
                pointer-events: none;
                border: 1px solid rgba(255, 255, 255, 0.2);
                backdrop-filter: blur(10px);
            `;
            
            // Add arrow
            const arrow = document.createElement('div');
            arrow.style.cssText = `
                position: absolute;
                top: 100%;
                left: 50%;
                transform: translateX(-50%);
                width: 0;
                height: 0;
                border-left: 6px solid transparent;
                border-right: 6px solid transparent;
                border-top: 6px solid rgba(220, 38, 38, 0.95);
            `;
            errorTooltip.appendChild(arrow);
            
            this.elements.loadMoreContainer.style.position = 'relative';
            this.elements.loadMoreContainer.appendChild(errorTooltip);
        }
        
        errorTooltip.textContent = message;
        errorTooltip.style.opacity = '1';
        
        // Hide after 3 seconds
        setTimeout(() => {
            if (errorTooltip) {
                errorTooltip.style.opacity = '0';
                setTimeout(() => errorTooltip?.remove(), 300);
            }
        }, 3000);
    }

    showLoading() {
        this.state.isLoading = true;
        this.elements.loadingIndicator.style.display = 'flex';
        this.elements.errorContainer.style.display = 'none';
    }

    hideLoading() {
        this.state.isLoading = false;
        this.elements.loadingIndicator.style.display = 'none';
    }

    handleError(message, error) {
        this.state.hasError = true;
        this.state.errorMessage = message;
        this.hideLoading();
        
        const errorDetails = this.elements.errorContainer.querySelector('.error-details');
        errorDetails.textContent = error?.message || 'Please try again later.';
        
        this.elements.errorContainer.style.display = 'flex';
        console.error(message, error);
    }

    async retryLoad() {
        this.state.hasError = false;
        this.elements.errorContainer.style.display = 'none';
        
        if (this.state.items.length === 0) {
            await this.loadInitialData();
        } else {
            await this.loadMoreItems();
        }
    }

    // Lightbox methods
    openLightbox(index) {
        if (!this.state.items[index]) return;
        
        this.currentLightboxIndex = index;
        this.updateLightboxContent();
        
        this.elements.lightbox.style.display = 'flex';
        requestAnimationFrame(() => {
            this.elements.lightbox.classList.add('active');
        });
        
        document.body.style.overflow = 'hidden';
    }

    closeLightbox() {
        this.elements.lightbox.classList.remove('active');
        
        setTimeout(() => {
            this.elements.lightbox.style.display = 'none';
            document.body.style.overflow = '';
        }, 400);
    }

    nextImage() {
        if (this.currentLightboxIndex < this.state.items.length - 1) {
            this.currentLightboxIndex++;
            this.updateLightboxContent();
        }
    }

    previousImage() {
        if (this.currentLightboxIndex > 0) {
            this.currentLightboxIndex--;
            this.updateLightboxContent();
        }
    }

    updateLightboxContent() {
        const item = this.state.items[this.currentLightboxIndex];
        if (!item) return;

        // Add smooth transition for content change
        const img = this.elements.lightboxImage;
        const title = this.elements.lightboxTitle;
        const description = this.elements.lightboxDescription;
        const date = this.elements.lightboxDate;

        // Add changing class for smooth transition
        img.classList.add('changing');
        
        // Update content after brief delay for smooth transition
        setTimeout(() => {
            img.src = item.image;
            img.alt = item.title;
            title.textContent = item.title;
            description.textContent = item.description;
            date.textContent = item.date;
            
            // Remove changing class to fade back in
            img.classList.remove('changing');
        }, 150);
    }

    handleKeydown(e) {
        if (!this.elements.lightbox.classList.contains('active')) return;

        switch (e.key) {
            case 'Escape':
                this.closeLightbox();
                break;
            case 'ArrowLeft':
                this.previousImage();
                break;
            case 'ArrowRight':
                this.nextImage();
                break;
        }
    }

    handleResize() {
        // Handle responsive changes if needed
        clearTimeout(this.resizeTimeout);
        this.resizeTimeout = setTimeout(() => {
            // Trigger reflow if necessary
        }, 250);
    }

    // Public API methods
    async refresh() {
        this.state.items = [];
        this.state.currentPage = 1;
        this.elements.grid.innerHTML = '';
        await this.loadInitialData();
    }

    async loadFromAPI(endpoint) {
        this.config.apiEndpoint = endpoint;
        this.config.mockData = false;
        await this.refresh();
    }

    addItem(item) {
        this.state.items.push(item);
        this.renderItems([item], true);
    }

    removeItem(id) {
        this.state.items = this.state.items.filter(item => item.id !== id);
        const element = this.elements.grid.querySelector(`[data-id="${id}"]`);
        element?.remove();
    }

    destroy() {
        // Cleanup
        this.intersectionObserver?.disconnect();
        this.itemObserver?.disconnect();
        clearTimeout(this.resizeTimeout);
        
        // Remove event listeners
        document.removeEventListener('keydown', this.handleKeydown);
        window.removeEventListener('resize', this.handleResize);
    }
}
// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Configuration for the gallery
    const galleryConfig = {
        mockData: true, // Set to false when you have a real API
        itemsPerPage: 6,
        enableInfiniteScroll: false, // Disabled to prevent auto-loading on scroll
        enableLoadMore: true, // Keep manual load more button
        autoLoad: true // Enable auto-loading of first batch
    };

    // Initialize the infinite gallery
    window.infiniteGallery = new InfiniteAssociationGallery(galleryConfig);
    
    console.log('🎨 Infinite Association Gallery ready!');
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = InfiniteAssociationGallery;
}
