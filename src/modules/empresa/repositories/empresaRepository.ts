import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../core/database/providers/prisma/prisma.service';
import { IEmpresa } from '../interfaces/IEmpresa';

/**
 * Repositório para operações relacionadas a Empresas
 * 
 * Este repositório é responsável por realizar operações de CRUD
 * para entidades de Empresa no banco de dados.
 */
@Injectable()
export class EmpresaRepository {
  constructor(private prisma: PrismaService) {}

  /**
   * Cria uma nova empresa no banco de dados
   * @param data Dados da empresa a ser criada
   * @returns A empresa criada
   */
  async create(data: Omit<IEmpresa, 'id' | 'dataCriacao' | 'dataAtualizacao'>): Promise<IEmpresa> {
    return this.prisma.empresa.create({
      data,
    });
  }

  /**
   * Busca uma empresa pelo ID
   * @param id ID da empresa
   * @returns A empresa encontrada ou null
   */
  async findById(id: string): Promise<IEmpresa | null> {
    return this.prisma.empresa.findUnique({
      where: { id },
    });
  }

  /**
   * Busca todas as empresas de um tenant
   * @param tenantId ID do tenant
   * @returns Lista de empresas do tenant
   */
  async findByTenantId(tenantId: string): Promise<IEmpresa[]> {
    return this.prisma.empresa.findMany({
      where: { tenantId },
    });
  }

  /**
   * Atualiza uma empresa existente
   * @param id ID da empresa
   * @param data Dados a serem atualizados
   * @returns A empresa atualizada
   */
  async update(id: string, data: Partial<Omit<IEmpresa, 'id' | 'dataCriacao' | 'dataAtualizacao'>>): Promise<IEmpresa> {
    return this.prisma.empresa.update({
      where: { id },
      data,
    });
  }

  /**
   * Remove uma empresa do banco de dados
   * @param id ID da empresa
   * @returns A empresa removida
   */
  async delete(id: string): Promise<IEmpresa> {
    return this.prisma.empresa.delete({
      where: { id },
    });
  }
}
