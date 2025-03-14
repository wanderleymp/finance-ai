import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../core/database/database.module';
import { PermissaoRepository } from './repositories/permissaoRepository';
import { PermissaoService } from './services/permissaoService';
import { PermissaoPadraoService } from './services/permissaoPadraoService';
import { PermissaoController } from './controllers/permissaoController';

/**
 * Módulo de permissões
 * 
 * Este módulo organiza todos os componentes relacionados
 * ao gerenciamento de permissões no sistema SaaS.
 */
@Module({
  imports: [DatabaseModule],
  controllers: [PermissaoController],
  providers: [
    {
      provide: PermissaoRepository,
      useFactory: (databaseProvider) => {
        const prisma = databaseProvider.getContext();
        return new PermissaoRepository(prisma);
      },
      inject: ['DATABASE_PROVIDER'],
    },
    PermissaoService,
    PermissaoPadraoService,
  ],
  exports: [PermissaoService, PermissaoPadraoService],
})
export class PermissaoModule {}
