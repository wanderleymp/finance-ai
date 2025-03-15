import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { RepositorioBase } from '../../../core/database/base/repositorioBase';
import { Usuario } from '../interfaces/usuario.interface';

/**
 * Repositório para operações relacionadas a Usuários
 * 
 * Este repositório estende o RepositorioBase e fornece métodos
 * específicos para manipulação de usuários no banco de dados.
 */
@Injectable()
export class UsuarioRepository extends RepositorioBase<Usuario, string> {
  /**
   * Construtor do repositório de usuário
   * @param prisma Cliente Prisma injetado
   */
  constructor(prisma: PrismaClient) {
    super(prisma, 'usuario');
  }

  /**
   * Busca um usuário pelo email
   * @param email Email do usuário
   * @returns Promise com o usuário encontrado ou null
   */
  async buscarPorEmail(email: string): Promise<Usuario | null> {
    return this.prisma.usuario.findUnique({
      where: { email },
    });
  }

  /**
   * Busca usuários por empresa
   * @param empresaId ID da empresa
   * @returns Promise com array de usuários da empresa
   */
  async buscarPorEmpresa(empresaId: string): Promise<Usuario[]> {
    return this.prisma.usuario.findMany({
      where: {
        empresas: {
          some: {
            empresaId,
          },
        },
      },
    });
  }

  /**
   * Verifica se um usuário tem acesso a uma empresa específica
   * @param usuarioId ID do usuário
   * @param empresaId ID da empresa
   * @returns Promise com boolean indicando se o usuário tem acesso
   */
  async verificarAcessoEmpresa(usuarioId: string, empresaId: string): Promise<boolean> {
    const count = await this.prisma.usuarioEmpresa.count({
      where: {
        usuarioId,
        empresaId,
      },
    });
    
    return count > 0;
  }

  /**
   * Mapeia os dados do banco para a entidade Usuario
   * @param data Dados do banco de dados
   * @returns Entidade Usuario
   */
  protected mapToEntity(data: any): Usuario {
    return {
      id: data.id,
      nome: data.nome,
      email: data.email,
      senha: data.senha,
      tenantId: data.tenantId,
      ativo: data.ativo,
      dataCriacao: data.dataCriacao,
      dataAtualizacao: data.dataAtualizacao,
    };
  }
}
