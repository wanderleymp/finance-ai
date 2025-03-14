import { Controller, Get, Post, Delete, Body, Param, UseGuards, Request, HttpException, HttpStatus } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwtAuthGuard';
import { PermissaoService } from '../services/permissaoService';
import { PermissaoPadraoService } from '../services/permissaoPadraoService';
import { RequirePermissao, PermissaoGuard } from '../guards/permissaoGuard';

/**
 * Interface para atribuição de permissões padrão
 */
interface IAtribuirPermissoesPadraoDTO {
  usuarioId: string;
  empresaId: string;
  tipo: 'admin' | 'comum';
}

/**
 * Interface para concessão de permissão
 */
interface IConcederPermissaoDTO {
  usuarioId: string;
  empresaId: string;
  moduloId: string;
  submoduloId?: string;
  recursoId?: string;
  acaoId?: string;
}

/**
 * Controlador para gerenciamento de permissões
 * 
 * Este controlador expõe endpoints REST para operações de gerenciamento
 * de permissões como listar, conceder e revogar.
 */
@Controller('permissoes')
@UseGuards(JwtAuthGuard)
export class PermissaoController {
  /**
   * Construtor do controlador de permissões
   * @param permissaoService Serviço de permissões injetado
   * @param permissaoPadraoService Serviço de permissões padrão injetado
   */
  constructor(
    private readonly permissaoService: PermissaoService,
    private readonly permissaoPadraoService: PermissaoPadraoService
  ) {}

  /**
   * Endpoint para listar permissões do usuário autenticado
   * @param req Requisição com usuário autenticado
   * @returns Lista de permissões do usuário
   */
  @Get('minhas')
  async listarMinhasPermissoes(@Request() req) {
    try {
      return await this.permissaoService.obterPermissoesUsuario(req.user.id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Endpoint para listar permissões de um usuário específico
   * @param usuarioId ID do usuário
   * @returns Lista de permissões do usuário
   */
  @Get('usuario/:usuarioId')
  @UseGuards(PermissaoGuard)
  @RequirePermissao('admin', 'usuarios', undefined, 'visualizar')
  async listarPermissoesUsuario(@Param('usuarioId') usuarioId: string) {
    try {
      return await this.permissaoService.obterPermissoesUsuario(usuarioId);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Endpoint para conceder permissão a um usuário
   * @param dados Dados da permissão a ser concedida
   * @returns Permissão concedida
   */
  @Post('conceder')
  @UseGuards(PermissaoGuard)
  @RequirePermissao('admin', 'permissoes', undefined, 'conceder')
  async concederPermissao(@Body() dados: IConcederPermissaoDTO) {
    try {
      return await this.permissaoService.concederPermissao(
        dados.usuarioId,
        dados.empresaId,
        dados.moduloId,
        dados.submoduloId,
        dados.recursoId,
        dados.acaoId,
      );
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Endpoint para revogar uma permissão
   * @param permissaoId ID da permissão a ser revogada
   * @returns Mensagem de sucesso
   */
  @Delete(':permissaoId')
  @UseGuards(PermissaoGuard)
  @RequirePermissao('admin', 'permissoes', undefined, 'revogar')
  async revogarPermissao(@Param('permissaoId') permissaoId: string) {
    try {
      await this.permissaoService.revogarPermissao(permissaoId);
      return { mensagem: 'Permissão revogada com sucesso' };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  
  /**
   * Endpoint para atribuir permissões padrão a um usuário
   * @param dados Dados para atribuição de permissões padrão
   * @returns Mensagem de sucesso
   */
  @Post('padrao')
  @UseGuards(PermissaoGuard)
  @RequirePermissao('admin', 'permissoes', undefined, 'conceder')
  async atribuirPermissoesPadrao(@Body() dados: IAtribuirPermissoesPadraoDTO) {
    try {
      if (dados.tipo === 'admin') {
        await this.permissaoPadraoService.criarPermissoesAdministrador(
          dados.usuarioId,
          dados.empresaId
        );
      } else {
        await this.permissaoPadraoService.criarPermissoesUsuarioComum(
          dados.usuarioId,
          dados.empresaId
        );
      }
      
      return { mensagem: `Permissões padrão de ${dados.tipo} atribuídas com sucesso` };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
