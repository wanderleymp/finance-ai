import { Module, DynamicModule } from '@nestjs/common';
import { RegisterController } from './register.controller';
import { RegisterService } from './register.service';

/**
 * Módulo de Registro
 * 
 * Este módulo encapsula todos os componentes relacionados ao processo de registro
 * de novos tenants, incluindo controller, serviço e dependências.
 */
@Module({
  controllers: [RegisterController],
  providers: [RegisterService],
  exports: [RegisterService]
})
export class RegisterModule {
  /**
   * Método estático para criar o módulo com as dependências necessárias
   * @param tenantService Serviço de tenant
   * @param usuarioService Serviço de usuário
   * @param empresaRepository Repositório de empresa
   * @returns Módulo configurado dinamicamente
   */
  static forRoot(
    tenantModule: any,
    usuarioModule: any,
    empresaRepository: any
  ): DynamicModule {
    return {
      module: RegisterModule,
      imports: [tenantModule, usuarioModule],
      providers: [
        {
          provide: 'TenantService',
          useFactory: (tenantService) => tenantService,
          inject: ['TenantService']
        },
        {
          provide: 'UsuarioService',
          useFactory: (usuarioService) => usuarioService,
          inject: ['UsuarioService']
        },
        {
          provide: 'EmpresaRepository',
          useValue: empresaRepository
        }
      ]
    };
  }
}
