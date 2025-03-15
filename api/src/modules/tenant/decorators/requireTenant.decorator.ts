import { SetMetadata, UseGuards, applyDecorators } from '@nestjs/common';
import { TenantGuard } from '../guards/tenantGuard';

/**
 * Chave de metadados para requisitos de tenant
 */
export const TENANT_REQUIRED_KEY = 'tenantRequired';

/**
 * Decorador para exigir um tenant válido para acessar um endpoint
 * 
 * Este decorador aplica a guarda de tenant para verificar se
 * existe um tenant válido na requisição.
 * 
 * Exemplo de uso:
 * ```
 * @RequireTenant()
 * @Get()
 * buscarDados() {
 *   // Este endpoint só pode ser acessado com um tenant válido
 * }
 * ```
 * 
 * @returns Decorador que aplica a guarda de tenant
 */
export const RequireTenant = () => {
  return applyDecorators(
    SetMetadata(TENANT_REQUIRED_KEY, true),
    UseGuards(TenantGuard),
  );
};
