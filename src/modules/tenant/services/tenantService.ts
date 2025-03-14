import { Injectable } from '@nestjs/common';
import { TenantRepository } from '../repositories/tenantRepository';
import { PermissaoPadraoService } from '../../permissao/services/permissaoPadraoService';

/**
 * Interface para o modelo de Tenant
 */
export interface Tenant {
  id: string;
  nome: string;
  dominio?: string | null;
  ativo: boolean;
  dataCriacao: Date;
  dataAtualizacao?: Date | null;
}

/**
 * Interface para criação de tenant
 */
interface ICriarTenantDTO {
  nome: string;
  dominio?: string;
  usuarioAdminId?: string;
  empresaId?: string;
}

/**
 * Serviço para gerenciamento de tenants
 * 
 * Este serviço encapsula a lógica de negócio relacionada
 * aos tenants no sistema SaaS.
 */
@Injectable()
export class TenantService {
  /**
   * Construtor do serviço de tenant
   * @param tenantRepository Repositório de tenant injetado
   * @param permissaoPadraoService Serviço de permissões padrão injetado
   */
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly permissaoPadraoService: PermissaoPadraoService
  ) {}

  /**
   * Busca todos os tenants
   * @returns Promise com array de tenants
   */
  async buscarTodos(): Promise<Tenant[]> {
    return this.tenantRepository.findAll();
  }

  /**
   * Busca um tenant pelo ID
   * @param id Identificador do tenant
   * @returns Promise com o tenant encontrado ou null
   */
  async buscarPorId(id: string): Promise<Tenant | null> {
    return this.tenantRepository.findById(id);
  }

  /**
   * Busca um tenant pelo domínio
   * @param dominio Domínio do tenant
   * @returns Promise com o tenant encontrado ou null
   */
  async buscarPorDominio(dominio: string): Promise<Tenant | null> {
    return this.tenantRepository.buscarPorDominio(dominio);
  }

  /**
   * Cria um novo tenant
   * @param dados Dados para criação do tenant
   * @returns Promise com o tenant criado
   */
  async criar(dados: ICriarTenantDTO): Promise<Tenant> {
    // Verificar se já existe um tenant com o mesmo domínio
    if (dados.dominio) {
      const tenantExistente = await this.tenantRepository.buscarPorDominio(dados.dominio);
      if (tenantExistente) {
        throw new Error(`Já existe um tenant com o domínio ${dados.dominio}`);
      }
    }

    // Criar o tenant
    const novoTenant = await this.tenantRepository.create({
      nome: dados.nome,
      dominio: dados.dominio,
      ativo: true,
      dataCriacao: new Date(),
    });
    
    // Criar permissões padrão se o ID do usuário admin e da empresa foram fornecidos
    if (dados.usuarioAdminId && dados.empresaId) {
      try {
        await this.permissaoPadraoService.criarPermissoesPadraoTenant(
          dados.usuarioAdminId,
          dados.empresaId
        );
      } catch (error) {
        console.error(`Erro ao criar permissões padrão para o tenant ${novoTenant.id}: ${error.message}`);
      }
    }
    
    return novoTenant;
  }

  /**
   * Atualiza um tenant existente
   * @param id Identificador do tenant
   * @param dados Dados para atualização do tenant
   * @returns Promise com o tenant atualizado
   */
  async atualizar(id: string, dados: Partial<Tenant>): Promise<Tenant> {
    // Verificar se o tenant existe
    const tenantExistente = await this.tenantRepository.findById(id);
    if (!tenantExistente) {
      throw new Error(`Tenant com ID ${id} não encontrado`);
    }

    // Verificar se está tentando atualizar o domínio para um que já existe
    if (dados.dominio && dados.dominio !== tenantExistente.dominio) {
      const tenantComMesmoDominio = await this.tenantRepository.buscarPorDominio(dados.dominio);
      if (tenantComMesmoDominio) {
        throw new Error(`Já existe um tenant com o domínio ${dados.dominio}`);
      }
    }

    // Atualizar o tenant
    return this.tenantRepository.update(id, {
      ...dados,
      dataAtualizacao: new Date(),
    });
  }

  /**
   * Ativa ou desativa um tenant
   * @param id Identificador do tenant
   * @param ativo Status de ativação
   * @returns Promise com o tenant atualizado
   */
  async alterarStatus(id: string, ativo: boolean): Promise<Tenant> {
    // Verificar se o tenant existe
    const tenantExistente = await this.tenantRepository.findById(id);
    if (!tenantExistente) {
      throw new Error(`Tenant com ID ${id} não encontrado`);
    }

    // Atualizar o status do tenant
    return this.tenantRepository.update(id, {
      ativo,
      dataAtualizacao: new Date(),
    });
  }

  /**
   * Exclui um tenant
   * @param id Identificador do tenant
   */
  async excluir(id: string): Promise<void> {
    // Verificar se o tenant existe
    const tenantExistente = await this.tenantRepository.findById(id);
    if (!tenantExistente) {
      throw new Error(`Tenant com ID ${id} não encontrado`);
    }

    // Excluir o tenant
    await this.tenantRepository.delete(id);
  }
}
