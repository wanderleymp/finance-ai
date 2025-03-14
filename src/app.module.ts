import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './core/database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsuarioModule } from './modules/usuario/usuario.module';
import { TenantModule } from './modules/tenant/tenant.module';
import { PermissaoModule } from './modules/permissao/permissao.module';
import { TenantMiddleware } from './core/tenant/middlewares/tenantMiddleware';
import { ConfigModule } from '@nestjs/config';

/**
 * Módulo principal da aplicação
 * 
 * Este módulo integra todos os módulos do sistema e configura
 * os middlewares globais para identificação de tenant.
 */
@Module({
  imports: [
    // Configuração de variáveis de ambiente
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // Módulos core
    DatabaseModule,
    // Módulos de negócio
    TenantModule,
    UsuarioModule,
    AuthModule,
    PermissaoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  /**
   * Configura os middlewares globais
   * @param consumer Consumidor de middlewares
   */
  configure(consumer: MiddlewareConsumer) {
    // Aplicar o middleware de tenant para todas as rotas
    consumer
      .apply(TenantMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
