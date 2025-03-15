import React from 'react';

/**
 * Componente da seção "Como Funciona" da landing page
 * Apresenta o processo de utilização do sistema em etapas
 */
const HowItWorksSection: React.FC = () => {
  // Array com os dados das etapas
  const etapas = [
    {
      id: 1,
      numero: 1,
      titulo: 'Conecte suas fontes de dados',
      descricao: 'Integre facilmente suas fontes de dados financeiros, como sistemas ERP, planilhas ou APIs bancárias.',
      imagem: 'step1.svg'
    },
    {
      id: 2,
      numero: 2,
      titulo: 'Nossa IA analisa e identifica padrões',
      descricao: 'Algoritmos avançados processam seus dados, identificando tendências, anomalias e oportunidades.',
      imagem: 'step2.svg'
    },
    {
      id: 3,
      numero: 3,
      titulo: 'Receba insights e recomendações acionáveis',
      descricao: 'Visualize relatórios intuitivos e receba recomendações personalizadas para otimizar seus resultados.',
      imagem: 'step3.svg'
    }
  ];

  return (
    <section className="how-it-works-section" id="como-funciona">
      <div className="container">
        <div className="section-title">
          <h2>Como o Finance AI funciona</h2>
          <p>
            Um processo simples e eficiente para transformar seus dados financeiros em decisões inteligentes
          </p>
        </div>
        
        <div className="steps-container">
          {/* Linha conectando as etapas */}
          <div className="steps-line"></div>
          
          {/* Renderização das etapas */}
          {etapas.map((etapa) => (
            <div className="step-item" key={etapa.id}>
              <div className="step-number">{etapa.numero}</div>
              <img 
                src={`/images/how-it-works/${etapa.imagem}`} 
                alt={`Etapa ${etapa.numero}`} 
                className="step-image" 
              />
              <h3 className="step-title">{etapa.titulo}</h3>
              <p>{etapa.descricao}</p>
            </div>
          ))}
        </div>
        
        <div className="text-center" style={{ marginTop: 'var(--espacamento-xxl)' }}>
          <a href="/technology" className="btn btn-secondary">
            Saiba mais sobre nossa tecnologia
          </a>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
