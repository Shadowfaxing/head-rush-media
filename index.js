document.addEventListener('DOMContentLoaded', () => {
    // Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 4. Scroll Reveal Observer
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.hero-content > *, .service-card, .portfolio-item, .contact-wrapper').forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });

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

    // Close mobile menu on click
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            const icon = mobileMenuBtn.querySelector('i');
            icon.setAttribute('data-lucide', 'menu');
            lucide.createIcons();
        });
    });

    // Form Submission (Mock)
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
                btn.classList.add('bg-green-500'); // Assuming we add a utility class or just style change
                contactForm.reset();
                setTimeout(() => {
                    btn.innerText = originalText;
                    btn.disabled = false;
                }, 3000);
            }, 1500);
        });
    }

    // Custom Cursor Logic
    const cursor = document.querySelector('.custom-cursor');
    if (cursor) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });

        document.querySelectorAll('a, button, .service-card, .portfolio-item').forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
        });
    }

    // Branding Cleanup Safeguard
    // Parallax Hero Effect (Chromatic Aberration)
    const heroSection = document.querySelector('.hero');
    const heroBg = document.getElementById('hero-bg');
    const heroBgRed = document.getElementById('hero-bg-red');
    const heroBgBlue = document.getElementById('hero-bg-blue');

    if (heroSection && heroBg && heroBgRed && heroBgBlue) {
        heroSection.addEventListener('mousemove', (e) => {
            // Calculate mouse position relative to center of screen
            const x = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
            const y = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);

            // Base Movement
            const moveX = x * -20;
            const moveY = y * -20;

            // Chromatic Offsets (More extreme movement for "ghosts")
            const redX = x * -35;
            const redY = y * -35;

            const blueX = x * -10;
            const blueY = y * -10;

            // Apply transforms
            heroBg.style.transform = `scale(1.1) translate(${moveX}px, ${moveY}px)`;
            heroBgRed.style.transform = `scale(1.1) translate(${redX}px, ${redY}px)`;
            heroBgBlue.style.transform = `scale(1.1) translate(${blueX}px, ${blueY}px)`;

            // Localization: Mask the effect to a radius around the cursor
            // We subtract the bounding rect top/left to handle scrolling/offsets if needed, 
            // but for a fixed hero, clientX/Y is usually fine. 
            // However, to be precise against the translation, we can just blindly apply it for now.
            const rect = heroBg.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            const maskSize = 300; // Radius in pixels
            const maskStyle = `radial-gradient(circle ${maskSize}px at ${mouseX}px ${mouseY}px, black, transparent)`;

            heroBgRed.style.maskImage = maskStyle;
            heroBgRed.style.webkitMaskImage = maskStyle;

            heroBgBlue.style.maskImage = maskStyle;
            heroBgBlue.style.webkitMaskImage = maskStyle;
        });
    }
});
