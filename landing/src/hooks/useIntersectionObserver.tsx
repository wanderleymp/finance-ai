import { useState, useEffect, useRef, RefObject } from 'react';

/**
 * Interface que define as opções do hook useIntersectionObserver
 */
interface UseIntersectionObserverOptions {
  threshold?: number;
  rootMargin?: string;
  root?: Element | null;
}

/**
 * Hook personalizado para detectar quando um elemento entra na viewport
 * Útil para animações de entrada e carregamento lazy
 * 
 * @param options - Opções para o IntersectionObserver
 * @returns Um array contendo a referência do elemento e um booleano indicando se está visível
 */
const useIntersectionObserver = <T extends Element>({
  threshold = 0.1,
  rootMargin = '0px',
  root = null
}: UseIntersectionObserverOptions = {}): [RefObject<T>, boolean] => {
  // Referência para o elemento que será observado
  const elementRef = useRef<T>(null);
  
  // Estado para controlar se o elemento está visível
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    
    // Se não houver elemento, não faz nada
    if (!element) return;

    // Callback chamado quando a interseção muda
    const observerCallback: IntersectionObserverCallback = (entries) => {
      const [entry] = entries;
      setIsVisible(entry.isIntersecting);
    };

    // Cria o observer com as opções fornecidas
    const observer = new IntersectionObserver(observerCallback, {
      threshold,
      rootMargin,
      root
    });

    // Inicia a observação do elemento
    observer.observe(element);

    // Limpa o observer quando o componente é desmontado
    return () => {
      observer.unobserve(element);
    };
  }, [threshold, rootMargin, root]);

  return [elementRef, isVisible];
};

export default useIntersectionObserver;
