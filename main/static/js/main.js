// Main Initialization
(function() {
    'use strict';
    
    function initMobileMenu() {
        const menuBtn = document.querySelector('.menu-btn');
        const nav = document.querySelector('.nav');
        
        if (menuBtn && nav) {
            menuBtn.addEventListener('click', () => {
                nav.classList.toggle('active');
                document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
            });
        }
        
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                nav?.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }
    
    function initCartButton() {
        const cartBtn = document.querySelector('.cart-btn');
        if (cartBtn) {
            cartBtn.addEventListener('click', () => {
                const cart = JSON.parse(localStorage.getItem('cart') || '[]');
                if (cart.length === 0) {
                    if (window.showToast) {
                        window.showToast('Your cart is empty');
                    }
                } else {
                    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                    if (window.showToast) {
                        window.showToast(`Cart total: $${total.toFixed(2)}`);
                    }
                }
            });
        }
    }
    
    document.addEventListener('DOMContentLoaded', () => {
        initMobileMenu();
        initCartButton();
    });
})();