// Collections - Django API Integration
(function() {
    'use strict';
    
    let collectionsData = [];
    let activeCollection = null;
    const API_BASE = '/api/';

    // Fetch collections from API
    async function fetchCollections() {
        try {
            const response = await fetch(`${API_BASE}collections/`);
            const data = await response.json();
            collectionsData = data;
            
            // Update stats
            const collectionCountEl = document.getElementById('collectionCount');
            const totalPiecesEl = document.getElementById('totalPiecesCount');
            
            if (collectionCountEl) collectionCountEl.textContent = collectionsData.length;
            if (totalPiecesEl) {
                const totalPieces = collectionsData.reduce((sum, c) => sum + (c.pieceCount || 0), 0);
                totalPiecesEl.textContent = totalPieces;
            }
            
            return collectionsData;
        } catch (error) {
            console.error('Error fetching collections:', error);
            return [];
        }
    }

    // Create collection item HTML
    function createCollectionItem(collection) {
        if (!collection) return '';
        return `
            <div class="collection-marquee-item" data-collection-id="${collection.id || ''}" data-collection-slug="${collection.slug || ''}">
                <div class="collection-card-inner">
                    <img src="${collection.image || ''}" alt="${collection.name || ''}" class="collection-image" onerror="this.src='https://via.placeholder.com/100'">
                    <div class="collection-name">${escapeHtml(collection.name || '')}</div>
                    <div class="collection-piece-count">${collection.pieceCount || 0} pieces</div>
                </div>
            </div>
        `;
    }

    // Escape HTML
    function escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Start marquee animations
    function startMarqueeAnimations() {
        const tracks = document.querySelectorAll('.marquee-track');
        if (!tracks || tracks.length === 0) {
            setTimeout(startMarqueeAnimations, 200);
            return;
        }
        
        tracks.forEach(track => {
            if (!track) return;
            
            let wrapper = track.closest('.marquee-wrapper');
            if (!wrapper) return;
            
            const direction = wrapper.getAttribute('data-direction');
            
            track.style.animation = 'none';
            void track.offsetHeight;
            
            if (direction === 'right-to-left') {
                track.style.animation = 'scrollRightToLeft 35s linear infinite';
            } else if (direction === 'left-to-right') {
                track.style.animation = 'scrollLeftToRight 40s linear infinite';
            } else if (direction === 'right-to-left-fast') {
                track.style.animation = 'scrollRightToLeft 25s linear infinite';
            }
        });
    }

    // Render all marquees
    async function renderMarquees() {
        const collections = await fetchCollections();
        
        const marqueeItems1 = document.getElementById('marqueeItems1');
        const marqueeItems2 = document.getElementById('marqueeItems2');
        const marqueeItems3 = document.getElementById('marqueeItems3');
        
        if (!marqueeItems1 || !marqueeItems2 || !marqueeItems3) {
            console.error('Marquee elements not found');
            return;
        }
        
        if (!collections || collections.length === 0) {
            const placeholder = '<div class="collection-marquee-item">No collections yet</div>';
            marqueeItems1.innerHTML = placeholder;
            marqueeItems2.innerHTML = placeholder;
            marqueeItems3.innerHTML = placeholder;
            return;
        }
        
        // Create different arrangements for each row
        const row1Items = [...collections, ...collections, ...collections];
        const row2Items = [...collections].reverse();
        const row2Duplicated = [...row2Items, ...row2Items, ...row2Items];
        const row3Items = [...collections].sort(() => Math.random() - 0.5);
        const row3Duplicated = [...row3Items, ...row3Items, ...row3Items];
        
        marqueeItems1.innerHTML = row1Items.map(c => createCollectionItem(c)).join('');
        marqueeItems2.innerHTML = row2Duplicated.map(c => createCollectionItem(c)).join('');
        marqueeItems3.innerHTML = row3Duplicated.map(c => createCollectionItem(c)).join('');
        
        setTimeout(startMarqueeAnimations, 200);
        attachClickListeners();
    }

    // Attach click listeners
    function attachClickListeners() {
        const items = document.querySelectorAll('.collection-marquee-item');
        items.forEach(item => {
            item.removeEventListener('click', handleItemClick);
            item.addEventListener('click', handleItemClick);
        });
    }

    // Handle item click
    async function handleItemClick(e) {
        const item = e.currentTarget;
        if (!item) return;
        
        const collectionSlug = item.getAttribute('data-collection-slug');
        if (!collectionSlug) return;
        
        try {
            const response = await fetch(`${API_BASE}collections/${collectionSlug}/`);
            const collection = await response.json();
            
            if (collection && !collection.error) {
                showCollectionDetail(collection);
            }
        } catch (error) {
            console.error('Error fetching collection details:', error);
        }
    }

    // Show collection detail
    function showCollectionDetail(collection) {
        activeCollection = collection;
        
        const container = document.querySelector('.collections-marquees-container');
        if (!container) return;
        
        const products = collection.products || [];
        
        container.innerHTML = `
            <div class="expanded-collection-view">
                <div class="expanded-header" style="background-image: linear-gradient(135deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.7) 100%), url('${collection.bg_image || collection.image || ''}'); background-size: cover; background-position: center;">
                    <button class="expanded-close-btn" onclick="window.resetCollectionsView()">
                        <i class="fas fa-times"></i>
                    </button>
                    <div class="expanded-header-content">
                        <span class="expanded-badge">COLLECTION</span>
                        <h2 class="expanded-title">${escapeHtml(collection.name || '')}</h2>
                        <p class="expanded-subtitle">${escapeHtml(collection.short_desc || 'Explore our curated selection')}</p>
                    </div>
                </div>
                <div class="expanded-body">
                    <div class="expanded-description">
                        <p>${escapeHtml(collection.description || '')}</p>
                        <div class="expanded-stats">
                            <div class="stat"><span class="stat-value">${collection.pieceCount || 0}</span><span class="stat-label">Pieces</span></div>
                            <div class="stat"><span class="stat-value">Limited</span><span class="stat-label">Edition</span></div>
                            <div class="stat"><span class="stat-value">Premium</span><span class="stat-label">Quality</span></div>
                        </div>
                    </div>
                    <div class="expanded-products">
                        <h3 class="products-title">Shop the Collection</h3>
                        <div class="expanded-products-grid">
                            ${products.map(product => `
                                <div class="expanded-product-card" data-product='${JSON.stringify(product).replace(/'/g, "&#39;")}'>
                                    <img src="${product.image || ''}" alt="${escapeHtml(product.name || '')}" class="expanded-product-image" onerror="this.src='https://via.placeholder.com/150'">
                                    <div class="expanded-product-info">
                                        <h4 class="expanded-product-name">${escapeHtml(product.name || '')}</h4>
                                        <p class="expanded-product-price">$${(product.price || 0).toFixed(2)}</p>
                                        <button class="expanded-product-btn">Quick View</button>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Add product click listeners
        document.querySelectorAll('.expanded-product-card').forEach(card => {
            card.addEventListener('click', (e) => {
                e.stopPropagation();
                try {
                    const productData = JSON.parse(card.getAttribute('data-product'));
                    if (window.openModal) {
                        window.openModal({
                            id: productData.id,
                            name: productData.name,
                            price: productData.price,
                            image: productData.image,
                            description: productData.description || `From the ${collection.name} collection.`
                        });
                    }
                } catch (err) {
                    console.error('Error parsing product:', err);
                }
            });
        });
        
        updateLeftPanel(collection);
    }

    // Update left panel
    function updateLeftPanel(collection) {
        const leftHalf = document.querySelector('.collections-section .left-half');
        if (!leftHalf) return;
        
        const collectionsInfo = leftHalf.querySelector('.collections-info');
        if (!collectionsInfo) return;
        
        const originalContent = collectionsInfo.innerHTML;
        
        collectionsInfo.innerHTML = `
            <div class="collection-viewing">
                <span class="viewing-badge"><i class="fas fa-eye"></i> Currently Viewing</span>
                <h2 class="viewing-title">${escapeHtml(collection.name || '')}</h2>
                <p class="viewing-desc">${escapeHtml((collection.description || '').substring(0, 100))}...</p>
                <button class="viewing-back-btn" onclick="window.resetCollectionsView()">
                    <i class="fas fa-arrow-left"></i> Back to All Collections
                </button>
            </div>
        `;
        
        collectionsInfo.setAttribute('data-original-content', originalContent);
    }

    // Reset to marquee view
    window.resetCollectionsView = async function() {
        if (!activeCollection) return;
        
        const container = document.querySelector('.collections-marquees-container');
        if (!container) return;
        
        container.innerHTML = `
            <div class="marquee-wrapper" data-direction="right-to-left">
                <div class="marquee-row">
                    <div class="marquee-track">
                        <div class="marquee-items" id="marqueeItems1"></div>
                    </div>
                </div>
            </div>
            <div class="marquee-wrapper" data-direction="left-to-right">
                <div class="marquee-row">
                    <div class="marquee-track">
                        <div class="marquee-items" id="marqueeItems2"></div>
                    </div>
                </div>
            </div>
            <div class="marquee-wrapper" data-direction="right-to-left-fast">
                <div class="marquee-row">
                    <div class="marquee-track">
                        <div class="marquee-items" id="marqueeItems3"></div>
                    </div>
                </div>
            </div>
        `;
        
        await renderMarquees();
        
        const leftHalf = document.querySelector('.collections-section .left-half');
        if (leftHalf) {
            const collectionsInfo = leftHalf.querySelector('.collections-info');
            const originalContent = collectionsInfo?.getAttribute('data-original-content');
            if (collectionsInfo && originalContent) {
                collectionsInfo.innerHTML = originalContent;
                collectionsInfo.removeAttribute('data-original-content');
            }
        }
        
        activeCollection = null;
        
        if (window.showToast) {
            window.showToast('Back to all collections');
        }
    };

    // Initialize
    document.addEventListener('DOMContentLoaded', () => {
        console.log('Collections.js initialized');
        renderMarquees();
    });
})();