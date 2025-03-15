import { Injectable, OnModuleInit, Logger, Inject } from '@nestjs/common';
import { IDatabaseProvider } from '../../../core/database/interfaces/IDatabaseProvider';

/**
 * Serviço para inicialização de dados do sistema
 * 
 * Este serviço é responsável por inicializar os dados básicos
 * do sistema, como permissões, ações e módulos padrão.
 */
@Injectable()
export class InitializationService implements OnModuleInit {
  private readonly logger = new Logger(InitializationService.name);

  /**
   * Construtor do serviço de inicialização
   * @param prisma Serviço do Prisma injetado
   */
  constructor(
    // Usando o decorador Inject de forma correta
    @Inject('DATABASE_PROVIDER')
    private readonly databaseProvider: IDatabaseProvider
  ) {}

  /**
   * Método executado quando o módulo é inicializado
   */
  async onModuleInit() {
    this.logger.log('Iniciando inicialização de dados do sistema...');
    
    try {
      await this.inicializarAcoes();
      await this.inicializarModulos();
      await this.inicializarTenantEAdmin(); // Nova chamada para inicializar tenant e admin
      
      this.logger.log('Inicialização de dados do sistema concluída com sucesso!');
    } catch (error) {
      // Tratamento seguro de erro com verificação de tipo
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      this.logger.error(`Erro na inicialização de dados do sistema: ${errorMessage}`);
      throw error;
    }
  }

  /**
   * Inicializa as ações padrão do sistema
   */
  private async inicializarAcoes() {
    const acoesPadrao = [
      { nome: 'Acessar', codigo: 'acessar', descricao: 'Permissão para acessar um recurso' },
      { nome: 'Criar', codigo: 'criar', descricao: 'Permissão para criar um recurso' },
      { nome: 'Editar', codigo: 'editar', descricao: 'Permissão para editar um recurso' },
      { nome: 'Excluir', codigo: 'excluir', descricao: 'Permissão para excluir um recurso' },
      { nome: 'Listar', codigo: 'listar', descricao: 'Permissão para listar recursos' },
      { nome: 'Visualizar', codigo: 'visualizar', descricao: 'Permissão para visualizar detalhes de um recurso' },
      { nome: 'Aprovar', codigo: 'aprovar', descricao: 'Permissão para aprovar um recurso' },
      { nome: 'Rejeitar', codigo: 'rejeitar', descricao: 'Permissão para rejeitar um recurso' },
      { nome: 'Exportar', codigo: 'exportar', descricao: 'Permissão para exportar dados' },
      { nome: 'Importar', codigo: 'importar', descricao: 'Permissão para importar dados' },
    ];

    const prisma = this.databaseProvider.getContext();
    for (const acao of acoesPadrao) {
      await prisma.acao.upsert({
        where: { codigo: acao.codigo },
        update: acao,
        create: acao,
      });
    }

    this.logger.log('Ações padrão inicializadas com sucesso!');
  }

  /**
   * Inicializa os módulos, submódulos e recursos padrão do sistema
   */
  /**
   * Inicializa o tenant license e usuário super admin padrão
   */
  private async inicializarTenantEAdmin() {
    const prisma = this.databaseProvider.getContext();
    
    try {
      // Criando o tenant padrão (license)
      const tenantLicense = await prisma.tenant.upsert({
        where: { dominio: 'license.finance-ai.com' },
        update: {},
        create: {
          nome: 'Finance AI License',
          dominio: 'license.finance-ai.com',
          ativo: true
        }
      });
      
      this.logger.log(`Tenant License inicializado: ${tenantLicense.id}`);
      
      // Importando bcrypt para criptografia da senha
      const bcrypt = require('bcrypt');
      
      // Criando o usuário super admin
      const senhaCriptografada = await bcrypt.hash('SuperAdmin@2025', 10);
      
      const superAdmin = await prisma.usuario.upsert({
        where: { email: 'admin@finance-ai.com' },
        update: {},
        create: {
          nome: 'Super Administrador',
          email: 'admin@finance-ai.com',
          senha: senhaCriptografada,
          tipo: 'SUPER_ADMIN',
          ativo: true,
          tenantId: tenantLicense.id
        }
      });
      
      this.logger.log(`Super Admin inicializado: ${superAdmin.id}`);
      
      // Criando uma empresa padrão para o tenant license
      const empresaPadrao = await prisma.empresa.upsert({
        where: { 
          cnpj: '00000000000000' 
        },
        update: {},
        create: {
          nome: 'Finance AI Administração',
          cnpj: '00000000000000',
          ativa: true,
          tenantId: tenantLicense.id
        }
      });
      
      this.logger.log(`Empresa padrão inicializada: ${empresaPadrao.id}`);
      
      // Vinculando o super admin à empresa padrão
      const usuarioEmpresa = await prisma.usuarioEmpresa.upsert({
        where: {
          usuarioId_empresaId: {
            usuarioId: superAdmin.id,
            empresaId: empresaPadrao.id
          }
        },
        update: {},
        create: {
          usuarioId: superAdmin.id,
          empresaId: empresaPadrao.id,
          principal: true
        }
      });
      
      this.logger.log(`Usuário vinculado à empresa: ${usuarioEmpresa.id}`);
      this.logger.log('Tenant license e super admin inicializados com sucesso!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      this.logger.error(`Erro ao inicializar tenant e admin: ${errorMessage}`);
      throw error;
    }
  }

  private async inicializarModulos() {
    // Módulos padrão do sistema
    const modulosPadrao = [
      {
        nome: 'Administração',
        codigo: 'admin',
        descricao: 'Módulo de administração do sistema',
        submodulos: [
          {
            nome: 'Usuários',
            codigo: 'usuarios',
            descricao: 'Gestão de usuários do sistema',
            recursos: [
              { nome: 'Usuário', codigo: 'usuario', descricao: 'Recurso de usuário' },
              { nome: 'Perfil', codigo: 'perfil', descricao: 'Recurso de perfil de usuário' },
              { nome: 'Permissão', codigo: 'permissao', descricao: 'Recurso de permissão' },
            ],
          },
          {
            nome: 'Tenants',
            codigo: 'tenants',
            descricao: 'Gestão de tenants do sistema',
            recursos: [
              { nome: 'Tenant', codigo: 'tenant', descricao: 'Recurso de tenant' },
              { nome: 'Empresa', codigo: 'empresa', descricao: 'Recurso de empresa' },
            ],
          },
          {
            nome: 'Sistema',
            codigo: 'sistema',
            descricao: 'Configurações do sistema',
            recursos: [
              { nome: 'Configuração', codigo: 'configuracao', descricao: 'Recurso de configuração do sistema' },
              { nome: 'Log', codigo: 'log', descricao: 'Recurso de log do sistema' },
            ],
          },
        ],
      },
      {
        nome: 'Financeiro',
        codigo: 'financeiro',
        descricao: 'Módulo financeiro',
        submodulos: [
          {
            nome: 'Contas',
            codigo: 'contas',
            descricao: 'Gestão de contas financeiras',
            recursos: [
              { nome: 'Conta', codigo: 'conta', descricao: 'Recurso de conta financeira' },
              { nome: 'Transação', codigo: 'transacao', descricao: 'Recurso de transação financeira' },
            ],
          },
          {
            nome: 'Relatórios',
            codigo: 'relatorios',
            descricao: 'Relatórios financeiros',
            recursos: [
              { nome: 'Relatório', codigo: 'relatorio', descricao: 'Recurso de relatório financeiro' },
              { nome: 'Dashboard', codigo: 'dashboard', descricao: 'Recurso de dashboard financeiro' },
            ],
          },
        ],
      },
    ];

    // Criar módulos, submódulos e recursos
    const prisma = this.databaseProvider.getContext();
    for (const modulo of modulosPadrao) {
      const moduloCriado = await prisma.modulo.upsert({
        where: { codigo: modulo.codigo },
        update: {
          nome: modulo.nome,
          descricao: modulo.descricao,
        },
        create: {
          nome: modulo.nome,
          codigo: modulo.codigo,
          descricao: modulo.descricao,
        },
      });

      for (const submodulo of modulo.submodulos) {
        const submoduloCriado = await prisma.submodulo.upsert({
          where: {
            moduloId_codigo: {
              moduloId: moduloCriado.id,
              codigo: submodulo.codigo,
            },
          },
          update: {
            nome: submodulo.nome,
            descricao: submodulo.descricao,
          },
          create: {
            nome: submodulo.nome,
            codigo: submodulo.codigo,
            descricao: submodulo.descricao,
            moduloId: moduloCriado.id,
          },
        });

        for (const recurso of submodulo.recursos) {
          await prisma.recurso.upsert({
            where: {
              submoduloId_codigo: {
                submoduloId: submoduloCriado.id,
                codigo: recurso.codigo,
              },
            },
            update: {
              nome: recurso.nome,
              descricao: recurso.descricao,
            },
            create: {
              nome: recurso.nome,
              codigo: recurso.codigo,
              descricao: recurso.descricao,
              submoduloId: submoduloCriado.id,
            },
          });
        }
      }
    }

    this.logger.log('Módulos, submódulos e recursos padrão inicializados com sucesso!');
  }
}
