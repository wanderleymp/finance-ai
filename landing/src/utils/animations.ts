/**
 * Utilitários para animações na landing page
 * Fornece funções e constantes para criar animações consistentes
 */

// Tipos de animações disponíveis
export type AnimationType = 
  | 'fadeIn' 
  | 'fadeInUp' 
  | 'fadeInDown' 
  | 'fadeInLeft' 
  | 'fadeInRight' 
  | 'zoomIn' 
  | 'slideIn';

// Interface para configuração de animações
export interface AnimationConfig {
  type: AnimationType;
  duration?: number;
  delay?: number;
  easing?: string;
}

// Duração padrão das animações em milissegundos
export const ANIMATION_DURATION = {
  fast: 300,
  normal: 500,
  slow: 800
};

// Funções de easing para animações
export const ANIMATION_EASING = {
  linear: 'linear',
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  bounce: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'
};

/**
 * Gera a string CSS para a animação especificada
 * 
 * @param config - Configuração da animação
 * @returns String CSS para a animação
 */
export const getAnimationStyle = (config: AnimationConfig): React.CSSProperties => {
  const { 
    type, 
    duration = ANIMATION_DURATION.normal, 
    delay = 0, 
    easing = ANIMATION_EASING.easeOut 
  } = config;
  
  return {
    animation: `${type} ${duration}ms ${easing}`,
    animationDelay: `${delay}ms`,
    animationFillMode: 'both'
  };
};

/**
 * Gera uma sequência de delays para animar múltiplos elementos em sequência
 * 
 * @param count - Número de elementos
 * @param baseDelay - Delay base entre cada elemento
 * @returns Array de delays em milissegundos
 */
export const getStaggeredDelays = (count: number, baseDelay = 100): number[] => {
  return Array.from({ length: count }, (_, i) => i * baseDelay);
};

/**
 * Classe utilitária para adicionar/remover classes de animação
 */
export const AnimationUtils = {
  /**
   * Adiciona uma classe de animação a um elemento
   * 
   * @param element - Elemento DOM
   * @param animationClass - Classe CSS da animação
   */
  addAnimation(element: HTMLElement, animationClass: string): void {
    element.classList.add(animationClass);
  },
  
  /**
   * Remove uma classe de animação de um elemento
   * 
   * @param element - Elemento DOM
   * @param animationClass - Classe CSS da animação
   */
  removeAnimation(element: HTMLElement, animationClass: string): void {
    element.classList.remove(animationClass);
  },
  
  /**
   * Adiciona uma animação temporária a um elemento
   * 
   * @param element - Elemento DOM
   * @param animationClass - Classe CSS da animação
   * @param duration - Duração da animação em milissegundos
   */
  animateTemporarily(
    element: HTMLElement, 
    animationClass: string, 
    duration = ANIMATION_DURATION.normal
  ): void {
    this.addAnimation(element, animationClass);
    
    setTimeout(() => {
      this.removeAnimation(element, animationClass);
    }, duration);
  }
};

export default AnimationUtils;
