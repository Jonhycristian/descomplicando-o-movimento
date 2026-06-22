/* =========================================
   SCRIPT.JS - UNIFICADO (Descomplicando o Movimento)
   ========================================= */
document.addEventListener('DOMContentLoaded', function() {
    
    // 1. SCROLL REVEAL E HEADER
    const reveals = document.querySelectorAll('.reveal');
    const header = document.getElementById('header');
    
    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        reveals.forEach((reveal) => { 
            if (reveal.getBoundingClientRect().top < windowHeight - 50) reveal.classList.add('active'); 
        });
    };
    
    window.addEventListener('scroll', () => {
        revealOnScroll();
        const isMenuOpen = header.classList.contains('menu-open-bg');
        if (window.scrollY > 50) header.classList.add('scrolled');
        else if (!isMenuOpen) header.classList.remove('scrolled');
    });
    revealOnScroll();

    // 2. MENU MOBILE
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenuMobile = document.querySelector('.nav-menu-mobile');
    const mobileLinks = document.querySelectorAll('.nav-menu-mobile a');

    if (menuToggle && navMenuMobile) {
        menuToggle.addEventListener('click', function() {
            const isActive = menuToggle.classList.toggle('active');
            navMenuMobile.classList.toggle('active');
            navMenuMobile.setAttribute('aria-hidden', !isActive);
            document.body.classList.toggle('modal-open', isActive);
            if(isActive) header.classList.add('menu-open-bg');
            else if (window.scrollY <= 50) header.classList.remove('menu-open-bg');
        });
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navMenuMobile.classList.remove('active');
                document.body.classList.remove('modal-open');
                if (window.scrollY <= 50) header.classList.remove('menu-open-bg');
            });
        });
    }

    // 3. SLIDER DE DEPOIMENTOS
    const sliderContainer = document.querySelector('.slider-container');
    if(sliderContainer) {
        const slides = document.querySelectorAll('.testimonial-slider .slide');
        const nextBtn = sliderContainer.querySelector('.next-btn');
        const prevBtn = sliderContainer.querySelector('.prev-btn');
        let currentSlide = 0;
        let autoSlideTimer;

        function goToSlide(index) {
            if (slides[currentSlide]) slides[currentSlide].classList.remove('active-slide');
            currentSlide = (index + slides.length) % slides.length;
            if (slides[currentSlide]) slides[currentSlide].classList.add('active-slide');
        }
        function resetTimer() {
            clearInterval(autoSlideTimer);
            autoSlideTimer = setInterval(() => goToSlide(currentSlide + 1), 6000);
        }
        if (slides.length > 0) {
            if (slides[0]) slides[0].classList.add('active-slide');
            if(nextBtn) nextBtn.addEventListener('click', () => { goToSlide(currentSlide + 1); resetTimer(); });
            if(prevBtn) prevBtn.addEventListener('click', () => { goToSlide(currentSlide - 1); resetTimer(); });
            resetTimer();
        }
    }

    // 4. VÍDEOS INTELIGENTES (Correção de carregamento e Play)
    const videos = document.querySelectorAll('.js-video-wrapper video');
    
    // Força compatibilidade de reprodução em celulares
    videos.forEach(v => {
        v.setAttribute('playsinline', '');
        v.addEventListener('error', function() {
            console.warn("Recarregando vídeo...");
            const sources = v.querySelectorAll('source');
            if(sources.length > 0) {
                sources[0].src = sources[0].src; 
                v.load();
            }
        });
    });

    // Observer para dar play apenas quando o vídeo aparece na tela
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const video = entry.target;
            const wrapper = video.closest('.js-video-wrapper');
            if (!wrapper) return; 

            if (entry.isIntersecting) {
                video.play().then(() => { 
                    wrapper.classList.add('playing'); 
                    video.setAttribute('controls', 'true'); 
                }).catch(() => { 
                    video.muted = true; 
                    video.play();
                    wrapper.classList.add('playing'); 
                    video.setAttribute('controls', 'true'); 
                });
            } else { 
                video.pause(); 
                wrapper.classList.remove('playing'); 
                video.removeAttribute('controls');
            }
        });
    }, { root: null, rootMargin: '0px', threshold: 0.6 });
    
    videos.forEach(video => { observer.observe(video); });

    // Permite ligar o som ao clicar na tela sobreposta do vídeo
    document.querySelectorAll('.js-video-wrapper').forEach(wrapper => {
        wrapper.querySelector('.video-play-overlay')?.addEventListener('click', () => {
            const video = wrapper.querySelector('video');
            video.muted = false; 
            video.play(); 
            wrapper.classList.add('playing'); 
            video.setAttribute('controls', 'true');
        });
    });
});