import React from 'react';

/**
 * Interface que define as propriedades do componente Testimonial
 */
interface TestimonialProps {
  conteudo: string;
  autor: string;
  cargo: string;
  empresa: string;
  foto: string;
  className?: string;
}

/**
 * Componente Testimonial reutilizável
 * Usado para exibir depoimentos de clientes de forma consistente
 */
const Testimonial: React.FC<TestimonialProps> = ({
  conteudo,
  autor,
  cargo,
  empresa,
  foto,
  className = ''
}) => {
  // Construção das classes CSS
  const testimonialClasses = [
    'testimonial-card',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={testimonialClasses}>
      <p className="testimonial-content">"{conteudo}"</p>
      
      <div className="testimonial-author">
        <img 
          src={`/images/testimonial-photos/${foto}`} 
          alt={autor} 
          className="author-avatar" 
        />
        
        <div className="author-info">
          <h4>{autor}</h4>
          <p className="author-position">{cargo}</p>
          <p className="author-company">{empresa}</p>
        </div>
      </div>
    </div>
  );
};

export default Testimonial;
