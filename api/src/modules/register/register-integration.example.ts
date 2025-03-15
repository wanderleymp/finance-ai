import { Module } from '@nestjs/common';
import { RegisterModule } from '../../../../shared/register.module';
import { TenantModule } from '../tenant/tenant.module';
import { UsuarioModule } from '../usuario/usuario.module';
import { EmpresaRepository } from '../empresa/repositories/empresaRepository';

/**
 * Exemplo de como integrar o módulo de registro na aplicação
 * 
 * Este é um exemplo de como você pode integrar o módulo de registro
 * no módulo principal da aplicação.
 */
@Module({
  imports: [
    // Importar o módulo de registro usando o método forRoot
    RegisterModule.forRoot(
      TenantModule,
      UsuarioModule,
      EmpresaRepository
    ),
  ],
})
export class RegisterIntegrationExample {}

/**
 * Como integrar no app.module.ts:
 * 
 * 1. Importe o RegisterModule no app.module.ts:
 * 
 * ```typescript
 * import { RegisterModule } from './modules/register/register.module';
 * import { TenantModule } from './modules/tenant/tenant.module';
 * import { UsuarioModule } from './modules/usuario/usuario.module';
 * import { EmpresaRepository } from './modules/empresa/repositories/empresaRepository';
 * 
 * @Module({
 *   imports: [
 *     // Outros módulos...
 *     RegisterModule.forRoot(
 *       TenantModule,
 *       UsuarioModule,
 *       EmpresaRepository
 *     ),
 *     // Outros módulos...
 *   ],
 *   // Resto do módulo...
 * })
 * export class AppModule {}
 * ```
 * 
 * 2. Certifique-se de que o endpoint de registro não está protegido pelo middleware de tenant
 * no método configure do AppModule:
 * 
 * ```typescript
 * configure(consumer: MiddlewareConsumer) {
 *   consumer
 *     .apply(TenantMiddleware)
 *     .exclude({ path: 'api/register', method: RequestMethod.POST })
 *     .forRoutes({ path: '*', method: RequestMethod.ALL });
 * }
 * ```
 */
