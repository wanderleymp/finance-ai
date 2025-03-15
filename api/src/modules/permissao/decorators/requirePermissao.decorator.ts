import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwtAuthGuard';
import { PermissaoGuard } from '../guards/permissaoGuard';

/**
 * Interface para definição de permissão
 */
export interface IPermissao {
  moduloId: string;
  submoduloId?: string;
  recursoId?: string;
  acaoId?: string;
}

/**
 * Decorador para definir permissões necessárias
 * 
 * Este decorador combina o JwtAuthGuard e o PermissaoGuard,
 * e define as permissões necessárias para acessar a rota.
 * 
 * @param permissoes Lista de permissões necessárias
 * @returns Decorador combinado
 */
export const RequirePermissao = (...permissoes: IPermissao[]) => {
  return applyDecorators(
    SetMetadata('permissoes', permissoes),
    UseGuards(JwtAuthGuard, PermissaoGuard),
  );
};
