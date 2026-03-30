// Hero Slider Initialization
(function() {
    'use strict';
    
    let heroSlider = null;
    
    function initHeroSlider() {
        const sliderElement = document.querySelector('.hero-slider');
        if (!sliderElement || heroSlider) return;
        
        heroSlider = new Swiper(sliderElement, {
            slidesPerView: 1,
            spaceBetween: 0,
            loop: true,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            effect: 'fade',
            fadeEffect: {
                crossFade: true
            },
            speed: 1000,
        });
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initHeroSlider);
    } else {
        initHeroSlider();
    }
})();