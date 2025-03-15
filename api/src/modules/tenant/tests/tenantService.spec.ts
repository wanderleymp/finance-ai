import { Test, TestingModule } from '@nestjs/testing';
import { TenantService } from '../services/tenantService';
import { TenantRepository } from '../repositories/tenantRepository';
import { PermissaoPadraoService } from '../../permissao/services/permissaoPadraoService';
import { UsuarioRepository } from '../../usuario/repositories/usuarioRepository';
import { EmpresaRepository } from '../../empresa/repositories/empresaRepository';
import { TestConfigModule } from '../../../config/test.config';
import { IEmpresa } from '../../empresa/interfaces/IEmpresa';

/**
 * Testes para o serviço de Tenant
 * 
 * Este arquivo contém testes unitários para o TenantService,
 * focando especialmente na integração com o sistema de permissões.
 */
describe('TenantService', () => {
  let tenantService: TenantService;
  let tenantRepository: TenantRepository;
  let permissaoPadraoService: PermissaoPadraoService;
  let usuarioRepository: UsuarioRepository;
  let empresaRepository: EmpresaRepository;

  // Mock dos repositórios e serviços
  const mockTenantRepository = {
    create: jest.fn(),
    findById: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    buscarPorDominio: jest.fn(), // Adicionando o método que faltava
  };

  const mockPermissaoPadraoService = {
    atribuirPermissoesPadrao: jest.fn(),
    criarPermissoesPadraoTenant: jest.fn(),
  };

  const mockUsuarioRepository = {
    create: jest.fn(),
    findById: jest.fn(),
  };

  const mockEmpresaRepository = {
    create: jest.fn(),
    findById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TestConfigModule,
      ],
      providers: [
        TenantService,
        {
          provide: TenantRepository,
          useValue: mockTenantRepository,
        },
        {
          provide: PermissaoPadraoService,
          useValue: mockPermissaoPadraoService,
        },
        {
          provide: UsuarioRepository,
          useValue: mockUsuarioRepository,
        },
        {
          provide: EmpresaRepository,
          useValue: mockEmpresaRepository,
        },
      ],
    }).compile();

    tenantService = module.get<TenantService>(TenantService);
    tenantRepository = module.get<TenantRepository>(TenantRepository);
    permissaoPadraoService = module.get<PermissaoPadraoService>(PermissaoPadraoService);
    usuarioRepository = module.get<UsuarioRepository>(UsuarioRepository);
    empresaRepository = module.get<EmpresaRepository>(EmpresaRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('criar', () => {
    it('deve criar um tenant, usuário admin, empresa e atribuir permissões padrão', async () => {
      // Dados de teste
      const tenantData = {
        nome: 'Tenant Teste',
        dominio: 'teste.com',
        ativo: true,
        dataCriacao: expect.any(Date),
      };

      const adminData = {
        nome: 'Admin Teste',
        email: 'admin@teste.com',
        senha: 'senha123',
      };

      const empresaData = {
        nome: 'Empresa Teste',
        cnpj: '12345678901234',
      };

      // Mock dos retornos
      const createdTenant = {
        id: 'tenant-id',
        ...tenantData,
        dataCriacao: new Date(),
        dataAtualizacao: new Date(),
        status: 'ATIVO',
      };

      const createdAdmin = {
        id: 'admin-id',
        ...adminData,
        dataCriacao: new Date(),
        dataAtualizacao: new Date(),
        status: 'ATIVO',
        tenantId: 'tenant-id',
      };

      const createdEmpresa = {
        id: 'empresa-id',
        ...empresaData,
        dataCriacao: new Date(),
        dataAtualizacao: new Date(),
        status: 'ATIVO',
        tenantId: 'tenant-id',
      };

      // Mock para buscarPorDominio retornar null (domínio não existe ainda)
      mockTenantRepository.buscarPorDominio.mockResolvedValue(null);
      
      mockTenantRepository.create.mockResolvedValue(createdTenant);
      mockUsuarioRepository.create.mockResolvedValue(createdAdmin);
      mockEmpresaRepository.create.mockResolvedValue(createdEmpresa);
      mockPermissaoPadraoService.atribuirPermissoesPadrao.mockResolvedValue(true);

      // Execução do método
      const result = await tenantService.criar({
        nome: tenantData.nome,
        dominio: tenantData.dominio,
        usuarioAdminId: 'admin-id',
        empresaId: 'empresa-id'
      });

      // Verificações
      expect(mockTenantRepository.create).toHaveBeenCalledWith(tenantData);
      
      // O TenantService não cria usuário e empresa, apenas usa os IDs fornecidos
      // para atribuir permissões padrão
      expect(mockUsuarioRepository.create).not.toHaveBeenCalled();
      expect(mockEmpresaRepository.create).not.toHaveBeenCalled();
      
      // Verificar se as permissões padrão foram atribuídas
      expect(mockPermissaoPadraoService.criarPermissoesPadraoTenant).toHaveBeenCalledWith(
        'admin-id',
        'empresa-id',
      );

      // Verificar o resultado
      expect(result).toEqual(createdTenant);
    });

    it('deve lançar erro se a criação do tenant falhar', async () => {
      // Dados de teste
      const tenantData = {
        nome: 'Tenant Teste',
        dominio: 'teste.com',
        ativo: true,
        dataCriacao: expect.any(Date),
      };

      const adminData = {
        nome: 'Admin Teste',
        email: 'admin@teste.com',
        senha: 'senha123',
      };

      const empresaData = {
        nome: 'Empresa Teste',
        cnpj: '12345678901234',
      };

      // Mock para buscarPorDominio retornar null (domínio não existe ainda)
      mockTenantRepository.buscarPorDominio.mockResolvedValue(null);
      
      // Mock do erro
      mockTenantRepository.create.mockRejectedValue(new Error('Erro ao criar tenant'));

      // Verificar se o método lança erro
      await expect(
        tenantService.criar({
          nome: tenantData.nome,
          dominio: tenantData.dominio,
          usuarioAdminId: 'admin-id',
          empresaId: 'empresa-id'
        })
      ).rejects.toThrow('Erro ao criar tenant');

      // Verificar que os outros métodos não foram chamados
      expect(mockUsuarioRepository.create).not.toHaveBeenCalled();
      expect(mockEmpresaRepository.create).not.toHaveBeenCalled();
      expect(mockPermissaoPadraoService.atribuirPermissoesPadrao).not.toHaveBeenCalled();
    });
  });
});
