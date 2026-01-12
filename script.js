document.addEventListener('DOMContentLoaded', () => {

    // 1. Navigation Scroll Effect
    const navbar = document.querySelector('.navbar');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileToggle = document.getElementById('mobile-toggle');
    const closeMenu = document.getElementById('close-menu');
    const mobileLinks = document.querySelectorAll('.mobile-links a');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle
    if (mobileToggle && mobileMenu) {
        mobileToggle.addEventListener('click', () => {
            mobileMenu.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scroll
        });

        const hideMenu = () => {
            mobileMenu.classList.remove('active');
            document.body.style.overflow = 'auto'; // Restore scroll
        };

        if (closeMenu) closeMenu.addEventListener('click', hideMenu);

        mobileLinks.forEach(link => {
            link.addEventListener('click', hideMenu);
        });
    }

    // 2. Scroll Reveal Animation using Intersection Observer
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right, .fade-in');
    animatedElements.forEach(el => observer.observe(el));

    // 3. Smooth Scroll for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // 4. Parallax effect for Background Shapes
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;

        const shapes = document.querySelectorAll('.bg-shape');
        if (shapes.length > 0) {
            shapes[0].style.transform = `translateY(${scrolled * 0.2}px)`;
            shapes[1].style.transform = `translateY(-${scrolled * 0.1}px) rotate(${scrolled * 0.05}deg)`;
        }
    });

    // 5. Hero Coffee Tilt Effect (Delayed Start)
    const heroSection = document.querySelector('.hero');
    const coffeeCup = document.querySelector('.floating-coffee');

    let isTiltEnabled = false;
    setTimeout(() => {
        isTiltEnabled = true;
    }, 2000);

    if (heroSection && coffeeCup) {
        heroSection.addEventListener('mousemove', (e) => {
            if (!isTiltEnabled) return;

            const xAxis = (window.innerWidth / 2 - e.pageX) / 25;
            const yAxis = (window.innerHeight / 2 - e.pageY) / 25;

            coffeeCup.style.transform = `translateX(-10%) rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
        });

        heroSection.addEventListener('mouseleave', () => {
            if (!isTiltEnabled) return;

            coffeeCup.style.transform = `translateX(-10%) rotate(0deg)`;
            coffeeCup.style.transition = 'transform 0.5s ease';
            setTimeout(() => {
                coffeeCup.style.transition = 'none';
            }, 500);
        });
    }

    // 6. Advanced Menu Carousel Logic
    const menuContainer = document.querySelector('.menu-scroll-container');
    const cards = document.querySelectorAll('.menu-card');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const dots = document.querySelectorAll('.dot');

    if (menuContainer && cards.length > 0) {

        // Function to update active state
        const updateActiveCard = () => {
            const containerCenter = menuContainer.getBoundingClientRect().left + menuContainer.offsetWidth / 2;

            let closestCard = null;
            let minDistance = Infinity;
            let closestIndex = 0;

            cards.forEach((card, index) => {
                const cardCenter = card.getBoundingClientRect().left + card.offsetWidth / 2;
                const distance = Math.abs(containerCenter - cardCenter);

                if (distance < minDistance) {
                    minDistance = distance;
                    closestCard = card;
                    closestIndex = index;
                }
            });

            // Update Cards
            cards.forEach(c => c.classList.remove('active-center'));
            if (closestCard) closestCard.classList.add('active-center');

            // Update Dots
            dots.forEach(d => d.classList.remove('active'));
            if (dots[closestIndex]) dots[closestIndex].classList.add('active');
        };

        // Helper to find current centered index
        const getCenteredIndex = () => {
            const containerCenter = menuContainer.getBoundingClientRect().left + menuContainer.offsetWidth / 2;
            let closestIndex = 0;
            let minDistance = Infinity;

            cards.forEach((card, index) => {
                const cardCenter = card.getBoundingClientRect().left + card.offsetWidth / 2;
                const distance = Math.abs(containerCenter - cardCenter);
                if (distance < minDistance) {
                    minDistance = distance;
                    closestIndex = index;
                }
            });
            return closestIndex;
        };

        // Touch Optimization: Prevent scroll-snap conflicts during button clicks
        let isProgrammaticScroll = false;
        menuContainer.addEventListener('touchstart', () => {
            isProgrammaticScroll = false;
        });

        // Scroll to specific index
        const scrollToCard = (index) => {
            if (index < 0 || index >= cards.length) return;

            isProgrammaticScroll = true;
            const card = cards[index];
            const containerWidth = menuContainer.offsetWidth;
            const cardWidth = card.offsetWidth;

            const targetLeft = card.offsetLeft - (containerWidth / 2) + (cardWidth / 2);

            menuContainer.scrollTo({
                left: targetLeft,
                behavior: 'smooth'
            });
        };

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                const currentIndex = getCenteredIndex();
                scrollToCard(currentIndex + 1);
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                const currentIndex = getCenteredIndex();
                scrollToCard(currentIndex - 1);
            });
        }

        // Event Listener for Scroll
        menuContainer.addEventListener('scroll', () => {
            window.requestAnimationFrame(updateActiveCard);
        });

        // Helper to force scroll to a card instantly
        const forceScrollToCard = (index) => {
            if (index < 0 || index >= cards.length) return;
            const card = cards[index];
            const containerWidth = menuContainer.offsetWidth;
            const cardWidth = card.offsetWidth;
            const targetLeft = card.offsetLeft - (containerWidth / 2) + (cardWidth / 2);
            menuContainer.scrollLeft = targetLeft; // Direct assignment for instant scroll
        };

        // Initial Scroll: Start at 4th card (Index 3)
        // We use a small timeout to let layout settle
        setTimeout(() => {
            if (cards.length > 4) {
                forceScrollToCard(3);
            }
        }, 50);

        // Double check after a bit more time to ensure snap didn't override
        setTimeout(() => {
            if (cards.length > 4) {
                // Only force if we are visibly at 0
                if (menuContainer.scrollLeft < 100) {
                    forceScrollToCard(3);
                }
            }
        }, 300);
    }

});
