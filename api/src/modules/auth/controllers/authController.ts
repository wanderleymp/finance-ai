import { Controller, Post, Body, HttpException, HttpStatus, UseGuards, Get, Request } from '@nestjs/common';
import { JwtAuthService } from '../services/jwtAuthService';
import { JwtAuthGuard } from '../guards/jwtAuthGuard';
import { UsuarioService } from '../../usuario/services/usuarioService';
import { extrairMensagemErro } from '../../../utils/errorHandler';

/**
 * Interface para login
 */
interface ILoginDTO {
  email: string;
  senha: string;
}

/**
 * Interface para atualização de token
 */
interface IRefreshTokenDTO {
  refreshToken: string;
}

/**
 * Interface para registro de usuário
 */
interface IRegistroDTO {
  nome: string;
  email: string;
  senha: string;
  tenantId?: string;
  empresaId?: string;
}

/**
 * Controlador para autenticação
 * 
 * Este controlador expõe endpoints REST para operações de autenticação
 * como registro, login, logout e atualização de token.
 */
@Controller('auth')
export class AuthController {
  /**
   * Construtor do controlador de autenticação
   * @param authService Serviço de autenticação injetado
   * @param usuarioService Serviço de usuário injetado
   */
  constructor(
    private readonly authService: JwtAuthService,
    private readonly usuarioService: UsuarioService
  ) {}

  /**
   * Endpoint para login
   * @param dados Dados de login
   * @returns Tokens de acesso e atualização
   */
  @Post('login')
  login(@Body() dados: ILoginDTO) {
    try {
      return this.authService.login(dados.email, dados.senha);
    } catch (error) {
      throw new HttpException(extrairMensagemErro(error, 'Erro de autenticação'), HttpStatus.UNAUTHORIZED);
    }
  }

  /**
   * Endpoint para atualização de token
   * @param dados Token de atualização
   * @returns Novos tokens de acesso e atualização
   */
  @Post('refresh')
  refresh(@Body() dados: IRefreshTokenDTO) {
    try {
      return this.authService.atualizarToken(dados.refreshToken);
    } catch (error) {
      throw new HttpException(extrairMensagemErro(error, 'Token inválido ou expirado'), HttpStatus.UNAUTHORIZED);
    }
  }

  /**
   * Endpoint para obter o perfil do usuário autenticado
   * @param req Requisição com usuário autenticado
   * @returns Perfil do usuário
   */
  @UseGuards(JwtAuthGuard)
  @Get('perfil')
  getPerfil(@Request() req: any) {
    return req.user;
  }

  /**
   * Endpoint para registro de usuário
   * @param dados Dados de registro
   * @returns Usuário registrado e tokens de acesso
   */
  @Post('registro')
  registro(@Body() dados: IRegistroDTO) {
    try {
      // Criar o usuário
      return this.usuarioService.criar({
        nome: dados.nome,
        email: dados.email,
        senha: dados.senha,
        tenantId: dados.tenantId,
        empresaId: dados.empresaId,
      })
      .then(usuario => {
        // Realizar login automático após registro
        return this.authService.login(dados.email, dados.senha)
          .then(tokens => ({
            usuario,
            ...tokens,
          }));
      });
    } catch (error) {
      throw new HttpException(extrairMensagemErro(error, 'Erro ao registrar usuário'), HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Endpoint para logout
   * @param req Requisição com usuário autenticado
   */
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logout(@Request() req: any) {
    try {
      return this.authService.logout(req.user.id)
        .then(() => ({ mensagem: 'Logout realizado com sucesso' }));
    } catch (error) {
      throw new HttpException(extrairMensagemErro(error, 'Erro ao realizar logout'), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
