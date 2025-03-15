import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwtAuthGuard';
import { PermissaoService } from '../../permissao/services/permissaoService';
import { PerfilService } from '../../perfil/services/perfilService';

/**
 * Controlador para verificação de permissões do usuário logado
 * 
 * Este controlador expõe endpoints para verificar as permissões
 * e perfis do usuário logado.
 */
@Controller('auth/permissoes')
export class PermissoesController {
  /**
   * Construtor do controlador de permissões
   * @param permissaoService Serviço de permissão injetado
   * @param perfilService Serviço de perfil injetado
   */
  constructor(
    private readonly permissaoService: PermissaoService,
    private readonly perfilService: PerfilService,
  ) {}

  /**
   * Verifica as permissões do usuário logado
   * @param req Requisição com usuário autenticado
   * @returns Objeto com permissões do usuário
   */
  @UseGuards(JwtAuthGuard)
  @Get()
  async verificarPermissoes(@Request() req) {
    const usuarioId = req.user.id;
    const empresaId = req.user.empresaId;
    
    // Buscar permissões diretas do usuário
    const permissoes = await this.permissaoService.listarPermissoesPorUsuario(usuarioId);
    
    // Buscar perfis do usuário
    const perfis = await this.perfilService.listarPerfisPorUsuario(usuarioId);
    
    // Buscar permissões dos perfis
    const permissoesPerfis: any[] = [];
    for (const perfil of perfis) {
      const permissoesPerfil = await this.perfilService.listarPermissoesPorPerfil(perfil.id);
      if (permissoesPerfil && Array.isArray(permissoesPerfil)) {
        permissoesPerfis.push(...permissoesPerfil);
      }
    }
    
    // Combinar todas as permissões (diretas e via perfis)
    const todasPermissoes = [...permissoes, ...permissoesPerfis];
    
    // Organizar as permissões em uma estrutura hierárquica
    const permissoesOrganizadas = this.organizarPermissoes(todasPermissoes);
    
    return {
      perfis: perfis.map(p => p.nome),
      permissoes: permissoesOrganizadas,
    };
  }
  
  /**
   * Organiza as permissões em uma estrutura hierárquica
   * @param permissoes Lista de permissões
   * @returns Objeto com permissões organizadas
   */
  private organizarPermissoes(permissoes) {
    const resultado = {};
    
    for (const permissao of permissoes) {
      // Ignorar permissões não permitidas
      if (!permissao.permitido) continue;
      
      const modulo = permissao.modulo?.codigo || 'sem_modulo';
      const submodulo = permissao.submodulo?.codigo || 'geral';
      const recurso = permissao.recurso?.codigo || 'geral';
      const acao = permissao.acao?.codigo || 'acessar';
      
      // Criar estrutura se não existir
      if (!resultado[modulo]) {
        resultado[modulo] = {};
      }
      
      if (!resultado[modulo][submodulo]) {
        resultado[modulo][submodulo] = {};
      }
      
      if (!resultado[modulo][submodulo][recurso]) {
        resultado[modulo][submodulo][recurso] = [];
      }
      
      // Adicionar ação se ainda não estiver na lista
      if (!resultado[modulo][submodulo][recurso].includes(acao)) {
        resultado[modulo][submodulo][recurso].push(acao);
      }
    }
    
    return resultado;
  }
}
