import React from 'react';

/**
 * Interface que define as propriedades do componente PricingCard
 */
interface PricingCardProps {
  nome: string;
  descricao: string;
  preco: string;
  periodo: string;
  economia?: string;
  recursos: string[];
  popular?: boolean;
  ctaText?: string;
  ctaLink: string;
  className?: string;
}

/**
 * Componente PricingCard reutilizável
 * Usado para exibir planos de preços de forma consistente
 */
const PricingCard: React.FC<PricingCardProps> = ({
  nome,
  descricao,
  preco,
  periodo,
  economia,
  recursos,
  popular = false,
  ctaText = 'Começar Agora',
  ctaLink,
  className = ''
}) => {
  // Construção das classes CSS
  const cardClasses = [
    'pricing-card',
    popular ? 'popular' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={cardClasses}>
      {popular && (
        <div className="popular-badge">Mais Popular</div>
      )}
      
      <h3 className="pricing-name">{nome}</h3>
      <p>{descricao}</p>
      
      <div className="pricing-price">
        {preco}
        <span className="pricing-period">/{periodo}</span>
      </div>
      
      {economia && (
        <div className="pricing-savings">{economia}</div>
      )}
      
      <ul className="pricing-features">
        {recursos.map((recurso, index) => (
          <li key={index}>{recurso}</li>
        ))}
      </ul>
      
      <a 
        href={ctaLink} 
        className={`btn ${popular ? 'btn-primary' : 'btn-secondary'} btn-lg`}
      >
        {ctaText}
      </a>
    </div>
  );
};

export default PricingCard;
