import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PermissaoGuard } from '../guards/permissaoGuard';
import { PermissaoService } from '../services/permissaoService';

/**
 * Testes para o guard de Permissão
 * 
 * Este arquivo contém testes unitários para o PermissaoGuard,
 * verificando se ele considera corretamente o contexto do tenant.
 */
describe('PermissaoGuard', () => {
  let permissaoGuard: PermissaoGuard;
  let reflector: Reflector;
  let permissaoService: PermissaoService;

  // Mock do serviço de permissão
  const mockPermissaoService = {
    verificarPermissao: jest.fn(),
  };

  // Mock do reflector
  const mockReflector = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PermissaoGuard,
        {
          provide: Reflector,
          useValue: mockReflector,
        },
        {
          provide: PermissaoService,
          useValue: mockPermissaoService,
        },
      ],
    }).compile();

    permissaoGuard = module.get<PermissaoGuard>(PermissaoGuard);
    reflector = module.get<Reflector>(Reflector);
    permissaoService = module.get<PermissaoService>(PermissaoService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('canActivate', () => {
    it('deve permitir acesso quando não há permissões necessárias', async () => {
      // Mock do contexto de execução
      const mockExecutionContext = {
        getHandler: jest.fn(),
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue({
            user: { id: 'usuario-id' },
          }),
        }),
      } as unknown as ExecutionContext;

      // Mock do reflector para retornar nenhuma permissão necessária
      mockReflector.get.mockReturnValue(null);

      // Execução do método
      const result = await permissaoGuard.canActivate(mockExecutionContext);

      // Verificações
      expect(mockReflector.get).toHaveBeenCalledWith('permissoes', expect.any(Function));
      expect(result).toBe(true);
      expect(mockPermissaoService.verificarPermissao).not.toHaveBeenCalled();
    });

    it('deve negar acesso quando não há usuário autenticado', async () => {
      // Mock do contexto de execução sem usuário
      const mockExecutionContext = {
        getHandler: jest.fn(),
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue({
            user: null,
          }),
        }),
      } as unknown as ExecutionContext;

      // Mock do reflector para retornar permissões necessárias
      mockReflector.get.mockReturnValue([
        { moduloId: 'modulo-id', acaoId: 'acao-id' },
      ]);

      // Execução do método
      const result = await permissaoGuard.canActivate(mockExecutionContext);

      // Verificações
      expect(result).toBe(false);
      expect(mockPermissaoService.verificarPermissao).not.toHaveBeenCalled();
    });

    it('deve permitir acesso quando o usuário tem todas as permissões necessárias', async () => {
      // Mock do contexto de execução com usuário e empresa
      const mockExecutionContext = {
        getHandler: jest.fn(),
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue({
            user: { id: 'usuario-id', empresaId: 'empresa-id' },
            headers: { 'empresa-id': 'empresa-id' },
          }),
        }),
      } as unknown as ExecutionContext;

      // Mock do reflector para retornar permissões necessárias
      mockReflector.get.mockReturnValue([
        { moduloId: 'modulo-id', acaoId: 'acao-id' },
      ]);

      // Mock do serviço de permissão para retornar que o usuário tem permissão
      mockPermissaoService.verificarPermissao.mockResolvedValue(true);

      // Execução do método
      const result = await permissaoGuard.canActivate(mockExecutionContext);

      // Verificações
      expect(result).toBe(true);
      expect(mockPermissaoService.verificarPermissao).toHaveBeenCalledWith(
        'usuario-id',
        'modulo-id',
        undefined,
        undefined,
        'acao-id',
        'empresa-id',
      );
    });

    it('deve negar acesso quando o usuário não tem todas as permissões necessárias', async () => {
      // Mock do contexto de execução com usuário e empresa
      const mockExecutionContext = {
        getHandler: jest.fn(),
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue({
            user: { id: 'usuario-id', empresaId: 'empresa-id' },
            headers: { 'empresa-id': 'empresa-id' },
          }),
        }),
      } as unknown as ExecutionContext;

      // Mock do reflector para retornar permissões necessárias
      mockReflector.get.mockReturnValue([
        { moduloId: 'modulo-id', acaoId: 'acao-id' },
      ]);

      // Mock do serviço de permissão para retornar que o usuário não tem permissão
      mockPermissaoService.verificarPermissao.mockResolvedValue(false);

      // Execução do método
      const result = await permissaoGuard.canActivate(mockExecutionContext);

      // Verificações
      expect(result).toBe(false);
      expect(mockPermissaoService.verificarPermissao).toHaveBeenCalledWith(
        'usuario-id',
        'modulo-id',
        undefined,
        undefined,
        'acao-id',
        'empresa-id',
      );
    });

    it('deve considerar o empresaId do cabeçalho prioritariamente', async () => {
      // Mock do contexto de execução com usuário e empresa diferente no cabeçalho
      const mockExecutionContext = {
        getHandler: jest.fn(),
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue({
            user: { id: 'usuario-id', empresaId: 'empresa-user-id' },
            headers: { 'empresa-id': 'empresa-header-id' },
          }),
        }),
      } as unknown as ExecutionContext;

      // Mock do reflector para retornar permissões necessárias
      mockReflector.get.mockReturnValue([
        { moduloId: 'modulo-id', acaoId: 'acao-id' },
      ]);

      // Mock do serviço de permissão para retornar que o usuário tem permissão
      mockPermissaoService.verificarPermissao.mockResolvedValue(true);

      // Execução do método
      const result = await permissaoGuard.canActivate(mockExecutionContext);

      // Verificações
      expect(result).toBe(true);
      expect(mockPermissaoService.verificarPermissao).toHaveBeenCalledWith(
        'usuario-id',
        'modulo-id',
        undefined,
        undefined,
        'acao-id',
        'empresa-header-id', // Deve usar o ID do cabeçalho, não o do usuário
      );
    });
  });
});
