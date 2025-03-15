import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { TenantContextService } from '../services/tenantContext.service';

/**
 * Middleware para identificação de tenant
 * 
 * Este middleware é responsável por extrair o identificador do tenant
 * da requisição e configurá-lo no contexto da aplicação.
 */
@Injectable()
export class TenantIdentificationMiddleware implements NestMiddleware {
  /**
   * Construtor do middleware
   * @param tenantContextService Serviço de contexto de tenant
   */
  constructor(private readonly tenantContextService: TenantContextService) {}

  /**
   * Método executado para cada requisição
   * @param req Objeto de requisição
   * @param res Objeto de resposta
   * @param next Função para passar para o próximo middleware
   */
  use(req: Request, res: Response, next: NextFunction) {
    // Extrair tenant_id do header, token JWT ou subdomínio
    const tenantId = this.extrairTenantId(req);
    
    if (tenantId) {
      this.tenantContextService.setCurrentTenantId(tenantId);
    }
    
    // Limpar o contexto do tenant após a requisição ser concluída
    res.on('finish', () => {
      this.tenantContextService.clearCurrentTenant();
    });
    
    next();
  }

  /**
   * Extrai o identificador do tenant da requisição
   * @param req Objeto de requisição
   * @returns Identificador do tenant ou null se não for encontrado
   */
  private extrairTenantId(req: Request): string | null {
    // Estratégia 1: Extrair do header
    const tenantIdFromHeader = req.headers['x-tenant-id'];
    if (tenantIdFromHeader) {
      return Array.isArray(tenantIdFromHeader) 
        ? tenantIdFromHeader[0] 
        : tenantIdFromHeader;
    }
    
    // Estratégia 2: Extrair do token JWT
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      // Implementação para extrair tenant_id do token JWT
      // Será implementada quando configurarmos a autenticação
    }
    
    // Estratégia 3: Extrair do subdomínio
    const host = req.headers.host;
    if (host && host.includes('.')) {
      const subdomain = host.split('.')[0];
      // Implementação para mapear subdomínio para tenant_id
      // Será necessário consultar o banco de dados
    }
    
    return null;
  }
}
