// Arquivo principal da landing page
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Obter o diretório atual em ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuração do servidor Express
const app = express();
const PORT = 3000;

// Definir pasta public para arquivos estáticos
const publicPath = path.join(__dirname, 'public');

// Servir arquivos estáticos da pasta public
app.use(express.static(publicPath));

// Rota principal que renderiza a landing page
app.get('/', (req, res) => {
  // Envia o HTML da landing page
  res.send(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Finance AI - Transforme suas decisões financeiras</title>
      <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
      <link rel="stylesheet" href="/styles.css">
    </head>
    <body>
      <!-- Header e Navegação -->
      <header class="header">
        <div class="container">
          <div class="nav-container">
            <div class="logo">
              <img src="/images/logo.svg" alt="Finance AI Logo">
              <span class="logo-text">Finance AI</span>
            </div>
            <nav>
              <ul class="nav-links">
                <li><a href="#beneficios">Benefícios</a></li>
                <li><a href="#como-funciona">Como Funciona</a></li>
                <li><a href="#depoimentos">Depoimentos</a></li>
                <li><a href="#precos">Preços</a></li>
                <li><a href="#faq">FAQ</a></li>
              </ul>
            </nav>
            <button class="btn">Entrar</button>
            <button class="mobile-menu-btn">
              <i class="fas fa-bars"></i>
            </button>
          </div>
        </div>
      </header>

      <!-- Seção Hero -->
      <section class="hero">
        <div class="container">
          <div class="hero-content">
            <h1>Transforme suas decisões financeiras com Inteligência Artificial</h1>
            <p>Análises precisas, insights poderosos e previsões que impulsionam seus resultados</p>
            <div class="hero-btns">
              <a href="#" class="btn">Começar Gratuitamente</a>
              <a href="#" class="btn btn-secondary">Agendar Demonstração</a>
            </div>
            <div class="hero-stats">
              <div class="stat-item">
                <div class="stat-number" data-target="10000">0</div>
                <div class="stat-label">Usuários Ativos</div>
              </div>
              <div class="stat-item">
                <div class="stat-number" data-target="500">0</div>
                <div class="stat-label">Empresas Atendidas</div>
              </div>
              <div class="stat-item">
                <div class="stat-number" data-target="95">0</div>
                <div class="stat-label">% de Satisfação</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Seção Benefícios -->
      <section id="beneficios" class="benefits">
        <div class="container">
          <div class="section-title reveal">
            <h2>Benefícios Exclusivos</h2>
            <p>Descubra como nossa plataforma pode transformar sua gestão financeira</p>
          </div>
          <div class="benefits-grid">
            <div class="benefit-card reveal">
              <div class="benefit-icon">
                <i class="fas fa-chart-line"></i>
              </div>
              <h3>Decisões baseadas em dados</h3>
              <p>Elimine o achismo e tome decisões financeiras com base em análises precisas e dados confiáveis.</p>
            </div>
            <div class="benefit-card reveal">
              <div class="benefit-icon">
                <i class="fas fa-brain"></i>
              </div>
              <h3>Previsões financeiras precisas</h3>
              <p>Nossa IA analisa padrões históricos e fatores de mercado para prever tendências com alta precisão.</p>
            </div>
            <div class="benefit-card reveal">
              <div class="benefit-icon">
                <i class="fas fa-robot"></i>
              </div>
              <h3>Automação de análises complexas</h3>
              <p>Automatize processos de análise financeira complexos e economize horas de trabalho manual.</p>
            </div>
            <div class="benefit-card reveal">
              <div class="benefit-icon">
                <i class="fas fa-lightbulb"></i>
              </div>
              <h3>Insights personalizados</h3>
              <p>Receba recomendações e insights personalizados para seu negócio, baseados no seu perfil único.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Seção Como Funciona -->
      <section id="como-funciona" class="how-it-works">
        <div class="container">
          <div class="section-title reveal">
            <h2>Como Funciona</h2>
            <p>Três passos simples para revolucionar suas finanças</p>
          </div>
          <div class="steps-container">
            <div class="step reveal">
              <div class="step-number">1</div>
              <h3>Conecte suas fontes de dados</h3>
              <p>Integre facilmente suas fontes de dados financeiros, ERPs, planilhas ou APIs de terceiros.</p>
            </div>
            <div class="step reveal">
              <div class="step-number">2</div>
              <h3>Nossa IA analisa e identifica padrões</h3>
              <p>Algoritmos avançados processam seus dados, identificando padrões e oportunidades ocultas.</p>
            </div>
            <div class="step reveal">
              <div class="step-number">3</div>
              <h3>Receba insights e recomendações</h3>
              <p>Visualize relatórios claros e receba recomendações acionáveis para otimizar seus resultados.</p>
            </div>
          </div>
          <div style="text-align: center; margin-top: 50px;">
            <a href="#" class="btn">Saiba mais sobre nossa tecnologia</a>
          </div>
        </div>
      </section>

      <!-- Seção Depoimentos -->
      <section id="depoimentos" class="testimonials">
        <div class="container">
          <div class="section-title reveal">
            <h2>O que nossos clientes dizem</h2>
            <p>Histórias reais de empresas que transformaram suas finanças com nossa plataforma</p>
          </div>
          <div class="testimonial-slider">
            <div class="testimonial-card reveal">
              <div class="testimonial-content">
                "A Finance AI revolucionou completamente nossa gestão financeira. Conseguimos identificar oportunidades de economia que nunca teríamos visto sem a plataforma. O retorno sobre o investimento foi quase imediato."
              </div>
              <div class="client-info">
                <div class="client-avatar">
                  <img src="https://randomuser.me/api/portraits/women/45.jpg" alt="Ana Silva">
                </div>
                <div class="client-details">
                  <h4>Ana Silva</h4>
                  <p>CFO, TechSolutions</p>
                </div>
              </div>
              <div class="client-result">
                30% de aumento na precisão das previsões
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Seção Planos e Preços -->
      <section id="precos" class="pricing">
        <div class="container">
          <div class="section-title reveal">
            <h2>Planos e Preços</h2>
            <p>Escolha o plano ideal para o seu negócio</p>
          </div>
          <div class="pricing-grid">
            <div class="pricing-card reveal">
              <h3>Básico</h3>
              <div class="price">R$99<span>/mês</span></div>
              <p>Ideal para pequenas empresas e profissionais autônomos</p>
              <ul class="pricing-features">
                <li>Análise de dados básica</li>
                <li>Previsões financeiras mensais</li>
                <li>1 integração de dados</li>
                <li>Suporte por email</li>
              </ul>
              <a href="#" class="btn">Escolher Plano</a>
            </div>
            <div class="pricing-card popular reveal">
              <div class="popular-badge">Mais Popular</div>
              <h3>Profissional</h3>
              <div class="price">R$249<span>/mês</span></div>
              <p>Perfeito para empresas em crescimento</p>
              <ul class="pricing-features">
                <li>Análise de dados avançada</li>
                <li>Previsões financeiras semanais</li>
                <li>5 integrações de dados</li>
                <li>Suporte prioritário</li>
                <li>Dashboard personalizado</li>
              </ul>
              <a href="#" class="btn">Escolher Plano</a>
            </div>
            <div class="pricing-card reveal">
              <h3>Empresarial</h3>
              <div class="price">R$499<span>/mês</span></div>
              <p>Solução completa para grandes empresas</p>
              <ul class="pricing-features">
                <li>Análise de dados em tempo real</li>
                <li>Previsões financeiras diárias</li>
                <li>Integrações ilimitadas</li>
                <li>Suporte 24/7</li>
                <li>Dashboard personalizado</li>
                <li>API exclusiva</li>
                <li>Treinamento da equipe</li>
              </ul>
              <a href="#" class="btn">Escolher Plano</a>
            </div>
          </div>
        </div>
      </section>

      <!-- Seção FAQ -->
      <section id="faq" class="faq">
        <div class="container">
          <div class="section-title reveal">
            <h2>Perguntas Frequentes</h2>
            <p>Tire suas dúvidas sobre a Finance AI</p>
          </div>
          <div class="faq-container">
            <div class="faq-item reveal">
              <div class="faq-question">Como a Finance AI protege meus dados financeiros?</div>
              <div class="faq-answer">
                <p>A Finance AI utiliza criptografia de ponta a ponta e segue os mais rigorosos protocolos de segurança. Seus dados são armazenados em servidores seguros com certificação ISO 27001. Além disso, não compartilhamos suas informações com terceiros sem sua autorização expressa.</p>
              </div>
            </div>
            <div class="faq-item reveal">
              <div class="faq-question">Posso integrar a plataforma com meu sistema atual?</div>
              <div class="faq-answer">
                <p>Sim! A Finance AI oferece integração com os principais sistemas financeiros e ERPs do mercado. Temos APIs e conectores pré-construídos para facilitar a integração. Caso seu sistema não esteja na lista, nossa equipe de suporte pode desenvolver uma solução personalizada.</p>
              </div>
            </div>
            <div class="faq-item reveal">
              <div class="faq-question">Quanto tempo leva para começar a ver resultados?</div>
              <div class="faq-answer">
                <p>A maioria dos clientes começa a ver insights valiosos já nas primeiras semanas de uso. A plataforma precisa de dados históricos para gerar previsões mais precisas, mas mesmo com poucos dados já é possível obter análises úteis. Tipicamente, após 3 meses de uso, os clientes reportam melhorias significativas em suas decisões financeiras.</p>
              </div>
            </div>
            <div class="faq-item reveal">
              <div class="faq-question">Preciso ter conhecimentos avançados em finanças ou tecnologia?</div>
              <div class="faq-answer">
                <p>Não! A Finance AI foi projetada para ser intuitiva e fácil de usar, mesmo para quem não tem conhecimentos avançados. Nossa interface é amigável e oferecemos treinamento gratuito para todos os novos usuários. Além disso, nossa equipe de suporte está sempre disponível para ajudar.</p>
              </div>
            </div>
            <div class="faq-item reveal">
              <div class="faq-question">Posso cancelar minha assinatura a qualquer momento?</div>
              <div class="faq-answer">
                <p>Sim, não exigimos contratos de longo prazo. Você pode cancelar sua assinatura a qualquer momento sem taxas adicionais. Acreditamos que a qualidade do nosso serviço é o que mantém nossos clientes, não contratos restritivos.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Seção CTA Final -->
      <section class="cta">
        <div class="container">
          <h2 class="reveal">Pronto para revolucionar suas decisões financeiras?</h2>
          <p class="reveal">Junte-se a milhares de empresas que já transformaram sua gestão financeira com a Finance AI</p>
          <div class="cta-buttons">
            <a href="#" class="btn reveal">Começar Agora</a>
            <a href="#" class="btn btn-secondary reveal">Fale com um Consultor</a>
          </div>
        </div>
      </section>

      <!-- Footer -->
      <footer class="footer">
        <div class="container">
          <div class="footer-grid">
            <div class="footer-about">
              <div class="footer-logo">
                <img src="/images/logo.svg" alt="Finance AI Logo">
                <span class="footer-logo-text">Finance AI</span>
              </div>
              <p>Transformando dados financeiros em insights poderosos e ações inteligentes para empresas de todos os tamanhos.</p>
              <div class="social-links">
                <a href="#"><i class="fab fa-facebook-f"></i></a>
                <a href="#"><i class="fab fa-twitter"></i></a>
                <a href="#"><i class="fab fa-linkedin-in"></i></a>
                <a href="#"><i class="fab fa-instagram"></i></a>
              </div>
            </div>
            <div class="footer-links">
              <h4>Empresa</h4>
              <ul>
                <li><a href="#">Sobre Nós</a></li>
                <li><a href="#">Carreiras</a></li>
                <li><a href="#">Blog</a></li>
                <li><a href="#">Imprensa</a></li>
              </ul>
            </div>
            <div class="footer-links">
              <h4>Recursos</h4>
              <ul>
                <li><a href="#">Centro de Ajuda</a></li>
                <li><a href="#">Documentação</a></li>
                <li><a href="#">Webinars</a></li>
                <li><a href="#">Parceiros</a></li>
              </ul>
            </div>
            <div class="footer-links">
              <h4>Legal</h4>
              <ul>
                <li><a href="#">Termos de Uso</a></li>
                <li><a href="#">Política de Privacidade</a></li>
                <li><a href="#">Compliance</a></li>
                <li><a href="#">Segurança</a></li>
              </ul>
            </div>
            <div class="newsletter">
              <h4>Newsletter</h4>
              <p>Receba as últimas novidades e dicas sobre gestão financeira</p>
              <form class="newsletter-form">
                <input type="email" placeholder="Seu email" required>
                <button type="submit"><i class="fas fa-paper-plane"></i></button>
              </form>
            </div>
          </div>
          <div class="footer-bottom">
            <p>&copy; ${new Date().getFullYear()} Finance AI. Todos os direitos reservados.</p>
            <div>
              <a href="#">Termos</a>
              <a href="#">Privacidade</a>
              <a href="#">Cookies</a>
            </div>
          </div>
        </div>
      </footer>

      <script src="/script.js"></script>
    </body>
    </html>
  `);
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor da landing page rodando em http://localhost:${PORT}`);
});
