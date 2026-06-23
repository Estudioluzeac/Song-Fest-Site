document.addEventListener('DOMContentLoaded', () => {
    
    /* ==========================================================================
       1. INICIALIZAÇÃO DE ÍCONES (LUCIDE ICONS)
       ========================================================================== */
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    /* ==========================================================================
       2. CONTROLE DA NAVBAR (ROLAGEM E MENU MOBILE)
       ========================================================================== */
    const navbar = document.getElementById('navbar');
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const iconOpen = mobileMenuToggle.querySelector('.icon-open');
    const iconClose = mobileMenuToggle.querySelector('.icon-close');

    // Adiciona classe scrolled ao rolar a página
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Destaque de link ativo ao rolar
        detectActiveSection();
    });

    // Toggle do Menu Mobile
    mobileMenuToggle.addEventListener('click', () => {
        const isActive = navMenu.classList.toggle('active');
        
        if (isActive) {
            iconOpen.style.display = 'none';
            iconClose.style.display = 'block';
            document.body.style.overflow = 'hidden'; // Evita scroll do fundo
        } else {
            iconOpen.style.display = 'block';
            iconClose.style.display = 'none';
            document.body.style.overflow = '';
        }
    });

    // Fechar menu mobile ao clicar em algum link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            iconOpen.style.display = 'block';
            iconClose.style.display = 'none';
            document.body.style.overflow = '';
        });
    });

    // Função para destacar o menu de acordo com a seção atual na tela
    function detectActiveSection() {
        const scrollPosition = window.scrollY + 120; // offset do header
        
        document.querySelectorAll('section').forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    /* ==========================================================================
       3. EFEITO DE BRILHO AO MOVER O MOUSE (BENTO GRID - ESTILO TECH)
       ========================================================================== */
    const bentoCards = document.querySelectorAll('.bento-card');
    
    bentoCards.forEach(card => {
        const glow = card.querySelector('.card-glow');
        
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; // Coordenada X relativa ao card
            const y = e.clientY - rect.top;  // Coordenada Y relativa ao card
            
            if (glow) {
                glow.style.setProperty('--x', `${x}px`);
                glow.style.setProperty('--y', `${y}px`);
            }
        });
    });

    /* ==========================================================================
       4. ANIMAÇÃO DE ELEMENTOS AO ROLAR A PÁGINA (REVEAL ON SCROLL)
       ========================================================================== */
    // Adicionamos classes de animação aos cards e cabeçalhos
    const scrollAnimateElements = [
        ...document.querySelectorAll('.bento-card'),
        ...document.querySelectorAll('.galeria-item'),
        ...document.querySelectorAll('.section-header'),
        ...document.querySelectorAll('.experiencia-row'),
        ...document.querySelectorAll('.localizacao-card'),
        ...document.querySelectorAll('.localizacao-map-container')
    ];

    scrollAnimateElements.forEach(el => {
        el.classList.add('animate-on-scroll');
    });

    // Configurando o Intersection Observer
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');
                scrollObserver.unobserve(entry.target); // Para rodar a animação apenas uma vez
            }
        });
    }, {
        threshold: 0.1, // Dispara quando 10% do elemento está visível
        rootMargin: '0px 0px -50px 0px' // Margem inferior de segurança
    });

    scrollAnimateElements.forEach(el => {
        scrollObserver.observe(el);
    });

    /* ==========================================================================
       5. NAVEGAÇÃO POR ABAS (SEÇÃO EXPERIÊNCIAS)
       ========================================================================== */
    const tabItems = document.querySelectorAll('.tab-item');
    const experienciaImg = document.querySelector('.experiencia-img');
    
    // Mapeamento de abas para imagens específicas para ilustrar dinamicamente
    const tabImages = {
        'tab-aniversarios': 'assets/hero.jpg',
        'tab-corporativo': 'assets/gourmet.png',
        'tab-familiar': 'assets/kids.jpg',
        'tab-banheiros': 'assets/banheiros-duplos.jpg'
    };

    tabItems.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove ativo das outras abas
            tabItems.forEach(t => t.classList.remove('active'));
            // Adiciona ativo na aba atual
            tab.classList.add('active');

            // Troca de imagem com efeito sutil de fade
            const targetKey = tab.getAttribute('data-target');
            const newImgSrc = tabImages[targetKey] || 'assets/hero.jpg';
            
            experienciaImg.style.opacity = 0;
            setTimeout(() => {
                experienciaImg.src = newImgSrc;
                experienciaImg.style.opacity = 1;
            }, 300);
        });
    });

    /* ==========================================================================
       6. ANIMAÇÃO DE CONTADORES (SEÇÃO ESTATÍSTICAS)
       ========================================================================== */
    const estatisticasSection = document.querySelector('.section-estatisticas');
    const estatisticaNumbers = document.querySelectorAll('.estatistica-number');
    let animatedStats = false;

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animatedStats) {
                animateNumbers();
                animatedStats = true;
            }
        });
    }, { threshold: 0.5 });

    if (estatisticasSection) {
        statsObserver.observe(estatisticasSection);
    }

    function animateNumbers() {
        estatisticaNumbers.forEach(num => {
            const targetValue = parseInt(num.getAttribute('data-value'), 10);
            const duration = 2000; // Duração de 2 segundos para a contagem
            const startTime = performance.now();

            function updateNumber(currentTime) {
                const elapsedTime = currentTime - startTime;
                const progress = Math.min(elapsedTime / duration, 1);
                
                // Função de easing out cubic para desacelerar no final
                const easeProgress = 1 - Math.pow(1 - progress, 3);
                
                const currentValue = Math.floor(easeProgress * targetValue);
                num.textContent = currentValue;

                if (progress < 1) {
                    requestAnimationFrame(updateNumber);
                } else {
                    num.textContent = targetValue;
                }
            }

            requestAnimationFrame(updateNumber);
        });
    }

    /* ==========================================================================
       7. SLIDER PREMIUM DA GALERIA (CARROSSEL INTERATIVO MULTI-INSTÂNCIA)
       ========================================================================== */
    const sliderContainers = document.querySelectorAll('.gallery-slider-container');

    sliderContainers.forEach(container => {
        const slides = container.querySelectorAll('.slide-item');
        const prevBtn = container.querySelector('.slider-arrow.prev');
        const nextBtn = container.querySelector('.slider-arrow.next');
        const dotsContainer = container.querySelector('.slider-dots');
        
        let currentSlide = 0;
        const totalSlides = slides.length;
        let slideInterval;

        if (totalSlides > 0 && dotsContainer) {
            // Gerar os indicadores (dots) dinamicamente
            for (let i = 0; i < totalSlides; i++) {
                const dot = document.createElement('button');
                dot.classList.add('dot');
                if (i === 0) dot.classList.add('active');
                dot.setAttribute('aria-label', `Ir para slide ${i + 1}`);
                dot.addEventListener('click', () => {
                    goToSlide(i);
                    resetInterval();
                });
                dotsContainer.appendChild(dot);
            }

            const dots = dotsContainer.querySelectorAll('.dot');

            function goToSlide(index) {
                slides[currentSlide].classList.remove('active');
                dots[currentSlide].classList.remove('active');
                
                currentSlide = (index + totalSlides) % totalSlides;
                
                slides[currentSlide].classList.add('active');
                dots[currentSlide].classList.add('active');
            }

            function nextSlide() {
                goToSlide(currentSlide + 1);
            }

            function prevSlide() {
                goToSlide(currentSlide - 1);
            }

            // Eventos das Setas
            if (nextBtn) {
                nextBtn.addEventListener('click', () => {
                    nextSlide();
                    resetInterval();
                });
            }

            if (prevBtn) {
                prevBtn.addEventListener('click', () => {
                    prevSlide();
                    resetInterval();
                });
            }

            // Auto play (troca a cada 5 segundos)
            function startInterval() {
                slideInterval = setInterval(nextSlide, 5000);
            }

            function resetInterval() {
                clearInterval(slideInterval);
                startInterval();
            }

            // Inicializa o autoplay
            startInterval();

            // Suporte a swipe no mobile
            let touchStartX = 0;
            let touchEndX = 0;

            container.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
            }, { passive: true });

            container.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                handleSwipe();
            }, { passive: true });

            function handleSwipe() {
                if (touchStartX - touchEndX > 50) {
                    nextSlide();
                    resetInterval();
                } else if (touchEndX - touchStartX > 50) {
                    prevSlide();
                    resetInterval();
                }
            }
        }
    });
});
