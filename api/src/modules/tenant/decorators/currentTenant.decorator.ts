import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Decorador para obter o tenant atual da requisição
 * 
 * Este decorador facilita o acesso ao tenant identificado pelo
 * middleware de tenant nos controladores.
 * 
 * Exemplo de uso:
 * ```
 * @Get()
 * buscarDados(@CurrentTenant() tenant: Tenant) {
 *   // Usar o tenant
 * }
 * ```
 */
export const CurrentTenant = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.tenant;
  },
);
