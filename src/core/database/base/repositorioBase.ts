import { IRepository } from '../interfaces/IRepository';
import { PrismaClient } from '@prisma/client';

/**
 * Classe base para repositórios usando Prisma
 * 
 * Esta classe implementa a interface IRepository e fornece
 * implementações padrão para operações CRUD básicas.
 * 
 * @template T - Tipo da entidade
 * @template ID - Tipo do identificador da entidade
 */
export abstract class RepositorioBase<T, ID> implements IRepository<T, ID> {
  /**
   * Construtor do repositório base
   * @param prisma Cliente Prisma para acesso ao banco de dados
   * @param modelName Nome do modelo no Prisma
   */
  constructor(
    protected readonly prisma: PrismaClient,
    protected readonly modelName: string,
  ) {}

  /**
   * Busca uma entidade pelo seu identificador
   * @param id Identificador da entidade
   * @returns Promise com a entidade encontrada ou null se não existir
   */
  async findById(id: ID): Promise<T | null> {
    const model = this.prisma[this.modelName];
    return model.findUnique({
      where: { id },
    }) as Promise<T | null>;
  }

  /**
   * Busca todas as entidades
   * @returns Promise com array de entidades
   */
  async findAll(): Promise<T[]> {
    const model = this.prisma[this.modelName];
    return model.findMany() as Promise<T[]>;
  }

  /**
   * Cria uma nova entidade
   * @param entity Dados da entidade a ser criada (sem o ID)
   * @returns Promise com a entidade criada
   */
  async create(entity: Omit<T, 'id'>): Promise<T> {
    const model = this.prisma[this.modelName];
    return model.create({
      data: entity,
    }) as Promise<T>;
  }

  /**
   * Atualiza uma entidade existente
   * @param id Identificador da entidade
   * @param entity Dados parciais da entidade a ser atualizada
   * @returns Promise com a entidade atualizada
   */
  async update(id: ID, entity: Partial<T>): Promise<T> {
    const model = this.prisma[this.modelName];
    return model.update({
      where: { id },
      data: entity,
    }) as Promise<T>;
  }

  /**
   * Remove uma entidade
   * @param id Identificador da entidade
   * @returns Promise void
   */
  async delete(id: ID): Promise<void> {
    const model = this.prisma[this.modelName];
    await model.delete({
      where: { id },
    });
  }

  /**
   * Busca entidades com filtros personalizados
   * @param filters Objeto com filtros a serem aplicados
   * @returns Promise com array de entidades que atendem aos filtros
   */
  async findByFilters(filters: Partial<T>): Promise<T[]> {
    const model = this.prisma[this.modelName];
    return model.findMany({
      where: filters,
    }) as Promise<T[]>;
  }

  /**
   * Método protegido para mapear dados do banco para a entidade
   * Deve ser implementado por classes filhas quando necessário
   * @param data Dados do banco de dados
   * @returns Entidade mapeada
   */
  protected abstract mapToEntity(data: any): T;
}
