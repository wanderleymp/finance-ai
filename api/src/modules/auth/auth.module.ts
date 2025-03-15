import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtAuthService } from './services/jwtAuthService';
import { JwtStrategy } from './strategies/jwtStrategy';
import { AuthController } from './controllers/authController';
import { PermissoesController } from './controllers/permissoesController';
import { TenantModule } from '../tenant/tenant.module';
import { UsuarioModule } from '../usuario/usuario.module';
import { PermissaoModule } from '../permissao/permissao.module';
import { PerfilModule } from '../perfil/perfil.module';

/**
 * Módulo de autenticação
 * 
 * Este módulo organiza todos os componentes relacionados
 * à autenticação e autorização no sistema SaaS.
 */
@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secretpadrao',
      signOptions: { expiresIn: '1h' },
    }),
    TenantModule,
    forwardRef(() => UsuarioModule),
    PermissaoModule,
    PerfilModule,
  ],
  controllers: [AuthController, PermissoesController],
  providers: [JwtAuthService, JwtStrategy],
  exports: [JwtAuthService],
})
export class AuthModule {}
