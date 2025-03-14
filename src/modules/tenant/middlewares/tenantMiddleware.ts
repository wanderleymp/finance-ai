import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { TenantService } from '../services/tenantService';

/**
 * Interface para representar o usuário autenticado com informações do tenant
 */
interface IUsuarioAutenticado {
  id: string;
  email: string;
  tenant?: string | { id: string };
  [key: string]: any;
}

/**
 * Middleware para identificação de tenant
 * 
 * Este middleware identifica o tenant atual com base em:
 * 1. Cabeçalho HTTP 'X-Tenant-ID'
 * 2. Subdomínio da URL
 * 3. Token JWT (se autenticado)
 * 
 * O tenant identificado é adicionado ao objeto Request para uso
 * posterior nos controladores e serviços.
 */
@Injectable()
export class TenantMiddleware implements NestMiddleware {
  /**
   * Construtor do middleware de tenant
   * @param tenantService Serviço de tenant injetado
   */
  constructor(private readonly tenantService: TenantService) {}

  /**
   * Método de execução do middleware
   * @param req Objeto de requisição
   * @param res Objeto de resposta
   * @param next Função para passar para o próximo middleware
   */
  async use(req: Request, res: Response, next: NextFunction) {
    try {
      // 1. Verificar cabeçalho HTTP 'X-Tenant-ID'
      const tenantId = req.headers['x-tenant-id'] as string;
      if (tenantId) {
        const tenant = await this.tenantService.buscarPorId(tenantId);
        if (tenant && tenant.ativo) {
          // Adicionar tenant ao objeto Request
          req['tenant'] = tenant;
          return next();
        }
      }

      // 2. Verificar subdomínio
      const host = req.headers.host;
      if (host) {
        const dominioParts = host.split('.');
        if (dominioParts.length > 1) {
          const subdominio = dominioParts[0];
          const tenant = await this.tenantService.buscarPorDominio(subdominio);
          if (tenant && tenant.ativo) {
            // Adicionar tenant ao objeto Request
            req['tenant'] = tenant;
            return next();
          }
        }
      }

      // 3. Verificar token JWT (se autenticado)
      const usuario = req['user'] as IUsuarioAutenticado | undefined;
      
      if (usuario && usuario.tenant) {
        const tenantId = typeof usuario.tenant === 'object' ? 
          usuario.tenant.id : usuario.tenant;
        
        if (tenantId) {
          const tenant = await this.tenantService.buscarPorId(tenantId);
          if (tenant && tenant.ativo) {
            // Adicionar tenant ao objeto Request
            req['tenant'] = tenant;
            return next();
          }
        }
      }

      // Se chegou aqui, não foi possível identificar o tenant
      // Verificar se a rota é pública (não requer tenant)
      const isPublicRoute = this.isPublicRoute(req.path);
      if (isPublicRoute) {
        // Para rotas públicas, continuar sem tenant
        return next();
      }

      // Para rotas que exigem tenant, retornar erro
      return res.status(401).json({
        statusCode: 401,
        message: 'Tenant não identificado ou inativo',
      });
    } catch (error) {
      console.error('Erro ao identificar tenant:', error);
      return res.status(500).json({
        statusCode: 500,
        message: 'Erro interno ao identificar tenant',
      });
    }
  }

  /**
   * Verifica se a rota é pública (não requer tenant)
   * @param path Caminho da requisição
   * @returns true se a rota for pública
   */
  private isPublicRoute(path: string): boolean {
    // Lista de rotas públicas que não requerem tenant
    const publicRoutes = [
      '/auth/login',
      '/auth/refresh',
      '/tenants',
      '/health',
      '/docs',
    ];

    // Verificar se o path começa com alguma das rotas públicas
    return publicRoutes.some(route => path.startsWith(route));
  }
}

/**
 * Interface para estender o tipo Request do Express
 * para incluir o tenant
 */
declare global {
  namespace Express {
    interface Request {
      tenant?: any;
    }
  }
}
