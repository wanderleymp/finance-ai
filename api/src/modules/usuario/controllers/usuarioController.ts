import { Controller, Get, Post, Put, Delete, Body, Param, HttpException, HttpStatus, UseGuards, Request } from '@nestjs/common';
import { UsuarioService } from '../services/usuarioService';
import { Usuario } from '../interfaces/usuario.interface';
import { JwtAuthGuard } from '../../auth/guards/jwtAuthGuard';
import { RequirePermissao } from '../../permissao/decorators/requirePermissao.decorator';

/**
 * Interface para criação de usuário
 */
interface ICriarUsuarioDTO {
  nome: string;
  email: string;
  senha: string;
  tenantId?: string;
  empresaId?: string;
  ativo?: boolean;
}

/**
 * Interface para atualização de usuário
 */
interface IAtualizarUsuarioDTO {
  nome?: string;
  email?: string;
  senha?: string;
  ativo?: boolean;
}

/**
 * Interface para alteração de senha
 */
interface IAlterarSenhaDTO {
  senhaAtual: string;
  novaSenha: string;
}

/**
 * Controlador para operações de usuário
 * 
 * Este controlador expõe endpoints REST para gerenciamento
 * de usuários no sistema SaaS.
 */
@Controller('usuarios')
export class UsuarioController {
  /**
   * Construtor do controlador de usuário
   * @param usuarioService Serviço de usuário injetado
   */
  constructor(private readonly usuarioService: UsuarioService) {}

  /**
   * Busca todos os usuários
   * @returns Lista de usuários
   */
  @UseGuards(JwtAuthGuard)
  @Get()
  async buscarTodos(): Promise<Omit<Usuario, 'senha'>[]> {
    try {
      const usuarios = await this.usuarioService.buscarTodos();
      // Remover a senha de todos os usuários
      return usuarios.map(({ senha, ...usuarioSemSenha }) => usuarioSemSenha);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Busca um usuário pelo ID
   * @param id Identificador do usuário
   * @returns Usuário encontrado
   */
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async buscarPorId(@Param('id') id: string): Promise<Omit<Usuario, 'senha'>> {
    try {
      const usuario = await this.usuarioService.buscarPorId(id);
      if (!usuario) {
        throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);
      }
      // Remover a senha do usuário
      const { senha, ...usuarioSemSenha } = usuario;
      return usuarioSemSenha;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Cria um novo usuário
   * @param dados Dados para criação do usuário
   * @returns Usuário criado
   */
  @Post()
  async criar(@Body() dados: ICriarUsuarioDTO): Promise<Omit<Usuario, 'senha'>> {
    try {
      return await this.usuarioService.criar(dados);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Atualiza um usuário existente
   * @param id Identificador do usuário
   * @param dados Dados para atualização do usuário
   * @returns Usuário atualizado
   */
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async atualizar(
    @Param('id') id: string,
    @Body() dados: IAtualizarUsuarioDTO,
  ): Promise<Omit<Usuario, 'senha'>> {
    try {
      return await this.usuarioService.atualizar(id, dados);
    } catch (error) {
      if (error.message.includes('não encontrado')) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Altera o status de um usuário (ativo/inativo)
   * @param id Identificador do usuário
   * @param ativo Status de ativação
   * @returns Usuário atualizado
   */
  @UseGuards(JwtAuthGuard)
  @Put(':id/status')
  async alterarStatus(
    @Param('id') id: string,
    @Body('ativo') ativo: boolean,
  ): Promise<Omit<Usuario, 'senha'>> {
    try {
      return await this.usuarioService.alterarStatus(id, ativo);
    } catch (error) {
      if (error.message.includes('não encontrado')) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Altera a senha do usuário autenticado
   * @param req Requisição com usuário autenticado
   * @param dados Dados para alteração de senha
   * @returns Usuário atualizado
   */
  @UseGuards(JwtAuthGuard)
  @Put('senha')
  async alterarSenha(
    @Request() req,
    @Body() dados: IAlterarSenhaDTO,
  ): Promise<Omit<Usuario, 'senha'>> {
    try {
      return await this.usuarioService.alterarSenha(
        req.user.id,
        dados.senhaAtual,
        dados.novaSenha,
      );
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Exclui um usuário
   * @param id Identificador do usuário
   */
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async excluir(@Param('id') id: string): Promise<void> {
    try {
      await this.usuarioService.excluir(id);
    } catch (error) {
      if (error.message.includes('não encontrado')) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Lista os perfis de um usuário
   * @param id Identificador do usuário
   * @returns Lista de perfis do usuário
   */
  @UseGuards(JwtAuthGuard)
  @RequirePermissao({ moduloId: 'usuarios', submoduloId: 'perfil', acaoId: 'listar' })
  @Get(':id/perfis')
  async listarPerfis(@Param('id') id: string): Promise<any[]> {
    try {
      return await this.usuarioService.listarPerfis(id);
    } catch (error) {
      if (error.message.includes('não encontrado')) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Atribui um perfil a um usuário
   * @param id Identificador do usuário
   * @param perfilId Identificador do perfil
   */
  @UseGuards(JwtAuthGuard)
  @RequirePermissao({ moduloId: 'usuarios', submoduloId: 'perfil', acaoId: 'atribuir' })
  @Post(':id/perfis/:perfilId')
  async atribuirPerfil(
    @Param('id') id: string,
    @Param('perfilId') perfilId: string,
  ): Promise<void> {
    try {
      await this.usuarioService.atribuirPerfil(id, perfilId);
    } catch (error) {
      if (error.message.includes('não encontrado')) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Remove um perfil de um usuário
   * @param id Identificador do usuário
   * @param perfilId Identificador do perfil
   */
  @UseGuards(JwtAuthGuard)
  @RequirePermissao({ moduloId: 'usuarios', submoduloId: 'perfil', acaoId: 'remover' })
  @Delete(':id/perfis/:perfilId')
  async removerPerfil(
    @Param('id') id: string,
    @Param('perfilId') perfilId: string,
  ): Promise<void> {
    try {
      await this.usuarioService.removerPerfil(id, perfilId);
    } catch (error) {
      if (error.message.includes('não encontrado')) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
