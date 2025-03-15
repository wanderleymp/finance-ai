import { Controller, Get, Post, Put, Delete, Body, Param, HttpException, HttpStatus, Request } from '@nestjs/common';
import { PerfilService } from '../services/perfilService';
import { ICriarPerfilDTO, IAtualizarPerfilDTO, IAtribuirPerfilDTO } from '../interfaces/perfil.interface';
import { RequirePermissao } from '../../permissao/decorators/requirePermissao.decorator';

/**
 * Controlador para gerenciamento de perfis
 * 
 * Este controlador expõe endpoints REST para operações de gerenciamento
 * de perfis como criar, atualizar, listar e atribuir perfis a usuários.
 */
@Controller('perfis')
export class PerfilController {
  /**
   * Construtor do controlador de perfis
   * @param perfilService Serviço de perfil injetado
   */
  constructor(private readonly perfilService: PerfilService) {}

  /**
   * Endpoint para criar um novo perfil
   * @param dados Dados para criação do perfil
   * @returns Perfil criado
   */
  @Post()
  @RequirePermissao({ moduloId: 'admin', submoduloId: 'perfis', acaoId: 'criar' })
  async criar(@Body() dados: ICriarPerfilDTO, @Request() req) {
    try {
      // Obter tenant do contexto
      const tenantId = req.tenant?.id || dados.tenantId;
      if (!tenantId) {
        throw new Error('Tenant não identificado');
      }

      return await this.perfilService.criar({
        ...dados,
        tenantId,
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Endpoint para atualizar um perfil existente
   * @param id ID do perfil
   * @param dados Dados para atualização do perfil
   * @returns Perfil atualizado
   */
  @Put(':id')
  @RequirePermissao({ moduloId: 'admin', submoduloId: 'perfis', acaoId: 'editar' })
  async atualizar(@Param('id') id: string, @Body() dados: IAtualizarPerfilDTO) {
    try {
      return await this.perfilService.atualizar(id, dados);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Endpoint para buscar um perfil pelo ID
   * @param id ID do perfil
   * @returns Perfil encontrado
   */
  @Get(':id')
  @RequirePermissao({ moduloId: 'admin', submoduloId: 'perfis', acaoId: 'visualizar' })
  async buscarPorId(@Param('id') id: string) {
    try {
      return await this.perfilService.buscarPorId(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  /**
   * Endpoint para listar todos os perfis
   * @param req Requisição com tenant
   * @returns Lista de perfis
   */
  @Get()
  @RequirePermissao({ moduloId: 'admin', submoduloId: 'perfis', acaoId: 'visualizar' })
  async listar(@Request() req) {
    try {
      const tenantId = req.tenant?.id;
      const empresaId = req.headers['empresa-id'] || req.user?.empresaId;

      if (!tenantId) {
        throw new Error('Tenant não identificado');
      }

      return await this.perfilService.listar(tenantId, empresaId);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Endpoint para ativar ou desativar um perfil
   * @param id ID do perfil
   * @param ativo Status de ativação
   * @returns Perfil atualizado
   */
  @Put(':id/status')
  @RequirePermissao({ moduloId: 'admin', submoduloId: 'perfis', acaoId: 'editar' })
  async alterarStatus(@Param('id') id: string, @Body('ativo') ativo: boolean) {
    try {
      return await this.perfilService.alterarStatus(id, ativo);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Endpoint para atribuir um perfil a um usuário
   * @param dados Dados para atribuição de perfil
   * @returns Relação criada
   */
  @Post('atribuir')
  @RequirePermissao({ moduloId: 'admin', submoduloId: 'perfis', acaoId: 'atribuir' })
  async atribuirPerfilUsuario(@Body() dados: IAtribuirPerfilDTO) {
    try {
      return await this.perfilService.atribuirPerfilUsuario(dados);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Endpoint para remover um perfil de um usuário
   * @param dados Dados para remoção de perfil
   * @returns Mensagem de sucesso
   */
  @Post('remover')
  @RequirePermissao({ moduloId: 'admin', submoduloId: 'perfis', acaoId: 'remover' })
  async removerPerfilUsuario(@Body() dados: IAtribuirPerfilDTO) {
    try {
      // Chamando o método com os parâmetros separados
      await this.perfilService.removerPerfilUsuario(dados.perfilId, dados.usuarioId);
      return { mensagem: 'Perfil removido do usuário com sucesso' };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Endpoint para buscar os perfis de um usuário
   * @param usuarioId ID do usuário
   * @returns Lista de perfis do usuário
   */
  @Get('usuario/:usuarioId')
  @RequirePermissao({ moduloId: 'admin', submoduloId: 'perfis', acaoId: 'visualizar' })
  async buscarPerfisUsuario(@Param('usuarioId') usuarioId: string) {
    try {
      return await this.perfilService.buscarPerfisUsuario(usuarioId);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Endpoint para buscar os usuários de um perfil
   * @param perfilId ID do perfil
   * @returns Lista de usuários do perfil
   */
  @Get(':perfilId/usuarios')
  @RequirePermissao({ moduloId: 'admin', submoduloId: 'perfis', acaoId: 'visualizar' })
  async buscarUsuariosPerfil(@Param('perfilId') perfilId: string) {
    try {
      return await this.perfilService.buscarUsuariosPerfil(perfilId);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Endpoint para adicionar uma permissão a um perfil
   * @param perfilId ID do perfil
   * @param permissaoId ID da permissão
   * @returns Relação criada
   */
  @Post(':perfilId/permissoes/:permissaoId')
  @RequirePermissao({ moduloId: 'admin', submoduloId: 'perfis', acaoId: 'editar' })
  async adicionarPermissaoPerfil(
    @Param('perfilId') perfilId: string,
    @Param('permissaoId') permissaoId: string,
  ) {
    try {
      return await this.perfilService.adicionarPermissaoPerfil(perfilId, permissaoId);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Endpoint para remover uma permissão de um perfil
   * @param perfilId ID do perfil
   * @param permissaoId ID da permissão
   * @returns Mensagem de sucesso
   */
  @Delete(':perfilId/permissoes/:permissaoId')
  @RequirePermissao({ moduloId: 'admin', submoduloId: 'perfis', acaoId: 'editar' })
  async removerPermissaoPerfil(
    @Param('perfilId') perfilId: string,
    @Param('permissaoId') permissaoId: string,
  ) {
    try {
      await this.perfilService.removerPermissaoPerfil(perfilId, permissaoId);
      return { mensagem: 'Permissão removida do perfil com sucesso' };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Endpoint para buscar as permissões de um perfil
   * @param perfilId ID do perfil
   * @returns Lista de permissões do perfil
   */
  @Get(':perfilId/permissoes')
  @RequirePermissao({ moduloId: 'admin', submoduloId: 'perfis', acaoId: 'visualizar' })
  async buscarPermissoesPerfil(@Param('perfilId') perfilId: string) {
    try {
      return await this.perfilService.buscarPermissoesPerfil(perfilId);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
