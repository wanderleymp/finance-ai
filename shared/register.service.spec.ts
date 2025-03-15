import { Test, TestingModule } from '@nestjs/testing';
import { RegisterService } from './register.service';
import { RegisterDto } from './dto/RegisterDto';
import { RegisterResult } from './interfaces/register-result.interface';
import { HttpException } from '@nestjs/common';

describe('RegisterService', () => {
  let service: RegisterService;
  let tenantServiceMock: any;
  let usuarioServiceMock: any;
  let empresaRepositoryMock: any;

  beforeEach(async () => {
    // Criando mocks para os serviços injetados
    tenantServiceMock = {
      criar: jest.fn(),
      atualizar: jest.fn()
    };

    usuarioServiceMock = {
      criar: jest.fn()
    };

    empresaRepositoryMock = {
      create: jest.fn()
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RegisterService,
        { provide: 'TenantService', useValue: tenantServiceMock },
        { provide: 'UsuarioService', useValue: usuarioServiceMock },
        { provide: 'EmpresaRepository', useValue: empresaRepositoryMock }
      ],
    }).compile();

    service = module.get<RegisterService>(RegisterService);
  });

  it('should create a new tenant', async () => {
    const registerDto: RegisterDto = { 
      tenant: { nome: 'Organização Teste', dominio: 'organizacao.finance-ai.com', plano: 'basic' },
      empresa: { nome: 'Empresa Teste', cnpj: '00000000000000' },
      administrador: { nome: 'Admin Teste', email: 'admin@organizacao.com', senha: 'senha_segura' }
    };

    // Configurar comportamento dos mocks
    const mockTenant = {
      id: '1', // ID como string (como seria retornado pelo banco)
      nome: 'Organização Teste',
      dominio: 'organizacao.finance-ai.com',
      plano: 'basic',
      ativo: true,
      dataCriacao: new Date()
    };

    const mockEmpresa = {
      id: '1',
      nome: 'Empresa Teste',
      cnpj: '00000000000000',
      tenantId: '1',
      dataCriacao: new Date()
    };

    const mockUsuario = {
      id: '1',
      nome: 'Admin Teste',
      email: 'admin@organizacao.com',
      tenantId: '1',
      empresaId: '1',
      ativo: true
    };

    tenantServiceMock.criar.mockResolvedValue(mockTenant);
    empresaRepositoryMock.create.mockResolvedValue(mockEmpresa);
    usuarioServiceMock.criar.mockResolvedValue(mockUsuario);
    tenantServiceMock.atualizar.mockResolvedValue(mockTenant);

    // Executar o método e verificar o resultado
    const result = await service.registerTenant(registerDto);
    
    // Verificar se os métodos dos serviços foram chamados com os parâmetros corretos
    expect(tenantServiceMock.criar).toHaveBeenCalledWith({
      nome: registerDto.tenant.nome,
      dominio: registerDto.tenant.dominio
    });
    
    expect(empresaRepositoryMock.create).toHaveBeenCalledWith({
      nome: registerDto.empresa.nome,
      cnpj: registerDto.empresa.cnpj,
      tenantId: mockTenant.id,
      dataCriacao: expect.any(Date)
    });
    
    expect(usuarioServiceMock.criar).toHaveBeenCalledWith({
      nome: registerDto.administrador.nome,
      email: registerDto.administrador.email,
      senha: registerDto.administrador.senha,
      tenantId: mockTenant.id,
      empresaId: mockEmpresa.id,
      ativo: true
    });
    
    expect(tenantServiceMock.atualizar).toHaveBeenCalledWith(mockTenant.id, {
      usuarioAdminId: mockUsuario.id,
      empresaId: mockEmpresa.id
    });
    
    // Verificar o resultado retornado
    expect(result).toEqual({
      success: true,
      tenant: {
        ...mockTenant,
        id: 1 // Verificar se o ID foi convertido para número
      }
    });
    
    expect(result.success).toBe(true);
    expect(result.tenant.nome).toBe('Organização Teste');
    expect(result.tenant.dominio).toBe('organizacao.finance-ai.com');
    expect(result.tenant.plano).toBe('basic');
    expect(result.tenant.id).toBeDefined();
    expect(result.tenant.id).toBe(1);
  });
  
  it('should handle errors during tenant registration', async () => {
    const registerDto: RegisterDto = { 
      tenant: { nome: 'Organização Teste', dominio: 'organizacao.finance-ai.com', plano: 'basic' },
      empresa: { nome: 'Empresa Teste', cnpj: '00000000000000' },
      administrador: { nome: 'Admin Teste', email: 'admin@organizacao.com', senha: 'senha_segura' }
    };
    
    // Simular erro no serviço de tenant
    tenantServiceMock.criar.mockRejectedValue(new Error('Erro ao criar tenant'));
    
    // Verificar se o erro é tratado corretamente
    await expect(service.registerTenant(registerDto)).rejects.toThrow(HttpException);
  });
});
