import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { GrupoPermissaoRepository } from '../repositories/grupoPermissaoRepository';
import { PermissaoService } from './permissaoService';
import { IGrupoPermissao, ICriarGrupoPermissaoDTO, IAtualizarGrupoPermissaoDTO } from '../interfaces/IGrupoPermissao';

/**
 * Serviço para gerenciamento de grupos de permissões
 */
@Injectable()
export class GrupoPermissaoService {
  constructor(
    private readonly grupoPermissaoRepository: GrupoPermissaoRepository,
    @Inject(forwardRef(() => PermissaoService))
    private readonly permissaoService: PermissaoService
  ) {}

  /**
   * Cria um novo grupo de permissões
   * @param dados Dados para criação do grupo
   * @returns Grupo de permissões criado
   */
  async criar(dados: ICriarGrupoPermissaoDTO): Promise<IGrupoPermissao> {
    return this.grupoPermissaoRepository.criar(dados);
  }

  /**
   * Busca um grupo de permissões pelo ID
   * @param id ID do grupo
   * @returns Grupo de permissões
   */
  async buscarPorId(id: string): Promise<IGrupoPermissao> {
    const grupo = await this.grupoPermissaoRepository.buscarPorId(id);
    if (!grupo) {
      throw new Error('Grupo de permissões não encontrado');
    }
    return grupo;
  }

  /**
   * Lista grupos de permissões por tenant
   * @param tenantId ID do tenant
   * @param empresaId ID da empresa (opcional)
   * @returns Lista de grupos de permissões
   */
  async listarPorTenant(tenantId: string, empresaId?: string): Promise<IGrupoPermissao[]> {
    return this.grupoPermissaoRepository.listarPorTenant(tenantId, empresaId);
  }

  /**
   * Atualiza um grupo de permissões
   * @param id ID do grupo
   * @param dados Dados para atualização
   * @returns Grupo atualizado
   */
  async atualizar(id: string, dados: IAtualizarGrupoPermissaoDTO): Promise<IGrupoPermissao> {
    // Verificar se o grupo existe
    await this.buscarPorId(id);
    
    return this.grupoPermissaoRepository.atualizar(id, dados);
  }

  /**
   * Exclui um grupo de permissões
   * @param id ID do grupo
   */
  async excluir(id: string): Promise<void> {
    // Verificar se o grupo existe
    await this.buscarPorId(id);
    
    await this.grupoPermissaoRepository.excluir(id);
  }

  /**
   * Atribui um grupo de permissões a um usuário
   * @param grupoId ID do grupo
   * @param usuarioId ID do usuário
   */
  async atribuirAoUsuario(grupoId: string, usuarioId: string): Promise<void> {
    // Verificar se o grupo existe
    await this.buscarPorId(grupoId);
    
    await this.grupoPermissaoRepository.atribuirAoUsuario(grupoId, usuarioId);
  }

  /**
   * Remove um grupo de permissões de um usuário
   * @param grupoId ID do grupo
   * @param usuarioId ID do usuário
   */
  async removerDoUsuario(grupoId: string, usuarioId: string): Promise<void> {
    // Verificar se o grupo existe
    await this.buscarPorId(grupoId);
    
    await this.grupoPermissaoRepository.removerDoUsuario(grupoId, usuarioId);
  }

  /**
   * Lista grupos de permissões de um usuário
   * @param usuarioId ID do usuário
   * @returns Lista de grupos de permissões
   */
  async listarPorUsuario(usuarioId: string): Promise<IGrupoPermissao[]> {
    return this.grupoPermissaoRepository.listarPorUsuario(usuarioId);
  }

  /**
   * Verifica se um usuário tem permissão através de seus grupos
   * @param usuarioId ID do usuário
   * @param moduloId ID do módulo
   * @param submduloId ID do submódulo (opcional)
   * @param recursoId ID do recurso (opcional)
   * @param acaoId ID da ação
   * @param empresaId ID da empresa (opcional)
   * @returns Boolean indicando se o usuário tem permissão
   */
  async verificarPermissaoPorGrupo(
    usuarioId: string,
    moduloId: string,
    submduloId?: string,
    recursoId?: string,
    acaoId?: string,
    empresaId?: string,
  ): Promise<boolean> {
    // Buscar grupos do usuário
    const grupos = await this.listarPorUsuario(usuarioId);
    
    // Se não tiver grupos, não tem permissão
    if (grupos.length === 0) {
      return false;
    }
    
    // Verificar permissões em cada grupo
    for (const grupo of grupos) {
      // Verificar cada permissão do grupo
      for (const permissaoId of grupo.permissoes) {
        // Buscar detalhes da permissão
        const permissao = await this.permissaoService.buscarPermissaoPorId(permissaoId);
        
        // Verificar se a permissão corresponde aos critérios
        if (
          permissao.moduloId === moduloId &&
          (!submduloId || permissao.submoduloId === submduloId) &&
          (!recursoId || permissao.recursoId === recursoId) &&
          (!acaoId || permissao.acaoId === acaoId) &&
          (!empresaId || permissao.empresaId === empresaId)
        ) {
          return true;
        }
      }
    }
    
    return false;
  }
}
