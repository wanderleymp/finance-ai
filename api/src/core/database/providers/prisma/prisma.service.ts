import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

/**
 * Serviço Prisma para conexão com o banco de dados
 * 
 * Este serviço encapsula a instância do PrismaClient e gerencia
 * o ciclo de vida da conexão com o banco de dados.
 */
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  // Assinatura de índice para permitir acesso dinâmico às propriedades
  [key: string]: any;
  /**
   * Inicializa a conexão com o banco de dados quando o módulo é inicializado
   */
  async onModuleInit() {
    await this.$connect();
  }

  /**
   * Fecha a conexão com o banco de dados quando o módulo é destruído
   */
  async onModuleDestroy() {
    await this.$disconnect();
  }

  /**
   * Limpa o banco de dados (útil para testes)
   * ATENÇÃO: Isso exclui todos os dados do banco!
   */
  async cleanDatabase() {
    // Apenas permitido em ambiente de teste
    if (process.env.NODE_ENV !== 'test') {
      throw new Error('Limpeza do banco de dados só é permitida em ambiente de teste!');
    }

    // Ordem de exclusão considerando as relações entre tabelas
    const models = Reflect.ownKeys(this).filter(
      (key) => typeof key === 'string' && !key.startsWith('_') && !key.startsWith('$')
    );

    return Promise.all(
      models.map((modelKey) => {
        const model = this[modelKey as string];
        if (typeof model.deleteMany === 'function') {
          return model.deleteMany({});
        }
        return Promise.resolve();
      })
    );
  }
}
