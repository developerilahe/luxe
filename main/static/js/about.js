// About Section Animations - Crazy Version with Scroll Protection
(function() {
    'use strict';
    
    let statsAnimated = false;
    let isAboutActive = false;
    
    // Check if about section is active
    function isAboutSectionActive() {
        const aboutSection = document.querySelector('.about-section');
        return aboutSection && aboutSection.classList.contains('active');
    }
    
    // Animate numbers counting up
    function animateNumbers() {
        const statNumbers = document.querySelectorAll('.about-section .stat-number');
        
        statNumbers.forEach(stat => {
            const target = parseInt(stat.dataset.target);
            let current = 0;
            const increment = target / 50;
            
            const updateNumber = () => {
                current += increment;
                if (current < target) {
                    stat.textContent = Math.floor(current);
                    requestAnimationFrame(updateNumber);
                } else {
                    stat.textContent = target.toLocaleString();
                }
            };
            
            updateNumber();
        });
    }
    
    // 3D card mouse move effect
    function init3DCard() {
        const card = document.getElementById('showcaseCard');
        if (!card) return;
        
        card.addEventListener('mousemove', (e) => {
            if (!isAboutSectionActive()) return;
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            const inner = card.querySelector('.card-3d-inner');
            if (inner) {
                inner.style.transform = `rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
            }
        });
        
        card.addEventListener('mouseleave', () => {
            const inner = card.querySelector('.card-3d-inner');
            if (inner) {
                inner.style.transform = 'rotateY(0deg) rotateX(0deg)';
            }
        });
    }
    
    // Parallax floating shapes
    function initFloatingShapes() {
        const shapes = document.querySelectorAll('.floating-shape');
        const leftHalf = document.querySelector('.about-section .left-half');
        
        if (!leftHalf || shapes.length === 0) return;
        
        leftHalf.addEventListener('mousemove', (e) => {
            if (!isAboutSectionActive()) return;
            const rect = leftHalf.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            
            shapes.forEach((shape, index) => {
                const speed = 20 + index * 10;
                const moveX = x * speed;
                const moveY = y * speed;
                shape.style.transform = `translate(${moveX}px, ${moveY}px)`;
            });
        });
    }
    
    // Timeline hover effects
    function initTimeline() {
        const timelineItems = document.querySelectorAll('.timeline-item');
        
        timelineItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                if (!isAboutSectionActive()) return;
                const dot = item.querySelector('.timeline-dot');
                if (dot) {
                    dot.style.animation = 'pulseGlow 0.5s ease';
                    setTimeout(() => {
                        dot.style.animation = '';
                    }, 500);
                }
            });
        });
    }
    
    // Team card hover effects
    function initTeamCards() {
        const teamCards = document.querySelectorAll('.team-card');
        
        teamCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                if (!isAboutSectionActive()) return;
                gsap.to(card, {
                    scale: 1.05,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });
            
            card.addEventListener('mouseleave', () => {
                gsap.to(card, {
                    scale: 1,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });
        });
    }
    
    // Value cards animation
    function initValueCards() {
        const valueCards = document.querySelectorAll('.value-card');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && isAboutSectionActive()) {
                    entry.target.style.animation = 'slideUpFade 0.5s ease forwards';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        valueCards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            observer.observe(card);
        });
    }
    
    // Stats animation when section becomes visible
    function initStatsAnimation() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !statsAnimated && isAboutSectionActive()) {
                    setTimeout(() => {
                        animateNumbers();
                        statsAnimated = true;
                    }, 500);
                }
            });
        }, { threshold: 0.5 });
        
        const statsGrid = document.querySelector('.about-stats-grid');
        if (statsGrid) {
            observer.observe(statsGrid);
        }
    }
    
    // Text scramble effect on hover for title words
    function initTextScramble() {
        const titleWords = document.querySelectorAll('.title-word');
        
        titleWords.forEach(word => {
            word.addEventListener('mouseenter', () => {
                if (!isAboutSectionActive()) return;
                const originalText = word.textContent;
                const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*';
                let iterations = 0;
                const maxIterations = 10;
                
                const interval = setInterval(() => {
                    word.textContent = originalText.split('')
                        .map((letter, index) => {
                            if (index < iterations) return originalText[index];
                            return letters[Math.floor(Math.random() * letters.length)];
                        })
                        .join('');
                    
                    iterations += 1 / 3;
                    
                    if (iterations >= maxIterations) {
                        clearInterval(interval);
                        word.textContent = originalText;
                    }
                }, 50);
            });
        });
    }
    
    // Animate timeline items on scroll
    function initTimelineScroll() {
        const timelineItems = document.querySelectorAll('.timeline-item');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting && isAboutSectionActive()) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateX(0)';
                    }, index * 200);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        
        timelineItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(-20px)';
            item.style.transition = 'all 0.5s ease';
            observer.observe(item);
        });
    }
    
    // Add slide up animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideUpFade {
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);
    
    // Reset stats when leaving about section
    function resetStats() {
        statsAnimated = false;
        const statNumbers = document.querySelectorAll('.about-section .stat-number');
        statNumbers.forEach(stat => {
            stat.textContent = '0';
        });
    }
    
    // Initialize all animations when section becomes active
    function initAboutSection() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'class') {
                    const section = mutation.target;
                    if (section.classList.contains('about-section')) {
                        if (section.classList.contains('active')) {
                            isAboutActive = true;
                            // Initialize all animations
                            setTimeout(() => {
                                init3DCard();
                                initFloatingShapes();
                                initTimeline();
                                initTeamCards();
                                initValueCards();
                                initStatsAnimation();
                                initTextScramble();
                                initTimelineScroll();
                            }, 100);
                        } else {
                            isAboutActive = false;
                            resetStats();
                        }
                    }
                }
            });
        });
        
        const aboutSection = document.querySelector('.about-section');
        if (aboutSection) {
            observer.observe(aboutSection, { attributes: true });
        }
    }
    
    // Start when DOM ready
    document.addEventListener('DOMContentLoaded', () => {
        initAboutSection();
    });
})();