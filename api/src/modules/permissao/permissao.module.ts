import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../core/database/database.module';
import { PermissaoRepository } from './repositories/permissaoRepository';
import { GrupoPermissaoRepository } from './repositories/grupoPermissaoRepository';
import { PermissaoService } from './services/permissaoService';
import { GrupoPermissaoService } from './services/grupoPermissaoService';
import { PermissaoPadraoService } from './services/permissaoPadraoService';
import { PermissaoController } from './controllers/permissaoController';
import { GrupoPermissaoController } from './controllers/grupoPermissaoController';
import { PermissaoGuard } from './guards/permissaoGuard';

/**
 * Módulo de permissões
 * 
 * Este módulo organiza todos os componentes relacionados
 * ao gerenciamento de permissões no sistema SaaS.
 */
@Module({
  imports: [DatabaseModule],
  controllers: [PermissaoController, GrupoPermissaoController],
  providers: [
    {
      provide: PermissaoRepository,
      useFactory: (databaseProvider) => {
        const prisma = databaseProvider.getContext();
        return new PermissaoRepository(prisma);
      },
      inject: ['DATABASE_PROVIDER'],
    },
    {
      provide: GrupoPermissaoRepository,
      useFactory: (databaseProvider) => {
        const prisma = databaseProvider.getContext();
        return new GrupoPermissaoRepository(prisma);
      },
      inject: ['DATABASE_PROVIDER'],
    },
    PermissaoService,
    GrupoPermissaoService,
    PermissaoPadraoService,
    PermissaoGuard,
  ],
  exports: [PermissaoService, GrupoPermissaoService, PermissaoPadraoService, PermissaoGuard],
})
export class PermissaoModule {}
