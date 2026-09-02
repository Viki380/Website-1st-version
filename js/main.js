(function () {
    'use strict';

    // --- Configuration ---
    // Get a free access key at https://web3forms.com (register drvigneshsnephro@gmail.com).
    // Replace the placeholder below with your real key to activate the contact form.
    const WEB3FORMS_KEY = '70e04def-c541-4875-a91b-9f28d3f066c2';

    // --- Analytics (Google Analytics 4) ---
    // Paste your GA4 Measurement ID (looks like G-XXXXXXXXXX) to enable analytics site-wide.
    const GA_MEASUREMENT_ID = 'G-83Z6ZZ13GJ';
    if (GA_MEASUREMENT_ID && GA_MEASUREMENT_ID !== 'G-XXXXXXXXXX') {
        const gaScript = document.createElement('script');
        gaScript.async = true;
        gaScript.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_MEASUREMENT_ID;
        document.head.appendChild(gaScript);
        window.dataLayer = window.dataLayer || [];
        window.gtag = function () { window.dataLayer.push(arguments); };
        window.gtag('js', new Date());
        window.gtag('config', GA_MEASUREMENT_ID);
    }

    // --- Header Scroll Logic (null-safe: header may be #header or plain <header>) ---
    const header = document.getElementById('header') || document.querySelector('header');
    if (header) {
        const handleScroll = () => {
            header.classList.toggle('scrolled', window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
    }

    // --- Mobile Navigation Toggle ---
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');
    if (mobileToggle && navLinks) {
        const setMenu = (open) => {
            document.body.classList.toggle('nav-open', open);
            mobileToggle.setAttribute('aria-expanded', String(open));
        };
        mobileToggle.addEventListener('click', () => {
            setMenu(!document.body.classList.contains('nav-open'));
        });
        navLinks.querySelectorAll('a').forEach((a) => {
            a.addEventListener('click', () => setMenu(false));
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') setMenu(false);
        });
    }

    // --- Intersection Observer for Reveal Animations ---
    const revealEls = document.querySelectorAll('.reveal');
    if (revealEls.length) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) entry.target.classList.add('active');
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });
        revealEls.forEach((el) => revealObserver.observe(el));
    }

    // --- Magnetic Button Effect (respects reduced-motion) ---
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduceMotion) {
        document.querySelectorAll('.btn').forEach((btn) => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                btn.style.transform = `translate(${x * 0.3}px, ${y * 0.5}px)`;
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'translate(0px, 0px)';
            });
        });
    }

    // --- Smooth Scroll for Anchors ---
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (!targetElement) return;
            e.preventDefault();
            const offsetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - 80;
            window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        });
    });

    // --- Contact Form Handler (Web3Forms) ---
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const statusEl = document.getElementById('form-status');
            const submitBtn = contactForm.querySelector('[type="submit"]');
            const showStatus = (msg, ok) => {
                if (!statusEl) return;
                statusEl.textContent = msg;
                statusEl.style.color = ok ? 'var(--accent)' : '#dc5a46';
            };

            if (WEB3FORMS_KEY === 'YOUR_ACCESS_KEY_HERE') {
                showStatus('Form not yet configured. Please email drvigneshsnephro@gmail.com directly.', false);
                return;
            }

            const formData = new FormData(contactForm);
            formData.append('access_key', WEB3FORMS_KEY);

            if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Sending...'; }
            showStatus('Sending your message...', true);

            try {
                const res = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    headers: { Accept: 'application/json' },
                    body: formData
                });
                const data = await res.json();
                if (data.success) {
                    showStatus('Thank you. Your message has been sent successfully.', true);
                    contactForm.reset();
                } else {
                    showStatus('Something went wrong. Please email us directly.', false);
                }
            } catch (err) {
                showStatus('Network error. Please email drvigneshsnephro@gmail.com directly.', false);
            } finally {
                if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Send Message'; }
            }
        });
    }

    // --- Dynamic Hero Background Interaction ---
    const hero = document.querySelector('.hero');
    const heroBg = document.querySelector('.hero-bg');
    if (hero && heroBg && !reduceMotion) {
        hero.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth) * 20;
            const y = (e.clientY / window.innerHeight) * 20;
            heroBg.style.transform = `translate(${x}px, ${y}px)`;
        });
    }

    // --- Dynamic footer year ---
    document.querySelectorAll('[data-year]').forEach((el) => {
        el.textContent = new Date().getFullYear();
    });

    // --- Floating WhatsApp + Call buttons (site-wide) ---
    const CONTACT_PHONE = '919500848820'; // Vijay Super Speciality Hospital appointment line
    if (!document.querySelector('.floating-contact')) {
        const fc = document.createElement('div');
        fc.className = 'floating-contact';
        fc.innerHTML =
            '<a class="fc-whatsapp" href="https://wa.me/' + CONTACT_PHONE + '" target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp">' +
            '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 14.4c-.3-.2-1.7-.9-2-1-.3-.1-.5-.2-.7.1-.2.3-.8 1-.9 1.1-.2.2-.3.2-.6.1-.3-.2-1.2-.5-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5-.1-.1-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.2.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.7-.7 1.9-1.4.2-.7.2-1.2.2-1.4-.1-.1-.3-.2-.6-.3zM12 2a10 10 0 0 0-8.6 15l-1.3 4.7 4.8-1.3A10 10 0 1 0 12 2zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-2.9.8.8-2.8-.2-.3A8.2 8.2 0 1 1 12 20.2z"/></svg>' +
            '</a>' +
            '<a class="fc-call" href="tel:+' + CONTACT_PHONE + '" aria-label="Call now">' +
            '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6.6 10.8a15.5 15.5 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.5.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.4c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.5.1.4 0 .8-.2 1l-2.2 2.3z"/></svg>' +
            '</a>';
        document.body.appendChild(fc);
    }
})();
