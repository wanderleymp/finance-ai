import { Module, forwardRef } from '@nestjs/common';
import { UsuarioRepository } from './repositories/usuarioRepository';
import { DatabaseModule } from '../../core/database/database.module';
import { UsuarioService } from './services/usuarioService';
import { UsuarioController } from './controllers/usuarioController';
import { AuthModule } from '../auth/auth.module';
import { PerfilModule } from '../perfil/perfil.module';
import { PermissaoModule } from '../permissao/permissao.module';

/**
 * Módulo de usuário
 * 
 * Este módulo organiza todos os componentes relacionados
 * à gestão de usuários no sistema SaaS.
 */
@Module({
  imports: [DatabaseModule, forwardRef(() => AuthModule), PerfilModule, PermissaoModule],
  controllers: [UsuarioController],
  providers: [
    {
      provide: UsuarioRepository,
      useFactory: (databaseProvider) => {
        const prisma = databaseProvider.getContext();
        return new UsuarioRepository(prisma);
      },
      inject: ['DATABASE_PROVIDER'],
    },
    UsuarioService,
  ],
  exports: [UsuarioRepository, UsuarioService],
})
export class UsuarioModule {}
