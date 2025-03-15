import React from 'react';

/**
 * Interface que define as propriedades do componente Card
 */
interface CardProps {
  children: React.ReactNode;
  className?: string;
  elevation?: 'low' | 'medium' | 'high';
  hoverEffect?: boolean;
  onClick?: () => void;
}

/**
 * Componente Card reutilizável
 * Usado para criar cards consistentes em toda a aplicação
 */
const Card: React.FC<CardProps> = ({
  children,
  className = '',
  elevation = 'low',
  hoverEffect = false,
  onClick
}) => {
  // Construção das classes CSS com base nas propriedades
  const cardClasses = [
    'card',
    `card-elevation-${elevation}`,
    hoverEffect ? 'card-hover' : '',
    onClick ? 'card-clickable' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={cardClasses} onClick={onClick}>
      {children}
    </div>
  );
};

export default Card;
