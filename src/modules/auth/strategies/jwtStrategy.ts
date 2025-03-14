import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsuarioRepository } from '../../usuario/repositories/usuarioRepository';
import { TenantContextService } from '../../../core/tenant/services/tenantContext.service';

/**
 * Estratégia JWT para autenticação
 * 
 * Esta classe implementa a estratégia JWT para o Passport,
 * validando tokens JWT e configurando o contexto do tenant.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  /**
   * Construtor da estratégia JWT
   * @param usuarioRepository Repositório de usuário injetado
   * @param tenantContextService Serviço de contexto de tenant injetado
   */
  constructor(
    private readonly usuarioRepository: UsuarioRepository,
    private readonly tenantContextService: TenantContextService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'secretpadrao',
    });
  }

  /**
   * Valida o payload do token JWT
   * @param payload Payload do token
   * @returns Usuário autenticado
   */
  async validate(payload: any) {
    // Configurar o tenant no contexto
    if (payload.tenantId) {
      this.tenantContextService.setCurrentTenantId(payload.tenantId);
    }

    // Buscar usuário pelo ID
    const usuario = await this.usuarioRepository.findById(payload.sub);
    if (!usuario) {
      return null;
    }

    // Verificar se o usuário está ativo
    if (!usuario.ativo) {
      return null;
    }

    // Retornar usuário autenticado
    return {
      id: usuario.id,
      email: usuario.email,
      tenantId: usuario.tenantId,
    };
  }
}
