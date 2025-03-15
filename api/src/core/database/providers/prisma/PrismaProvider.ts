import { PrismaClient } from '@prisma/client';
import { IDatabaseProvider, ITransaction } from '../../interfaces/IDatabaseProvider';
import { criarTenantMiddleware } from './prismaTenantMiddleware';

/**
 * Implementação do provedor de banco de dados usando Prisma ORM
 * 
 * Esta classe implementa a interface IDatabaseProvider para fornecer
 * acesso ao banco de dados PostgreSQL usando o Prisma ORM.
 */
export class PrismaProvider implements IDatabaseProvider {
  private prisma: PrismaClient;
  private static instance: PrismaProvider;
  private tenantIdGetter: () => string | null = () => null;

  constructor() {
    this.prisma = new PrismaClient({
      log: ['error', 'warn'],
    });
  }

  /**
   * Obtém uma instância singleton do provedor Prisma
   * @returns Instância do PrismaProvider
   */
  public static getInstance(): PrismaProvider {
    if (!PrismaProvider.instance) {
      PrismaProvider.instance = new PrismaProvider();
    }
    return PrismaProvider.instance;
  }

  /**
   * Configura a função para obter o tenant ID atual
   * @param getter Função que retorna o tenant ID atual
   */
  setTenantIdGetter(getter: () => string | null): void {
    this.tenantIdGetter = getter;
    
    // Configura o middleware de tenant no Prisma
    this.prisma.$use(criarTenantMiddleware(this.tenantIdGetter));
  }

  /**
   * Estabelece conexão com o banco de dados
   */
  async connect(): Promise<void> {
    try {
      await this.prisma.$connect();
    } catch (error) {
      console.error('Erro ao conectar ao banco de dados:', error);
      throw error;
    }
  }

  /**
   * Encerra a conexão com o banco de dados
   */
  async disconnect(): Promise<void> {
    try {
      await this.prisma.$disconnect();
    } catch (error) {
      console.error('Erro ao desconectar do banco de dados:', error);
      throw error;
    }
  }

  /**
   * Inicia uma transação no banco de dados
   * @returns Objeto de transação
   */
  async startTransaction(): Promise<ITransaction> {
    try {
      // Criamos um novo cliente Prisma para a transação
      const tx = this.prisma.$transaction(async (prisma) => {
        return prisma;
      });

      return {
        commit: async () => {
          // No Prisma, o commit é automático quando a Promise do $transaction resolve
          await tx;
        },
        rollback: async () => {
          // Para fazer rollback, rejeitamos a Promise
          throw new Error('Transação cancelada manualmente');
        },
        getContext: () => tx,
      };
    } catch (error) {
      console.error('Erro ao iniciar transação:', error);
      throw error;
    }
  }

  /**
   * Retorna o contexto do Prisma
   * @returns Cliente Prisma
   */
  getContext(): PrismaClient {
    return this.prisma;
  }
}
