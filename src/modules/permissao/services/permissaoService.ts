import { Injectable } from '@nestjs/common';
import { IPermissaoService } from '../interfaces/IPermissaoService';
import { PermissaoRepository } from '../repositories/permissaoRepository';

/**
 * Serviço de permissões
 * 
 * Este serviço implementa a interface IPermissaoService e fornece
 * funcionalidades para gerenciamento de permissões de usuários.
 */
@Injectable()
export class PermissaoService implements IPermissaoService {
  /**
   * Construtor do serviço de permissões
   * @param permissaoRepository Repositório de permissão injetado
   */
  constructor(private readonly permissaoRepository: PermissaoRepository) {}

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
  async verificarPermissao(
    usuarioId: string,
    moduloId: string,
    submduloId?: string,
    recursoId?: string,
    acaoId?: string,
    empresaId?: string,
  ): Promise<boolean> {
    // Verificar permissão específica
    const temPermissaoEspecifica = await this.permissaoRepository.verificarPermissao(
      usuarioId,
      moduloId,
      submduloId,
      recursoId,
      acaoId,
      empresaId,
    );

    if (temPermissaoEspecifica) {
      return true;
    }

    // Verificar permissão no nível do módulo
    if (submduloId || recursoId) {
      const temPermissaoModulo = await this.permissaoRepository.verificarPermissao(
        usuarioId,
        moduloId,
        undefined,
        undefined,
        acaoId,
        empresaId,
      );

      if (temPermissaoModulo) {
        return true;
      }
    }

    // Verificar permissão no nível do submódulo
    if (recursoId && submduloId) {
      const temPermissaoSubmodulo = await this.permissaoRepository.verificarPermissao(
        usuarioId,
        moduloId,
        submduloId,
        undefined,
        acaoId,
        empresaId,
      );

      if (temPermissaoSubmodulo) {
        return true;
      }
    }

    return false;
  }

  /**
   * Obtém todas as permissões de um usuário
   * @param usuarioId ID do usuário
   * @returns Promise com array de permissões do usuário
   */
  async obterPermissoesUsuario(usuarioId: string): Promise<any[]> {
    return this.permissaoRepository.buscarPermissoesUsuario(usuarioId);
  }

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
  async concederPermissao(
    usuarioId: string,
    empresaId: string,
    moduloId: string,
    submduloId?: string,
    recursoId?: string,
    acaoId?: string,
  ): Promise<any> {
    // Verificar se já existe a permissão
    const permissaoExistente = await this.permissaoRepository.verificarPermissao(
      usuarioId,
      moduloId,
      submduloId,
      recursoId,
      acaoId,
    );

    if (permissaoExistente) {
      throw new Error('Permissão já concedida');
    }

    // Criar nova permissão
    return this.permissaoRepository.criarPermissao({
      usuarioId,
      empresaId,
      moduloId,
      submoduloId: submduloId,
      recursoId,
      acaoId,
    });
  }

  /**
   * Revoga uma permissão de um usuário
   * @param permissaoId ID da permissão
   * @returns Promise void
   */
  async revogarPermissao(permissaoId: string): Promise<void> {
    await this.permissaoRepository.delete(permissaoId);
  }
}
