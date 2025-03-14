import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtAuthService } from './services/jwtAuthService';
import { JwtStrategy } from './strategies/jwtStrategy';
import { AuthController } from './controllers/authController';
import { TenantModule } from '../tenant/tenant.module';
import { UsuarioModule } from '../usuario/usuario.module';

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
    UsuarioModule,
  ],
  controllers: [AuthController],
  providers: [JwtAuthService, JwtStrategy],
  exports: [JwtAuthService],
})
export class AuthModule {}
