/* =========================================
   A. VARIÁVEIS GLOBAIS (Carrinho)
   ========================================= */
let cart = [];

function addToCart() {
    const wineName = document.getElementById('modal-title').textContent;
    cart.push(wineName);
    updateCartUI();

    const btnCart = document.querySelector('#wine-modal .btn-primary');
    const originalHTML = btnCart.innerHTML;

    btnCart.innerHTML = `<i class="fa-solid fa-check"></i> Adicionado!`;
    btnCart.style.background = 'linear-gradient(135deg, #c9a96e, #8a6a3a)';
    btnCart.style.color = 'var(--cor-fundo)';
    btnCart.style.borderColor = 'transparent';

    setTimeout(() => {
        btnCart.innerHTML = originalHTML;
        btnCart.style.background = '';
        btnCart.style.color = '';
        btnCart.style.borderColor = '';
    }, 2000);
}

function updateCartUI() {
    const countEl = document.getElementById('cart-count');
    if (countEl) {
        countEl.textContent = cart.length;
        countEl.classList.remove('bounce');
        void countEl.offsetWidth; // force reflow
        countEl.classList.add('bounce');
    }
    renderCartItems();
}

function renderCartItems() {
    const cartItemsEl = document.getElementById('cart-items');
    const cartFooter = document.getElementById('cart-footer');
    if (!cartItemsEl) return;

    if (cart.length === 0) {
        cartItemsEl.innerHTML = `
            <div class="cart-empty">
                <i class="fa-solid fa-wine-glass"></i>
                <p>Sua seleção está vazia.</p>
                <span>Descubra nossos vinhos e adicione suas escolhas.</span>
            </div>`;
        if (cartFooter) cartFooter.style.display = 'none';
        return;
    }

    if (cartFooter) cartFooter.style.display = 'block';

    // Conta ocorrências
    const counts = {};
    cart.forEach(name => { counts[name] = (counts[name] || 0) + 1; });

    cartItemsEl.innerHTML = Object.entries(counts).map(([name, qty]) => `
        <div class="cart-item">
            <div class="cart-item-info">
                <span class="cart-item-name">${name}</span>
                <span class="cart-item-qty">${qty}x</span>
            </div>
            <button class="cart-item-remove" onclick="removeFromCart('${name.replace(/'/g, "\\'")}')" aria-label="Remover">
                <i class="fa-solid fa-xmark"></i>
            </button>
        </div>
    `).join('');
}

function removeFromCart(name) {
    const idx = cart.indexOf(name);
    if (idx > -1) cart.splice(idx, 1);
    updateCartUI();
}

/* =========================================
   DOM READY
   ========================================= */
document.addEventListener('DOMContentLoaded', () => {

    /* =========================================
       1. PRELOADER
       ========================================= */
    const loader = document.getElementById('loader');
    if (loader) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                loader.classList.add('fade-out');
                setTimeout(() => {
                    loader.style.display = 'none';
                }, 800);
            }, 2200);
        });
        // Fallback: garante que o loader some mesmo sem o evento load
        setTimeout(() => {
            if (loader && !loader.classList.contains('fade-out')) {
                loader.classList.add('fade-out');
                setTimeout(() => { loader.style.display = 'none'; }, 800);
            }
        }, 4000);
    }

    /* =========================================
       2. AGE GATE
       ========================================= */
    const ageGate = document.getElementById('age-gate');
    if (ageGate) {
        const verified = sessionStorage.getItem('age-verified');
        if (!verified) {
            ageGate.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        document.getElementById('age-yes')?.addEventListener('click', () => {
            sessionStorage.setItem('age-verified', 'true');
            ageGate.classList.remove('active');
            document.body.style.overflow = '';
        });

        document.getElementById('age-no')?.addEventListener('click', () => {
            window.location.href = 'https://www.google.com';
        });
    }

    /* =========================================
       3. CURSOR PREMIUM
       ========================================= */
    const dot = document.getElementById('cursor-dot');
    const ring = document.getElementById('cursor-ring');

    if (dot && ring && window.matchMedia('(pointer: fine)').matches) {
        let ringX = 0, ringY = 0;
        let dotX = 0, dotY = 0;
        let rafId;

        const moveDot = (x, y) => {
            dot.style.left = x + 'px';
            dot.style.top = y + 'px';
        };

        const animateRing = () => {
            ringX += (dotX - ringX) * 0.12;
            ringY += (dotY - ringY) * 0.12;
            ring.style.left = ringX + 'px';
            ring.style.top = ringY + 'px';
            rafId = requestAnimationFrame(animateRing);
        };

        document.addEventListener('mousemove', (e) => {
            dotX = e.clientX;
            dotY = e.clientY;
            moveDot(dotX, dotY);
        });

        animateRing();

        // Hover state em elementos interativos
        const interactiveEls = document.querySelectorAll('a, button, input, select, .wine-card, .review-card, .milestone');
        interactiveEls.forEach(el => {
            el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
            el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
        });
    }

    /* =========================================
       4. HEADER DINÂMICO
       ========================================= */
    const header = document.querySelector('.site-header');
    let isScrolling = false;

    const handleScroll = () => {
        if (window.scrollY > 60) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        isScrolling = false;
    };

    window.addEventListener('scroll', () => {
        if (!isScrolling) {
            window.requestAnimationFrame(handleScroll);
            isScrolling = true;
        }
    });

    /* =========================================
       5. MENU MOBILE
       ========================================= */
    const menuBtn = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.main-nav');

    if (menuBtn && nav) {
        menuBtn.addEventListener('click', () => {
            nav.classList.toggle('active');
            menuBtn.classList.toggle('open');
        });
    }

    /* =========================================
       6. GSAP PARALLAX (Hero + Terroir)
       ========================================= */
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        // Hero parallax
        gsap.to(".parallax-bg", {
            y: 180,
            ease: "none",
            scrollTrigger: {
                trigger: ".hero",
                start: "top top",
                end: "bottom top",
                scrub: true
            }
        });

        // Terroir parallax
        gsap.to(".terroir-bg", {
            y: 120,
            ease: "none",
            scrollTrigger: {
                trigger: ".terroir-break",
                start: "top bottom",
                end: "bottom top",
                scrub: true
            }
        });

        // Terroir quote reveal
        gsap.fromTo(".terroir-quote", 
            { opacity: 0, y: 30 },
            {
                opacity: 1, y: 0, duration: 1.2,
                scrollTrigger: {
                    trigger: ".terroir-break",
                    start: "top 65%"
                }
            }
        );

        // Wine cards com stagger
        gsap.utils.toArray(".wine-card").forEach((card, i) => {
            gsap.from(card, {
                opacity: 0,
                y: 70,
                duration: 1.1,
                delay: i * 0.12,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: card,
                    start: "top 88%"
                }
            });
        });

        // Stats com stagger
        gsap.utils.toArray(".stat").forEach((stat, i) => {
            gsap.from(stat, {
                opacity: 0,
                y: 30,
                duration: 0.8,
                delay: i * 0.1,
                scrollTrigger: {
                    trigger: ".stats",
                    start: "top 75%"
                }
            });
        });
    }

    /* =========================================
       7. SCROLL SUAVE
       ========================================= */
    const smoothLinks = document.querySelectorAll('a[href^="#"]');
    smoothLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                e.preventDefault();
                const headerH = header.offsetHeight;
                const targetPos = targetSection.getBoundingClientRect().top + window.scrollY - headerH;
                window.scrollTo({ top: targetPos, behavior: 'smooth' });
                if (nav?.classList.contains('active')) {
                    nav.classList.remove('active');
                    menuBtn?.classList.remove('open');
                }
            }
        });
    });

    /* =========================================
       8. REVEAL AO SCROLL
       ========================================= */
    const elementsToReveal = document.querySelectorAll('.history-text, .history-image, .review-card');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });

    elementsToReveal.forEach(el => {
        el.classList.add('reveal-hidden');
        revealObserver.observe(el);
    });

    /* =========================================
       9. ANIMAÇÃO DAS BARRAS (Wine Profile)
       ========================================= */
    const wineCardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('bars-animated');
                wineCardObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    document.querySelectorAll('.wine-card').forEach(card => {
        wineCardObserver.observe(card);
    });

    /* =========================================
       10. EFEITO 3D MOUSE TRACKING (Cards)
       ========================================= */
    document.addEventListener("mousemove", (e) => {
        const xAxis = (window.innerWidth / 2 - e.clientX) / 35;
        const yAxis = (window.innerHeight / 2 - e.clientY) / 35;

        document.querySelectorAll(".wine-card").forEach(card => {
            card.style.setProperty('--rotate-y', `${xAxis}deg`);
            card.style.setProperty('--rotate-x', `${yAxis * -1}deg`);
        });
    });

    /* =========================================
       11. MAGNETIC BUTTONS
       ========================================= */
    document.querySelectorAll('.magnetic-btn').forEach(btn => {
        btn.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            const strength = 0.25;
            this.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
        });
        btn.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });

    /* =========================================
       12. CONTADORES ANIMADOS
       ========================================= */
    const counters = document.querySelectorAll(".counter");
    let hasAnimated = false;

    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    const animateCounters = () => {
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const duration = 1800;
            const start = performance.now();

            const update = (now) => {
                const elapsed = now - start;
                const progress = Math.min(elapsed / duration, 1);
                const eased = easeOutCubic(progress);
                counter.textContent = Math.round(eased * target);
                if (progress < 1) requestAnimationFrame(update);
                else counter.textContent = target;
            };
            requestAnimationFrame(update);
        });
    };

    const statsSection = document.querySelector('.stats');
    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !hasAnimated) {
                animateCounters();
                hasAnimated = true;
                statsObserver.unobserve(statsSection);
            }
        }, { threshold: 0.4 });
        statsObserver.observe(statsSection);
    }

    /* =========================================
       13. SISTEMA DE MODAIS
       ========================================= */
    const modais = document.querySelectorAll('.modal-overlay');
    const btnsCloseModal = document.querySelectorAll('.close-modal');
    const htmlBody = document.body;

    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            htmlBody.style.overflow = 'hidden';
        }
    }

    function closeAllModals() {
        modais.forEach(modal => modal.classList.remove('active'));
        htmlBody.style.overflow = '';
    }

    // Modal de Vinhos
    document.querySelectorAll('.open-modal').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();

            // Dados básicos
            document.getElementById('modal-title').textContent = this.dataset.title || '';
            document.getElementById('modal-type').textContent = this.dataset.type || '';
            document.getElementById('modal-notes').textContent = this.dataset.notes || '';
            document.getElementById('modal-img').src = this.dataset.img || '';

            // Score
            const scoreEl = document.getElementById('modal-score');
            if (scoreEl) scoreEl.textContent = this.dataset.score || '';

            // Região
            const regionEl = document.getElementById('modal-region-text');
            if (regionEl) regionEl.textContent = this.dataset.region || '';

            // Harmonização
            const pairingEl = document.getElementById('modal-pairing-text');
            if (pairingEl) pairingEl.textContent = this.dataset.pairing || '';

            openModal('wine-modal');
        });
    });

    // Modal de Visitas
    document.querySelectorAll('.trigger-visit').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            openModal('visit-modal');
        });
    });

    // Fechar
    btnsCloseModal.forEach(btn => btn.addEventListener('click', closeAllModals));
    modais.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) closeAllModals();
        });
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeAllModals();
    });

    /* =========================================
       14. CART SIDEBAR
       ========================================= */
    const cartToggle = document.getElementById('cart-toggle');
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartClose = document.getElementById('cart-close');
    const cartOverlay = document.getElementById('cart-overlay');

    function openCart() {
        cartSidebar?.classList.add('open');
        cartOverlay?.classList.add('active');
        htmlBody.style.overflow = 'hidden';
    }
    function closeCart() {
        cartSidebar?.classList.remove('open');
        cartOverlay?.classList.remove('active');
        htmlBody.style.overflow = '';
    }

    cartToggle?.addEventListener('click', openCart);
    cartClose?.addEventListener('click', closeCart);
    cartOverlay?.addEventListener('click', closeCart);

    /* =========================================
       15. FORMULÁRIOS
       ========================================= */
    const handleFormSubmit = (formId, successMessage) => {
        const form = document.getElementById(formId);
        if (!form) return;

        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const btn = this.querySelector('button[type="submit"]');
            if (!btn) return;

            const originalHTML = btn.innerHTML;
            btn.innerHTML = `<i class="fa-solid fa-check"></i> ${successMessage}`;
            btn.style.background = 'linear-gradient(135deg, #c9a96e, #8a6a3a)';
            btn.style.color = 'var(--cor-fundo)';
            btn.style.borderColor = 'transparent';
            btn.disabled = true;

            setTimeout(() => {
                btn.innerHTML = originalHTML;
                btn.style.background = '';
                btn.style.color = '';
                btn.style.borderColor = '';
                btn.disabled = false;
                this.reset();
                if (formId === 'visit-form') closeAllModals();
            }, 3000);
        });
    };

    handleFormSubmit('visit-form', 'Agendamento Confirmado!');
    handleFormSubmit('newsletter-form', 'Subscrição Ativa!');

    /* =========================================
       16. MILESTONE HOVER (História)
       ========================================= */
    document.querySelectorAll('.milestone').forEach(m => {
        m.addEventListener('mouseenter', function() {
            this.querySelector('.milestone-year').style.color = 'var(--cor-dourado-claro)';
        });
        m.addEventListener('mouseleave', function() {
            this.querySelector('.milestone-year').style.color = 'var(--cor-dourado)';
        });
    });

});

/* =========================================
   17. PARTÍCULAS (tsParticles)
   ========================================= */
document.addEventListener('DOMContentLoaded', () => {
    if (typeof tsParticles !== 'undefined') {
        tsParticles.load("tsparticles", {
            fpsLimit: 60,
            particles: {
                color: { value: "#c9a96e" },
                links: { enable: false },
                move: {
                    direction: "top",
                    enable: true,
                    outModes: { default: "out" },
                    random: true,
                    speed: 0.65,
                    straight: false,
                },
                number: {
                    density: { enable: true, area: 900 },
                    value: 35,
                },
                opacity: {
                    value: { min: 0.05, max: 0.45 },
                    animation: { enable: true, speed: 0.8, sync: false }
                },
                shape: { type: "circle" },
                size: {
                    value: { min: 1, max: 2.5 },
                },
            },
            detectRetina: true,
        });
    }
});