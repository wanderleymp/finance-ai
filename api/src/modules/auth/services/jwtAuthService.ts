import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { IAuthService } from '../interfaces/IAuthService';
import { UsuarioRepository } from '../../usuario/repositories/usuarioRepository';

/**
 * Implementação do serviço de autenticação usando JWT
 * 
 * Este serviço implementa a interface IAuthService para fornecer
 * funcionalidades de autenticação usando JSON Web Tokens.
 */
@Injectable()
export class JwtAuthService implements IAuthService {
  /**
   * Construtor do serviço de autenticação JWT
   * @param jwtService Serviço JWT injetado
   * @param usuarioRepository Repositório de usuário injetado
   */
  constructor(
    private readonly jwtService: JwtService,
    private readonly usuarioRepository: UsuarioRepository,
  ) {}

  /**
   * Realiza o login do usuário
   * @param email Email do usuário
   * @param senha Senha do usuário
   * @returns Token de acesso e token de atualização
   */
  async login(email: string, senha: string): Promise<{ accessToken: string; refreshToken: string }> {
    // Buscar usuário pelo email
    const usuario = await this.usuarioRepository.buscarPorEmail(email);
    if (!usuario) {
      throw new Error('Usuário não encontrado');
    }

    // Verificar se o usuário está ativo
    if (!usuario.ativo) {
      throw new Error('Usuário inativo');
    }

    // Verificar senha
    const senhaValida = await this.verificarSenha(senha, usuario.senha);
    if (!senhaValida) {
      throw new Error('Senha inválida');
    }

    // Gerar tokens
    const payload = {
      sub: usuario.id,
      email: usuario.email,
      tenantId: usuario.tenantId,
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '1h',
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '7d',
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  /**
   * Valida um token de acesso
   * @param token Token de acesso
   * @returns Payload do token se válido, null se inválido
   */
  async validarToken(token: string): Promise<any | null> {
    try {
      const payload = this.jwtService.verify(token);
      return payload;
    } catch (error) {
      // Usar tratamento seguro de erro
      const errorMessage = error && typeof error === 'object' && 'message' in error ? error.message : 'Erro desconhecido';
      console.error(`Erro ao validar token: ${errorMessage}`);
      return null;
    }
  }

  /**
   * Atualiza um token de acesso usando um token de atualização
   * @param refreshToken Token de atualização
   * @returns Novo token de acesso e novo token de atualização
   */
  async atualizarToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      // Verificar se o refresh token é válido
      const payload = this.jwtService.verify(refreshToken);
      
      try {
        // Buscar usuário pelo ID
        const usuario = await this.usuarioRepository.findById(payload.sub);
        if (!usuario) {
          throw new Error('Usuário não encontrado');
        }

        // Verificar se o usuário está ativo
        if (!usuario.ativo) {
          throw new Error('Usuário inativo');
        }

        // Gerar novos tokens
        const newPayload = {
          sub: usuario.id,
          email: usuario.email,
          tenantId: usuario.tenantId,
        };

        const accessToken = this.jwtService.sign(newPayload, {
          expiresIn: '1h',
        });

        const newRefreshToken = this.jwtService.sign(newPayload, {
          expiresIn: '7d',
        });

        return {
          accessToken,
          refreshToken: newRefreshToken,
        };
      } catch (userError) {
        // Propagar erros relacionados ao usuário
        const errorMessage = userError && typeof userError === 'object' && 'message' in userError ? userError.message : 'Erro desconhecido';
        console.error(`Erro ao atualizar token: ${errorMessage}`);
        throw userError; // Propaga o erro original
      }
    } catch (error) {
      // Tratar apenas erros de token inválido
      const errorMessage = error && typeof error === 'object' && 'message' in error ? error.message : 'Erro desconhecido';
      console.error(`Erro ao atualizar token: ${errorMessage}`);
      throw new Error('Token de atualização inválido');
    }
  }

  /**
   * Invalida os tokens de um usuário (logout)
   * @param userId ID do usuário
   */
  async logout(userId: string): Promise<void> {
    // Implementação depende de como você quer gerenciar o logout
    // Pode ser usando uma lista negra de tokens ou simplesmente não fazer nada
    // e deixar os tokens expirarem naturalmente
    
    // Para uma implementação mais robusta, seria necessário armazenar os tokens
    // em um banco de dados ou Redis e marcá-los como inválidos no logout
    console.log(`Logout do usuário ${userId}`);
  }

  /**
   * Gera um hash para uma senha
   * @param senha Senha em texto plano
   * @returns Hash da senha
   */
  async gerarHashSenha(senha: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(senha, salt);
  }

  /**
   * Verifica se uma senha corresponde a um hash
   * @param senha Senha em texto plano
   * @param hash Hash da senha
   * @returns true se a senha corresponde ao hash, false caso contrário
   */
  async verificarSenha(senha: string, hash: string): Promise<boolean> {
    return bcrypt.compare(senha, hash);
  }
}
