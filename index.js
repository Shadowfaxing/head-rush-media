document.addEventListener('DOMContentLoaded', () => {
    // ===== UTILITY FUNCTIONS =====

    // Debounce function to limit how often a function can run
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Throttle function for scroll events
    function throttle(func, limit) {
        let inThrottle;
        return function (...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // ===== MOBILE MENU =====
    const mobileMenuBtn = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = mobileMenuBtn.querySelector('i');
            icon.setAttribute('data-lucide', navLinks.classList.contains('active') ? 'x' : 'menu');
            lucide.createIcons();
        });
    }

    // ===== SMOOTH SCROLL =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });

    // ===== FORM SUBMISSION =====
    const contactForm = document.getElementById('hr-contact');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button');
            const originalText = btn.innerText;
            btn.innerText = 'Sending...';
            btn.disabled = true;

            setTimeout(() => {
                btn.innerText = 'Message Sent!';
                btn.style.backgroundColor = 'var(--primary-color)';
                btn.style.color = 'var(--text-color)';
                contactForm.reset();
                setTimeout(() => {
                    btn.innerText = originalText;
                    btn.disabled = false;
                    btn.style.backgroundColor = '';
                    btn.style.color = '';
                }, 3000);
            }, 1500);
        });
    }

    // ===== OPTIMIZED INTERSECTION OBSERVER =====
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target); // Stop observing once animated
            }
        });
    }, observerOptions);

    // Observe sections for fade-in (only non-hero sections)
    document.querySelectorAll('section:not(.hero)').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });

    // ===== OPTIMIZED NAVBAR SCROLL =====
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;

    const handleScroll = throttle(() => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            navbar.style.padding = '1rem 0';
            navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.padding = '2rem 0';
            navbar.style.boxShadow = 'none';
        }

        lastScroll = currentScroll;
    }, 100);

    window.addEventListener('scroll', handleScroll, { passive: true });

    // ===== OPTIMIZED SERVICES PREVIEW =====
    const previewImage = document.getElementById('preview-image');
    const previewImg = previewImage?.querySelector('img');
    const serviceItems = document.querySelectorAll('.service-showcase-item');

    if (previewImage && previewImg && serviceItems.length > 0 && window.innerWidth > 768) {
        let mouseX = 0;
        let mouseY = 0;
        let currentX = 0;
        let currentY = 0;
        let isHovering = false;
        let rafId = null;

        function animatePreview() {
            if (isHovering) {
                currentX += (mouseX - currentX) * 0.15;
                currentY += (mouseY - currentY) * 0.15;

                previewImage.style.transform = `translate(${currentX}px, ${currentY}px)`;
                rafId = requestAnimationFrame(animatePreview);
            }
        }

        serviceItems.forEach(item => {
            const imageSrc = item.getAttribute('data-image');

            item.addEventListener('mouseenter', () => {
                if (imageSrc) {
                    previewImg.src = imageSrc;
                    previewImage.classList.add('active');
                    isHovering = true;
                    if (!rafId) rafId = requestAnimationFrame(animatePreview);
                }
            });

            item.addEventListener('mousemove', throttle((e) => {
                mouseX = e.clientX + 20;
                mouseY = e.clientY - 100;

                const previewWidth = 280;
                const previewHeight = 200;

                if (mouseX + previewWidth > window.innerWidth) {
                    mouseX = e.clientX - previewWidth - 20;
                }
                if (mouseY + previewHeight > window.innerHeight) {
                    mouseY = window.innerHeight - previewHeight - 20;
                }
                if (mouseY < 0) mouseY = 20;
            }, 16), { passive: true });

            item.addEventListener('mouseleave', () => {
                previewImage.classList.remove('active');
                isHovering = false;
                if (rafId) {
                    cancelAnimationFrame(rafId);
                    rafId = null;
                }
            });
        });
    }

    // ===== OPTIMIZED WORK HOVER EFFECT =====
    const workItems = document.querySelectorAll('.work-item');

    workItems.forEach(item => {
        const hoverImg = item.querySelector('.hover-img');
        if (!hoverImg) return;

        let animationId = null;
        let targetRadius = 0;
        let currentRadius = 0;
        let centerX = 50;
        let centerY = 50;
        let isAnimating = false;

        function animateReveal() {
            currentRadius += (targetRadius - currentRadius) * 0.2;
            hoverImg.style.clipPath = `circle(${currentRadius}% at ${centerX}% ${centerY}%)`;

            if (Math.abs(targetRadius - currentRadius) > 0.5) {
                animationId = requestAnimationFrame(animateReveal);
            } else {
                currentRadius = targetRadius;
                hoverImg.style.clipPath = `circle(${currentRadius}% at ${centerX}% ${centerY}%)`;
                isAnimating = false;
            }
        }

        item.addEventListener('mouseenter', (e) => {
            const rect = item.getBoundingClientRect();
            centerX = ((e.clientX - rect.left) / rect.width) * 100;
            centerY = ((e.clientY - rect.top) / rect.height) * 100;

            currentRadius = 0;
            targetRadius = 150;

            if (animationId) cancelAnimationFrame(animationId);
            if (!isAnimating) {
                isAnimating = true;
                animationId = requestAnimationFrame(animateReveal);
            }
        });

        item.addEventListener('mousemove', throttle((e) => {
            const rect = item.getBoundingClientRect();
            centerX = ((e.clientX - rect.left) / rect.width) * 100;
            centerY = ((e.clientY - rect.top) / rect.height) * 100;
        }, 32), { passive: true });

        item.addEventListener('mouseleave', (e) => {
            const rect = item.getBoundingClientRect();
            centerX = ((e.clientX - rect.left) / rect.width) * 100;
            centerY = ((e.clientY - rect.top) / rect.height) * 100;

            targetRadius = 0;

            if (animationId) cancelAnimationFrame(animationId);
            if (!isAnimating) {
                isAnimating = true;
                animationId = requestAnimationFrame(animateReveal);
            }
        });
    });

    // ===== PRELOAD CRITICAL IMAGES =====
    // Preload hero images for smoother experience
    const heroImages = document.querySelectorAll('.hero-img img');
    heroImages.forEach(img => {
        if (img.loading !== 'lazy') {
            const src = img.getAttribute('src');
            if (src) {
                const preloadLink = document.createElement('link');
                preloadLink.rel = 'preload';
                preloadLink.as = 'image';
                preloadLink.href = src;
                document.head.appendChild(preloadLink);
            }
        }
    });
});
