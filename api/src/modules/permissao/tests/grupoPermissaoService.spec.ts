import { Test, TestingModule } from '@nestjs/testing';
import { GrupoPermissaoService } from '../services/grupoPermissaoService';
import { GrupoPermissaoRepository } from '../repositories/grupoPermissaoRepository';
import { PermissaoService } from '../services/permissaoService';
import { ICriarGrupoPermissaoDTO, IAtualizarGrupoPermissaoDTO } from '../interfaces/IGrupoPermissao';

/**
 * Testes para o serviço de Grupo de Permissões
 * 
 * Este arquivo contém testes unitários para o GrupoPermissaoService,
 * verificando se as operações de CRUD e verificação de permissões por grupo
 * estão funcionando corretamente.
 */
describe('GrupoPermissaoService', () => {
  let grupoPermissaoService: GrupoPermissaoService;
  let grupoPermissaoRepository: GrupoPermissaoRepository;
  let permissaoService: PermissaoService;

  // Mock do repositório de grupo de permissão
  const mockGrupoPermissaoRepository = {
    criar: jest.fn(),
    buscarPorId: jest.fn(),
    listarPorTenant: jest.fn(),
    atualizar: jest.fn(),
    excluir: jest.fn(),
    atribuirAoUsuario: jest.fn(),
    removerDoUsuario: jest.fn(),
    listarPorUsuario: jest.fn(),
  };

  // Mock do serviço de permissão
  const mockPermissaoService = {
    buscarPermissaoPorId: jest.fn(),
    verificarPermissao: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GrupoPermissaoService,
        {
          provide: GrupoPermissaoRepository,
          useValue: mockGrupoPermissaoRepository,
        },
        {
          provide: PermissaoService,
          useValue: mockPermissaoService,
        },
      ],
    }).compile();

    grupoPermissaoService = module.get<GrupoPermissaoService>(GrupoPermissaoService);
    grupoPermissaoRepository = module.get<GrupoPermissaoRepository>(GrupoPermissaoRepository);
    permissaoService = module.get<PermissaoService>(PermissaoService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Dados de teste comuns
  const grupoMock = {
    id: 'grupo-id',
    nome: 'Grupo de Teste',
    descricao: 'Descrição do grupo de teste',
    empresaId: 'empresa-id',
    tenantId: 'tenant-id',
    dataCriacao: new Date(),
    dataAtualizacao: null,
    permissoes: ['permissao-id-1', 'permissao-id-2']
  };

  describe('criar', () => {
    it('deve criar um novo grupo de permissões', async () => {
      // Dados para o teste
      const dadosCriacao: ICriarGrupoPermissaoDTO = {
        nome: 'Grupo de Teste',
        descricao: 'Descrição do grupo de teste',
        empresaId: 'empresa-id',
        tenantId: 'tenant-id',
        permissoes: ['permissao-id-1', 'permissao-id-2']
      };

      // Mock do retorno do repositório
      mockGrupoPermissaoRepository.criar.mockResolvedValue(grupoMock);

      // Execução do método
      const resultado = await grupoPermissaoService.criar(dadosCriacao);

      // Verificações
      expect(mockGrupoPermissaoRepository.criar).toHaveBeenCalledWith(dadosCriacao);
      expect(resultado).toEqual(grupoMock);
    });

    it('deve lidar com erros ao criar um grupo', async () => {
      // Dados para o teste
      const dadosCriacao: ICriarGrupoPermissaoDTO = {
        nome: 'Grupo de Teste',
        descricao: 'Descrição do grupo de teste',
        empresaId: 'empresa-id',
        tenantId: 'tenant-id',
        permissoes: ['permissao-id-1', 'permissao-id-2']
      };

      // Mock do erro
      mockGrupoPermissaoRepository.criar.mockRejectedValue(new Error('Erro ao criar grupo'));

      // Verificação
      await expect(grupoPermissaoService.criar(dadosCriacao)).rejects.toThrow();
    });
  });

  describe('buscarPorId', () => {
    it('deve buscar um grupo pelo ID', async () => {
      // Mock do retorno do repositório
      mockGrupoPermissaoRepository.buscarPorId.mockResolvedValue(grupoMock);

      // Execução do método
      const resultado = await grupoPermissaoService.buscarPorId('grupo-id');

      // Verificações
      expect(mockGrupoPermissaoRepository.buscarPorId).toHaveBeenCalledWith('grupo-id');
      expect(resultado).toEqual(grupoMock);
    });

    it('deve lançar erro quando o grupo não for encontrado', async () => {
      // Mock do retorno do repositório
      mockGrupoPermissaoRepository.buscarPorId.mockResolvedValue(null);

      // Verificação
      await expect(grupoPermissaoService.buscarPorId('grupo-inexistente')).rejects.toThrow('Grupo de permissões não encontrado');
    });
  });

  describe('listarPorTenant', () => {
    it('deve listar grupos por tenant', async () => {
      // Mock do retorno do repositório
      mockGrupoPermissaoRepository.listarPorTenant.mockResolvedValue([grupoMock]);

      // Execução do método
      const resultado = await grupoPermissaoService.listarPorTenant('tenant-id');

      // Verificações
      expect(mockGrupoPermissaoRepository.listarPorTenant).toHaveBeenCalledWith('tenant-id', undefined);
      expect(resultado).toEqual([grupoMock]);
    });

    it('deve listar grupos por tenant e empresa', async () => {
      // Mock do retorno do repositório
      mockGrupoPermissaoRepository.listarPorTenant.mockResolvedValue([grupoMock]);

      // Execução do método
      const resultado = await grupoPermissaoService.listarPorTenant('tenant-id', 'empresa-id');

      // Verificações
      expect(mockGrupoPermissaoRepository.listarPorTenant).toHaveBeenCalledWith('tenant-id', 'empresa-id');
      expect(resultado).toEqual([grupoMock]);
    });
  });

  describe('atualizar', () => {
    it('deve atualizar um grupo existente', async () => {
      // Dados para o teste
      const dadosAtualizacao: IAtualizarGrupoPermissaoDTO = {
        nome: 'Grupo Atualizado',
        descricao: 'Nova descrição',
        permissoes: ['permissao-id-1', 'permissao-id-3']
      };

      // Mock dos retornos
      mockGrupoPermissaoRepository.buscarPorId.mockResolvedValue(grupoMock);
      mockGrupoPermissaoRepository.atualizar.mockResolvedValue({
        ...grupoMock,
        nome: 'Grupo Atualizado',
        descricao: 'Nova descrição',
        permissoes: ['permissao-id-1', 'permissao-id-3']
      });

      // Execução do método
      const resultado = await grupoPermissaoService.atualizar('grupo-id', dadosAtualizacao);

      // Verificações
      expect(mockGrupoPermissaoRepository.buscarPorId).toHaveBeenCalledWith('grupo-id');
      expect(mockGrupoPermissaoRepository.atualizar).toHaveBeenCalledWith('grupo-id', dadosAtualizacao);
      expect(resultado.nome).toBe('Grupo Atualizado');
    });

    it('deve lançar erro ao atualizar grupo inexistente', async () => {
      // Dados para o teste
      const dadosAtualizacao: IAtualizarGrupoPermissaoDTO = {
        nome: 'Grupo Atualizado',
      };

      // Mock do retorno
      mockGrupoPermissaoRepository.buscarPorId.mockResolvedValue(null);

      // Verificação
      await expect(grupoPermissaoService.atualizar('grupo-inexistente', dadosAtualizacao)).rejects.toThrow('Grupo de permissões não encontrado');
    });
  });

  describe('excluir', () => {
    it('deve excluir um grupo existente', async () => {
      // Mock dos retornos
      mockGrupoPermissaoRepository.buscarPorId.mockResolvedValue(grupoMock);
      mockGrupoPermissaoRepository.excluir.mockResolvedValue(undefined);

      // Execução do método
      await grupoPermissaoService.excluir('grupo-id');

      // Verificações
      expect(mockGrupoPermissaoRepository.buscarPorId).toHaveBeenCalledWith('grupo-id');
      expect(mockGrupoPermissaoRepository.excluir).toHaveBeenCalledWith('grupo-id');
    });

    it('deve lançar erro ao excluir grupo inexistente', async () => {
      // Mock do retorno
      mockGrupoPermissaoRepository.buscarPorId.mockResolvedValue(null);

      // Verificação
      await expect(grupoPermissaoService.excluir('grupo-inexistente')).rejects.toThrow('Grupo de permissões não encontrado');
    });
  });

  describe('atribuirAoUsuario', () => {
    it('deve atribuir um grupo a um usuário', async () => {
      // Mock dos retornos
      mockGrupoPermissaoRepository.buscarPorId.mockResolvedValue(grupoMock);
      mockGrupoPermissaoRepository.atribuirAoUsuario.mockResolvedValue(undefined);

      // Execução do método
      await grupoPermissaoService.atribuirAoUsuario('grupo-id', 'usuario-id');

      // Verificações
      expect(mockGrupoPermissaoRepository.buscarPorId).toHaveBeenCalledWith('grupo-id');
      expect(mockGrupoPermissaoRepository.atribuirAoUsuario).toHaveBeenCalledWith('grupo-id', 'usuario-id');
    });

    it('deve lançar erro ao atribuir grupo inexistente', async () => {
      // Mock do retorno
      mockGrupoPermissaoRepository.buscarPorId.mockResolvedValue(null);

      // Verificação
      await expect(grupoPermissaoService.atribuirAoUsuario('grupo-inexistente', 'usuario-id')).rejects.toThrow('Grupo de permissões não encontrado');
    });
  });

  describe('removerDoUsuario', () => {
    it('deve remover um grupo de um usuário', async () => {
      // Mock dos retornos
      mockGrupoPermissaoRepository.buscarPorId.mockResolvedValue(grupoMock);
      mockGrupoPermissaoRepository.removerDoUsuario.mockResolvedValue(undefined);

      // Execução do método
      await grupoPermissaoService.removerDoUsuario('grupo-id', 'usuario-id');

      // Verificações
      expect(mockGrupoPermissaoRepository.buscarPorId).toHaveBeenCalledWith('grupo-id');
      expect(mockGrupoPermissaoRepository.removerDoUsuario).toHaveBeenCalledWith('grupo-id', 'usuario-id');
    });

    it('deve lançar erro ao remover grupo inexistente', async () => {
      // Mock do retorno
      mockGrupoPermissaoRepository.buscarPorId.mockResolvedValue(null);

      // Verificação
      await expect(grupoPermissaoService.removerDoUsuario('grupo-inexistente', 'usuario-id')).rejects.toThrow('Grupo de permissões não encontrado');
    });
  });

  describe('listarPorUsuario', () => {
    it('deve listar grupos de um usuário', async () => {
      // Mock do retorno do repositório
      mockGrupoPermissaoRepository.listarPorUsuario.mockResolvedValue([grupoMock]);

      // Execução do método
      const resultado = await grupoPermissaoService.listarPorUsuario('usuario-id');

      // Verificações
      expect(mockGrupoPermissaoRepository.listarPorUsuario).toHaveBeenCalledWith('usuario-id');
      expect(resultado).toEqual([grupoMock]);
    });
  });

  describe('verificarPermissaoPorGrupo', () => {
    it('deve retornar false quando o usuário não tem grupos', async () => {
      // Mock do retorno do repositório
      mockGrupoPermissaoRepository.listarPorUsuario.mockResolvedValue([]);

      // Execução do método
      const resultado = await grupoPermissaoService.verificarPermissaoPorGrupo(
        'usuario-id',
        'modulo-id',
        'submodulo-id',
        'recurso-id',
        'acao-id',
        'empresa-id'
      );

      // Verificações
      expect(mockGrupoPermissaoRepository.listarPorUsuario).toHaveBeenCalledWith('usuario-id');
      expect(resultado).toBe(false);
    });

    it('deve retornar true quando o usuário tem permissão através de um grupo', async () => {
      // Mock dos retornos
      mockGrupoPermissaoRepository.listarPorUsuario.mockResolvedValue([grupoMock]);
      mockPermissaoService.buscarPermissaoPorId.mockResolvedValueOnce({
        id: 'permissao-id-1',
        moduloId: 'modulo-id',
        submoduloId: 'submodulo-id',
        recursoId: 'recurso-id',
        acaoId: 'acao-id',
        empresaId: 'empresa-id',
        permitido: true
      });

      // Execução do método
      const resultado = await grupoPermissaoService.verificarPermissaoPorGrupo(
        'usuario-id',
        'modulo-id',
        'submodulo-id',
        'recurso-id',
        'acao-id',
        'empresa-id'
      );

      // Verificações
      expect(mockGrupoPermissaoRepository.listarPorUsuario).toHaveBeenCalledWith('usuario-id');
      expect(mockPermissaoService.buscarPermissaoPorId).toHaveBeenCalledWith('permissao-id-1');
      expect(resultado).toBe(true);
    });

    it('deve retornar false quando o usuário não tem permissão através de seus grupos', async () => {
      // Mock dos retornos
      mockGrupoPermissaoRepository.listarPorUsuario.mockResolvedValue([grupoMock]);
      mockPermissaoService.buscarPermissaoPorId.mockResolvedValueOnce({
        id: 'permissao-id-1',
        moduloId: 'outro-modulo',
        submoduloId: 'outro-submodulo',
        recursoId: 'outro-recurso',
        acaoId: 'outra-acao',
        empresaId: 'outra-empresa',
        permitido: true
      });
      mockPermissaoService.buscarPermissaoPorId.mockResolvedValueOnce({
        id: 'permissao-id-2',
        moduloId: 'outro-modulo-2',
        submoduloId: 'outro-submodulo-2',
        recursoId: 'outro-recurso-2',
        acaoId: 'outra-acao-2',
        empresaId: 'outra-empresa-2',
        permitido: true
      });

      // Execução do método
      const resultado = await grupoPermissaoService.verificarPermissaoPorGrupo(
        'usuario-id',
        'modulo-id',
        'submodulo-id',
        'recurso-id',
        'acao-id',
        'empresa-id'
      );

      // Verificações
      expect(mockGrupoPermissaoRepository.listarPorUsuario).toHaveBeenCalledWith('usuario-id');
      expect(mockPermissaoService.buscarPermissaoPorId).toHaveBeenCalledTimes(2);
      expect(resultado).toBe(false);
    });
  });
});
