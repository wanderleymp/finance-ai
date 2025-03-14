/**
 * Interface para o modelo de Usuário
 */
export interface Usuario {
  id: string;
  nome: string;
  email: string;
  senha: string;
  tenantId?: string | null;
  empresaId?: string | null;
  ativo: boolean;
  dataCriacao: Date;
  dataAtualizacao?: Date | null;
}
