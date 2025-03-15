import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { PerfilRepository } from '../repositories/perfilRepository';
import { ICriarPerfilDTO, IAtualizarPerfilDTO, IPerfil, IAtribuirPerfilDTO } from '../interfaces/perfil.interface';

/**
 * Serviço para gerenciamento de perfis
 * 
 * Este serviço fornece funcionalidades para gerenciamento de perfis
 * de usuários, incluindo criação, atualização e atribuição de perfis.
 */
@Injectable()
export class PerfilService {
  /**
   * Construtor do serviço de perfil
   * @param perfilRepository Repositório de perfil injetado
   */
  constructor(private readonly perfilRepository: PerfilRepository) {}

  /**
   * Cria um novo perfil
   * @param dados Dados para criação do perfil
   * @returns Promise com o perfil criado
   */
  async criar(dados: ICriarPerfilDTO): Promise<IPerfil> {
    // Verificar se já existe um perfil com o mesmo nome
    const perfilExistente = await this.perfilRepository.buscarPorNome(
      dados.nome,
      dados.tenantId,
      dados.empresaId
    );

    if (perfilExistente) {
      throw new Error(`Já existe um perfil com o nome '${dados.nome}'`);
    }

    // Criar o perfil com todos os campos obrigatórios
    return this.perfilRepository.create({
      id: crypto.randomUUID(), // Gera um UUID para o ID
      nome: dados.nome,
      descricao: dados.descricao,
      tenantId: dados.tenantId,
      empresaId: dados.empresaId,
      ativo: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }

  /**
   * Atualiza um perfil existente
   * @param id ID do perfil
   * @param dados Dados para atualização do perfil
   * @returns Promise com o perfil atualizado
   */
  async atualizar(id: string, dados: IAtualizarPerfilDTO): Promise<IPerfil> {
    // Verificar se o perfil existe
    const perfil = await this.perfilRepository.findById(id);
    if (!perfil) {
      throw new Error('Perfil não encontrado');
    }

    // Verificar se o nome já está em uso por outro perfil
    if (dados.nome && dados.nome !== perfil.nome) {
      const perfilExistente = await this.perfilRepository.buscarPorNome(
        dados.nome,
        perfil.tenantId,
        perfil.empresaId
      );

      if (perfilExistente && perfilExistente.id !== id) {
        throw new Error(`Já existe um perfil com o nome '${dados.nome}'`);
      }
    }

    // Atualizar o perfil
    return this.perfilRepository.update(id, dados);
  }

  /**
   * Busca um perfil pelo ID
   * @param id ID do perfil
   * @returns Promise com o perfil encontrado
   */
  async buscarPorId(id: string): Promise<IPerfil> {
    const perfil = await this.perfilRepository.findById(id);
    if (!perfil) {
      throw new Error('Perfil não encontrado');
    }
    return perfil;
  }

  /**
   * Lista todos os perfis de um tenant/empresa
   * @param tenantId ID do tenant
   * @param empresaId ID da empresa (opcional)
   * @returns Promise com array de perfis
   */
  async listar(tenantId: string, empresaId?: string): Promise<IPerfil[]> {
    // Buscar todos os perfis e filtrar manualmente
    const todosPerfis = await this.perfilRepository.findAll();
    
    // Filtrar pelo tenantId e empresaId (opcional)
    return todosPerfis.filter(perfil => {
      if (empresaId) {
        return perfil.tenantId === tenantId && perfil.empresaId === empresaId;
      }
      return perfil.tenantId === tenantId;
    });
  }

  /**
   * Ativa ou desativa um perfil
   * @param id ID do perfil
   * @param ativo Status de ativação
   * @returns Promise com o perfil atualizado
   */
  async alterarStatus(id: string, ativo: boolean): Promise<IPerfil> {
    // Verificar se o perfil existe
    const perfil = await this.perfilRepository.findById(id);
    if (!perfil) {
      throw new Error('Perfil não encontrado');
    }

    // Atualizar o status do perfil
    return this.perfilRepository.update(id, { ativo });
  }

  /**
   * Atribui um perfil a um usuário
   * @param dados Dados para atribuição de perfil
   * @returns Promise com a relação criada
   */
  async atribuirPerfilUsuario(dados: IAtribuirPerfilDTO): Promise<any> {
    // Verificar se o perfil existe
    const perfil = await this.perfilRepository.findById(dados.perfilId);
    if (!perfil) {
      throw new Error('Perfil não encontrado');
    }

    // Atribuir o perfil ao usuário
    return this.perfilRepository.atribuirPerfilUsuario(dados.perfilId, dados.usuarioId);
  }

  /**
   * Atribui um perfil a um usuário (método alternativo)
   * @param perfilId ID do perfil
   * @param usuarioId ID do usuário
   * @returns Promise com a relação criada
   */
  async atribuirPerfilAoUsuario(perfilId: string, usuarioId: string): Promise<any> {
    // Verificar se o perfil existe
    const perfil = await this.perfilRepository.findById(perfilId);
    if (!perfil) {
      throw new Error('Perfil não encontrado');
    }

    // Atribuir o perfil ao usuário
    return this.perfilRepository.atribuirPerfilUsuario(perfilId, usuarioId);
  }

  /**
   * Remove um perfil de um usuário
   * @param perfilId ID do perfil
   * @param usuarioId ID do usuário
   * @returns Promise void
   */
  async removerPerfilUsuario(perfilId: string, usuarioId: string): Promise<void> {
    await this.perfilRepository.removerPerfilUsuario(perfilId, usuarioId);
  }

  /**
   * Busca os perfis de um usuário
   * @param usuarioId ID do usuário
   * @returns Promise com array de perfis do usuário
   */
  async buscarPerfisUsuario(usuarioId: string): Promise<IPerfil[]> {
    return this.perfilRepository.buscarPerfisUsuario(usuarioId);
  }

  /**
   * Busca os usuários de um perfil
   * @param perfilId ID do perfil
   * @returns Promise com array de usuários do perfil
   */
  async buscarUsuariosPerfil(perfilId: string): Promise<any[]> {
    return this.perfilRepository.buscarUsuariosPerfil(perfilId);
  }

  /**
   * Adiciona uma permissão a um perfil
   * @param perfilId ID do perfil
   * @param permissaoId ID da permissão
   * @returns Promise com a relação criada
   */
  async adicionarPermissaoPerfil(perfilId: string, permissaoId: string): Promise<any> {
    return this.perfilRepository.adicionarPermissaoPerfil(perfilId, permissaoId);
  }

  /**
   * Remove uma permissão de um perfil
   * @param perfilId ID do perfil
   * @param permissaoId ID da permissão
   * @returns Promise void
   */
  async removerPermissaoPerfil(perfilId: string, permissaoId: string): Promise<void> {
    await this.perfilRepository.removerPermissaoPerfil(perfilId, permissaoId);
  }

  /**
   * Busca as permissões de um perfil
   * @param perfilId ID do perfil
   * @returns Promise com array de permissões do perfil
   */
  async buscarPermissoesPerfil(perfilId: string): Promise<any[]> {
    return this.perfilRepository.buscarPermissoesPerfil(perfilId);
  }

  /**
   * Lista os perfis de um usuário
   * @param usuarioId ID do usuário
   * @returns Promise com array de perfis do usuário
   */
  async listarPerfisPorUsuario(usuarioId: string): Promise<IPerfil[]> {
    // Implementação do método para listar perfis por usuário
    return this.perfilRepository.buscarPerfisUsuario(usuarioId);
  }

  /**
   * Lista as permissões de um perfil
   * @param perfilId ID do perfil
   * @returns Promise com array de permissões do perfil
   */
  async listarPermissoesPorPerfil(perfilId: string): Promise<any[]> {
    // Este método é um alias para buscarPermissoesPerfil para manter compatibilidade
    return this.buscarPermissoesPerfil(perfilId);
  }
}
