import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { RepositorioBase } from '../../../core/database/base/repositorioBase';
import { Tenant } from '../services/tenantService';

/**
 * Repositório para operações relacionadas a Tenants
 * 
 * Este repositório estende o RepositorioBase e fornece métodos
 * específicos para manipulação de tenants no banco de dados.
 */
@Injectable()
export class TenantRepository extends RepositorioBase<Tenant, string> {
  /**
   * Construtor do repositório de tenant
   * @param prisma Cliente Prisma injetado
   */
  constructor(prisma: PrismaClient) {
    super(prisma, 'tenant');
  }

  /**
   * Busca um tenant pelo domínio
   * @param dominio Domínio do tenant
   * @returns Promise com o tenant encontrado ou null
   */
  async buscarPorDominio(dominio: string): Promise<Tenant | null> {
    return this.prisma.tenant.findUnique({
      where: { dominio },
    });
  }

  /**
   * Busca todos os tenants ativos
   * @returns Promise com array de tenants ativos
   */
  async buscarTenantAtivos(): Promise<Tenant[]> {
    return this.prisma.tenant.findMany({
      where: { ativo: true },
    });
  }

  /**
   * Desativa um tenant
   * @param id Identificador do tenant
   * @returns Promise com o tenant desativado
   */
  async desativarTenant(id: string): Promise<Tenant> {
    return this.prisma.tenant.update({
      where: { id },
      data: { ativo: false },
    });
  }

  /**
   * Mapeia os dados do banco para a entidade Tenant
   * @param data Dados do banco de dados
   * @returns Entidade Tenant
   */
  protected mapToEntity(data: any): Tenant {
    return {
      id: data.id,
      nome: data.nome,
      dominio: data.dominio,
      ativo: data.ativo,
      dataCriacao: data.dataCriacao,
      dataAtualizacao: data.dataAtualizacao,
    };
  }
}
