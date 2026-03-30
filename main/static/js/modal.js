// Modern Modal - Replaces Letter Modal
(function() {
    'use strict';
    
    const modal = document.getElementById('product-modal');
    const modalBody = document.getElementById('modal-body');
    let isModalOpen = false;
    
    // Category mapping
    const categoryNames = {
        'shoes': 'Footwear',
        'clothing': 'Apparel',
        'accessories': 'Accessories'
    };
    
    function openModal(product) {
        if (!modal || !modalBody) return;
        
        const categoryName = categoryNames[product.category] || product.category;
        
        // Generate modal content with modern design
        modalBody.innerHTML = `
            <div class="modal-product-wrapper">
                <img src="${product.image}" alt="${product.name}" class="modal-product-image">
                <div class="modal-product-info">
                    <h2 class="modal-product-title">${product.name}</h2>
                    <div class="modal-product-category">${categoryName}</div>
                    <p class="modal-product-price">$${product.price.toFixed(2)}</p>
                    <p class="modal-product-description">${product.description}</p>
                    
                    <div class="modal-features">
                        <h4><i class="fas fa-star"></i> Key Features</h4>
                        <ul>
                            <li><i class="fas fa-check"></i> Premium quality materials</li>
                            <li><i class="fas fa-check"></i> Free shipping worldwide</li>
                            <li><i class="fas fa-check"></i> 30-day return policy</li>
                            <li><i class="fas fa-check"></i> 2-year warranty</li>
                        </ul>
                    </div>
                    
                    <div class="modal-features">
                        <h4><i class="fas fa-truck"></i> Shipping & Returns</h4>
                        <ul>
                            <li><i class="fas fa-clock"></i> Express delivery: 2-3 business days</li>
                            <li><i class="fas fa-box"></i> Free returns within 30 days</li>
                            <li><i class="fas fa-shield-alt"></i> Secure payment guaranteed</li>
                            <li><i class="fas fa-headset"></i> 24/7 customer support</li>
                        </ul>
                    </div>
                    
                    <div class="modal-actions">
                        <button class="btn btn-primary add-to-cart-modal" data-id="${product.id}">
                            Add to Cart <i class="fas fa-bag-shopping"></i>
                        </button>
                        <button class="btn btn-secondary close-modal-btn">
                            Continue Shopping
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        // Show modal
        modal.classList.add('active');
        isModalOpen = true;
        document.body.classList.add('modal-open');
        
        // Add event listeners
        const closeBtn = modalBody.querySelector('.close-modal-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', closeModal);
        }
        
        const addToCartBtn = modalBody.querySelector('.add-to-cart-modal');
        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                addToCart(product);
                closeModal();
            });
        }
        
        const modalCloseBtn = document.querySelector('.modal-close');
        if (modalCloseBtn) {
            modalCloseBtn.addEventListener('click', closeModal);
        }
    }
    
    function closeModal() {
        if (!modal) return;
        
        modal.classList.remove('active');
        isModalOpen = false;
        document.body.classList.remove('modal-open');
        
        setTimeout(() => {
            if (modalBody) modalBody.innerHTML = '';
        }, 300);
    }
    
    function addToCart(product) {
        let cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const existingItem = cart.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: 1,
                image: product.image,
                category: product.category
            });
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        
        if (window.updateCartCount) {
            window.updateCartCount();
        }
        
        showToast(`${product.name} added to cart!`);
        
        // Animate cart icon
        const cartIcon = document.querySelector('.cart-btn i');
        if (cartIcon) {
            cartIcon.style.transform = 'scale(1.2)';
            cartIcon.style.transition = 'transform 0.2s ease';
            setTimeout(() => {
                cartIcon.style.transform = '';
            }, 300);
        }
    }
    
    function showToast(message) {
        const toast = document.getElementById('toast-notification');
        if (!toast) return;
        
        toast.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
    
    // Close on backdrop click
    const modalBackdrop = document.querySelector('.modal-backdrop');
    if (modalBackdrop) {
        modalBackdrop.addEventListener('click', closeModal);
    }
    
    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isModalOpen) {
            closeModal();
        }
    });
    
    // Expose functions globally
    window.openModal = openModal;
    window.closeModal = closeModal;
})();