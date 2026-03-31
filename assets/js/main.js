document.addEventListener('DOMContentLoaded', () => {
    // Theme Management
    const root = document.documentElement;
    
    const applyTheme = (isDark) => {
        if (isDark) root.classList.add('dark');
        else root.classList.remove('dark');
        localStorage.setItem('darkMode', isDark);
    };

    const applyDirection = (isRTL) => {
        root.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
        localStorage.setItem('rtl', isRTL);
    };

    // Listeners for global elements (using IDs matching the header)
    document.addEventListener('click', (e) => {
        if (e.target.closest('#dark-mode-toggle')) {
            const current = root.classList.contains('dark');
            applyTheme(!current);
        }
        if (e.target.closest('#rtl-toggle')) {
            const current = root.getAttribute('dir') === 'rtl';
            applyDirection(!current);
        }
    });

    // Mobile Menu Drawer Logic
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileBackdrop = document.getElementById('mobile-menu-backdrop');
    const mobileClose = document.getElementById('mobile-menu-close');

    const toggleMobileMenu = (isOpen) => {
        if (isOpen) {
            mobileMenu.classList.remove('translate-x-full');
            mobileMenu.classList.add('translate-x-0');
            mobileBackdrop.classList.remove('hidden', 'opacity-0', 'pointer-events-none');
            mobileBackdrop.classList.add('opacity-100', 'pointer-events-auto');
            document.body.classList.add('overflow-hidden');
        } else {
            mobileMenu.classList.add('translate-x-full');
            mobileMenu.classList.remove('translate-x-0');
            mobileBackdrop.classList.add('opacity-0', 'pointer-events-none');
            mobileBackdrop.classList.remove('opacity-100', 'pointer-events-auto');
            document.body.classList.remove('overflow-hidden');
            setTimeout(() => {
                if (mobileMenu.classList.contains('translate-x-full')) {
                    mobileBackdrop.classList.add('hidden');
                }
            }, 300);
        }
    };

    if (mobileBtn && mobileMenu) {
        mobileBtn.addEventListener('click', () => toggleMobileMenu(true));
    }
    if (mobileClose) {
        mobileClose.addEventListener('click', () => toggleMobileMenu(false));
    }
    if (mobileBackdrop) {
        mobileBackdrop.addEventListener('click', () => toggleMobileMenu(false));
    }

    // Metric Counter Animation and Observer
    const animateValue = (obj, start, end, duration) => {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            obj.innerHTML = Math.floor(progress * (end - start) + start);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    };

    const metricObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                const counter = entry.target.querySelector('.counter-up');
                if (counter && !counter.classList.contains('animated')) {
                    const target = parseInt(counter.dataset.target);
                    animateValue(counter, 0, target, 2000);
                    counter.classList.add('animated');
                }
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.metric-card-reveal').forEach(card => metricObserver.observe(card));

    // Psychology Carousel Navigation
    const track = document.getElementById('psychology-track');
    const nextBtn = document.getElementById('next-btn');
    const prevBtn = document.getElementById('prev-btn');

    if (track && nextBtn && prevBtn) {
        let currentScroll = 0;
        const scrollAmount = 392; // Card width (360) + space-x-8 (32)

        nextBtn.onclick = () => {
            const maxScroll = track.scrollWidth - track.clientWidth;
            currentScroll = Math.min(currentScroll + scrollAmount, maxScroll);
            track.scrollTo({ left: currentScroll, behavior: 'smooth' });
        };

        prevBtn.onclick = () => {
            currentScroll = Math.max(currentScroll - scrollAmount, 0);
            track.scrollTo({ left: currentScroll, behavior: 'smooth' });
        };
    }

    // Existing Observer Logic
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('visible', 'animate-in');
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));

    // Initial Load
    applyTheme(localStorage.getItem('darkMode') === 'true');
    // Back to Top Logic
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    applyDirection(localStorage.getItem('rtl') === 'true');
});

// Utility for formatting currency
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(amount);
};
