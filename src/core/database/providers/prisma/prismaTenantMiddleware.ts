/**
 * Middleware do Prisma para isolamento de dados por tenant
 * 
 * Esta função cria um middleware para o Prisma que adiciona automaticamente
 * o filtro de tenant_id em todas as operações de banco de dados.
 * 
 * @param getTenantId Função que retorna o tenant_id atual
 * @returns Função de middleware do Prisma
 */
export function criarTenantMiddleware(getTenantId: () => string | null) {
  return async (
    params: any,
    next: (params: any) => Promise<any>,
  ) => {
    // Obter o tenant_id do contexto atual
    const tenantId = getTenantId();
    
    // Se não houver tenant_id, continuar sem modificar a query
    if (!tenantId) {
      return next(params);
    }

    // Lista de modelos que não devem ser filtrados por tenant_id
    const modelosSemTenant = ['Tenant', 'Modulo', 'Acao'];
    
    // Modificar a query para incluir o tenant_id em todas as operações
    if (params.model && !modelosSemTenant.includes(params.model)) {
      if (params.action === 'findUnique' || params.action === 'findFirst') {
        // Para operações de busca única, adicionar tenant_id ao where
        params.args.where = { 
          tenantId: tenantId, 
          ...params.args.where 
        };
      } else if (params.action === 'findMany') {
        // Para operações de busca múltipla, adicionar tenant_id ao where
        if (!params.args) params.args = {};
        if (!params.args.where) params.args.where = {};
        params.args.where.tenantId = tenantId;
      } else if (
        params.action === 'create' ||
        params.action === 'createMany'
      ) {
        // Para operações de criação, adicionar tenant_id aos dados
        if (params.args.data) {
          if (Array.isArray(params.args.data)) {
            params.args.data = params.args.data.map((item) => ({
              ...item,
              tenantId,
            }));
          } else {
            params.args.data.tenantId = tenantId;
          }
        }
      } else if (params.action === 'update' || params.action === 'updateMany') {
        // Para operações de atualização, adicionar tenant_id ao where
        if (!params.args.where) params.args.where = {};
        params.args.where.tenantId = tenantId;
      } else if (params.action === 'delete' || params.action === 'deleteMany') {
        // Para operações de exclusão, adicionar tenant_id ao where
        if (!params.args.where) params.args.where = {};
        params.args.where.tenantId = tenantId;
      }
    }

    return next(params);
  };
}
