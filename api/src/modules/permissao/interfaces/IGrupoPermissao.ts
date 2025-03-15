/**
 * Interface para grupo de permissões
 * 
 * Define a estrutura de um grupo de permissões que pode ser
 * atribuído a múltiplos usuários.
 */
export interface IGrupoPermissao {
  id: string;
  nome: string;
  descricao: string;
  empresaId: string;
  tenantId: string;
  permissoes: string[]; // IDs das permissões associadas
  dataCriacao: Date;
  dataAtualizacao: Date | null;
}

/**
 * Interface para criação de grupo de permissões
 */
export interface ICriarGrupoPermissaoDTO {
  nome: string;
  descricao: string;
  empresaId: string;
  tenantId: string;
  permissoes?: string[]; // IDs das permissões a serem associadas
}

/**
 * Interface para atualização de grupo de permissões
 */
export interface IAtualizarGrupoPermissaoDTO {
  nome?: string;
  descricao?: string;
  permissoes?: string[]; // IDs das permissões a serem associadas
}
