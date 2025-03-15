import React, { useState } from 'react';

/**
 * Interface que define as propriedades do item do acordeão
 */
interface AccordionItemProps {
  title: string;
  content: string;
  isOpen: boolean;
  onClick: () => void;
  index: number;
}

/**
 * Componente para um item individual do acordeão
 */
const AccordionItem: React.FC<AccordionItemProps> = ({
  title,
  content,
  isOpen,
  onClick,
  index
}) => {
  return (
    <div className={`accordion-item ${isOpen ? 'open' : ''}`}>
      <div 
        className="accordion-header"
        onClick={onClick}
        role="button"
        aria-expanded={isOpen}
        aria-controls={`accordion-content-${index}`}
      >
        <h3>{title}</h3>
        <span className="accordion-icon">
          {isOpen ? '−' : '+'}
        </span>
      </div>
      
      <div 
        className="accordion-content"
        id={`accordion-content-${index}`}
        aria-hidden={!isOpen}
      >
        <p>{content}</p>
      </div>
    </div>
  );
};

/**
 * Interface que define as propriedades do componente Accordion
 */
interface AccordionProps {
  items: Array<{
    id: number;
    title: string;
    content: string;
  }>;
  allowMultiple?: boolean;
  defaultOpenIndex?: number | null;
}

/**
 * Componente Accordion reutilizável
 * Usado para criar acordeões consistentes em toda a aplicação
 */
const Accordion: React.FC<AccordionProps> = ({
  items,
  allowMultiple = false,
  defaultOpenIndex = null
}) => {
  // Estado para controlar quais itens estão abertos
  const [openItems, setOpenItems] = useState<number[]>(
    defaultOpenIndex !== null ? [defaultOpenIndex] : []
  );

  // Função para alternar a abertura/fechamento de um item
  const toggleItem = (index: number) => {
    if (allowMultiple) {
      // Se permitir múltiplos itens abertos, alterna o estado do item clicado
      setOpenItems(
        openItems.includes(index)
          ? openItems.filter(item => item !== index)
          : [...openItems, index]
      );
    } else {
      // Se não permitir múltiplos itens abertos, fecha todos e abre apenas o clicado
      setOpenItems(openItems.includes(index) ? [] : [index]);
    }
  };

  return (
    <div className="accordion">
      {items.map((item, index) => (
        <AccordionItem
          key={item.id}
          title={item.title}
          content={item.content}
          isOpen={openItems.includes(index)}
          onClick={() => toggleItem(index)}
          index={index}
        />
      ))}
    </div>
  );
};

export default Accordion;
