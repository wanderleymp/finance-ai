import { Module } from '@nestjs/common';
import { TenantContextService } from './services/tenantContext.service';
import { TenantMiddleware } from './middlewares/tenantMiddleware';
import { TenantModule as TenantBusinessModule } from '../../modules/tenant/tenant.module';

/**
 * Módulo de tenant no core da aplicação
 * 
 * Este módulo é responsável por fornecer serviços relacionados
 * à identificação e gerenciamento de tenants no nível da infraestrutura.
 * 
 * Integra o middleware de tenant e o serviço de contexto de tenant
 * para permitir a identificação e isolamento de tenants em todas as requisições.
 */
@Module({
  imports: [TenantBusinessModule],
  providers: [TenantContextService, TenantMiddleware],
  exports: [TenantContextService, TenantMiddleware],
})
export class TenantModule {}
