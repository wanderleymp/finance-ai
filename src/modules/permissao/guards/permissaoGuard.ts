import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PermissaoService } from '../services/permissaoService';

/**
 * Decorador para definir permissões necessárias
 */
export const RequirePermissao = (
  moduloId: string,
  submoduloId?: string,
  recursoId?: string,
  acaoId?: string,
) => {
  return (target: any, key: string | symbol, descriptor?: any) => {
    const metadataKey = 'permissoes';
    const permissoes = Reflect.getMetadata(metadataKey, target, key) || [];
    
    permissoes.push({
      moduloId,
      submoduloId,
      recursoId,
      acaoId,
    });
    
    Reflect.defineMetadata(metadataKey, permissoes, target, key);
    
    return descriptor;
  };
};

/**
 * Guard para verificação de permissões
 * 
 * Este guard é usado para proteger rotas que requerem permissões específicas.
 * Utiliza o serviço de permissões para verificar se o usuário tem as permissões necessárias.
 */
@Injectable()
export class PermissaoGuard implements CanActivate {
  /**
   * Construtor do guard de permissões
   * @param reflector Reflector para acessar metadados
   * @param permissaoService Serviço de permissões injetado
   */
  constructor(
    private readonly reflector: Reflector,
    private readonly permissaoService: PermissaoService,
  ) {}

  /**
   * Verifica se o usuário tem permissão para acessar a rota
   * @param context Contexto de execução
   * @returns Boolean indicando se o usuário tem permissão
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Obter permissões necessárias dos metadados
    const permissoesNecessarias = this.reflector.get<any[]>(
      'permissoes',
      context.getHandler(),
    );

    // Se não houver permissões definidas, permitir acesso
    if (!permissoesNecessarias || permissoesNecessarias.length === 0) {
      return true;
    }

    // Obter usuário e empresa da requisição
    const request = context.switchToHttp().getRequest();
    const usuario = request.user;
    const empresaId = request.headers['empresa-id'] || request.user?.empresaId;

    // Se não houver usuário autenticado, negar acesso
    if (!usuario) {
      return false;
    }

    // Verificar cada permissão necessária
    for (const permissao of permissoesNecessarias) {
      const temPermissao = await this.permissaoService.verificarPermissao(
        usuario.id,
        permissao.moduloId,
        permissao.submoduloId,
        permissao.recursoId,
        permissao.acaoId,
        empresaId,
      );

      // Se o usuário não tiver alguma das permissões necessárias, negar acesso
      if (!temPermissao) {
        return false;
      }
    }

    // Se o usuário tiver todas as permissões necessárias, permitir acesso
    return true;
  }
}
