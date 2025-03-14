import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { TenantContextService } from '../services/tenantContext.service';
import { TenantService } from '../../../modules/tenant/services/tenantService';

/**
 * Middleware para identificação de tenant
 * 
 * Este middleware identifica o tenant com base no domínio da requisição
 * e configura o contexto do tenant para a requisição atual.
 */
@Injectable()
export class TenantMiddleware implements NestMiddleware {
  /**
   * Construtor do middleware de tenant
   * @param tenantContextService Serviço de contexto de tenant injetado
   * @param tenantService Serviço de tenant injetado
   */
  constructor(
    private readonly tenantContextService: TenantContextService,
    private readonly tenantService: TenantService,
  ) {}

  /**
   * Método executado para cada requisição
   * @param req Objeto de requisição
   * @param res Objeto de resposta
   * @param next Função para continuar o fluxo de middlewares
   */
  async use(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Obter o domínio da requisição
      const dominio = this.extrairDominio(req);
      
      if (dominio) {
        // Buscar o tenant pelo domínio
        const tenant = await this.tenantService.buscarPorDominio(dominio);
        
        if (tenant && tenant.ativo) {
          // Configurar o tenant no contexto
          this.tenantContextService.setCurrentTenantId(tenant.id);
        }
      }
      
      // Continuar o fluxo de middlewares
      next();
    } catch (error) {
      console.error('Erro ao identificar tenant:', error);
      next();
    }
  }

  /**
   * Extrai o domínio da requisição
   * @param req Objeto de requisição
   * @returns Domínio extraído ou null
   */
  private extrairDominio(req: Request): string | null {
    // Tentar obter o domínio do cabeçalho Host
    const host = req.headers.host;
    if (host) {
      // Remover a porta, se houver
      return host.split(':')[0];
    }
    
    // Tentar obter o domínio do cabeçalho Origin
    const origin = req.headers.origin;
    if (origin) {
      try {
        const url = new URL(origin);
        return url.hostname;
      } catch (error) {
        console.error('Erro ao extrair domínio do Origin:', error);
      }
    }
    
    // Tentar obter o domínio do cabeçalho X-Tenant-ID
    const tenantId = req.headers['x-tenant-id'];
    if (tenantId && typeof tenantId === 'string') {
      return tenantId;
    }
    
    return null;
  }
}
