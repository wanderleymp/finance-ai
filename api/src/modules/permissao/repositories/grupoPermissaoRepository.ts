import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../core/database/providers/prisma/prisma.service';
import { IGrupoPermissao, ICriarGrupoPermissaoDTO, IAtualizarGrupoPermissaoDTO } from '../interfaces/IGrupoPermissao';
import { Prisma } from '@prisma/client';

/**
 * Repositório para gerenciamento de grupos de permissões
 */
@Injectable()
export class GrupoPermissaoRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Cria um novo grupo de permissões
   * @param dados Dados para criação do grupo
   * @returns Grupo de permissões criado
   */
  async criar(dados: ICriarGrupoPermissaoDTO): Promise<IGrupoPermissao> {
    try {
      // Verificação para evitar acesso a propriedades de objetos indefinidos
      if (!dados.permissoes || dados.permissoes.length === 0) {
        throw new Error('Permissões não podem ser indefinidas ou vazias');
      }
      const grupo = await this.prisma.grupoPermissao.create({
        data: {
          nome: dados.nome,
          descricao: dados.descricao,
          empresaId: dados.empresaId,
          tenantId: dados.tenantId,
          permissoesGrupo: {
            create: dados.permissoes.map(permissaoId => ({ permissaoId }))
          }
        },
        include: {
          permissoesGrupo: true
        }
      });
  
      // Atualizando o retorno do método criar para incluir dataCriacao e dataAtualizacao:
      const permissoes = grupo.permissoesGrupo && Array.isArray(grupo.permissoesGrupo)
        ? grupo.permissoesGrupo.map(p => p.permissaoId)
        : [];
  
      return {
        id: grupo.id,
        nome: grupo.nome,
        descricao: grupo.descricao,
        empresaId: grupo.empresaId,
        tenantId: grupo.tenantId,
        permissoes: permissoes,
        dataCriacao: grupo.dataCriacao,
        dataAtualizacao: grupo.dataAtualizacao
      };
    } catch (error) {
      console.error('Erro ao criar grupo de permissões:', error);
      throw new Error('Erro ao criar grupo de permissões');
    }
  }

  /**
   * Busca um grupo de permissões pelo ID
   * @param id ID do grupo
   * @returns Grupo de permissões
   */
  async buscarPorId(id: string): Promise<IGrupoPermissao | null> {
    try {
      const grupo = await this.prisma.grupoPermissao.findUnique({
        where: { id },
        include: { permissoesGrupo: true },
      });

      if (!grupo) {
        return null;
      }

      // Garantindo que as permissões sejam extraídas corretamente
      const permissoes = grupo.permissoesGrupo && Array.isArray(grupo.permissoesGrupo)
        ? grupo.permissoesGrupo.map(p => p.permissaoId)
        : [];

      return {
        id: grupo.id,
        nome: grupo.nome,
        descricao: grupo.descricao,
        empresaId: grupo.empresaId,
        tenantId: grupo.tenantId,
        permissoes: permissoes,
        dataCriacao: grupo.dataCriacao,
        dataAtualizacao: grupo.dataAtualizacao
      };
    } catch (error) {
      console.error('Erro ao buscar grupo de permissões:', error);
      throw new Error('Erro ao buscar grupo de permissões');
    }
  }

  /**
   * Lista grupos de permissões por tenant
   * @param tenantId ID do tenant
   * @param empresaId ID da empresa
   * @returns Lista de grupos de permissões
   */
  async listarPorTenant(tenantId: string, empresaId?: string): Promise<IGrupoPermissao[]> {
    try {
      const grupos = await this.prisma.grupoPermissao.findMany({
        where: { 
          tenantId,
          ...(empresaId ? { empresaId } : {})
        },
        include: {
          permissoesGrupo: true
        }
      });

      // Formatação correta da resposta
      return grupos.map(grupo => {
        const permissoes = grupo.permissoesGrupo && Array.isArray(grupo.permissoesGrupo)
          ? grupo.permissoesGrupo.map(p => p.permissaoId)
          : [];

        return {
          ...grupo,
          permissoes: permissoes
        };
      });
    } catch (error) {
      console.error('Erro ao listar grupos de permissões:', error);
      return [];
    }
  }

  /**
   * Atualiza um grupo de permissões
   * @param id ID do grupo
   * @param dados Dados para atualização
   * @returns Grupo atualizado
   */
  async atualizar(id: string, dados: IAtualizarGrupoPermissaoDTO): Promise<IGrupoPermissao> {
    const { permissoes, ...grupoData } = dados;
    
    try {
      const grupoAtualizado = await this.prisma.$transaction(async (prisma: any) => {
        const grupo = await prisma.grupoPermissao.update({
          where: { id },
          data: grupoData,
          include: { permissoesGrupo: true }
        });

        if (permissoes && permissoes.length >= 0) {
          await prisma.permissaoGrupo.deleteMany({
            where: { grupoPermissaoId: id }
          });
          
          if (permissoes.length > 0) {
            await prisma.permissaoGrupo.createMany({
              data: permissoes.map(permissaoId => ({
                grupoPermissaoId: id,
                permissaoId
              }))
            });
          }
          
          return prisma.grupoPermissao.findUnique({
            where: { id },
            include: { permissoesGrupo: true }
          });
        }
        
        return grupo;
      });

      if (!grupoAtualizado) {
        throw new Error('Grupo não encontrado');
      }

      const permissoesAtualizadas = grupoAtualizado.permissoesGrupo && 
        Array.isArray(grupoAtualizado.permissoesGrupo)
        ? grupoAtualizado.permissoesGrupo.map(p => p.permissaoId)
        : [];
      
      return {
        ...grupoAtualizado,
        permissoes: permissoesAtualizadas
      };
    } catch (error) {
      console.error('Erro ao atualizar grupo de permissões:', error);
      throw new Error('Erro ao atualizar grupo de permissões');
    }
  }

  /**
   * Exclui um grupo de permissões
   * @param id ID do grupo
   */
  async excluir(id: string): Promise<void> {
    try {
      await this.prisma.$transaction(async (prisma: any) => {
        await prisma.permissaoGrupo.deleteMany({
          where: { grupoPermissaoId: id }
        });
        
        await prisma.usuarioGrupoPermissao.deleteMany({
          where: { grupoPermissaoId: id }
        });
        
        await prisma.grupoPermissao.delete({
          where: { id }
        });
      });
    } catch (error) {
      console.error('Erro ao excluir grupo de permissões:', error);
      throw new Error('Erro ao excluir grupo de permissões');
    }
  }

  /**
   * Atribui um grupo de permissões a um usuário
   * @param grupoId ID do grupo
   * @param usuarioId ID do usuário
   */
  async atribuirAoUsuario(grupoId: string, usuarioId: string): Promise<void> {
    try {
      await this.prisma.usuarioGrupoPermissao.create({
        data: {
          grupoPermissaoId: grupoId,
          usuarioId
        }
      });
    } catch (error) {
      console.error('Erro ao atribuir grupo de permissões ao usuário:', error);
      throw new Error('Erro ao atribuir grupo de permissões ao usuário');
    }
  }

  /**
   * Remove um grupo de permissões de um usuário
   * @param grupoId ID do grupo
   * @param usuarioId ID do usuário
   */
  async removerDoUsuario(grupoId: string, usuarioId: string): Promise<void> {
    try {
      await this.prisma.usuarioGrupoPermissao.deleteMany({
        where: {
          grupoPermissaoId: grupoId,
          usuarioId
        }
      });
    } catch (error) {
      console.error('Erro ao remover grupo de permissões do usuário:', error);
      throw new Error('Erro ao remover grupo de permissões do usuário');
    }
  }

  /**
   * Lista grupos de permissões de um usuário
   * @param usuarioId ID do usuário
   * @returns Lista de grupos de permissões
   */
  async listarPorUsuario(usuarioId: string): Promise<IGrupoPermissao[]> {
    try {
      const usuarioGrupos = await this.prisma.usuarioGrupoPermissao.findMany({
        where: { usuarioId },
        include: {
          grupoPermissao: {
            include: {
              permissoesGrupo: true
            }
          }
        }
      });

      // Formatar resposta
      return usuarioGrupos.map(ug => {
        // Verificando se grupoPermissao e permissoesGrupo existem antes de acessar o método map
        if (!ug.grupoPermissao) {
          return null; // Retorna null para filtrar depois
        }
        
        const permissoes = ug.grupoPermissao.permissoesGrupo && Array.isArray(ug.grupoPermissao.permissoesGrupo)
          ? ug.grupoPermissao.permissoesGrupo.map(p => p.permissaoId)
          : [];
          
        return {
          ...ug.grupoPermissao,
          permissoes: permissoes
        };
      }).filter(Boolean); // Remove os itens null
    } catch (error) {
      console.error('Erro ao listar grupos de permissões do usuário:', error);
      return [];
    }
  }
}
