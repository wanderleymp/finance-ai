import React, { useState } from 'react';

/**
 * Componente da seção de preços da landing page
 * Apresenta os diferentes planos e suas características
 */
const PricingSection: React.FC = () => {
  // Estado para controlar se está mostrando preços mensais ou anuais
  const [isAnnual, setIsAnnual] = useState(false);
  
  // Função para alternar entre preços mensais e anuais
  const togglePricing = () => {
    setIsAnnual(!isAnnual);
  };
  
  // Array com os dados dos planos
  const planos = [
    {
      id: 1,
      nome: 'Básico',
      descricao: 'Ideal para pequenas empresas e profissionais autônomos',
      precoMensal: 'R$ 197',
      precoAnual: 'R$ 1.970',
      economiaAnual: 'Economize R$ 394',
      popular: false,
      recursos: [
        'Análise de dados financeiros básica',
        'Dashboards personalizáveis',
        'Previsões financeiras mensais',
        'Exportação de relatórios em PDF',
        'Suporte por e-mail'
      ]
    },
    {
      id: 2,
      nome: 'Profissional',
      descricao: 'Perfeito para empresas em crescimento',
      precoMensal: 'R$ 397',
      precoAnual: 'R$ 3.970',
      economiaAnual: 'Economize R$ 794',
      popular: true,
      recursos: [
        'Todos os recursos do plano Básico',
        'Análise avançada com IA',
        'Previsões financeiras semanais',
        'Integração com sistemas ERP',
        'Alertas personalizados',
        'Suporte prioritário por telefone'
      ]
    },
    {
      id: 3,
      nome: 'Empresarial',
      descricao: 'Solução completa para grandes organizações',
      precoMensal: 'R$ 997',
      precoAnual: 'R$ 9.970',
      economiaAnual: 'Economize R$ 1.994',
      popular: false,
      recursos: [
        'Todos os recursos do plano Profissional',
        'API completa para integrações',
        'Análise preditiva avançada',
        'Consultoria financeira mensal',
        'Treinamento personalizado',
        'Suporte 24/7 com gerente dedicado',
        'Personalização completa da plataforma'
      ]
    }
  ];

  return (
    <section className="pricing-section" id="precos">
      <div className="container">
        <div className="section-title">
          <h2>Planos e Preços</h2>
          <p>
            Escolha o plano ideal para suas necessidades financeiras
          </p>
        </div>
        
        {/* Toggle entre preços mensais e anuais */}
        <div className="pricing-toggle">
          <span 
            className={`toggle-option ${!isAnnual ? 'active' : ''}`}
            onClick={() => setIsAnnual(false)}
          >
            Mensal
          </span>
          
          <div 
            className={`toggle-switch ${isAnnual ? 'annual' : ''}`}
            onClick={togglePricing}
          ></div>
          
          <span 
            className={`toggle-option ${isAnnual ? 'active' : ''}`}
            onClick={() => setIsAnnual(true)}
          >
            Anual
          </span>
        </div>
        
        {/* Grid de planos */}
        <div className="pricing-grid">
          {planos.map((plano) => (
            <div 
              className={`pricing-card ${plano.popular ? 'popular' : ''}`} 
              key={plano.id}
            >
              {plano.popular && (
                <div className="popular-badge">Mais Popular</div>
              )}
              
              <h3 className="pricing-name">{plano.nome}</h3>
              <p>{plano.descricao}</p>
              
              <div className="pricing-price">
                {isAnnual ? plano.precoAnual : plano.precoMensal}
                <span className="pricing-period">
                  /{isAnnual ? 'ano' : 'mês'}
                </span>
              </div>
              
              {isAnnual && (
                <div className="pricing-savings">{plano.economiaAnual}</div>
              )}
              
              <ul className="pricing-features">
                {plano.recursos.map((recurso, index) => (
                  <li key={index}>{recurso}</li>
                ))}
              </ul>
              
              <a 
                href={`/register?plan=${plano.id}`} 
                className={`btn ${plano.popular ? 'btn-primary' : 'btn-secondary'} btn-lg`}
              >
                Começar Agora
              </a>
            </div>
          ))}
        </div>
        
        <div className="pricing-guarantee text-center" style={{ marginTop: 'var(--espacamento-xxl)' }}>
          <p>
            <strong>Garantia de 14 dias.</strong> Teste sem compromisso e cancele a qualquer momento.
          </p>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
