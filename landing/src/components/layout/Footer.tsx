import React from 'react';

/**
 * Componente de rodapé da landing page
 * Contém links, informações de contato e formulário de newsletter
 */
const Footer: React.FC = () => {
  // Função para lidar com o envio do formulário de newsletter
  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui seria implementada a lógica para processar a inscrição na newsletter
    console.log('Formulário de newsletter enviado');
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-container">
          {/* Coluna com logo e redes sociais */}
          <div className="footer-column">
            <img src="/images/logo.svg" alt="Finance AI" className="footer-logo" />
            <p>Transforme suas decisões financeiras com o poder da inteligência artificial.</p>
            
            <div className="social-links">
              <a href="#" className="social-icon" aria-label="LinkedIn">
                <i className="fab fa-linkedin-in"></i>
              </a>
              <a href="#" className="social-icon" aria-label="Twitter">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="social-icon" aria-label="Facebook">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="social-icon" aria-label="Instagram">
                <i className="fab fa-instagram"></i>
              </a>
            </div>
          </div>
          
          {/* Coluna de links de produto */}
          <div className="footer-column">
            <h4>Produto</h4>
            <ul className="footer-links">
              <li><a href="#">Recursos</a></li>
              <li><a href="#">Preços</a></li>
              <li><a href="#">Casos de Uso</a></li>
              <li><a href="#">Integrações</a></li>
              <li><a href="#">API</a></li>
            </ul>
          </div>
          
          {/* Coluna de links de empresa */}
          <div className="footer-column">
            <h4>Empresa</h4>
            <ul className="footer-links">
              <li><a href="#">Sobre Nós</a></li>
              <li><a href="#">Blog</a></li>
              <li><a href="#">Carreiras</a></li>
              <li><a href="#">Contato</a></li>
              <li><a href="#">Parceiros</a></li>
            </ul>
          </div>
          
          {/* Coluna de links de suporte */}
          <div className="footer-column">
            <h4>Suporte</h4>
            <ul className="footer-links">
              <li><a href="#">Documentação</a></li>
              <li><a href="#">Centro de Ajuda</a></li>
              <li><a href="#">Tutoriais</a></li>
              <li><a href="#">Status do Sistema</a></li>
              <li><a href="#">Comunidade</a></li>
            </ul>
          </div>
          
          {/* Coluna de newsletter */}
          <div className="footer-column">
            <h4>Fique por dentro</h4>
            <p>Receba as últimas novidades e atualizações do Finance AI.</p>
            
            <form onSubmit={handleNewsletterSubmit} className="newsletter-form">
              <input 
                type="email" 
                placeholder="Seu e-mail" 
                className="newsletter-input" 
                required 
              />
              <button type="submit" className="newsletter-button">
                Inscrever
              </button>
            </form>
          </div>
        </div>
        
        {/* Rodapé inferior com copyright e links legais */}
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Finance AI. Todos os direitos reservados.</p>
          <div className="footer-legal">
            <a href="#">Termos de Serviço</a> | 
            <a href="#">Política de Privacidade</a> | 
            <a href="#">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
