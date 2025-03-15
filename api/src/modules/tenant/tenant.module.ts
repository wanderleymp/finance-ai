import { Module } from '@nestjs/common';
import { TenantController } from './controllers/tenantController';
import { TenantService } from './services/tenantService';
import { TenantRepository } from './repositories/tenantRepository';
import { DatabaseModule } from '../../core/database/database.module';
import { TenantContextService } from '../../core/tenant/services/tenantContext.service';
import { PermissaoModule } from '../permissao/permissao.module';

/**
 * Módulo de tenant
 * 
 * Este módulo organiza todos os componentes relacionados
 * à gestão de tenants no sistema SaaS.
 */
@Module({
  imports: [DatabaseModule, PermissaoModule],
  controllers: [TenantController],
  providers: [
    TenantService,
    TenantContextService,
    {
      provide: TenantRepository,
      useFactory: (databaseProvider) => {
        const prisma = databaseProvider.getContext();
        return new TenantRepository(prisma);
      },
      inject: ['DATABASE_PROVIDER'],
    },
  ],
  exports: [TenantService, TenantRepository, TenantContextService],
})
export class TenantModule {}
