import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { RepositorioBase } from '../../../core/database/base/repositorioBase';

/**
 * Interface para o modelo de Permissão
 */
export interface Permissao {
  id: string;
  permitido: boolean;
  dataCriacao: Date;
  usuarioId?: string | null;
  empresaId: string;
  moduloId: string;
  submoduloId?: string | null;
  recursoId?: string | null;
  acaoId: string;
}

/**
 * Repositório para operações relacionadas a Permissões
 * 
 * Este repositório estende o RepositorioBase e fornece métodos
 * específicos para manipulação de permissões no banco de dados.
 */
@Injectable()
export class PermissaoRepository extends RepositorioBase<Permissao, string> {
  /**
   * Construtor do repositório de permissão
   * @param prisma Cliente Prisma injetado
   */
  constructor(prisma: PrismaClient) {
    super(prisma, 'permissao');
  }

  /**
   * Busca permissões de um usuário
   * @param usuarioId ID do usuário
   * @returns Promise com array de permissões do usuário
   */
  async buscarPermissoesUsuario(usuarioId: string): Promise<Permissao[]> {
    return this.prisma.permissao.findMany({
      where: { usuarioId },
      include: {
        modulo: true,
        submodulo: true,
        recurso: true,
        acao: true,
      },
    });
  }

  /**
   * Verifica se um usuário tem uma permissão específica
   * @param usuarioId ID do usuário
   * @param moduloId ID do módulo
   * @param submoduloId ID do submódulo (opcional)
   * @param recursoId ID do recurso (opcional)
   * @param acaoId ID da ação (opcional)
   * @param empresaId ID da empresa (opcional)
   * @returns Promise com boolean indicando se o usuário tem a permissão
   */
  async verificarPermissao(
    usuarioId: string,
    moduloId: string,
    submoduloId?: string,
    recursoId?: string,
    acaoId?: string,
    empresaId?: string,
  ): Promise<boolean> {
    const count = await this.prisma.permissao.count({
      where: {
        usuarioId,
        moduloId,
        ...(submoduloId && { submoduloId }),
        ...(recursoId && { recursoId }),
        ...(acaoId && { acaoId }),
        ...(empresaId && { empresaId }),
      },
    });
    
    return count > 0;
  }

  /**
   * Cria uma nova permissão
   * @param dados Dados da permissão
   * @returns Promise com a permissão criada
   */
  async criarPermissao(dados: {
    usuarioId: string;
    empresaId: string;
    moduloId: string;
    submoduloId?: string;
    recursoId?: string;
    acaoId?: string;
  }): Promise<Permissao> {
    return this.prisma.permissao.create({
      data: dados,
    });
  }

  /**
   * Mapeia os dados do banco para a entidade Permissao
   * @param data Dados do banco de dados
   * @returns Entidade Permissao
   */
  protected mapToEntity(data: any): Permissao {
    return {
      id: data.id,
      permitido: data.permitido || true,
      usuarioId: data.usuarioId,
      empresaId: data.empresaId,
      moduloId: data.moduloId,
      submoduloId: data.submoduloId,
      recursoId: data.recursoId,
      acaoId: data.acaoId,
      dataCriacao: data.dataCriacao,
    };
  }
}
