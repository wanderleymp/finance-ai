/**
 * Interface para provedor de banco de dados
 * 
 * Esta interface define os métodos básicos que qualquer provedor de banco de dados
 * deve implementar para ser compatível com a aplicação.
 */
export interface IDatabaseProvider {
  /**
   * Estabelece conexão com o banco de dados
   */
  connect(): Promise<void>;
  
  /**
   * Encerra a conexão com o banco de dados
   */
  disconnect(): Promise<void>;
  
  /**
   * Inicia uma transação no banco de dados
   */
  startTransaction(): Promise<ITransaction>;
  
  /**
   * Retorna o contexto do provedor de banco de dados
   * Este método permite acesso à implementação específica quando necessário
   */
  getContext(): any;
}

/**
 * Interface para transações de banco de dados
 */
export interface ITransaction {
  /**
   * Confirma as operações realizadas na transação
   */
  commit(): Promise<void>;
  
  /**
   * Desfaz as operações realizadas na transação
   */
  rollback(): Promise<void>;
  
  /**
   * Retorna o contexto da transação específico do provedor
   */
  getContext(): any;
}
