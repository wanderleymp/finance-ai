import { Test, TestingModule } from '@nestjs/testing';
import { PermissaoPadraoService } from '../services/permissaoPadraoService';
import { PermissaoService } from '../services/permissaoService';
import { PermissaoRepository } from '../repositories/permissaoRepository';

/**
 * Testes para o serviço de Permissão Padrão
 * 
 * Este arquivo contém testes unitários para o PermissaoPadraoService,
 * verificando se as permissões padrão são atribuídas corretamente.
 */
describe('PermissaoPadraoService', () => {
  let permissaoPadraoService: PermissaoPadraoService;
  let permissaoService: PermissaoService;

  // Mock do serviço de permissão
  const mockPermissaoService = {
    concederPermissao: jest.fn(),
    verificarPermissao: jest.fn(),
    obterPermissoesUsuario: jest.fn(),
    revogarPermissao: jest.fn(),
  };
  
  // Mock do repositório de permissão
  const mockPermissaoRepository = {
    create: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    criarPermissao: jest.fn().mockResolvedValue({
      id: 'permissao-id',
      usuarioId: 'usuario-id',
      empresaId: 'empresa-id',
      moduloId: 'modulo-id',
      acaoId: 'acao-id',
      permitido: true,
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PermissaoPadraoService,
        {
          provide: PermissaoRepository,
          useValue: mockPermissaoRepository,
        },
        {
          provide: PermissaoService,
          useValue: mockPermissaoService,
        },
      ],
    }).compile();

    permissaoPadraoService = module.get<PermissaoPadraoService>(PermissaoPadraoService);
    permissaoService = module.get<PermissaoService>(PermissaoService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('atribuirPermissoesPadrao', () => {
    it('deve atribuir permissão padrão para um usuário', async () => {
      // Dados de teste
      const usuarioId = 'usuario-id';
      const empresaId = 'empresa-id';

      // Mock do retorno da concessão de permissão
      mockPermissaoService.concederPermissao.mockResolvedValue({
        id: 'permissao-id',
        usuarioId,
        empresaId,
        moduloId: 'default',
        acaoId: 'visualizar',
        permitido: true,
      });

      // Execução do método
      await permissaoPadraoService.atribuirPermissoesPadrao(usuarioId, empresaId);

      // Verificar que o método foi chamado com os parâmetros corretos
      expect(mockPermissaoService.concederPermissao).toHaveBeenCalledWith(
        usuarioId,
        empresaId,
        'default',
        undefined,
        undefined,
        'visualizar'
      );
    });

    it('deve lidar com erros ao atribuir permissões', async () => {
      // Dados de teste
      const usuarioId = 'usuario-id';
      const empresaId = 'empresa-id';

      // Mock do erro
      mockPermissaoService.concederPermissao.mockRejectedValue(
        new Error('Permissão já concedida')
      );

      // Execução do método - não deve lançar erro
      await expect(permissaoPadraoService.atribuirPermissoesPadrao(usuarioId, empresaId)).resolves.not.toThrow();

      // Verificar que o método foi chamado com os parâmetros corretos
      expect(mockPermissaoService.concederPermissao).toHaveBeenCalledWith(
        usuarioId,
        empresaId,
        'default',
        undefined,
        undefined,
        'visualizar'
      );
    });
  });
});
