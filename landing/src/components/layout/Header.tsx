import React, { useState, useEffect } from 'react';

/**
 * Componente de cabeçalho da landing page
 * Responsável pela navegação e elementos superiores da página
 */
const Header: React.FC = () => {
  // Estado para controlar se o usuário rolou a página
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Estado para controlar se o menu mobile está aberto
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Efeito para detectar o scroll da página
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    
    // Limpeza do event listener quando o componente é desmontado
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Função para alternar o estado do menu mobile
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className={`header ${isScrolled ? 'header-scrolled' : ''}`}>
      <div className="container header-container">
        <div className="logo">
          <img src="/images/logo.svg" alt="Finance AI" />
        </div>
        
        <button 
          className="mobile-menu-toggle"
          onClick={toggleMobileMenu}
          aria-label="Menu de navegação"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        
        <nav className={`main-nav ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          <ul>
            <li><a href="#beneficios">Benefícios</a></li>
            <li><a href="#como-funciona">Como Funciona</a></li>
            <li><a href="#depoimentos">Depoimentos</a></li>
            <li><a href="#precos">Preços</a></li>
            <li><a href="#faq">FAQ</a></li>
          </ul>
          
          <div className="nav-buttons">
            <a href="/login" className="btn btn-secondary">Entrar</a>
            <a href="/register" className="btn btn-primary">Começar Grátis</a>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
