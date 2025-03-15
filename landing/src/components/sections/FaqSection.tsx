import React, { useState } from 'react';

/**
 * Componente da seção de Perguntas Frequentes (FAQ) da landing page
 * Apresenta perguntas e respostas comuns em formato de acordeão
 */
const FaqSection: React.FC = () => {
  // Estado para controlar qual item do acordeão está aberto
  const [openItem, setOpenItem] = useState<number | null>(0);
  
  // Função para alternar a abertura/fechamento de um item
  const toggleItem = (index: number) => {
    setOpenItem(openItem === index ? null : index);
  };
  
  // Array com os dados das perguntas frequentes
  const perguntas = [
    {
      id: 1,
      pergunta: 'Como o Finance AI protege meus dados financeiros?',
      resposta: 'O Finance AI utiliza criptografia de ponta a ponta para todos os dados transmitidos e armazenados. Implementamos protocolos de segurança rigorosos, incluindo autenticação de dois fatores, controles de acesso baseados em funções e monitoramento contínuo. Todos os nossos servidores estão em conformidade com as normas ISO 27001 e LGPD, garantindo o mais alto nível de proteção para seus dados financeiros.'
    },
    {
      id: 2,
      pergunta: 'Quais sistemas e fontes de dados o Finance AI pode integrar?',
      resposta: 'O Finance AI oferece integrações nativas com os principais sistemas ERP do mercado (SAP, Oracle, Totvs), plataformas de e-commerce (Shopify, Magento, WooCommerce), sistemas bancários via Open Banking, além de suportar importação de arquivos CSV, Excel e Google Sheets. Nossa API aberta também permite desenvolver integrações personalizadas para qualquer fonte de dados específica da sua empresa.'
    },
    {
      id: 3,
      pergunta: 'Quanto tempo leva para implementar o Finance AI na minha empresa?',
      resposta: 'O tempo de implementação varia de acordo com o tamanho da sua empresa e a complexidade dos seus dados. Para pequenas empresas, a configuração básica pode ser concluída em 1-2 dias. Para médias empresas com integrações mais complexas, o processo típico leva de 1 a 2 semanas. Grandes organizações com requisitos personalizados podem levar de 3 a 4 semanas. Nossa equipe de onboarding acompanha todo o processo para garantir uma transição suave.'
    },
    {
      id: 4,
      pergunta: 'Preciso ter conhecimento técnico para usar o Finance AI?',
      resposta: 'Não, o Finance AI foi projetado para ser intuitivo e acessível a usuários sem conhecimento técnico. Nossa interface é amigável e oferecemos dashboards pré-configurados que facilitam a visualização e interpretação dos dados. Para usuários mais avançados, disponibilizamos opções de personalização e configurações mais técnicas. Além disso, oferecemos treinamento gratuito para todos os novos clientes.'
    },
    {
      id: 5,
      pergunta: 'Posso testar o Finance AI antes de assinar?',
      resposta: 'Sim, oferecemos um período de teste gratuito de 14 dias com acesso completo a todas as funcionalidades da plataforma. Durante este período, você pode explorar todos os recursos, integrar suas fontes de dados e avaliar o valor que o Finance AI pode trazer para sua empresa. Não exigimos cartão de crédito para iniciar o teste e você receberá suporte completo da nossa equipe durante todo o período.'
    },
    {
      id: 6,
      pergunta: 'Como funciona o suporte técnico?',
      resposta: 'Oferecemos diferentes níveis de suporte técnico dependendo do seu plano. Todos os planos incluem suporte por e-mail com tempo de resposta de até 24 horas. O plano Profissional adiciona suporte por telefone em horário comercial. O plano Empresarial oferece suporte 24/7 com um gerente de conta dedicado. Também disponibilizamos uma extensa base de conhecimento, tutoriais em vídeo e webinars mensais para todos os clientes.'
    },
    {
      id: 7,
      pergunta: 'É possível personalizar os relatórios e dashboards?',
      resposta: 'Sim, o Finance AI oferece amplas opções de personalização. Você pode criar dashboards personalizados, definir métricas específicas para seu negócio, personalizar relatórios e configurar alertas baseados em critérios específicos. No plano Empresarial, oferecemos ainda a possibilidade de desenvolver visualizações e relatórios totalmente customizados com a ajuda da nossa equipe de consultores.'
    }
  ];

  return (
    <section className="faq-section" id="faq">
      <div className="container">
        <div className="section-title">
          <h2>Perguntas Frequentes</h2>
          <p>
            Tire suas dúvidas sobre o Finance AI
          </p>
        </div>
        
        <div className="accordion">
          {perguntas.map((pergunta, index) => (
            <div 
              className={`accordion-item ${openItem === index ? 'open' : ''}`} 
              key={pergunta.id}
            >
              <div 
                className="accordion-header"
                onClick={() => toggleItem(index)}
              >
                <h3>{pergunta.pergunta}</h3>
                <span className="accordion-icon">
                  {openItem === index ? '−' : '+'}
                </span>
              </div>
              
              <div className="accordion-content">
                <p>{pergunta.resposta}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="faq-more text-center" style={{ marginTop: 'var(--espacamento-xl)' }}>
          <p>
            Não encontrou o que procurava? 
            <a href="/contato" style={{ marginLeft: 'var(--espacamento-sm)' }}>
              Entre em contato com nossa equipe
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
