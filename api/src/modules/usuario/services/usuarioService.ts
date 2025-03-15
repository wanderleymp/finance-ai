import { Injectable } from '@nestjs/common';
import { UsuarioRepository } from '../repositories/usuarioRepository';
import { Usuario } from '../interfaces/usuario.interface';
import { JwtAuthService } from '../../auth/services/jwtAuthService';
import { PerfilService } from '../../perfil/services/perfilService';

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
 * Serviço para gerenciamento de usuários
 * 
 * Este serviço encapsula a lógica de negócio relacionada
 * aos usuários no sistema SaaS.
 */
@Injectable()
export class UsuarioService {
  /**
   * Construtor do serviço de usuário
   * @param usuarioRepository Repositório de usuário injetado
   * @param authService Serviço de autenticação injetado
   */
  constructor(
    private readonly usuarioRepository: UsuarioRepository,
    private readonly authService: JwtAuthService,
    private readonly perfilService: PerfilService
  ) {}

  /**
   * Busca todos os usuários
   * @returns Promise com array de usuários
   */
  async buscarTodos(): Promise<Usuario[]> {
    return this.usuarioRepository.findAll();
  }

  /**
   * Busca um usuário pelo ID
   * @param id Identificador do usuário
   * @returns Promise com o usuário encontrado ou null
   */
  async buscarPorId(id: string): Promise<Usuario | null> {
    return this.usuarioRepository.findById(id);
  }

  /**
   * Busca um usuário pelo email
   * @param email Email do usuário
   * @returns Promise com o usuário encontrado ou null
   */
  async buscarPorEmail(email: string): Promise<Usuario | null> {
    return this.usuarioRepository.buscarPorEmail(email);
  }

  /**
   * Cria um novo usuário
   * @param dados Dados para criação do usuário
   * @returns Promise com o usuário criado
   */
  async criar(dados: ICriarUsuarioDTO): Promise<Usuario> {
    // Verificar se já existe um usuário com o mesmo email
    const usuarioExistente = await this.usuarioRepository.buscarPorEmail(dados.email);
    if (usuarioExistente) {
      throw new Error(`Já existe um usuário com o email ${dados.email}`);
    }

    // Gerar hash da senha
    const senhaHash = await this.authService.gerarHashSenha(dados.senha);

    // Criar o usuário
    const novoUsuario = await this.usuarioRepository.create({
      nome: dados.nome,
      email: dados.email,
      senha: senhaHash,
      tenantId: dados.tenantId,
      empresaId: dados.empresaId,
      ativo: dados.ativo !== undefined ? dados.ativo : true,
      dataCriacao: new Date(),
    });
    
    // Remover a senha do objeto retornado
    const { senha, ...usuarioSemSenha } = novoUsuario;
    return usuarioSemSenha as Usuario;
  }

  /**
   * Atualiza um usuário existente
   * @param id Identificador do usuário
   * @param dados Dados para atualização do usuário
   * @returns Promise com o usuário atualizado
   */
  async atualizar(id: string, dados: IAtualizarUsuarioDTO): Promise<Usuario> {
    // Verificar se o usuário existe
    const usuarioExistente = await this.usuarioRepository.findById(id);
    if (!usuarioExistente) {
      throw new Error(`Usuário com ID ${id} não encontrado`);
    }

    // Verificar se está tentando atualizar o email para um que já existe
    if (dados.email && dados.email !== usuarioExistente.email) {
      const usuarioComMesmoEmail = await this.usuarioRepository.buscarPorEmail(dados.email);
      if (usuarioComMesmoEmail) {
        throw new Error(`Já existe um usuário com o email ${dados.email}`);
      }
    }

    // Preparar dados para atualização
    const dadosAtualizacao: Partial<Usuario> = {
      ...dados,
      dataAtualizacao: new Date(),
    };

    // Se a senha foi fornecida, gerar hash
    if (dados.senha) {
      dadosAtualizacao.senha = await this.authService.gerarHashSenha(dados.senha);
    }

    // Atualizar o usuário
    const usuarioAtualizado = await this.usuarioRepository.update(id, dadosAtualizacao);
    
    // Remover a senha do objeto retornado
    const { senha, ...usuarioSemSenha } = usuarioAtualizado;
    return usuarioSemSenha as Usuario;
  }

  /**
   * Ativa ou desativa um usuário
   * @param id Identificador do usuário
   * @param ativo Status de ativação
   * @returns Promise com o usuário atualizado
   */
  async alterarStatus(id: string, ativo: boolean): Promise<Usuario> {
    // Verificar se o usuário existe
    const usuarioExistente = await this.usuarioRepository.findById(id);
    if (!usuarioExistente) {
      throw new Error(`Usuário com ID ${id} não encontrado`);
    }

    // Atualizar o status do usuário
    const usuarioAtualizado = await this.usuarioRepository.update(id, {
      ativo,
      dataAtualizacao: new Date(),
    });
    
    // Remover a senha do objeto retornado
    const { senha, ...usuarioSemSenha } = usuarioAtualizado;
    return usuarioSemSenha as Usuario;
  }

  /**
   * Exclui um usuário
   * @param id Identificador do usuário
   */
  async excluir(id: string): Promise<void> {
    // Verificar se o usuário existe
    const usuarioExistente = await this.usuarioRepository.findById(id);
    if (!usuarioExistente) {
      throw new Error(`Usuário com ID ${id} não encontrado`);
    }

    // Excluir o usuário
    await this.usuarioRepository.delete(id);
  }

  /**
   * Altera a senha de um usuário
   * @param id Identificador do usuário
   * @param senhaAtual Senha atual
   * @param novaSenha Nova senha
   * @returns Promise com o usuário atualizado
   */
  async alterarSenha(id: string, senhaAtual: string, novaSenha: string): Promise<Usuario> {
    // Verificar se o usuário existe
    const usuario = await this.usuarioRepository.findById(id);
    if (!usuario) {
      throw new Error(`Usuário com ID ${id} não encontrado`);
    }

    // Verificar se a senha atual está correta
    const senhaValida = await this.authService.verificarSenha(senhaAtual, usuario.senha);
    if (!senhaValida) {
      throw new Error('Senha atual incorreta');
    }

    // Gerar hash da nova senha
    const novaSenhaHash = await this.authService.gerarHashSenha(novaSenha);

    // Atualizar a senha do usuário
    const usuarioAtualizado = await this.usuarioRepository.update(id, {
      senha: novaSenhaHash,
      dataAtualizacao: new Date(),
    });
    
    // Remover a senha do objeto retornado
    const { senha, ...usuarioSemSenha } = usuarioAtualizado;
    return usuarioSemSenha as Usuario;
  }

  /**
   * Atribui um perfil a um usuário
   * @param usuarioId Identificador do usuário
   * @param perfilId Identificador do perfil
   * @returns Promise com o resultado da operação
   */
  async atribuirPerfil(usuarioId: string, perfilId: string): Promise<void> {
    // Verificar se o usuário existe
    const usuario = await this.usuarioRepository.findById(usuarioId);
    if (!usuario) {
      throw new Error(`Usuário com ID ${usuarioId} não encontrado`);
    }

    // Atribuir o perfil ao usuário
    await this.perfilService.atribuirPerfilAoUsuario(perfilId, usuarioId);
  }

  /**
   * Remove um perfil de um usuário
   * @param usuarioId Identificador do usuário
   * @param perfilId Identificador do perfil
   * @returns Promise com o resultado da operação
   */
  async removerPerfil(usuarioId: string, perfilId: string): Promise<void> {
    // Verificar se o usuário existe
    const usuario = await this.usuarioRepository.findById(usuarioId);
    if (!usuario) {
      throw new Error(`Usuário com ID ${usuarioId} não encontrado`);
    }

    // Remover o perfil do usuário
    await this.perfilService.removerPerfilUsuario(perfilId, usuarioId);
  }

  /**
   * Lista os perfis de um usuário
   * @param usuarioId Identificador do usuário
   * @returns Promise com a lista de perfis do usuário
   */
  async listarPerfis(usuarioId: string): Promise<any[]> {
    // Verificar se o usuário existe
    const usuario = await this.usuarioRepository.findById(usuarioId);
    if (!usuario) {
      throw new Error(`Usuário com ID ${usuarioId} não encontrado`);
    }

    // Buscar os perfis do usuário
    return this.perfilService.listarPerfisPorUsuario(usuarioId);
  }
}
