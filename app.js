document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. MOBILE NAVIGATION
    // ==========================================
    const hamburger = document.querySelector('.hamburger');
    const mobileNav = document.querySelector('.mobile-nav');
    const navOverlay = document.querySelector('.nav-overlay');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');

    function toggleMenu() {
        hamburger.classList.toggle('open');
        mobileNav.classList.toggle('open');
        navOverlay.classList.toggle('open');
        document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
    }

    hamburger.addEventListener('click', toggleMenu);
    navOverlay.addEventListener('click', toggleMenu);

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileNav.classList.contains('open')) {
                toggleMenu();
            }
        });
    });

    // ==========================================
    // 2. SCROLL SPY & STICKY HEADER
    // ==========================================
    const header = document.querySelector('.header');
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        // Sticky Header effect
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Active link scroll spy
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });

    // Trigger scroll check on load to set initial state
    window.dispatchEvent(new Event('scroll'));

    // ==========================================
    // 3. REVEAL ANIMATIONS (Intersection Observer)
    // ==========================================
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Trigger animation once
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // ==========================================
    // 4. BEFORE/AFTER SLIDER
    // ==========================================
    const sliderContainer = document.querySelector('.slider-container');
    const sliderRange = document.querySelector('.slider-range');

    if (sliderContainer && sliderRange) {
        sliderRange.addEventListener('input', (e) => {
            sliderContainer.style.setProperty('--position', `${e.target.value}%`);
        });
    }

    // ==========================================
    // 5. TESTIMONIALS SLIDER
    // ==========================================
    const track = document.querySelector('.reviews-track');
    const cards = document.querySelectorAll('.review-card');
    const dots = document.querySelectorAll('.review-dot');
    
    if (track && cards.length > 0 && dots.length > 0) {
        let currentIndex = 0;
        
        function getCardsPerPage() {
            if (window.innerWidth >= 1024) return 3;
            if (window.innerWidth >= 768) return 2;
            return 1;
        }

        function getMaxIndex() {
            return Math.max(0, cards.length - getCardsPerPage());
        }

        function updateSlider() {
            const cardsPerPage = getCardsPerPage();
            const maxIndex = getMaxIndex();
            
            // Boundary checks
            if (currentIndex > maxIndex) {
                currentIndex = maxIndex;
            }

            // Calculate card width and gap dynamically
            const cardWidth = cards[0].getBoundingClientRect().width;
            const gap = parseFloat(window.getComputedStyle(track).gap) || 32; // default 2rem
            
            // Translate track
            track.style.transform = `translate3d(-${currentIndex * (cardWidth + gap)}px, 0, 0)`;

            // Update Dot active state
            // Number of pages/dots depends on responsiveness
            dots.forEach((dot, idx) => {
                dot.style.display = idx <= maxIndex ? 'block' : 'none';
                dot.classList.toggle('active', idx === currentIndex);
            });
        }

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentIndex = index;
                updateSlider();
            });
        });

        // Touch Swipe support for mobile
        let startX = 0;
        let isSwiping = false;

        track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isSwiping = true;
        }, { passive: true });

        track.addEventListener('touchmove', (e) => {
            if (!isSwiping) return;
            const diffX = startX - e.touches[0].clientX;
            if (Math.abs(diffX) > 50) {
                const maxIndex = getMaxIndex();
                if (diffX > 0 && currentIndex < maxIndex) {
                    currentIndex++;
                    updateSlider();
                    isSwiping = false;
                } else if (diffX < 0 && currentIndex > 0) {
                    currentIndex--;
                    updateSlider();
                    isSwiping = false;
                }
            }
        }, { passive: true });

        track.addEventListener('touchend', () => {
            isSwiping = false;
        });

        // Recalculate layout on window resize
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(updateSlider, 100);
        });

        // Initialize Testimonial Slider
        updateSlider();
    }

    // ==========================================
    // 6. FAQ ACCORDION
    // ==========================================
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const currentItem = question.closest('.faq-item');
            const isActive = currentItem.classList.contains('active');

            // Close other items
            document.querySelectorAll('.faq-item').forEach(item => {
                if (item !== currentItem) {
                    item.classList.remove('active');
                }
            });

            // Toggle current item
            currentItem.classList.toggle('active', !isActive);
        });
    });

    // ==========================================
    // 7. BOOKING REQUEST MODAL & FORM
    // ==========================================
    const modalOverlay = document.getElementById('bookingModal');
    const modalCloseBtn = document.querySelector('.modal-close');
    const bookButtons = document.querySelectorAll('.trigger-booking-modal');
    const bookingForm = document.getElementById('bookingForm');
    const formState = document.querySelector('.modal-form-state');
    const successState = document.querySelector('.modal-success-state');

    function openModal() {
        modalOverlay.classList.add('open');
        document.body.style.overflow = 'hidden';
        
        // Reset states
        formState.classList.remove('inactive');
        successState.classList.remove('active');
        if (bookingForm) bookingForm.reset();
    }

    function closeModal() {
        modalOverlay.classList.remove('open');
        document.body.style.overflow = '';
    }

    bookButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Prefill treatment if data-treatment exists on the clicked button
            const treatment = btn.getAttribute('data-treatment');
            const selectControl = document.getElementById('modalService');
            if (treatment && selectControl) {
                selectControl.value = treatment;
            }
            
            openModal();
        });
    });

    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', closeModal);
    }

    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                closeModal();
            }
        });
    }

    // Escape Key Close Modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('open')) {
            closeModal();
        }
    });

    // Form Submission with basic validation & success state transition
    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Simple validation check
            const nameInput = document.getElementById('modalName');
            const phoneInput = document.getElementById('modalPhone');
            let isValid = true;

            if (!nameInput.value.trim()) {
                nameInput.focus();
                isValid = false;
            } else if (!phoneInput.value.trim() || phoneInput.value.trim().length < 10) {
                phoneInput.focus();
                isValid = false;
            }

            if (isValid) {
                // In production, you would fetch/post this form content to a server or WhatsApp API.
                // Transition to success screen
                formState.classList.add('inactive');
                successState.classList.add('active');

                // Auto close modal after 4 seconds
                setTimeout(() => {
                    if (modalOverlay.classList.contains('open')) {
                        closeModal();
                    }
                }, 4000);
            }
        });
    }
});
