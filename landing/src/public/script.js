// Script para funcionalidades interativas da landing page

document.addEventListener('DOMContentLoaded', function() {
    // Manipulação do menu mobile
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
    }
    
    // Funcionalidade de acordeão para FAQ
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Fecha todos os outros itens
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Alterna o estado do item atual
            item.classList.toggle('active');
        });
    });
    
    // Animação de números para estatísticas
    const statNumbers = document.querySelectorAll('.stat-number');
    
    function animateNumbers() {
        statNumbers.forEach(statNumber => {
            const target = parseInt(statNumber.getAttribute('data-target'));
            const duration = 2000; // 2 segundos
            const increment = target / (duration / 16); // 60fps
            let current = 0;
            
            const timer = setInterval(() => {
                current += increment;
                statNumber.textContent = Math.floor(current).toLocaleString();
                
                if (current >= target) {
                    statNumber.textContent = target.toLocaleString();
                    clearInterval(timer);
                }
            }, 16);
        });
    }
    
    // Inicia a animação quando o elemento estiver visível
    const heroStats = document.querySelector('.hero-stats');
    
    if (heroStats) {
        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                animateNumbers();
                observer.disconnect();
            }
        });
        
        observer.observe(heroStats);
    }
    
    // Validação simples do formulário de newsletter
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            
            if (!emailInput.value || !emailInput.value.includes('@')) {
                alert('Por favor, insira um email válido.');
                return;
            }
            
            // Simulação de envio bem-sucedido
            emailInput.value = '';
            alert('Obrigado por se inscrever em nossa newsletter!');
        });
    }
    
    // Efeito de scroll suave para links de âncora
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Efeito de revelação ao rolar
    const revealElements = document.querySelectorAll('.reveal');
    
    function revealOnScroll() {
        revealElements.forEach(element => {
            const windowHeight = window.innerHeight;
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < windowHeight - elementVisible) {
                element.classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Verificar elementos visíveis no carregamento inicial
});
