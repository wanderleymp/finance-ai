/**
 * Interface para o modelo de Empresa
 * 
 * Esta interface define a estrutura de dados para entidades de Empresa
 * no sistema, seguindo o padrão de nomenclatura com prefixo I.
 */
export interface IEmpresa {
  id: string;
  nome: string;
  cnpj?: string | null;
  ativa: boolean;
  tenantId: string;
  dataCriacao: Date;
  dataAtualizacao?: Date | null;
}
