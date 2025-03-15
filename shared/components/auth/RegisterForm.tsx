import React, { useState } from 'react';
import { RegisterDto } from '../../interfaces/RegisterDto';
import './RegisterForm.styles.css';

const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState<RegisterDto>({
    tenant: { nome: '', dominio: '', plano: '' },
    empresa: { nome: '', cnpj: '' },
    administrador: { nome: '', email: '', senha: '' },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Lógica para enviar dados para a API
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Registro de Tenant</h2>
      <label>
        Nome do Tenant:
        <input type="text" name="tenant.nome" value={formData.tenant.nome} onChange={handleChange} required />
      </label>
      <label>
        Domínio:
        <input type="text" name="tenant.dominio" value={formData.tenant.dominio} onChange={handleChange} />
      </label>
      <label>
        Plano:
        <input type="text" name="tenant.plano" value={formData.tenant.plano} onChange={handleChange} required />
      </label>
      <label>
        Nome da Empresa:
        <input type="text" name="empresa.nome" value={formData.empresa.nome} onChange={handleChange} required />
      </label>
      <label>
        CNPJ:
        <input type="text" name="empresa.cnpj" value={formData.empresa.cnpj} onChange={handleChange} />
      </label>
      <label>
        Nome do Administrador:
        <input type="text" name="administrador.nome" value={formData.administrador.nome} onChange={handleChange} required />
      </label>
      <label>
        Email:
        <input type="email" name="administrador.email" value={formData.administrador.email} onChange={handleChange} required />
      </label>
      <label>
        Senha:
        <input type="password" name="administrador.senha" value={formData.administrador.senha} onChange={handleChange} required />
      </label>
      <button type="submit">Registrar</button>
    </form>
  );
};

export default RegisterForm;
