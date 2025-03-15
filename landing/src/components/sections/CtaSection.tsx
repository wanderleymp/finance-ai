import React from 'react';

/**
 * Componente da seção CTA (Call to Action) final da landing page
 * Apresenta uma chamada para ação destacada no final da página
 */
const CtaSection: React.FC = () => {
  return (
    <section className="cta-section">
      <div className="container">
        <div className="cta-content">
          <h2>Pronto para revolucionar suas decisões financeiras?</h2>
          <p>
            Junte-se a milhares de empresas que já estão transformando seus dados financeiros em 
            insights valiosos e decisões mais inteligentes com o Finance AI.
          </p>
          
          <div className="cta-buttons">
            <a href="/register" className="btn btn-primary btn-lg btn-register-cta">
              Registre aqui
            </a>
            <a href="/contato" className="btn btn-secondary btn-lg">
              Fale com um Consultor
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
