import { Module } from '@nestjs/common';
import { InitializationService } from './initializationService';
import { DatabaseModule } from '../../../core/database/database.module';

/**
 * Módulo de inicialização
 * 
 * Este módulo é responsável por inicializar os dados básicos
 * do sistema quando a aplicação é iniciada.
 */
@Module({
  imports: [DatabaseModule],
  providers: [
    InitializationService,
  ],
  exports: [InitializationService],
})
export class InitializationModule {}
