import { Module, Provider } from '@nestjs/common';
import { PrismaProvider } from './providers/prisma/PrismaProvider';

/**
 * Provedores de banco de dados disponíveis
 * 
 * Esta constante define os provedores de banco de dados que podem ser injetados
 * em outros módulos da aplicação. Atualmente, apenas o PrismaProvider está disponível.
 */
const databaseProviders: Provider[] = [
  {
    provide: 'DATABASE_PROVIDER',
    useFactory: () => {
      const provider = PrismaProvider.getInstance();
      return provider;
    },
  },
];

/**
 * Módulo de banco de dados
 * 
 * Este módulo é responsável por fornecer acesso ao banco de dados
 * através de provedores abstratos que podem ser facilmente trocados.
 */
@Module({
  providers: [...databaseProviders],
  exports: [...databaseProviders],
})
export class DatabaseModule {}
