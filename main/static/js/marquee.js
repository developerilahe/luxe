// Infinite Marquee for Sponsors
(function() {
    'use strict';
    
    function initMarquee() {
        const marqueeTrack = document.querySelector('.marquee-track');
        if (!marqueeTrack) return;
        
        let position = 0;
        let animationId = null;
        let isAnimating = true;
        
        function animate() {
            if (!isAnimating) return;
            
            position -= 1.5;
            const content = marqueeTrack.querySelector('.marquee-content');
            if (content) {
                const contentWidth = content.offsetWidth / 2;
                if (Math.abs(position) >= contentWidth) {
                    position = 0;
                }
                content.style.transform = `translateX(${position}px)`;
            }
            
            animationId = requestAnimationFrame(animate);
        }
        
        const marqueeContainer = document.querySelector('.sponsor-marquee');
        if (marqueeContainer) {
            marqueeContainer.addEventListener('mouseenter', () => {
                isAnimating = false;
                if (animationId) {
                    cancelAnimationFrame(animationId);
                    animationId = null;
                }
            });
            
            marqueeContainer.addEventListener('mouseleave', () => {
                if (!animationId && !isAnimating) {
                    isAnimating = true;
                    animate();
                }
            });
        }
        
        animate();
        
        window.addEventListener('beforeunload', () => {
            if (animationId) cancelAnimationFrame(animationId);
        });
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMarquee);
    } else {
        initMarquee();
    }
})();