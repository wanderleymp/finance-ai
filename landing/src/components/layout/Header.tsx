import React, { useState, useEffect } from 'react';

/**
 * Componente de cabeçalho da landing page
 * Responsável pela navegação e elementos superiores da página
 */
const Header = () => {
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

  // Função para fechar o menu mobile ao clicar em um link
  const closeMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className={`header ${isScrolled ? 'header-scrolled' : ''}`}>
      <div className="container header-container">
        {/* Logo */}
        <div className="logo">
          <a href="/">
            <img src="/images/logo.svg" alt="Finance AI" />
          </a>
        </div>
        
        {/* Botões de ação para desktop - exibidos fora do menu em telas grandes */}
        <div className="desktop-nav-buttons d-none d-md-flex">
          <a href="/login" className="btn btn-secondary">Entrar</a>
          <a href="/register" className="btn btn-primary btn-register-header">Registre aqui</a>
        </div>
        
        {/* Botão do menu mobile */}
        <button 
          className="mobile-menu-toggle"
          onClick={toggleMobileMenu}
          aria-label="Menu de navegação"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        
        {/* Menu de navegação principal */}
        <nav className={`main-nav ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          <ul>
            <li><a href="#beneficios" onClick={closeMenu}>Benefícios</a></li>
            <li><a href="#como-funciona" onClick={closeMenu}>Como Funciona</a></li>
            <li><a href="#depoimentos" onClick={closeMenu}>Depoimentos</a></li>
            <li><a href="#precos" onClick={closeMenu}>Preços</a></li>
            <li><a href="#faq" onClick={closeMenu}>FAQ</a></li>
          </ul>
          
          {/* Botões de ação para mobile - exibidos apenas dentro do menu em telas pequenas */}
          <div className="nav-buttons d-md-none">
            <a href="/login" className="btn btn-secondary" onClick={closeMenu}>Entrar</a>
            <a href="/register" className="btn btn-primary btn-register-header" onClick={closeMenu}>Registre aqui</a>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
