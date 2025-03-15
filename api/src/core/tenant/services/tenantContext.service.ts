import { Injectable, Scope } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';

/**
 * Serviço para gerenciamento do contexto do tenant
 * 
 * Este serviço utiliza AsyncLocalStorage para armazenar e recuperar
 * o identificador do tenant atual no contexto da requisição.
 */
@Injectable({ scope: Scope.DEFAULT })
export class TenantContextService {
  // AsyncLocalStorage para armazenar o contexto do tenant
  private readonly asyncLocalStorage = new AsyncLocalStorage<Map<string, any>>();

  /**
   * Define o tenant atual no contexto
   * @param tenantId Identificador do tenant
   */
  setCurrentTenantId(tenantId: string): void {
    const store = this.asyncLocalStorage.getStore();
    if (store) {
      store.set('tenantId', tenantId);
    } else {
      const newStore = new Map<string, any>();
      newStore.set('tenantId', tenantId);
      this.asyncLocalStorage.enterWith(newStore);
    }
  }

  /**
   * Obtém o tenant atual do contexto
   * @returns Identificador do tenant ou null se não estiver definido
   */
  getCurrentTenantId(): string | null {
    const store = this.asyncLocalStorage.getStore();
    return store ? store.get('tenantId') : null;
  }

  /**
   * Executa uma função no contexto de um tenant específico
   * @param tenantId Identificador do tenant
   * @param callback Função a ser executada
   * @returns Resultado da função
   */
  runWithTenant<T>(tenantId: string, callback: () => T): T {
    const store = new Map<string, any>();
    store.set('tenantId', tenantId);
    return this.asyncLocalStorage.run(store, callback);
  }

  /**
   * Limpa o tenant atual do contexto
   */
  clearCurrentTenant(): void {
    const store = this.asyncLocalStorage.getStore();
    if (store) {
      store.delete('tenantId');
    }
  }
}
