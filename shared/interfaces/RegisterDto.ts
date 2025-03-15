export interface RegisterDto {
  tenant: {
    nome: string;
    dominio?: string; // Opcional, caso não utilize subdomínio
    plano: string;
  };
  empresa: {
    nome: string;
    cnpj?: string; // Opcional
  };
  administrador: {
    nome: string;
    email: string;
    senha: string;
  };
}
