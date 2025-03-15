/**
 * Interface para o serviço de tenants
 * 
 * Define os métodos necessários para gerenciamento de tenants
 * no sistema SaaS multi-inquilino.
 */
export interface ITenantService {
  /**
   * Cria um novo tenant
   * @param nome Nome do tenant
   * @param dominio Domínio do tenant
   * @param dadosAdicionais Dados adicionais do tenant
   * @returns Promise com o tenant criado
   */
  criarTenant(nome: string, dominio: string, dadosAdicionais?: any): Promise<any>;
  
  /**
   * Obtém um tenant pelo ID
   * @param id ID do tenant
   * @returns Promise com o tenant encontrado
   */
  obterTenantPorId(id: string): Promise<any>;
  
  /**
   * Obtém um tenant pelo domínio
   * @param dominio Domínio do tenant
   * @returns Promise com o tenant encontrado
   */
  obterTenantPorDominio(dominio: string): Promise<any>;
  
  /**
   * Atualiza um tenant
   * @param id ID do tenant
   * @param dados Dados do tenant a serem atualizados
   * @returns Promise com o tenant atualizado
   */
  atualizarTenant(id: string, dados: any): Promise<any>;
  
  /**
   * Desativa um tenant
   * @param id ID do tenant
   * @returns Promise void
   */
  desativarTenant(id: string): Promise<void>;
  
  /**
   * Ativa um tenant
   * @param id ID do tenant
   * @returns Promise void
   */
  ativarTenant(id: string): Promise<void>;
}
