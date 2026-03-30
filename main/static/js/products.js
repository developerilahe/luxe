// Products - Django API Integration
let allProducts = [];
let currentCategory = 'all';
let currentPriceMin = 0;
let currentPriceMax = 500;
let currentRating = 0;
let inStockOnly = false;
let onSaleOnly = false;
let selectedBrands = [];
let currentSort = 'default';
let shopSearchQuery = '';

// API Base URL
const API_BASE = '/api/';

// Fetch products from API
async function fetchProducts() {
    try {
        let url = `${API_BASE}products/?`;
        
        if (currentCategory !== 'all') url += `category=${currentCategory}&`;
        if (shopSearchQuery) url += `search=${encodeURIComponent(shopSearchQuery)}&`;
        if (currentPriceMin) url += `min_price=${currentPriceMin}&`;
        if (currentPriceMax && currentPriceMax < 500) url += `max_price=${currentPriceMax}&`;
        if (currentRating) url += `rating=${currentRating}&`;
        if (inStockOnly) url += `in_stock=true&`;
        if (onSaleOnly) url += `on_sale=true&`;
        if (currentSort === 'price_asc') url += `sort=price_asc&`;
        if (currentSort === 'price_desc') url += `sort=price_desc&`;
        if (currentSort === 'name_asc') url += `sort=name_asc&`;
        if (currentSort === 'name_desc') url += `sort=name_desc&`;
        
        console.log('Fetching products from:', url);
        const response = await fetch(url);
        const products = await response.json();
        allProducts = products;
        console.log('Products loaded:', products.length);
        return products;
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
}

// Fetch categories from API
async function fetchCategories() {
    try {
        const response = await fetch(`${API_BASE}categories/`);
        const categories = await response.json();
        console.log('Categories loaded:', categories);
        return categories;
    } catch (error) {
        console.error('Error fetching categories:', error);
        return [];
    }
}

// Update category counts
async function updateCategoryCounts() {
    const categories = await fetchCategories();
    const products = await fetchProducts();
    
    const allCount = document.getElementById('all-count');
    const shoesCount = document.getElementById('shoes-count');
    const clothingCount = document.getElementById('clothing-count');
    const accessoriesCount = document.getElementById('accessories-count');
    
    if (allCount) allCount.textContent = products.length;
    
    categories.forEach(cat => {
        if (cat.slug === 'shoes' && shoesCount) shoesCount.textContent = cat.count;
        if (cat.slug === 'clothing' && clothingCount) clothingCount.textContent = cat.count;
        if (cat.slug === 'accessories' && accessoriesCount) accessoriesCount.textContent = cat.count;
    });
}

// Render products
async function renderProducts() {
    const grid = document.getElementById('products-grid');
    if (!grid) return;
    
    const products = await fetchProducts();
    
    const countSpan = document.getElementById('product-count');
    if (countSpan) countSpan.textContent = products.length;
    
    if (products.length === 0) {
        grid.innerHTML = '<div class="no-products">No products found</div>';
        return;
    }
    
    grid.innerHTML = '';
    
    products.forEach((product, index) => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.style.animationDelay = `${index * 0.05}s`;
        productCard.innerHTML = `
            <div class="product-image-wrapper">
                <img src="${product.image}" alt="${product.name}" loading="lazy" class="product-image">
                <div class="product-overlay">
                    <button class="quick-view-btn" data-id="${product.id}">Quick View</button>
                    <button class="add-cart-btn" data-id="${product.id}"><i class="fas fa-cart-plus"></i> Add</button>
                </div>
            </div>
            <div class="product-info">
                <h3 class="product-title">${escapeHtml(product.name)}</h3>
                <p class="product-price">$${product.price.toFixed(2)}</p>
            </div>
        `;
        grid.appendChild(productCard);
    });
    
    // Add event listeners
    document.querySelectorAll('.quick-view-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const productId = parseInt(btn.dataset.id);
            const product = allProducts.find(p => p.id === productId);
            if (product && window.openModal) {
                window.openModal(product);
            }
        });
    });
    
    document.querySelectorAll('.add-cart-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.stopPropagation();
            const productId = parseInt(btn.dataset.id);
            const product = allProducts.find(p => p.id === productId);
            if (product) {
                await addToCartWithAnimation(product, btn);
            }
        });
    });
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Add to cart with animation
async function addToCartWithAnimation(product, button) {
    try {
        const response = await fetch(`${API_BASE}cart/add/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ product_id: product.id, quantity: 1 })
        });
        
        const data = await response.json();
        
        if (data.success) {
            await updateCartCount();
            
            const originalHTML = button.innerHTML;
            button.innerHTML = '<i class="fas fa-check"></i> Added!';
            button.style.background = '#4caf50';
            
            setTimeout(() => {
                button.innerHTML = originalHTML;
                button.style.background = '';
            }, 1500);
            
            showToast(data.message);
            
            const cartIcon = document.querySelector('.cart-btn i');
            if (cartIcon) {
                cartIcon.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    cartIcon.style.transform = '';
                }, 300);
            }
        } else {
            showToast(data.error || 'Error adding to cart');
        }
    } catch (error) {
        console.error('Error adding to cart:', error);
        showToast('Error adding to cart');
    }
}

// Update cart count
async function updateCartCount() {
    try {
        const response = await fetch(`${API_BASE}cart/`);
        const data = await response.json();
        const cartCountElement = document.querySelector('.cart-count');
        if (cartCountElement) {
            cartCountElement.textContent = data.count;
            cartCountElement.style.transform = 'scale(1.2)';
            setTimeout(() => {
                cartCountElement.style.transform = '';
            }, 200);
        }
    } catch (error) {
        console.error('Error fetching cart:', error);
    }
}

// Show toast notification
function showToast(message) {
    const toast = document.getElementById('toast-notification');
    if (!toast) return;
    
    toast.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Global search function
async function globalSearch(query) {
    const searchResultsGrid = document.getElementById('searchResultsGrid');
    const resultsCount = document.getElementById('resultsCount');
    const fixedSearchBar = document.getElementById('fixedSearchBar');
    
    if (!searchResultsGrid) return;
    
    if (!query.trim()) {
        searchResultsGrid.innerHTML = '';
        if (resultsCount) resultsCount.textContent = '0 products found';
        if (fixedSearchBar) fixedSearchBar.classList.remove('has-results');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}products/?search=${encodeURIComponent(query)}`);
        const products = await response.json();
        
        if (resultsCount) {
            resultsCount.textContent = `${products.length} product${products.length !== 1 ? 's' : ''} found`;
        }
        
        if (products.length === 0) {
            searchResultsGrid.innerHTML = '<div class="no-results">No products found matching your search</div>';
            if (fixedSearchBar) fixedSearchBar.classList.add('has-results');
            return;
        }
        
        searchResultsGrid.innerHTML = '';
        products.forEach(product => {
            const resultCard = document.createElement('div');
            resultCard.className = 'search-result-card';
            resultCard.innerHTML = `
                <img src="${product.image}" alt="${product.name}" class="search-result-image">
                <div class="search-result-info">
                    <h4 class="search-result-title">${escapeHtml(product.name)}</h4>
                    <p class="search-result-price">$${product.price.toFixed(2)}</p>
                </div>
            `;
            resultCard.addEventListener('click', () => {
                if (window.openModal) {
                    window.openModal(product);
                    if (fixedSearchBar) fixedSearchBar.classList.remove('active');
                    document.getElementById('global-search').value = '';
                    searchResultsGrid.innerHTML = '';
                    if (fixedSearchBar) fixedSearchBar.classList.remove('has-results');
                }
            });
            searchResultsGrid.appendChild(resultCard);
        });
        
        if (fixedSearchBar) fixedSearchBar.classList.add('has-results');
    } catch (error) {
        console.error('Error searching products:', error);
    }
}

// Clear search results
function clearSearchResults() {
    const searchInput = document.getElementById('global-search');
    const searchResultsGrid = document.getElementById('searchResultsGrid');
    const fixedSearchBar = document.getElementById('fixedSearchBar');
    
    if (searchInput) searchInput.value = '';
    if (searchResultsGrid) searchResultsGrid.innerHTML = '';
    if (fixedSearchBar) {
        fixedSearchBar.classList.remove('has-results');
        fixedSearchBar.classList.remove('active');
    }
}

// Initialize price range
function initPriceRange() {
    const minSlider = document.getElementById('price-min');
    const maxSlider = document.getElementById('price-max');
    const minInput = document.getElementById('min-price-input');
    const maxInput = document.getElementById('max-price-input');
    const priceRangeValue = document.getElementById('priceRangeValue');
    
    if (!minSlider || !maxSlider) return;
    
    function updateTrack() {
        const min = parseFloat(minSlider.value);
        const max = parseFloat(maxSlider.value);
        const percentMin = (min / 500) * 100;
        const percentMax = (max / 500) * 100;
        
        const track = document.querySelector('.slider-track');
        if (track) {
            track.style.left = percentMin + '%';
            track.style.right = (100 - percentMax) + '%';
        }
    }
    
    minSlider.addEventListener('input', (e) => {
        let value = parseFloat(e.target.value);
        const max = parseFloat(maxSlider.value);
        if (value > max) {
            value = max;
            minSlider.value = value;
        }
        currentPriceMin = value;
        if (minInput) minInput.value = value;
        if (priceRangeValue) {
            priceRangeValue.textContent = `$${currentPriceMin} - $${currentPriceMax === 500 ? '500+' : currentPriceMax}`;
        }
        updateTrack();
    });
    
    maxSlider.addEventListener('input', (e) => {
        let value = parseFloat(e.target.value);
        const min = parseFloat(minSlider.value);
        if (value < min) {
            value = min;
            maxSlider.value = value;
        }
        currentPriceMax = value;
        if (maxInput) maxInput.value = value;
        if (priceRangeValue) {
            priceRangeValue.textContent = `$${currentPriceMin} - $${currentPriceMax === 500 ? '500+' : currentPriceMax}`;
        }
        updateTrack();
    });
    
    if (minInput) {
        minInput.addEventListener('change', (e) => {
            let value = parseFloat(e.target.value);
            if (isNaN(value)) value = 0;
            if (value < 0) value = 0;
            if (value > currentPriceMax) value = currentPriceMax;
            currentPriceMin = value;
            minSlider.value = value;
            if (priceRangeValue) {
                priceRangeValue.textContent = `$${currentPriceMin} - $${currentPriceMax === 500 ? '500+' : currentPriceMax}`;
            }
            updateTrack();
        });
    }
    
    if (maxInput) {
        maxInput.addEventListener('change', (e) => {
            let value = parseFloat(e.target.value);
            if (isNaN(value)) value = 500;
            if (value > 500) value = 500;
            if (value < currentPriceMin) value = currentPriceMin;
            currentPriceMax = value;
            maxSlider.value = value;
            if (priceRangeValue) {
                priceRangeValue.textContent = `$${currentPriceMin} - $${currentPriceMax === 500 ? '500+' : currentPriceMax}`;
            }
            updateTrack();
        });
    }
    
    updateTrack();
}

// Initialize all filters
async function initFilters() {
    await updateCategoryCounts();
    initPriceRange();
    
    // Category filters
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCategory = btn.dataset.category;
            renderProducts();
        });
    });
    
    // Rating filters
    const ratingBtns = document.querySelectorAll('.rating-btn');
    ratingBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            ratingBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentRating = parseInt(btn.dataset.rating);
        });
    });
    
    // Stock filters
    const inStockCheckbox = document.getElementById('in-stock-only');
    if (inStockCheckbox) {
        inStockCheckbox.addEventListener('change', (e) => {
            inStockOnly = e.target.checked;
        });
    }
    
    const onSaleCheckbox = document.getElementById('on-sale-only');
    if (onSaleCheckbox) {
        onSaleCheckbox.addEventListener('change', (e) => {
            onSaleOnly = e.target.checked;
        });
    }
    
    // Brand filters
    const brandCheckboxes = document.querySelectorAll('.brand-list input');
    brandCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            if (e.target.checked) {
                selectedBrands.push(e.target.value);
            } else {
                selectedBrands = selectedBrands.filter(b => b !== e.target.value);
            }
        });
    });
    
    // Sort filter
    const sortSelect = document.getElementById('sort-by');
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            currentSort = e.target.value;
            renderProducts();
        });
    }
    
    // Apply filters button
    const applyBtn = document.getElementById('applyFilters');
    if (applyBtn) {
        applyBtn.addEventListener('click', () => {
            renderProducts();
            showToast('Filters applied successfully!');
        });
    }
    
    // Reset filters button
    const resetBtn = document.getElementById('resetFilters');
    if (resetBtn) {
        resetBtn.addEventListener('click', async () => {
            currentCategory = 'all';
            currentPriceMin = 0;
            currentPriceMax = 500;
            currentRating = 0;
            inStockOnly = false;
            onSaleOnly = false;
            selectedBrands = [];
            currentSort = 'default';
            shopSearchQuery = '';
            
            filterBtns.forEach(b => b.classList.remove('active'));
            const allBtn = document.querySelector('.filter-btn[data-category="all"]');
            if (allBtn) allBtn.classList.add('active');
            
            // Reset price sliders
            const minSlider = document.getElementById('price-min');
            const maxSlider = document.getElementById('price-max');
            const minInput = document.getElementById('min-price-input');
            const maxInput = document.getElementById('max-price-input');
            const priceRangeValue = document.getElementById('priceRangeValue');
            
            if (minSlider) minSlider.value = 0;
            if (maxSlider) maxSlider.value = 500;
            if (minInput) minInput.value = 0;
            if (maxInput) maxInput.value = 500;
            if (priceRangeValue) priceRangeValue.textContent = '$0 - $500+';
            
            const track = document.querySelector('.slider-track');
            if (track) {
                track.style.left = '0%';
                track.style.right = '0%';
            }
            
            ratingBtns.forEach(b => b.classList.remove('active'));
            if (inStockCheckbox) inStockCheckbox.checked = false;
            if (onSaleCheckbox) onSaleCheckbox.checked = false;
            brandCheckboxes.forEach(cb => cb.checked = false);
            if (sortSelect) sortSelect.value = 'default';
            
            const shopSearch = document.getElementById('shop-search');
            if (shopSearch) shopSearch.value = '';
            
            await renderProducts();
            showToast('All filters reset!');
        });
    }
    
    // Shop search
    const shopSearch = document.getElementById('shop-search');
    if (shopSearch) {
        shopSearch.addEventListener('input', (e) => {
            shopSearchQuery = e.target.value;
            renderProducts();
        });
    }
    
    // Header search
    const searchInput = document.getElementById('global-search');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            globalSearch(e.target.value);
        });
    }
    
    // Clear search button
    const clearSearch = document.getElementById('clearSearch');
    if (clearSearch) {
        clearSearch.addEventListener('click', () => {
            clearSearchResults();
        });
    }
    
    const clearResults = document.getElementById('clearResults');
    if (clearResults) {
        clearResults.addEventListener('click', () => {
            clearSearchResults();
        });
    }
    
    // Search toggle
    const searchToggle = document.querySelector('.search-toggle');
    const fixedSearchBar = document.getElementById('fixedSearchBar');
    const closeSearchBar = document.getElementById('closeSearchBar');
    
    if (searchToggle && fixedSearchBar) {
        searchToggle.addEventListener('click', () => {
            fixedSearchBar.classList.toggle('active');
            if (fixedSearchBar.classList.contains('active')) {
                document.getElementById('global-search')?.focus();
            } else {
                clearSearchResults();
            }
        });
    }
    
    if (closeSearchBar && fixedSearchBar) {
        closeSearchBar.addEventListener('click', () => {
            fixedSearchBar.classList.remove('active');
            clearSearchResults();
        });
    }
    
    document.addEventListener('click', (e) => {
        if (fixedSearchBar && fixedSearchBar.classList.contains('active')) {
            if (!fixedSearchBar.contains(e.target) && !searchToggle?.contains(e.target)) {
                fixedSearchBar.classList.remove('active');
                clearSearchResults();
            }
        }
    });
}

// Countdown timer
function initCountdown() {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 7);
    targetDate.setHours(23, 59, 59, 999);
    
    function updateCountdown() {
        const now = new Date();
        const diff = targetDate - now;
        
        if (diff <= 0) {
            const countdownEl = document.getElementById('countdown');
            if (countdownEl) countdownEl.innerHTML = 'Offer Expired';
            return;
        }
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % 86400000) / 3600000);
        const minutes = Math.floor((diff % 3600000) / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        
        const daysEl = document.getElementById('days');
        const hoursEl = document.getElementById('hours');
        const minutesEl = document.getElementById('minutes');
        const secondsEl = document.getElementById('seconds');
        
        if (daysEl) daysEl.textContent = days.toString().padStart(2, '0');
        if (hoursEl) hoursEl.textContent = hours.toString().padStart(2, '0');
        if (minutesEl) minutesEl.textContent = minutes.toString().padStart(2, '0');
        if (secondsEl) secondsEl.textContent = seconds.toString().padStart(2, '0');
    }
    
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    console.log('Products.js initialized');
    renderProducts();
    initFilters();
    initCountdown();
    updateCartCount();
});

// Expose for global use
window.updateCartCount = updateCartCount;
window.showToast = showToast;
window.globalSearch = globalSearch;
window.clearSearchResults = clearSearchResults;

window.fetchProducts = fetchProducts;
window.renderProducts = renderProducts;
window.addToCartWithAnimation = addToCartWithAnimation;
window.updateCartCount = updateCartCount;
window.showToast = showToast;
window.globalSearch = globalSearch;
window.clearSearchResults = clearSearchResults;