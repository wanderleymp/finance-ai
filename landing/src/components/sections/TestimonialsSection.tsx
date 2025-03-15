import React, { useState, useEffect } from 'react';

/**
 * Componente da seção de depoimentos da landing page
 * Apresenta depoimentos de clientes em formato de carrossel
 */
const TestimonialsSection: React.FC = () => {
  // Estado para controlar o depoimento ativo
  const [activeIndex, setActiveIndex] = useState(0);
  
  // Array com os dados dos depoimentos
  const depoimentos = [
    {
      id: 1,
      conteudo: "O Finance AI transformou completamente nossa gestão financeira. Conseguimos identificar oportunidades de economia que não tínhamos percebido antes e aumentamos nossa margem de lucro em 22% no primeiro trimestre de uso.",
      autor: "Ana Silva",
      cargo: "CFO",
      empresa: "TechSolutions Ltda",
      foto: "ana-silva.jpg"
    },
    {
      id: 2,
      conteudo: "Como gestor de uma empresa de médio porte, sempre tive dificuldade em prever tendências financeiras com precisão. O Finance AI mudou isso. Agora temos previsões com 95% de acurácia, o que nos permite planejar com muito mais confiança.",
      autor: "Carlos Mendes",
      cargo: "CEO",
      empresa: "Mendes Indústria",
      foto: "carlos-mendes.jpg"
    },
    {
      id: 3,
      conteudo: "A facilidade de uso do Finance AI é impressionante. Mesmo sem conhecimento técnico profundo, nossa equipe consegue extrair insights valiosos dos dados. O suporte ao cliente também é excepcional, sempre disponível para nos ajudar.",
      autor: "Mariana Costa",
      cargo: "Diretora Financeira",
      empresa: "Costa Comércio",
      foto: "mariana-costa.jpg"
    },
    {
      id: 4,
      conteudo: "Implementamos o Finance AI há 6 meses e já vimos um ROI de 300%. A capacidade da plataforma de analisar grandes volumes de dados e entregar insights acionáveis economizou incontáveis horas de trabalho manual da nossa equipe.",
      autor: "Roberto Almeida",
      cargo: "Controller",
      empresa: "Grupo Almeida",
      foto: "roberto-almeida.jpg"
    }
  ];

  // Efeito para alternar automaticamente os depoimentos
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => 
        prevIndex === depoimentos.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Alterna a cada 5 segundos
    
    return () => clearInterval(interval);
  }, [depoimentos.length]);

  // Função para navegar para um depoimento específico
  const goToTestimonial = (index: number) => {
    setActiveIndex(index);
  };

  return (
    <section className="testimonials-section" id="depoimentos">
      <div className="container">
        <div className="section-title">
          <h2>O que nossos clientes dizem</h2>
          <p>
            Empresas de diversos setores estão transformando suas finanças com o Finance AI
          </p>
        </div>
        
        <div className="testimonials-container">
          {/* Depoimento ativo */}
          <div className="testimonial-card">
            <p className="testimonial-content">"{depoimentos[activeIndex].conteudo}"</p>
            
            <div className="testimonial-author">
              <img 
                src={`/images/testimonial-photos/${depoimentos[activeIndex].foto}`} 
                alt={depoimentos[activeIndex].autor} 
                className="author-avatar" 
              />
              
              <div className="author-info">
                <h4>{depoimentos[activeIndex].autor}</h4>
                <p className="author-position">{depoimentos[activeIndex].cargo}</p>
                <p className="author-company">{depoimentos[activeIndex].empresa}</p>
              </div>
            </div>
          </div>
          
          {/* Indicadores de navegação */}
          <div className="testimonial-nav">
            {depoimentos.map((_, index) => (
              <button 
                key={index}
                className={`nav-dot ${index === activeIndex ? 'active' : ''}`}
                onClick={() => goToTestimonial(index)}
                aria-label={`Depoimento ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
