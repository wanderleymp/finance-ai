import React, { useEffect } from 'react';
import Layout from '../components/layout/Layout';
import HeroSection from '../components/sections/HeroSection';
import BenefitsSection from '../components/sections/BenefitsSection';
import HowItWorksSection from '../components/sections/HowItWorksSection';
import TestimonialsSection from '../components/sections/TestimonialsSection';
import PricingSection from '../components/sections/PricingSection';
import FaqSection from '../components/sections/FaqSection';
import CtaSection from '../components/sections/CtaSection';
import useIntersectionObserver from '../hooks/useIntersectionObserver';
import { AnimationUtils } from '../utils/animations';

/**
 * Componente principal da Landing Page
 * Integra todas as seções da página em uma estrutura coesa
 */
const LandingPage: React.FC = () => {
  // Efeito para aplicar animações quando a página carrega
  useEffect(() => {
    // Seleciona todos os elementos que devem ser animados
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    // Configura o observer para cada elemento
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          // Quando o elemento entra na viewport
          if (entry.isIntersecting) {
            // Adiciona a classe de animação
            entry.target.classList.add('animated');
            // Para de observar o elemento após a animação
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    
    // Inicia a observação de cada elemento
    animatedElements.forEach(el => {
      observer.observe(el);
    });
    
    // Limpa o observer quando o componente é desmontado
    return () => {
      animatedElements.forEach(el => {
        observer.unobserve(el);
      });
    };
  }, []);

  return (
    <Layout>
      {/* Seção Hero - Apresentação principal */}
      <HeroSection />
      
      {/* Seção de Benefícios */}
      <BenefitsSection />
      
      {/* Seção Como Funciona */}
      <HowItWorksSection />
      
      {/* Seção de Depoimentos */}
      <TestimonialsSection />
      
      {/* Seção de Preços */}
      <PricingSection />
      
      {/* Seção de Perguntas Frequentes */}
      <FaqSection />
      
      {/* Seção CTA Final */}
      <CtaSection />
    </Layout>
  );
};

export default LandingPage;
