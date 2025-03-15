import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../core/database/providers/prisma/prisma.service';
import { IPerfil, IPerfilRepository } from '../interfaces/perfil.interface';

/**
 * Repositório para gerenciamento de perfis
 * Implementa a interface IPerfilRepository
 */
@Injectable()
export class PerfilRepository implements IPerfilRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Cria um novo perfil
   * @param data Dados do perfil
   */
  async create(data: IPerfil): Promise<IPerfil> {
    const result = await this.prisma.perfil.create({
      data: {
        id: data.id,
        nome: data.nome,
        descricao: data.descricao,
        ativo: data.ativo,
        tenantId: data.tenantId,
        empresaId: data.empresaId,
        dataCriacao: data.createdAt || new Date(),
        dataAtualizacao: data.updatedAt || new Date()
      },
    });
    
    return this.mapToDomain(result);
  }

  /**
   * Busca um perfil pelo ID
   * @param id ID do perfil
   */
  async findById(id: string): Promise<IPerfil | null> {
    const perfil = await this.prisma.perfil.findUnique({
      where: { id },
    });
    
    return perfil ? this.mapToDomain(perfil) : null;
  }

  /**
   * Atualiza um perfil
   * @param id ID do perfil
   * @param data Dados para atualização
   */
  async update(id: string, data: Partial<IPerfil>): Promise<IPerfil> {
    const updateData: any = {};
    
    if (data.nome !== undefined) updateData.nome = data.nome;
    if (data.descricao !== undefined) updateData.descricao = data.descricao;
    if (data.ativo !== undefined) updateData.ativo = data.ativo;
    if (data.empresaId !== undefined) updateData.empresaId = data.empresaId;
    if (data.createdAt) updateData.dataCriacao = data.createdAt;
    if (data.updatedAt) updateData.dataAtualizacao = data.updatedAt;
    
    // Se não foi fornecida uma data de atualização, usa a data atual
    if (!data.updatedAt) {
      updateData.dataAtualizacao = new Date();
    }
    
    const result = await this.prisma.perfil.update({
      where: { id },
      data: updateData,
    });
    
    return this.mapToDomain(result);
  }

  /**
   * Retorna todos os perfis
   */
  async findAll(): Promise<IPerfil[]> {
    const perfis = await this.prisma.perfil.findMany();
    return perfis.map(perfil => this.mapToDomain(perfil));
  }

  /**
   * Busca um perfil pelo nome
   * @param nome Nome do perfil
   * @param tenantId ID do tenant
   * @param empresaId ID da empresa (opcional)
   */
  async buscarPorNome(nome: string, tenantId: string, empresaId?: string): Promise<IPerfil | null> {
    const filtro: any = {
      nome,
      tenantId,
    };

    if (empresaId) {
      filtro.empresaId = empresaId;
    }

    const perfil = await this.prisma.perfil.findFirst({
      where: filtro,
    });
    
    return perfil ? this.mapToDomain(perfil) : null;
  }

  /**
   * Atribui um perfil a um usuário
   * @param perfilId ID do perfil
   * @param usuarioId ID do usuário
   */
  async atribuirPerfilUsuario(perfilId: string, usuarioId: string): Promise<any> {
    return this.prisma.perfilUsuario.create({
      data: {
        perfilId,
        usuarioId,
      },
    });
  }

  /**
   * Remove um perfil de um usuário
   * @param perfilId ID do perfil
   * @param usuarioId ID do usuário
   */
  async removerPerfilUsuario(perfilId: string, usuarioId: string): Promise<void> {
    await this.prisma.perfilUsuario.deleteMany({
      where: {
        perfilId,
        usuarioId,
      },
    });
  }

  /**
   * Busca todos os perfis de um usuário
   * @param usuarioId ID do usuário
   */
  async buscarPerfisUsuario(usuarioId: string): Promise<IPerfil[]> {
    const perfilUsuarios = await this.prisma.perfilUsuario.findMany({
      where: {
        usuarioId,
      },
      include: {
        perfil: true,
      },
    });

    return perfilUsuarios.map(pu => this.mapToDomain(pu.perfil));
  }

  /**
   * Busca todos os usuários de um perfil
   * @param perfilId ID do perfil
   */
  async buscarUsuariosPerfil(perfilId: string): Promise<any[]> {
    const perfilUsuarios = await this.prisma.perfilUsuario.findMany({
      where: {
        perfilId,
      },
      include: {
        usuario: true,
      },
    });

    return perfilUsuarios.map(pu => pu.usuario);
  }

  /**
   * Busca todas as permissões de um perfil
   * @param perfilId ID do perfil
   */
  async buscarPermissoesPerfil(perfilId: string): Promise<any[]> {
    return this.prisma.perfilPermissao.findMany({
      where: {
        perfilId,
      },
      include: {
        permissao: true,
      },
    });
  }

  /**
   * Adiciona uma permissão a um perfil
   * @param perfilId ID do perfil
   * @param permissaoId ID da permissão
   */
  async adicionarPermissaoPerfil(perfilId: string, permissaoId: string): Promise<any> {
    return this.prisma.perfilPermissao.create({
      data: {
        perfilId,
        permissaoId,
      },
    });
  }

  /**
   * Remove uma permissão de um perfil
   * @param perfilId ID do perfil
   * @param permissaoId ID da permissão
   */
  async removerPermissaoPerfil(perfilId: string, permissaoId: string): Promise<void> {
    await this.prisma.perfilPermissao.deleteMany({
      where: {
        perfilId,
        permissaoId,
      },
    });
  }

  /**
   * Mapeia os dados do banco para o domínio da aplicação
   * @param data Dados do banco
   */
  private mapToDomain(data: any): IPerfil {
    return {
      id: data.id,
      nome: data.nome,
      descricao: data.descricao || '',
      ativo: data.ativo,
      tenantId: data.tenantId,
      empresaId: data.empresaId,
      createdAt: data.dataCriacao,
      updatedAt: data.dataAtualizacao || data.dataCriacao,
    };
  }
}
