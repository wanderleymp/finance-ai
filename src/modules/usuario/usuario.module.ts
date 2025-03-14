import { Module } from '@nestjs/common';
import { UsuarioRepository } from './repositories/usuarioRepository';
import { DatabaseModule } from '../../core/database/database.module';

/**
 * Módulo de usuário
 * 
 * Este módulo organiza todos os componentes relacionados
 * à gestão de usuários no sistema SaaS.
 */
@Module({
  imports: [DatabaseModule],
  providers: [
    {
      provide: UsuarioRepository,
      useFactory: (databaseProvider) => {
        const prisma = databaseProvider.getContext();
        return new UsuarioRepository(prisma);
      },
      inject: ['DATABASE_PROVIDER'],
    },
  ],
  exports: [UsuarioRepository],
})
export class UsuarioModule {}
