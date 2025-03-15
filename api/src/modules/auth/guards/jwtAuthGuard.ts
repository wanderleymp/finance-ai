import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Guard para autenticação JWT
 * 
 * Este guard é usado para proteger rotas que requerem autenticação.
 * Utiliza a estratégia JWT configurada no Passport.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
