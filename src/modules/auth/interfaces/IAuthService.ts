/**
 * Interface para o serviço de autenticação
 * 
 * Define os métodos necessários para autenticação de usuários
 * e geração/validação de tokens.
 */
export interface IAuthService {
  /**
   * Realiza o login do usuário
   * @param email Email do usuário
   * @param senha Senha do usuário
   * @returns Token de acesso e token de atualização
   */
  login(email: string, senha: string): Promise<{ accessToken: string; refreshToken: string }>;
  
  /**
   * Valida um token de acesso
   * @param token Token de acesso
   * @returns Payload do token se válido, null se inválido
   */
  validarToken(token: string): Promise<any | null>;
  
  /**
   * Atualiza um token de acesso usando um token de atualização
   * @param refreshToken Token de atualização
   * @returns Novo token de acesso e novo token de atualização
   */
  atualizarToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }>;
  
  /**
   * Invalida os tokens de um usuário (logout)
   * @param userId ID do usuário
   */
  logout(userId: string): Promise<void>;
  
  /**
   * Gera um hash para uma senha
   * @param senha Senha em texto plano
   * @returns Hash da senha
   */
  gerarHashSenha(senha: string): Promise<string>;
  
  /**
   * Verifica se uma senha corresponde a um hash
   * @param senha Senha em texto plano
   * @param hash Hash da senha
   * @returns true se a senha corresponde ao hash, false caso contrário
   */
  verificarSenha(senha: string, hash: string): Promise<boolean>;
}
