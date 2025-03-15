/**
 * Interface para representar um perfil de usuário
 */
export interface IPerfil {
  id: string;
  nome: string;
  descricao: string;
  ativo: boolean;
  tenantId: string;
  empresaId?: string;
  createdAt: Date;
  updatedAt: Date;
}
