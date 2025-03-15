import { Test, TestingModule } from '@nestjs/testing';
import { UsuarioModule } from '../usuario.module';
import { UsuarioService } from '../services/usuarioService';
import { UsuarioRepository } from '../repositories/usuarioRepository';
import { PermissaoService } from '../../permissao/services/permissaoService';
import { PermissaoGuard } from '../../permissao/guards/permissaoGuard';
import { Reflector } from '@nestjs/core';

/**
 * Testes para o módulo de usuário
 * 
 * Este arquivo contém testes unitários para o UsuarioModule,
 * verificando se as dependências estão configuradas corretamente.
 */
describe('UsuarioModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    // Mock do DATABASE_PROVIDER
    const mockDatabaseProvider = {
      getContext: jest.fn().mockReturnValue({
        usuario: {
          findUnique: jest.fn(),
          findMany: jest.fn(),
          create: jest.fn(),
          update: jest.fn(),
          delete: jest.fn(),
        },
      }),
    };

    // Mock do PermissaoService
    const mockPermissaoService = {
      verificarPermissao: jest.fn(),
    };

    // Cria um módulo de teste com os mocks necessários
    module = await Test.createTestingModule({
      imports: [UsuarioModule],
    })
      .overrideProvider('DATABASE_PROVIDER')
      .useValue(mockDatabaseProvider)
      .overrideProvider(PermissaoService)
      .useValue(mockPermissaoService)
      .overrideProvider(Reflector)
      .useValue({ get: jest.fn() })
      .compile();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve ser definido', () => {
    expect(module).toBeDefined();
  });

  it('deve fornecer o UsuarioService', () => {
    const usuarioService = module.get<UsuarioService>(UsuarioService);
    expect(usuarioService).toBeDefined();
  });

  it('deve fornecer o UsuarioRepository', () => {
    const usuarioRepository = module.get<UsuarioRepository>(UsuarioRepository);
    expect(usuarioRepository).toBeDefined();
  });

  it('deve fornecer o PermissaoGuard através do PermissaoModule', () => {
    // Verifica se o PermissaoGuard está disponível no contexto do módulo
    const permissaoGuard = module.get<PermissaoGuard>(PermissaoGuard);
    expect(permissaoGuard).toBeDefined();
  });

  it('deve fornecer o PermissaoService através do PermissaoModule', () => {
    // Verifica se o PermissaoService está disponível no contexto do módulo
    const permissaoService = module.get<PermissaoService>(PermissaoService);
    expect(permissaoService).toBeDefined();
  });
});
