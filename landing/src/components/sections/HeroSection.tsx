import React from 'react';

/**
 * Componente da seção principal (Hero) da landing page
 * Apresenta a mensagem principal, CTAs e imagem de destaque
 */
const HeroSection: React.FC = () => {
  return (
    <section className="hero-section" id="inicio">
      <div className="container">
        <div className="hero-content">
          <h1>Transforme suas decisões financeiras com Inteligência Artificial</h1>
          <p className="hero-subtitle">
            Análises precisas, insights poderosos e previsões que impulsionam seus resultados
          </p>
          
          <div className="hero-cta">
            <a href="/register" className="btn btn-primary btn-lg">
              Começar Gratuitamente
            </a>
            <a href="/demo" className="btn btn-secondary btn-lg">
              Agendar Demonstração
            </a>
          </div>
          
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-number">10.000+</span>
              <span className="stat-label">Usuários</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">500+</span>
              <span className="stat-label">Empresas</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">98%</span>
              <span className="stat-label">Satisfação</span>
            </div>
          </div>
        </div>
        
        <div className="hero-image">
          <img 
            src="/images/hero-image.png" 
            alt="Dashboard Finance AI" 
            className="dashboard-preview"
          />
        </div>
      </div>
      
      <div className="hero-wave">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path fill="#B3D7FF" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,149.3C960,160,1056,160,1152,138.7C1248,117,1344,75,1392,53.3L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
