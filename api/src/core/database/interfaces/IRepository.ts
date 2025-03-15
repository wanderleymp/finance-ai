/**
 * Interface genérica para repositórios
 * 
 * Esta interface define os métodos básicos que qualquer repositório
 * deve implementar para operações CRUD básicas.
 * 
 * @template T - Tipo da entidade
 * @template ID - Tipo do identificador da entidade
 */
export interface IRepository<T, ID> {
  /**
   * Busca uma entidade pelo seu identificador
   * @param id - Identificador da entidade
   * @returns Promise com a entidade encontrada ou null se não existir
   */
  findById(id: ID): Promise<T | null>;
  
  /**
   * Busca todas as entidades
   * @returns Promise com array de entidades
   */
  findAll(): Promise<T[]>;
  
  /**
   * Cria uma nova entidade
   * @param entity - Dados da entidade a ser criada (sem o ID)
   * @returns Promise com a entidade criada
   */
  create(entity: Omit<T, 'id'>): Promise<T>;
  
  /**
   * Atualiza uma entidade existente
   * @param id - Identificador da entidade
   * @param entity - Dados parciais da entidade a ser atualizada
   * @returns Promise com a entidade atualizada
   */
  update(id: ID, entity: Partial<T>): Promise<T>;
  
  /**
   * Remove uma entidade
   * @param id - Identificador da entidade
   * @returns Promise void
   */
  delete(id: ID): Promise<void>;
  
  /**
   * Busca entidades com filtros personalizados
   * @param filters - Objeto com filtros a serem aplicados
   * @returns Promise com array de entidades que atendem aos filtros
   */
  findByFilters(filters: Partial<T>): Promise<T[]>;
}
