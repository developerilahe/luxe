// Fixed Scroll Effect - With Scrollable Area Detection
(function() {
    'use strict';
    
    if (window.innerWidth < 1024) return;
    
    let sections = document.querySelectorAll('.section');
    let currentSection = 0;
    let isTransitioning = false;
    let wheelDelta = 0;
    let wheelTimeout;
    
    // Check if modal is open
    function isModalOpen() {
        const modal = document.getElementById('product-modal');
        return modal && modal.classList.contains('active');
    }
    
    // Check if target is inside a scrollable area
    function isInsideScrollableArea(target) {
        // Find the closest scrollable container
        const scrollableContainers = [
            '.left-half',
            '.right-half', 
            '.products-container',
            '.filter-panel',
            '.search-results-grid',
            '.modal-body',
            '.section-half'
        ];
        
        for (const selector of scrollableContainers) {
            const container = target.closest(selector);
            if (container) {
                // Check if this container is scrollable (has overflow)
                const style = window.getComputedStyle(container);
                const overflowY = style.overflowY;
                const isScrollable = (overflowY === 'auto' || overflowY === 'scroll') && container.scrollHeight > container.clientHeight;
                
                if (isScrollable) {
                    return {
                        isScrollable: true,
                        container: container,
                        atTop: container.scrollTop === 0,
                        atBottom: container.scrollHeight - container.scrollTop === container.clientHeight
                    };
                }
            }
        }
        
        return { isScrollable: false };
    }
    
    // Set initial state
    function init() {
        sections = document.querySelectorAll('.section');
        if (sections.length === 0) return;
        
        sections.forEach((section, index) => {
            if (index === 0) {
                section.classList.add('active');
                const leftHalf = section.querySelector('.left-half');
                const rightHalf = section.querySelector('.right-half');
                if (leftHalf) leftHalf.style.transform = 'translateX(0%)';
                if (rightHalf) rightHalf.style.transform = 'translateX(0%)';
            } else {
                section.classList.remove('active');
                const leftHalf = section.querySelector('.left-half');
                const rightHalf = section.querySelector('.right-half');
                if (leftHalf) leftHalf.style.transform = 'translateX(-100%)';
                if (rightHalf) rightHalf.style.transform = 'translateX(100%)';
            }
        });
        
        updateIndicator();
    }
    
    // Handle wheel scroll - Disabled when modal is open or scrolling inside scrollable areas
    function handleWheel(e) {
        // Don't scroll sections if modal is open
        if (isModalOpen()) {
            return;
        }
        
        // Check if scrolling inside a scrollable area
        const scrollableInfo = isInsideScrollableArea(e.target);
        
        if (scrollableInfo.isScrollable) {
            const container = scrollableInfo.container;
            const deltaY = e.deltaY;
            const atTop = scrollableInfo.atTop;
            const atBottom = scrollableInfo.atBottom;
            
            // If at the top and trying to scroll up, or at bottom and trying to scroll down
            // Allow section change by not preventing default
            if ((atTop && deltaY < 0) || (atBottom && deltaY > 0)) {
                // Let the section change happen
                // Don't return - continue to section change logic
            } else {
                // Let the scrollable container scroll naturally
                // Don't prevent default and don't change section
                return;
            }
        }
        
        if (isTransitioning) {
            e.preventDefault();
            return;
        }
        
        wheelDelta += e.deltaY;
        
        if (wheelTimeout) clearTimeout(wheelTimeout);
        
        const threshold = 30;
        
        if (Math.abs(wheelDelta) >= threshold) {
            if (wheelDelta > 0 && currentSection < sections.length - 1) {
                e.preventDefault();
                changeSection(currentSection + 1);
                wheelDelta = 0;
            } else if (wheelDelta < 0 && currentSection > 0) {
                e.preventDefault();
                changeSection(currentSection - 1);
                wheelDelta = 0;
            } else {
                wheelDelta = 0;
            }
        }
        
        wheelTimeout = setTimeout(() => {
            wheelDelta = 0;
        }, 100);
    }
    
    // Change section with side slide animation
    function changeSection(newIndex) {
        if (isTransitioning || newIndex === currentSection) return;
        if (newIndex < 0 || newIndex >= sections.length) return;
        
        isTransitioning = true;
        
        const oldSection = sections[currentSection];
        const newSection = sections[newIndex];
        
        const oldLeft = oldSection.querySelector('.left-half');
        const oldRight = oldSection.querySelector('.right-half');
        const newLeft = newSection.querySelector('.left-half');
        const newRight = newSection.querySelector('.right-half');
        
        newSection.classList.add('active');
        
        gsap.set(newLeft, { x: '-100%', visibility: 'visible' });
        gsap.set(newRight, { x: '100%', visibility: 'visible' });
        
        const tl = gsap.timeline({
            onComplete: () => {
                oldSection.classList.remove('active');
                gsap.set(oldLeft, { x: '0%' });
                gsap.set(oldRight, { x: '0%' });
                currentSection = newIndex;
                isTransitioning = false;
                updateIndicator();
                updateActiveNavLink();
            }
        });
        
        tl.to(oldLeft, { x: '-100%', duration: 0.5, ease: 'power2.in' }, 0);
        tl.to(oldRight, { x: '100%', duration: 0.5, ease: 'power2.in' }, 0);
        tl.to(newLeft, { x: '0%', duration: 0.5, ease: 'power2.out' }, 0);
        tl.to(newRight, { x: '0%', duration: 0.5, ease: 'power2.out' }, 0);
    }
    
    function updateIndicator() {
        const currentSpan = document.querySelector('.current-section');
        const totalSpan = document.querySelector('.total-sections');
        if (currentSpan) {
            currentSpan.textContent = (currentSection + 1).toString().padStart(2, '0');
        }
        if (totalSpan) {
            totalSpan.textContent = sections.length.toString().padStart(2, '0');
        }
    }
    
    function updateActiveNavLink() {
        const navLinks = document.querySelectorAll('.nav-link[data-section]');
        navLinks.forEach(link => {
            const sectionIndex = parseInt(link.getAttribute('data-section'));
            if (sectionIndex === currentSection) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
    
    function setupArrows() {
        const upArrow = document.querySelector('.up-arrow');
        const downArrow = document.querySelector('.down-arrow');
        
        if (upArrow) {
            upArrow.addEventListener('click', () => {
                if (!isModalOpen() && currentSection > 0 && !isTransitioning) {
                    changeSection(currentSection - 1);
                }
            });
        }
        
        if (downArrow) {
            downArrow.addEventListener('click', () => {
                if (!isModalOpen() && currentSection < sections.length - 1 && !isTransitioning) {
                    changeSection(currentSection + 1);
                }
            });
        }
    }
    
    function setupNavLinks() {
        const navLinks = document.querySelectorAll('.nav-link[data-section]');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                if (isModalOpen()) return;
                e.preventDefault();
                const sectionIndex = parseInt(link.getAttribute('data-section'));
                if (!isNaN(sectionIndex) && sectionIndex !== currentSection && !isTransitioning) {
                    changeSection(sectionIndex);
                }
            });
        });
        
        const shopNowBtn = document.querySelector('.shop-now-btn');
        if (shopNowBtn) {
            shopNowBtn.addEventListener('click', () => {
                if (!isModalOpen() && sections.length > 1 && !isTransitioning) {
                    changeSection(1);
                }
            });
        }
    }
    
    function setupKeyboard() {
        document.addEventListener('keydown', (e) => {
            if (isModalOpen()) return;
            
            if (e.key === 'ArrowUp' && currentSection > 0 && !isTransitioning) {
                changeSection(currentSection - 1);
            } else if (e.key === 'ArrowDown' && currentSection < sections.length - 1 && !isTransitioning) {
                changeSection(currentSection + 1);
            }
        });
    }
    
    // Add scroll event listeners to prevent section change when scrolling inside containers
    function setupScrollProtection() {
        const scrollableElements = document.querySelectorAll('.left-half, .right-half, .products-container, .filter-panel');
        
        scrollableElements.forEach(element => {
            element.addEventListener('wheel', (e) => {
                const atTop = element.scrollTop === 0;
                const atBottom = element.scrollHeight - element.scrollTop === element.clientHeight;
                const deltaY = e.deltaY;
                
                // If at edge and trying to scroll further, allow section change
                if ((atTop && deltaY < 0) || (atBottom && deltaY > 0)) {
                    // Let the event bubble to section change handler
                    return;
                }
                
                // Otherwise, prevent the event from reaching section change handler
                e.stopPropagation();
            }, { passive: false });
        });
    }
    
    window.addEventListener('load', () => {
        init();
        setupArrows();
        setupNavLinks();
        setupKeyboard();
        setupScrollProtection();
        window.addEventListener('wheel', handleWheel, { passive: false });
    });
})();