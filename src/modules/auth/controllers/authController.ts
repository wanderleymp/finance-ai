import { Controller, Post, Body, HttpException, HttpStatus, UseGuards, Get, Request } from '@nestjs/common';
import { JwtAuthService } from '../services/jwtAuthService';
import { JwtAuthGuard } from '../guards/jwtAuthGuard';

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
 * Controlador para autenticação
 * 
 * Este controlador expõe endpoints REST para operações de autenticação
 * como login, logout e atualização de token.
 */
@Controller('auth')
export class AuthController {
  /**
   * Construtor do controlador de autenticação
   * @param authService Serviço de autenticação injetado
   */
  constructor(private readonly authService: JwtAuthService) {}

  /**
   * Endpoint para login
   * @param dados Dados de login
   * @returns Tokens de acesso e atualização
   */
  @Post('login')
  async login(@Body() dados: ILoginDTO) {
    try {
      return await this.authService.login(dados.email, dados.senha);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
    }
  }

  /**
   * Endpoint para atualização de token
   * @param dados Token de atualização
   * @returns Novos tokens de acesso e atualização
   */
  @Post('refresh')
  async refresh(@Body() dados: IRefreshTokenDTO) {
    try {
      return await this.authService.atualizarToken(dados.refreshToken);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
    }
  }

  /**
   * Endpoint para obter o perfil do usuário autenticado
   * @param req Requisição com usuário autenticado
   * @returns Perfil do usuário
   */
  @UseGuards(JwtAuthGuard)
  @Get('perfil')
  getPerfil(@Request() req) {
    return req.user;
  }

  /**
   * Endpoint para logout
   * @param req Requisição com usuário autenticado
   */
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Request() req) {
    try {
      await this.authService.logout(req.user.id);
      return { mensagem: 'Logout realizado com sucesso' };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
