document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = mobileMenuBtn.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.setAttribute('data-lucide', 'x');
            } else {
                icon.setAttribute('data-lucide', 'menu');
            }
            lucide.createIcons();
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const offsetTop = target.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Form Submission
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

    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe sections for fade-in
    document.querySelectorAll('section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(section);
    });

    // Navbar scroll effect
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        const navbar = document.querySelector('.navbar');

        if (currentScroll > 100) {
            navbar.style.padding = '1rem 0';
            navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.padding = '2rem 0';
            navbar.style.boxShadow = 'none';
        }

        lastScroll = currentScroll;
    });

    // Services Showcase - Floating Preview Image
    const previewImage = document.getElementById('preview-image');
    const previewImg = previewImage?.querySelector('img');
    const serviceItems = document.querySelectorAll('.service-showcase-item');

    if (previewImage && previewImg && serviceItems.length > 0) {
        let mouseX = 0;
        let mouseY = 0;
        let currentX = 0;
        let currentY = 0;
        let isHovering = false;

        // Smooth animation loop for preview image position
        function animatePreview() {
            if (isHovering) {
                // Smooth lerp for fluid movement
                currentX += (mouseX - currentX) * 0.15;
                currentY += (mouseY - currentY) * 0.15;

                previewImage.style.left = `${currentX}px`;
                previewImage.style.top = `${currentY}px`;
            }
            requestAnimationFrame(animatePreview);
        }
        animatePreview();

        serviceItems.forEach(item => {
            const imageSrc = item.getAttribute('data-image');

            item.addEventListener('mouseenter', () => {
                if (imageSrc && window.innerWidth > 768) {
                    previewImg.src = imageSrc;
                    previewImage.classList.add('active');
                    isHovering = true;
                }
            });

            item.addEventListener('mousemove', (e) => {
                if (window.innerWidth > 768) {
                    // Position preview to the right of cursor
                    mouseX = e.clientX + 20;
                    mouseY = e.clientY - 100;

                    // Keep preview within viewport
                    const previewWidth = 280;
                    const previewHeight = 200;

                    if (mouseX + previewWidth > window.innerWidth) {
                        mouseX = e.clientX - previewWidth - 20;
                    }
                    if (mouseY + previewHeight > window.innerHeight) {
                        mouseY = window.innerHeight - previewHeight - 20;
                    }
                    if (mouseY < 0) {
                        mouseY = 20;
                    }
                }
            });

            item.addEventListener('mouseleave', () => {
                previewImage.classList.remove('active');
                isHovering = false;
            });
        });
    }

    // Our Work - Liquid Morph Hover Effect
    const workItems = document.querySelectorAll('.work-item');

    workItems.forEach(item => {
        const hoverImg = item.querySelector('.hover-img');

        if (hoverImg) {
            let animationId = null;
            let targetRadius = 0;
            let currentRadius = 0;
            let centerX = 50;
            let centerY = 50;

            function animateReveal() {
                // Smooth interpolation
                currentRadius += (targetRadius - currentRadius) * 0.15;

                // Apply clip-path with current values
                hoverImg.style.clipPath = `circle(${currentRadius}% at ${centerX}% ${centerY}%)`;

                // Continue animation if not at target
                if (Math.abs(targetRadius - currentRadius) > 0.1) {
                    animationId = requestAnimationFrame(animateReveal);
                } else {
                    currentRadius = targetRadius;
                    hoverImg.style.clipPath = `circle(${currentRadius}% at ${centerX}% ${centerY}%)`;
                }
            }

            item.addEventListener('mouseenter', (e) => {
                const rect = item.getBoundingClientRect();
                centerX = ((e.clientX - rect.left) / rect.width) * 100;
                centerY = ((e.clientY - rect.top) / rect.height) * 100;

                // Reset and start reveal animation
                currentRadius = 0;
                hoverImg.style.clipPath = `circle(0% at ${centerX}% ${centerY}%)`;

                // Animate to full reveal
                targetRadius = 150; // 150% ensures full coverage from any point
                if (animationId) cancelAnimationFrame(animationId);
                animationId = requestAnimationFrame(animateReveal);
            });

            item.addEventListener('mousemove', (e) => {
                const rect = item.getBoundingClientRect();
                centerX = ((e.clientX - rect.left) / rect.width) * 100;
                centerY = ((e.clientY - rect.top) / rect.height) * 100;
            });

            item.addEventListener('mouseleave', (e) => {
                const rect = item.getBoundingClientRect();
                centerX = ((e.clientX - rect.left) / rect.width) * 100;
                centerY = ((e.clientY - rect.top) / rect.height) * 100;

                // Animate back to hidden
                targetRadius = 0;
                if (animationId) cancelAnimationFrame(animationId);
                animationId = requestAnimationFrame(animateReveal);
            });
        }
    });
});
