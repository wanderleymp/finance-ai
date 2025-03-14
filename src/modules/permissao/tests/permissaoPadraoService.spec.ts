import { Test, TestingModule } from '@nestjs/testing';
import { PermissaoPadraoService } from '../services/permissaoPadraoService';
import { PermissaoService } from '../services/permissaoService';

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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PermissaoPadraoService,
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
    it('deve atribuir todas as permissões padrão para um administrador', async () => {
      // Dados de teste
      const usuarioId = 'usuario-id';
      const empresaId = 'empresa-id';

      // Mock do retorno da concessão de permissão
      mockPermissaoService.concederPermissao.mockResolvedValue({
        id: 'permissao-id',
        usuarioId,
        empresaId,
        permitido: true,
      });

      // Execução do método
      const result = await permissaoPadraoService.atribuirPermissoesPadrao(usuarioId, empresaId);

      // Verificar que o método foi chamado múltiplas vezes (uma para cada permissão padrão)
      expect(mockPermissaoService.concederPermissao).toHaveBeenCalled();
      
      // O número exato de chamadas depende da quantidade de permissões padrão definidas
      // no serviço. Vamos verificar se foi chamado pelo menos uma vez.
      expect(mockPermissaoService.concederPermissao.mock.calls.length).toBeGreaterThan(0);
      
      // Verificar que todas as chamadas incluem o usuarioId e empresaId corretos
      mockPermissaoService.concederPermissao.mock.calls.forEach(call => {
        expect(call[0]).toBe(usuarioId);
        expect(call[1]).toBe(empresaId);
      });

      // Verificar o resultado
      expect(result).toBe(true);
    });

    it('deve lidar com erros ao atribuir permissões', async () => {
      // Dados de teste
      const usuarioId = 'usuario-id';
      const empresaId = 'empresa-id';

      // Mock do erro
      mockPermissaoService.concederPermissao.mockRejectedValue(
        new Error('Permissão já concedida')
      );

      // Execução do método - não deve lançar erro, apenas retornar false
      const result = await permissaoPadraoService.atribuirPermissoesPadrao(usuarioId, empresaId);

      // Verificar que o método foi chamado
      expect(mockPermissaoService.concederPermissao).toHaveBeenCalled();
      
      // Verificar o resultado
      expect(result).toBe(false);
    });
  });
});
