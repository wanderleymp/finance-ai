import React from 'react';

/**
 * Componente da seção de benefícios da landing page
 * Apresenta os principais benefícios do sistema em formato de cards
 */
const BenefitsSection: React.FC = () => {
  // Array com os dados dos benefícios
  const beneficios = [
    {
      id: 1,
      icone: 'data-analysis.svg',
      titulo: 'Decisões baseadas em dados',
      descricao: 'Transforme dados complexos em insights claros e acionáveis para tomar decisões financeiras mais precisas.'
    },
    {
      id: 2,
      icone: 'forecast.svg',
      titulo: 'Previsões financeiras precisas',
      descricao: 'Algoritmos avançados de IA que preveem tendências financeiras com precisão superior aos métodos tradicionais.'
    },
    {
      id: 3,
      icone: 'automation.svg',
      titulo: 'Automação de análises complexas',
      descricao: 'Economize tempo automatizando análises financeiras complexas que normalmente levariam horas ou dias.'
    },
    {
      id: 4,
      icone: 'personalization.svg',
      titulo: 'Insights personalizados',
      descricao: 'Receba recomendações personalizadas para seu negócio específico, adaptadas ao seu setor e objetivos.'
    }
  ];

  return (
    <section className="benefits-section" id="beneficios">
      <div className="container">
        <div className="section-title">
          <h2>Benefícios do Finance AI</h2>
          <p>
            Nossa plataforma combina tecnologia de ponta com expertise financeira para entregar 
            soluções que transformam a maneira como você toma decisões de negócio.
          </p>
        </div>
        
        <div className="benefits-grid">
          {beneficios.map((beneficio) => (
            <div className="card benefit-card" key={beneficio.id}>
              <img 
                src={`/images/benefit-icons/${beneficio.icone}`} 
                alt={beneficio.titulo} 
                className="benefit-icon" 
              />
              <h3 className="benefit-title">{beneficio.titulo}</h3>
              <p>{beneficio.descricao}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
