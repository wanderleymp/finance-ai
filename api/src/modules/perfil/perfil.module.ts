import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../core/database/database.module';
import { PerfilRepository } from './repositories/perfilRepository';
import { PerfilService } from './services/perfilService';
import { PerfilController } from './controllers/perfilController';
import { PermissaoModule } from '../permissao/permissao.module';
import { PerfilGuard } from './guards/perfilGuard';

/**
 * Módulo de perfis
 * 
 * Este módulo organiza todos os componentes relacionados
 * ao gerenciamento de perfis no sistema SaaS.
 */
@Module({
  imports: [DatabaseModule, PermissaoModule],
  controllers: [PerfilController],
  providers: [
    {
      provide: PerfilRepository,
      useFactory: (databaseProvider) => {
        const prisma = databaseProvider.getContext();
        return new PerfilRepository(prisma);
      },
      inject: ['DATABASE_PROVIDER'],
    },
    PerfilService,
    PerfilGuard,
  ],
  exports: [PerfilService, PerfilGuard],
})
export class PerfilModule {}
