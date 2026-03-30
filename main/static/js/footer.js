// Footer Section - Crazy Animations
(function() {
    'use strict';
    
    let particleCanvas = null;
    let ctx = null;
    let particles = [];
    let animationId = null;
    let isFooterActive = false;
    
    // Particle System for Footer
    function initFooterParticles() {
        const container = document.getElementById('footerParticles');
        if (!container) return;
        
        particleCanvas = document.createElement('canvas');
        particleCanvas.style.position = 'absolute';
        particleCanvas.style.top = '0';
        particleCanvas.style.left = '0';
        particleCanvas.style.width = '100%';
        particleCanvas.style.height = '100%';
        particleCanvas.style.pointerEvents = 'none';
        container.appendChild(particleCanvas);
        
        ctx = particleCanvas.getContext('2d');
        
        function resizeCanvas() {
            const rect = container.parentElement.getBoundingClientRect();
            particleCanvas.width = rect.width;
            particleCanvas.height = rect.height;
        }
        
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        
        // Create floating particles
        const particleCount = 80;
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * particleCanvas.width,
                y: Math.random() * particleCanvas.height,
                radius: Math.random() * 2 + 1,
                speedX: (Math.random() - 0.5) * 0.3,
                speedY: (Math.random() - 0.5) * 0.3,
                opacity: Math.random() * 0.5 + 0.2,
                color: `rgba(200, 168, 107, ${Math.random() * 0.5 + 0.1})`
            });
        }
        
        function animateParticles() {
            if (!isFooterActive) return;
            if (!ctx || !particleCanvas) return;
            
            ctx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
            
            particles.forEach(particle => {
                particle.x += particle.speedX;
                particle.y += particle.speedY;
                
                if (particle.x < 0) particle.x = particleCanvas.width;
                if (particle.x > particleCanvas.width) particle.x = 0;
                if (particle.y < 0) particle.y = particleCanvas.height;
                if (particle.y > particleCanvas.height) particle.y = 0;
                
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
                ctx.fillStyle = particle.color;
                ctx.fill();
            });
            
            animationId = requestAnimationFrame(animateParticles);
        }
        
        animateParticles();
    }
    
    // Newsletter subscription
    function initNewsletter() {
        const subscribeBtn = document.getElementById('subscribeBtn');
        const emailInput = document.getElementById('newsletterEmail');
        const successMsg = document.getElementById('newsletterSuccess');
        
        if (!subscribeBtn) return;
        
        subscribeBtn.addEventListener('click', () => {
            const email = emailInput.value.trim();
            if (!email) {
                if (window.showToast) {
                    window.showToast('Please enter your email address');
                }
                return;
            }
            
            if (!email.includes('@') || !email.includes('.')) {
                if (window.showToast) {
                    window.showToast('Please enter a valid email address');
                }
                return;
            }
            
            // Animate button
            subscribeBtn.style.transform = 'scale(0.9)';
            setTimeout(() => {
                subscribeBtn.style.transform = '';
            }, 200);
            
            // Show success
            successMsg.classList.add('show');
            emailInput.value = '';
            
            setTimeout(() => {
                successMsg.classList.remove('show');
            }, 3000);
            
            if (window.showToast) {
                window.showToast('Successfully subscribed to newsletter!');
            }
        });
        
        emailInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                subscribeBtn.click();
            }
        });
    }
    
    // Animate footer elements on scroll
    function initFooterScrollAnimations() {
        const footerColumns = document.querySelectorAll('.footer-column');
        const socialIcons = document.querySelectorAll('.social-icon-card');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && isFooterActive) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        footerColumns.forEach(column => {
            column.style.opacity = '0';
            column.style.transform = 'translateY(20px)';
            column.style.transition = 'all 0.5s ease';
            observer.observe(column);
        });
        
        socialIcons.forEach((icon, index) => {
            icon.style.opacity = '0';
            icon.style.transform = 'translateY(20px)';
            icon.style.transition = `all 0.5s ease ${index * 0.05}s`;
            observer.observe(icon);
        });
    }
    
    // Magnetic effect on social icons
    function initMagneticEffect() {
        const socialIcons = document.querySelectorAll('.social-icon-card');
        
        socialIcons.forEach(icon => {
            icon.addEventListener('mousemove', (e) => {
                if (!isFooterActive) return;
                const rect = icon.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const moveX = (x - centerX) / 15;
                const moveY = (y - centerY) / 15;
                
                icon.style.transform = `translate(${moveX}px, ${moveY}px)`;
            });
            
            icon.addEventListener('mouseleave', () => {
                icon.style.transform = '';
            });
        });
    }
    
    // Parallax effect on footer background
    function initFooterParallax() {
        const footer = document.querySelector('.footer-section');
        if (!footer) return;
        
        window.addEventListener('mousemove', (e) => {
            if (!isFooterActive) return;
            const x = e.clientX / window.innerWidth;
            const y = e.clientY / window.innerHeight;
            const gradient = footer.querySelector('.footer-gradient');
            if (gradient) {
                gradient.style.transform = `translate(${x * 20}px, ${y * 20}px)`;
            }
        });
    }
    
    // Animate payment icons
    function initPaymentIcons() {
        const paymentIcons = document.querySelectorAll('.footer-payment i');
        
        paymentIcons.forEach(icon => {
            icon.addEventListener('mouseenter', () => {
                gsap.to(icon, {
                    y: -5,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });
            
            icon.addEventListener('mouseleave', () => {
                gsap.to(icon, {
                    y: 0,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });
        });
    }
    
    // Typing effect for footer logo
    function initLogoEffect() {
        const logoText = document.querySelector('.footer-logo-text');
        if (!logoText) return;
        
        const originalText = logoText.textContent;
        logoText.textContent = '';
        
        let i = 0;
        const typeInterval = setInterval(() => {
            if (!isFooterActive) {
                clearInterval(typeInterval);
                logoText.textContent = originalText;
                return;
            }
            if (i < originalText.length) {
                logoText.textContent += originalText.charAt(i);
                i++;
            } else {
                clearInterval(typeInterval);
            }
        }, 100);
    }
    
    // Initialize when footer section becomes active
    function initFooterSection() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'class') {
                    const section = mutation.target;
                    if (section.classList.contains('footer-section')) {
                        if (section.classList.contains('active')) {
                            isFooterActive = true;
                            setTimeout(() => {
                                initFooterParticles();
                                initNewsletter();
                                initFooterScrollAnimations();
                                initMagneticEffect();
                                initFooterParallax();
                                initPaymentIcons();
                                initLogoEffect();
                            }, 100);
                        } else {
                            isFooterActive = false;
                            if (animationId) {
                                cancelAnimationFrame(animationId);
                                animationId = null;
                            }
                            if (ctx && particleCanvas) {
                                ctx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
                            }
                        }
                    }
                }
            });
        });
        
        const footerSection = document.querySelector('.footer-section');
        if (footerSection) {
            observer.observe(footerSection, { attributes: true });
        }
    }
    
    // Start when DOM ready
    document.addEventListener('DOMContentLoaded', () => {
        initFooterSection();
    });
})();