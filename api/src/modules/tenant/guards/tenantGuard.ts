import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';

/**
 * Guarda para verificar se o tenant está presente na requisição
 * 
 * Esta guarda verifica se o middleware de tenant identificou
 * corretamente um tenant ativo para a requisição atual.
 * 
 * Pode ser usada para proteger rotas que exigem um tenant válido.
 */
@Injectable()
export class TenantGuard implements CanActivate {
  /**
   * Verifica se a requisição possui um tenant válido
   * @param context Contexto de execução
   * @returns true se o tenant for válido, false caso contrário
   */
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const tenant = request.tenant;

    // Verificar se o tenant existe e está ativo
    if (!tenant || !tenant.ativo) {
      throw new UnauthorizedException('Tenant não identificado ou inativo');
    }

    return true;
  }
}
