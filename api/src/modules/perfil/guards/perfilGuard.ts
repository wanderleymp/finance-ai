import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PerfilService } from '../services/perfilService';

/**
 * Guard para verificação de perfil
 * 
 * Este guard verifica se o usuário possui o perfil requerido
 * para acessar um determinado endpoint.
 */
@Injectable()
export class PerfilGuard implements CanActivate {
  /**
   * Construtor do guard de perfil
   * @param reflector Serviço para acessar metadados de decoradores
   * @param perfilService Serviço de perfil injetado
   */
  constructor(
    private reflector: Reflector,
    private perfilService: PerfilService,
  ) {}

  /**
   * Verifica se o usuário pode ativar a rota
   * @param context Contexto de execução
   * @returns Promise com resultado da verificação
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Obter o perfil requerido dos metadados
    const perfilRequerido = this.reflector.get<string>(
      'perfil_requerido',
      context.getHandler(),
    );

    // Se não há perfil requerido, permitir acesso
    if (!perfilRequerido) {
      return true;
    }

    // Obter o usuário da requisição
    const request = context.switchToHttp().getRequest();
    const usuario = request.user;

    // Se não há usuário autenticado, negar acesso
    if (!usuario) {
      return false;
    }

    // Verificar se o usuário possui o perfil requerido
    const perfis = await this.perfilService.listarPerfisPorUsuario(usuario.id);
    return perfis.some(perfil => perfil.nome === perfilRequerido);
  }
}
