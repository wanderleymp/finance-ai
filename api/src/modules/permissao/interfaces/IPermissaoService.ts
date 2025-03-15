/**
 * Interface para o serviço de permissões
 * 
 * Define os métodos necessários para gerenciamento de permissões
 * de usuários no sistema.
 */
export interface IPermissaoService {
  /**
   * Verifica se um usuário tem permissão para uma ação específica
   * @param usuarioId ID do usuário
   * @param moduloId ID do módulo
   * @param submduloId ID do submódulo (opcional)
   * @param recursoId ID do recurso (opcional)
   * @param acaoId ID da ação
   * @param empresaId ID da empresa (opcional)
   * @returns Promise com boolean indicando se o usuário tem permissão
   */
  verificarPermissao(
    usuarioId: string,
    moduloId: string,
    submduloId?: string,
    recursoId?: string,
    acaoId?: string,
    empresaId?: string,
  ): Promise<boolean>;
  
  /**
   * Obtém todas as permissões de um usuário
   * @param usuarioId ID do usuário
   * @returns Promise com array de permissões do usuário
   */
  obterPermissoesUsuario(usuarioId: string): Promise<any[]>;
  
  /**
   * Concede uma permissão a um usuário
   * @param usuarioId ID do usuário
   * @param empresaId ID da empresa
   * @param moduloId ID do módulo
   * @param submduloId ID do submódulo (opcional)
   * @param recursoId ID do recurso (opcional)
   * @param acaoId ID da ação
   * @returns Promise com a permissão concedida
   */
  concederPermissao(
    usuarioId: string,
    empresaId: string,
    moduloId: string,
    submduloId?: string,
    recursoId?: string,
    acaoId?: string,
  ): Promise<any>;
  
  /**
   * Revoga uma permissão de um usuário
   * @param permissaoId ID da permissão
   * @returns Promise void
   */
  revogarPermissao(permissaoId: string): Promise<void>;
}
