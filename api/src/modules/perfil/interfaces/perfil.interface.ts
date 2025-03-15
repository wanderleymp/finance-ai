/**
 * Interface para representar um perfil de usuário
 */
export interface IPerfil {
  id: string;
  nome: string;
  descricao: string;
  tenantId: string;
  empresaId?: string;
  ativo: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Interface para o repositório de perfis
 */
export interface IPerfilRepository {
  create(data: IPerfil): Promise<IPerfil>;
  findById(id: string): Promise<IPerfil | null>;
  update(id: string, data: Partial<IPerfil>): Promise<IPerfil>;
  findAll(): Promise<IPerfil[]>;
  buscarPorNome(nome: string, tenantId: string, empresaId?: string): Promise<IPerfil | null>;
  atribuirPerfilUsuario(perfilId: string, usuarioId: string): Promise<any>;
  removerPerfilUsuario(perfilId: string, usuarioId: string): Promise<void>;
  buscarPerfisUsuario(usuarioId: string): Promise<IPerfil[]>;
  buscarUsuariosPerfil(perfilId: string): Promise<any[]>;
  buscarPermissoesPerfil(perfilId: string): Promise<any[]>;
  adicionarPermissaoPerfil(perfilId: string, permissaoId: string): Promise<any>;
  removerPermissaoPerfil(perfilId: string, permissaoId: string): Promise<void>;
}

/**
 * Interface para criação de perfil
 */
export interface ICriarPerfilDTO {
  nome: string;
  descricao: string;
  tenantId: string;
  empresaId?: string;
}

/**
 * Interface para atualização de perfil
 */
export interface IAtualizarPerfilDTO {
  nome?: string;
  descricao?: string;
  ativo?: boolean;
}

/**
 * Interface para atribuição de perfil a usuário
 */
export interface IAtribuirPerfilDTO {
  perfilId: string;
  usuarioId: string;
}
