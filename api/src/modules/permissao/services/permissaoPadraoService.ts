import { Injectable } from '@nestjs/common';
import { PermissaoRepository } from '../repositories/permissaoRepository';
import { PermissaoService } from './permissaoService';

/**
 * Interface para definição de permissão padrão
 */
interface IPermissaoPadrao {
  moduloId: string;
  submoduloId?: string;
  recursoId?: string;
  acaoId: string;
}

/**
 * Serviço para gerenciamento de permissões padrão
 * 
 * Este serviço é responsável por criar as permissões padrão
 * para novos tenants, empresas e usuários.
 */
@Injectable()
export class PermissaoPadraoService {
  /**
   * Lista de permissões padrão para administradores
   */
  private permissoesAdministrador: IPermissaoPadrao[] = [
    // Permissões de administração
    { moduloId: 'admin', acaoId: 'visualizar' },
    { moduloId: 'admin', acaoId: 'criar' },
    { moduloId: 'admin', acaoId: 'editar' },
    { moduloId: 'admin', acaoId: 'excluir' },
    
    // Permissões de usuários
    { moduloId: 'admin', submoduloId: 'usuarios', acaoId: 'visualizar' },
    { moduloId: 'admin', submoduloId: 'usuarios', acaoId: 'criar' },
    { moduloId: 'admin', submoduloId: 'usuarios', acaoId: 'editar' },
    { moduloId: 'admin', submoduloId: 'usuarios', acaoId: 'excluir' },
    
    // Permissões de empresas
    { moduloId: 'admin', submoduloId: 'empresas', acaoId: 'visualizar' },
    { moduloId: 'admin', submoduloId: 'empresas', acaoId: 'criar' },
    { moduloId: 'admin', submoduloId: 'empresas', acaoId: 'editar' },
    { moduloId: 'admin', submoduloId: 'empresas', acaoId: 'excluir' },
    
    // Permissões de permissões
    { moduloId: 'admin', submoduloId: 'permissoes', acaoId: 'visualizar' },
    { moduloId: 'admin', submoduloId: 'permissoes', acaoId: 'conceder' },
    { moduloId: 'admin', submoduloId: 'permissoes', acaoId: 'revogar' },
  ];

  /**
   * Lista de permissões padrão para usuários comuns
   */
  private permissoesUsuarioComum: IPermissaoPadrao[] = [
    // Permissões básicas
    { moduloId: 'perfil', acaoId: 'visualizar' },
    { moduloId: 'perfil', acaoId: 'editar' },
    { moduloId: 'dashboard', acaoId: 'visualizar' },
  ];

  /**
   * Construtor do serviço de permissões padrão
   * @param permissaoRepository Repositório de permissão injetado
   */
  constructor(
    private readonly permissaoRepository: PermissaoRepository,
    private readonly permissaoService: PermissaoService
  ) {}

  /**
   * Cria as permissões padrão para um administrador
   * @param usuarioId ID do usuário administrador
   * @param empresaId ID da empresa
   * @returns Promise void
   */
  async criarPermissoesAdministrador(usuarioId: string, empresaId: string): Promise<void> {
    for (const permissao of this.permissoesAdministrador) {
      try {
        await this.permissaoRepository.criarPermissao({
          usuarioId,
          empresaId,
          moduloId: permissao.moduloId,
          submoduloId: permissao.submoduloId,
          recursoId: permissao.recursoId,
          acaoId: permissao.acaoId,
        });
      } catch (error) {
        // Tratamento seguro de erro com verificação de tipo
        const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
        console.error(`Erro ao criar permissão padrão de administrador: ${errorMessage}`);
      }
    }
  }

  /**
   * Cria as permissões padrão para um usuário comum
   * @param usuarioId ID do usuário
   * @param empresaId ID da empresa
   * @returns Promise void
   */
  async criarPermissoesUsuarioComum(usuarioId: string, empresaId: string): Promise<void> {
    for (const permissao of this.permissoesUsuarioComum) {
      try {
        await this.permissaoRepository.criarPermissao({
          usuarioId,
          empresaId,
          moduloId: permissao.moduloId,
          submoduloId: permissao.submoduloId,
          recursoId: permissao.recursoId,
          acaoId: permissao.acaoId,
        });
      } catch (error) {
        // Tratamento seguro de erro com verificação de tipo
        const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
        console.error(`Erro ao criar permissão padrão de usuário comum: ${errorMessage}`);
      }
    }
  }

  /**
   * Cria as permissões padrão para um novo tenant
   * @param usuarioAdminId ID do usuário administrador do tenant
   * @param empresaId ID da empresa principal do tenant
   * @returns Promise void
   */
  async criarPermissoesPadraoTenant(usuarioAdminId: string, empresaId: string): Promise<void> {
    // Criar permissões de administrador para o usuário admin
    await this.criarPermissoesAdministrador(usuarioAdminId, empresaId);
  }

  /**
   * Atribui as permissões padrão ao usuário
   * @param usuarioId ID do usuário
   * @param empresaId ID da empresa
   * @returns Promise<void>
   */
  async atribuirPermissoesPadrao(usuarioId: string, empresaId: string): Promise<void> {
    try {
      // Atribuir permissões padrão usando o serviço de permissão
      await this.permissaoService.concederPermissao(
        usuarioId,
        empresaId,
        'default',  // moduloId
        undefined,  // submduloId
        undefined,  // recursoId
        'visualizar' // acaoId
      );
    } catch (error) {
      // Tratamento seguro de erro com verificação de tipo
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      console.error(`Erro ao atribuir permissões padrão: ${errorMessage}`);
      // Não propaga o erro para cima, apenas registra no console
    }
  }
}
