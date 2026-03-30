// Contact Section - Crazy Animations
(function() {
    'use strict';
    
    let particleCanvas = null;
    let ctx = null;
    let particles = [];
    let animationId = null;
    let isContactActive = false;
    
    // Particle System
    function initParticles() {
        particleCanvas = document.getElementById('particleCanvas');
        if (!particleCanvas) return;
        
        ctx = particleCanvas.getContext('2d');
        
        function resizeCanvas() {
            const leftHalf = document.querySelector('.contact-section .left-half');
            if (leftHalf) {
                particleCanvas.width = leftHalf.offsetWidth;
                particleCanvas.height = leftHalf.offsetHeight;
            }
        }
        
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        
        // Create particles
        const particleCount = 100;
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * particleCanvas.width,
                y: Math.random() * particleCanvas.height,
                radius: Math.random() * 3 + 1,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5,
                color: `rgba(200, 168, 107, ${Math.random() * 0.5 + 0.2})`
            });
        }
        
        function animateParticles() {
            if (!isContactActive) return;
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
    
    // Stop particles
    function stopParticles() {
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }
        if (ctx && particleCanvas) {
            ctx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
        }
    }
    
    // Form submission with animation
    function initForm() {
        const form = document.getElementById('contactForm');
        const submitBtn = document.getElementById('submitBtn');
        const successMsg = document.getElementById('successMessage');
        const formCard = document.querySelector('.form-card');
        
        if (!form) return;
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Animate button
            submitBtn.style.transform = 'scale(0.95)';
            setTimeout(() => {
                submitBtn.style.transform = '';
            }, 200);
            
            // Show loading state
            const btnText = submitBtn.querySelector('.btn-text');
            const originalText = btnText.textContent;
            btnText.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            // Simulate sending (replace with actual API call)
            setTimeout(() => {
                // Hide form, show success message
                formCard.style.animation = 'cardFloat 0.5s ease reverse';
                setTimeout(() => {
                    form.style.display = 'none';
                    successMsg.classList.add('show');
                    
                    // Reset form after 3 seconds
                    setTimeout(() => {
                        form.reset();
                        form.style.display = '';
                        successMsg.classList.remove('show');
                        formCard.style.animation = '';
                        btnText.textContent = originalText;
                        submitBtn.disabled = false;
                        
                        // Show toast notification
                        if (window.showToast) {
                            window.showToast('Message sent successfully!');
                        }
                    }, 3000);
                }, 300);
            }, 1500);
        });
    }
    
    // Animate contact cards on scroll
    function initCardAnimations() {
        const cards = document.querySelectorAll('.contact-info-card');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting && isContactActive) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 100);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = `all 0.5s ease ${index * 0.1}s`;
            observer.observe(card);
        });
    }
    
    // Animate social links
    function initSocialLinks() {
        const socialLinks = document.querySelectorAll('.social-link');
        
        socialLinks.forEach((link, index) => {
            link.style.animation = `fadeInUp 0.5s ease ${index * 0.1}s forwards`;
            link.style.opacity = '0';
        });
    }
    
    // Add fadeInUp animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInUp {
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        .social-link {
            transform: translateY(20px);
        }
    `;
    document.head.appendChild(style);
    
    // Typing effect for badge
    function initTypingEffect() {
        const badge = document.querySelector('.contact-badge');
        if (!badge) return;
        
        const originalText = badge.textContent;
        badge.textContent = '';
        
        let i = 0;
        const typeInterval = setInterval(() => {
            if (!isContactActive) return;
            if (i < originalText.length) {
                badge.textContent += originalText.charAt(i);
                i++;
            } else {
                clearInterval(typeInterval);
                setTimeout(() => {
                    badge.style.animation = 'borderPulse 2s ease-in-out infinite';
                }, 500);
            }
        }, 100);
    }
    
    // Magnetic effect on buttons
    function initMagneticEffect() {
        const submitBtn = document.getElementById('submitBtn');
        if (!submitBtn) return;
        
        submitBtn.addEventListener('mousemove', (e) => {
            if (!isContactActive) return;
            const rect = submitBtn.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const moveX = (x - centerX) / 20;
            const moveY = (y - centerY) / 20;
            
            submitBtn.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });
        
        submitBtn.addEventListener('mouseleave', () => {
            submitBtn.style.transform = '';
        });
    }
    
    // Parallax effect on form card
    function initFormParallax() {
        const formCard = document.querySelector('.form-card');
        const container = document.querySelector('.form-container-3d');
        
        if (!formCard || !container) return;
        
        container.addEventListener('mousemove', (e) => {
            if (!isContactActive) return;
            const rect = container.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            
            const rotateY = x * 10;
            const rotateX = y * -10;
            
            formCard.style.transform = `perspective(1000px) rotateY(${rotateY}deg) rotateX(${rotateX}deg) translateY(-5px)`;
        });
        
        container.addEventListener('mouseleave', () => {
            formCard.style.transform = '';
        });
    }
    
    // Floating labels animation
    function initFloatingLabels() {
        const inputs = document.querySelectorAll('.floating-input input, .floating-input textarea');
        
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                const parent = input.closest('.input-group');
                const icon = parent.querySelector('.input-icon');
                if (icon) {
                    icon.style.transform = 'scale(1.1)';
                }
            });
            
            input.addEventListener('blur', () => {
                const parent = input.closest('.input-group');
                const icon = parent.querySelector('.input-icon');
                if (icon) {
                    icon.style.transform = '';
                }
            });
        });
    }
    
    // Live status pulse animation
    function initLiveStatus() {
        const pulseDot = document.querySelector('.pulse-dot');
        if (pulseDot) {
            setInterval(() => {
                if (isContactActive) {
                    pulseDot.style.animation = 'none';
                    setTimeout(() => {
                        pulseDot.style.animation = 'pulse 1.5s ease-in-out infinite';
                    }, 10);
                }
            }, 3000);
        }
    }
    
    // Reset all animations when leaving section
    function resetContactSection() {
        stopParticles();
        
        const cards = document.querySelectorAll('.contact-info-card');
        cards.forEach(card => {
            card.style.opacity = '';
            card.style.transform = '';
        });
        
        const formCard = document.querySelector('.form-card');
        if (formCard) {
            formCard.style.transform = '';
        }
    }
    
    // Initialize when section becomes active
    function initContactSection() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'class') {
                    const section = mutation.target;
                    if (section.classList.contains('contact-section')) {
                        if (section.classList.contains('active')) {
                            isContactActive = true;
                            setTimeout(() => {
                                initParticles();
                                initForm();
                                initCardAnimations();
                                initSocialLinks();
                                initTypingEffect();
                                initMagneticEffect();
                                initFormParallax();
                                initFloatingLabels();
                                initLiveStatus();
                            }, 100);
                        } else {
                            isContactActive = false;
                            resetContactSection();
                        }
                    }
                }
            });
        });
        
        const contactSection = document.querySelector('.contact-section');
        if (contactSection) {
            observer.observe(contactSection, { attributes: true });
        }
    }
    
    // Start when DOM ready
    document.addEventListener('DOMContentLoaded', () => {
        initContactSection();
    });
})();