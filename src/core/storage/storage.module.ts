import { Module, Provider } from '@nestjs/common';
import { S3Provider } from './providers/s3/S3Provider';

/**
 * Provedores de armazenamento disponíveis
 * 
 * Esta constante define os provedores de armazenamento que podem ser injetados
 * em outros módulos da aplicação. Atualmente, apenas o S3Provider está disponível.
 */
const storageProviders: Provider[] = [
  {
    provide: 'STORAGE_PROVIDER',
    useFactory: () => {
      const provider = S3Provider.getInstance();
      return provider;
    },
  },
];

/**
 * Módulo de armazenamento
 * 
 * Este módulo é responsável por fornecer acesso ao serviço de armazenamento
 * através de provedores abstratos que podem ser facilmente trocados.
 */
@Module({
  providers: [...storageProviders],
  exports: [...storageProviders],
})
export class StorageModule {}
