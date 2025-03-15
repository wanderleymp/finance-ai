import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request, HttpException, HttpStatus } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwtAuthGuard';
import { RequirePermissao } from '../decorators/requirePermissao.decorator';
import { GrupoPermissaoService } from '../services/grupoPermissaoService';
import { ICriarGrupoPermissaoDTO, IAtualizarGrupoPermissaoDTO } from '../interfaces/IGrupoPermissao';

/**
 * Interface para atribuição de grupo a usuário
 */
interface IAtribuirGrupoUsuarioDTO {
  usuarioId: string;
  grupoId: string;
}

/**
 * Controlador para gerenciamento de grupos de permissões
 */
@Controller('grupos-permissoes')
@UseGuards(JwtAuthGuard)
export class GrupoPermissaoController {
  constructor(private readonly grupoPermissaoService: GrupoPermissaoService) {}

  /**
   * Endpoint para listar grupos de permissões
   * @param tenantId ID do tenant
   * @param empresaId ID da empresa (opcional)
   * @returns Lista de grupos de permissões
   */
  @Get()
  @RequirePermissao({ moduloId: 'admin', submoduloId: 'permissoes', acaoId: 'visualizar' })
  async listar(
    @Query('tenantId') tenantId: string,
    @Query('empresaId') empresaId?: string
  ) {
    try {
      return await this.grupoPermissaoService.listarPorTenant(tenantId, empresaId);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Endpoint para buscar um grupo de permissões pelo ID
   * @param id ID do grupo
   * @returns Grupo de permissões
   */
  @Get(':id')
  @RequirePermissao({ moduloId: 'admin', submoduloId: 'permissoes', acaoId: 'visualizar' })
  async buscarPorId(@Param('id') id: string) {
    try {
      return await this.grupoPermissaoService.buscarPorId(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  /**
   * Endpoint para criar um grupo de permissões
   * @param dados Dados para criação do grupo
   * @returns Grupo de permissões criado
   */
  @Post()
  @RequirePermissao({ moduloId: 'admin', submoduloId: 'permissoes', acaoId: 'criar' })
  async criar(@Body() dados: ICriarGrupoPermissaoDTO) {
    try {
      return await this.grupoPermissaoService.criar(dados);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Endpoint para atualizar um grupo de permissões
   * @param id ID do grupo
   * @param dados Dados para atualização
   * @returns Grupo atualizado
   */
  @Put(':id')
  @RequirePermissao({ moduloId: 'admin', submoduloId: 'permissoes', acaoId: 'editar' })
  async atualizar(
    @Param('id') id: string,
    @Body() dados: IAtualizarGrupoPermissaoDTO
  ) {
    try {
      return await this.grupoPermissaoService.atualizar(id, dados);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Endpoint para excluir um grupo de permissões
   * @param id ID do grupo
   * @returns Mensagem de sucesso
   */
  @Delete(':id')
  @RequirePermissao({ moduloId: 'admin', submoduloId: 'permissoes', acaoId: 'excluir' })
  async excluir(@Param('id') id: string) {
    try {
      await this.grupoPermissaoService.excluir(id);
      return { mensagem: 'Grupo de permissões excluído com sucesso' };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Endpoint para listar grupos de permissões de um usuário
   * @param usuarioId ID do usuário
   * @returns Lista de grupos de permissões
   */
  @Get('usuario/:usuarioId')
  @RequirePermissao({ moduloId: 'admin', submoduloId: 'permissoes', acaoId: 'visualizar' })
  async listarPorUsuario(@Param('usuarioId') usuarioId: string) {
    try {
      return await this.grupoPermissaoService.listarPorUsuario(usuarioId);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Endpoint para atribuir um grupo de permissões a um usuário
   * @param dados Dados para atribuição
   * @returns Mensagem de sucesso
   */
  @Post('atribuir')
  @RequirePermissao({ moduloId: 'admin', submoduloId: 'permissoes', acaoId: 'conceder' })
  async atribuirAoUsuario(@Body() dados: IAtribuirGrupoUsuarioDTO) {
    try {
      await this.grupoPermissaoService.atribuirAoUsuario(dados.grupoId, dados.usuarioId);
      return { mensagem: 'Grupo de permissões atribuído com sucesso' };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Endpoint para remover um grupo de permissões de um usuário
   * @param dados Dados para remoção
   * @returns Mensagem de sucesso
   */
  @Post('remover')
  @RequirePermissao({ moduloId: 'admin', submoduloId: 'permissoes', acaoId: 'revogar' })
  async removerDoUsuario(@Body() dados: IAtribuirGrupoUsuarioDTO) {
    try {
      await this.grupoPermissaoService.removerDoUsuario(dados.grupoId, dados.usuarioId);
      return { mensagem: 'Grupo de permissões removido com sucesso' };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
