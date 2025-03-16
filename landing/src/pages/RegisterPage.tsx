import React, { useState, ReactElement } from 'react';
import Layout from '../components/layout/Layout';
import '../styles/register-page.css';
import '@types/react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      div: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
      section: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      h1: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
      h2: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
      p: React.DetailedHTMLProps<React.HTMLAttributes<HTMLParagraphElement>, HTMLParagraphElement>;
      form: React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>;
      label: React.DetailedHTMLProps<React.LabelHTMLAttributes<HTMLLabelElement>, HTMLLabelElement>;
      input: React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;
      select: React.DetailedHTMLProps<React.SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement>;
      option: React.DetailedHTMLProps<React.OptionHTMLAttributes<HTMLOptionElement>, HTMLOptionElement>;
      button: React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;
      a: React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>;
    }
  }
}

/**
 * Componente da página de registro
 * Permite que novos usuários se registrem na plataforma
 */
const RegisterPage = (): ReactElement => {
  // Estados para os campos do formulário
  const [tenantNome, setTenantNome] = useState('');
  const [tenantDominio, setTenantDominio] = useState('');
  const [tenantPlano, setTenantPlano] = useState('básico');
  const [empresaNome, setEmpresaNome] = useState('');
  const [empresaCnpj, setEmpresaCnpj] = useState('');
  const [adminNome, setAdminNome] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminSenha, setAdminSenha] = useState('');
  const [adminConfirmSenha, setAdminConfirmSenha] = useState('');
  
  // Estado para mensagens de erro e sucesso
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Função para validar o formulário
  const validateForm = () => {
    if (!tenantNome) {
      setError('Nome do tenant é obrigatório');
      return false;
    }
    if (!tenantPlano) {
      setError('Plano é obrigatório');
      return false;
    }
    if (!empresaNome) {
      setError('Nome da empresa é obrigatório');
      return false;
    }
    if (!adminNome) {
      setError('Nome do administrador é obrigatório');
      return false;
    }
    if (!adminEmail) {
      setError('Email do administrador é obrigatório');
      return false;
    }
    if (!adminSenha) {
      setError('Senha é obrigatória');
      return false;
    }
    if (adminSenha !== adminConfirmSenha) {
      setError('As senhas não coincidem');
      return false;
    }
    
    return true;
  };

  // Função para lidar com o envio do formulário
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Limpar mensagens anteriores
    setError('');
    setSuccess('');
    
    // Validar o formulário
    if (!validateForm()) {
      return;
    }
    
    // Preparar os dados para envio
    const registerData = {
      tenant: {
        nome: tenantNome,
        dominio: tenantDominio,
        plano: tenantPlano
      },
      empresa: {
        nome: empresaNome,
        cnpj: empresaCnpj
      },
      administrador: {
        nome: adminNome,
        email: adminEmail,
        senha: adminSenha
      }
    };
    
    try {
      setLoading(true);
      
      // Enviar os dados para a API
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(registerData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Erro ao registrar');
      }
      
      // Registro bem-sucedido
      setSuccess('Registro realizado com sucesso! Redirecionando para o login...');
      
      // Redirecionar para a página de login após 3 segundos
      setTimeout(() => {
        window.location.href = '/login';
      }, 3000);
      
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro ao processar seu registro');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <section className="register-section">
        <div className="container">
          <div className="register-content">
            <h1>Crie sua conta</h1>
            <p className="register-subtitle">
              Preencha o formulário abaixo para começar a usar o Finance AI
            </p>
            
            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}
            
            <form className="register-form" onSubmit={handleSubmit}>
              <div className="form-section">
                <h2>Informações do Tenant</h2>
                
                <div className="form-group">
                  <label htmlFor="tenantNome">Nome do Tenant *</label>
                  <input
                    type="text"
                    id="tenantNome"
                    value={tenantNome}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTenantNome(e.target.value)}
                    className="form-control"
                    placeholder="Ex: Minha Empresa"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="tenantDominio">Domínio (opcional)</label>
                  <input
                    type="text"
                    id="tenantDominio"
                    value={tenantDominio}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTenantDominio(e.target.value)}
                    className="form-control"
                    placeholder="Ex: minhaempresa"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="tenantPlano">Plano *</label>
                  <select
                    id="tenantPlano"
                    value={tenantPlano}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setTenantPlano(e.target.value)}
                    className="form-control"
                    required
                  >
                    <option value="básico">Básico</option>
                    <option value="profissional">Profissional</option>
                    <option value="empresarial">Empresarial</option>
                  </select>
                </div>
              </div>
              
              <div className="form-section">
                <h2>Informações da Empresa</h2>
                
                <div className="form-group">
                  <label htmlFor="empresaNome">Nome da Empresa *</label>
                  <input
                    type="text"
                    id="empresaNome"
                    value={empresaNome}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmpresaNome(e.target.value)}
                    className="form-control"
                    placeholder="Ex: Minha Empresa Ltda"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="empresaCnpj">CNPJ (opcional)</label>
                  <input
                    type="text"
                    id="empresaCnpj"
                    value={empresaCnpj}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmpresaCnpj(e.target.value)}
                    className="form-control"
                    placeholder="Ex: 00.000.000/0001-00"
                  />
                </div>
              </div>
              
              <div className="form-section">
                <h2>Informações do Administrador</h2>
                
                <div className="form-group">
                  <label htmlFor="adminNome">Nome *</label>
                  <input
                    type="text"
                    id="adminNome"
                    value={adminNome}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAdminNome(e.target.value)}
                    className="form-control"
                    placeholder="Ex: João Silva"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="adminEmail">Email *</label>
                  <input
                    type="email"
                    id="adminEmail"
                    value={adminEmail}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAdminEmail(e.target.value)}
                    className="form-control"
                    placeholder="Ex: joao@minhaempresa.com"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="adminSenha">Senha *</label>
                  <input
                    type="password"
                    id="adminSenha"
                    value={adminSenha}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAdminSenha(e.target.value)}
                    className="form-control"
                    placeholder="Sua senha"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="adminConfirmSenha">Confirmar Senha *</label>
                  <input
                    type="password"
                    id="adminConfirmSenha"
                    value={adminConfirmSenha}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAdminConfirmSenha(e.target.value)}
                    className="form-control"
                    placeholder="Confirme sua senha"
                    required
                  />
                </div>
              </div>
              
              <div className="form-actions">
                <button 
                  type="submit" 
                  className="btn btn-primary btn-lg"
                  disabled={loading}
                >
                  {loading ? 'Processando...' : 'Criar Conta'}
                </button>
                
                <p className="login-link">
                  Já tem uma conta? <a href="/login">Entrar</a>
                </p>
              </div>
            </form>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default RegisterPage;