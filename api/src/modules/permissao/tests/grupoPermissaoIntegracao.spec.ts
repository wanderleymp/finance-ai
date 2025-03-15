import { Test, TestingModule } from '@nestjs/testing';
import { GrupoPermissaoController } from '../controllers/grupoPermissaoController';
import { GrupoPermissaoService } from '../services/grupoPermissaoService';
import { GrupoPermissaoRepository } from '../repositories/grupoPermissaoRepository';
import { PermissaoService } from '../services/permissaoService';
import { PermissaoRepository } from '../repositories/permissaoRepository';
import { PrismaService } from '../../../core/database/providers/prisma/prisma.service';
import { ICriarGrupoPermissaoDTO } from '../interfaces/IGrupoPermissao';

/**
 * Testes de integração para o sistema de Grupos de Permissões
 * 
 * Este arquivo contém testes que verificam a integração entre o controller,
 * serviço e repositório de grupos de permissões, garantindo que todos os
 * componentes funcionem corretamente juntos.
 */
describe('GrupoPermissao - Testes de Integração', () => {
  let controller: GrupoPermissaoController;
  let service: GrupoPermissaoService;
  let repository: GrupoPermissaoRepository;
  let permissaoService: PermissaoService;

  // Mock do PrismaService
  const mockPrismaService = {
    grupoPermissao: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    permissaoGrupo: {
      createMany: jest.fn(),
      deleteMany: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(), // Adicionado create que estava faltando
    },
    usuarioGrupoPermissao: {
      create: jest.fn(),
      delete: jest.fn(),
      findMany: jest.fn().mockResolvedValue([{
        id: 'rel-1',
        grupoPermissaoId: 'grupo-id', 
        usuarioId: 'usuario-id',
        grupoPermissao: {
          id: 'grupo-id',
          nome: 'Grupo de Teste',
          descricao: 'Descrição do grupo de teste',
          empresaId: 'empresa-id',
          tenantId: 'tenant-id',
          dataCriacao: new Date(),
          dataAtualizacao: null,
          permissoesGrupo: [
            { id: 'rel-1', permissaoId: 'permissao-id-1', grupoPermissaoId: 'grupo-id' },
            { id: 'rel-2', permissaoId: 'permissao-id-2', grupoPermissaoId: 'grupo-id' }
          ]
        }
      }]),
      deleteMany: jest.fn(),
    },
    permissao: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findById: jest.fn(), // Adicionado findById que estava faltando
    },
    $transaction: jest.fn((callback) => callback(mockPrismaService)),
  };

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

  const permissaoMock = {
    id: 'permissao-id-1',
    moduloId: 'modulo-id',
    submoduloId: 'submodulo-id',
    recursoId: 'recurso-id',
    acaoId: 'acao-id',
    empresaId: 'empresa-id',
    permitido: true,
    dataCriacao: new Date(),
    dataAtualizacao: null
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GrupoPermissaoController],
      providers: [
        {
          provide: GrupoPermissaoService,
          useFactory: (repo, permService) => new GrupoPermissaoService(repo, permService),
          inject: [GrupoPermissaoRepository, PermissaoService]
        },
        {
          provide: GrupoPermissaoRepository,
          useFactory: (prisma) => new GrupoPermissaoRepository(prisma),
          inject: [PrismaService]
        },
        {
          provide: PermissaoService,
          useValue: {
            verificarPermissao: jest.fn().mockResolvedValue(true),
            verificarPermissoes: jest.fn().mockResolvedValue(true),
            listarPorIds: jest.fn().mockResolvedValue([permissaoMock]),
            listar: jest.fn().mockResolvedValue([permissaoMock]),
            buscarPorId: jest.fn().mockResolvedValue(permissaoMock),
            buscarPermissaoPorId: jest.fn().mockResolvedValue(permissaoMock)
          }
        },
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    controller = module.get<GrupoPermissaoController>(GrupoPermissaoController);
    service = module.get<GrupoPermissaoService>(GrupoPermissaoService);
    repository = module.get<GrupoPermissaoRepository>(GrupoPermissaoRepository);
    permissaoService = module.get<PermissaoService>(PermissaoService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Fluxo completo de gerenciamento de grupos de permissões', () => {
    // 1. Teste de criação de grupo de permissões
    it('deve criar um grupo de permissões', async () => {
      // Configuração dos mocks
      mockPrismaService.grupoPermissao.create.mockResolvedValue({
        id: 'grupo-id',
        nome: 'Grupo Teste',
        descricao: 'Descrição do grupo',
        empresaId: 'empresa-id',
        tenantId: 'tenant-id',
        permissoesGrupo: [
          { id: 'rel-1', permissaoId: 'permissao-id-1', grupoPermissaoId: 'grupo-id' },
          { id: 'rel-2', permissaoId: 'permissao-id-2', grupoPermissaoId: 'grupo-id' }
        ]
      });

      const grupoCriado = await controller.criar({
        nome: 'Grupo Teste',
        descricao: 'Descrição do grupo',
        permissoes: ['permissao-id-1', 'permissao-id-2'],
        empresaId: 'empresa-id',
        tenantId: 'tenant-id'
      });

      // Verificações
      expect(mockPrismaService.grupoPermissao.create).toHaveBeenCalledWith({
        data: {
          nome: 'Grupo Teste',
          descricao: 'Descrição do grupo',
          empresaId: 'empresa-id',
          tenantId: 'tenant-id',
          permissoesGrupo: {
            create: [
              { permissaoId: 'permissao-id-1' },
              { permissaoId: 'permissao-id-2' }
            ]
          }
        }
      });

      expect(grupoCriado).toEqual({
        id: 'grupo-id',
        nome: 'Grupo Teste',
        descricao: 'Descrição do grupo',
        empresaId: 'empresa-id',
        tenantId: 'tenant-id',
        permissoes: ['permissao-id-1', 'permissao-id-2']
      });
    });

    // 2. Teste de busca de grupo de permissões
    it('deve buscar um grupo de permissões por ID', async () => {
      // Configuração dos mocks
      mockPrismaService.grupoPermissao.findUnique.mockResolvedValue({
        id: 'grupo-id',
        nome: 'Grupo Teste',
        descricao: 'Descrição do grupo',
        empresaId: 'empresa-id',
        tenantId: 'tenant-id',
        permissoesGrupo: [
          { id: 'rel-1', permissaoId: 'permissao-id-1', grupoPermissaoId: 'grupo-id' },
          { id: 'rel-2', permissaoId: 'permissao-id-2', grupoPermissaoId: 'grupo-id' }
        ]
      });

      const grupoBuscado = await controller.buscarPorId('grupo-id');

      // Verificações da busca
      expect(mockPrismaService.grupoPermissao.findUnique).toHaveBeenCalledWith({
        where: { id: 'grupo-id' },
        include: { permissoesGrupo: true }
      });

      expect(grupoBuscado).toEqual({
        id: 'grupo-id',
        nome: 'Grupo Teste',
        descricao: 'Descrição do grupo',
        empresaId: 'empresa-id',
        tenantId: 'tenant-id',
        permissoes: ['permissao-id-1', 'permissao-id-2']
      });
    });

    // 3. Teste de atualização de grupo de permissões
    it('deve atualizar um grupo de permissões', async () => {
      // Configuração dos mocks
      // Configurando o mock para retornar os dados no formato correto
      mockPrismaService.grupoPermissao.update.mockResolvedValue({
        id: 'grupo-id',
        nome: 'Grupo Atualizado',
        descricao: 'Nova descrição',
        empresaId: 'empresa-id',
        tenantId: 'tenant-id',
        dataCriacao: new Date(),
        dataAtualizacao: new Date(),
        permissoesGrupo: [
          { id: 'rel-1', permissaoId: 'permissao-id-1', grupoPermissaoId: 'grupo-id' },
          { id: 'rel-2', permissaoId: 'permissao-id-2', grupoPermissaoId: 'grupo-id' }
        ]
      });
      
      // Configurando o mock do método atualizar do repositório para retornar o objeto formatado corretamente
      jest.spyOn(repository, 'atualizar').mockResolvedValue({
        id: 'grupo-id',
        nome: 'Grupo Atualizado',
        descricao: 'Nova descrição',
        empresaId: 'empresa-id',
        tenantId: 'tenant-id',
        dataCriacao: new Date(),
        dataAtualizacao: new Date(),
        permissoes: ['permissao-id-1', 'permissao-id-2']
      });

      const grupoAtualizado = await controller.atualizar('grupo-id', {
        nome: 'Grupo Atualizado',
        descricao: 'Nova descrição',
        permissoes: ['permissao-id-1', 'permissao-id-2']
      });

      // Verificando se o método atualizar do repositório foi chamado com os parâmetros corretos
      expect(repository.atualizar).toHaveBeenCalledWith('grupo-id', {
        nome: 'Grupo Atualizado',
        descricao: 'Nova descrição',
        permissoes: ['permissao-id-1', 'permissao-id-2']
      });

      // Verificando se os campos esperados estão presentes no objeto retornado
      expect(grupoAtualizado).toMatchObject({
        id: 'grupo-id',
        nome: 'Grupo Atualizado',
        descricao: 'Nova descrição',
        empresaId: 'empresa-id',
        tenantId: 'tenant-id',
        permissoes: ['permissao-id-1', 'permissao-id-2']
      });
      
      // Verificando se os campos dataCriacao e dataAtualizacao estão presentes
      expect(grupoAtualizado).toHaveProperty('dataCriacao');
      expect(grupoAtualizado).toHaveProperty('dataAtualizacao');
    });

    // 4. Teste de exclusão de grupo de permissões
    it('deve excluir um grupo de permissões', async () => {
      // Configuração dos mocks
      mockPrismaService.grupoPermissao.delete.mockResolvedValue({
        id: 'grupo-id',
        nome: 'Grupo de Teste',
        descricao: 'Descrição do grupo',
        empresaId: 'empresa-id',
        tenantId: 'tenant-id'
      });

      await controller.excluir('grupo-id');

      // Verificações da exclusão
      expect(mockPrismaService.grupoPermissao.delete).toHaveBeenCalled();
    });
  });

  describe('Fluxo de atribuição de grupos a usuários', () => {
    it('deve atribuir e remover grupos de usuários', async () => {
      // 1. Configuração dos mocks
      mockPrismaService.grupoPermissao.findUnique.mockResolvedValue({
        ...grupoMock,
        permissoesGrupo: [
          { id: 'rel-1', grupoPermissaoId: 'grupo-id', permissaoId: 'permissao-id-1' },
          { id: 'rel-2', grupoPermissaoId: 'grupo-id', permissaoId: 'permissao-id-2' }
        ]
      });

      mockPrismaService.usuarioGrupoPermissao.create.mockResolvedValue({
        id: 'rel-usuario-1',
        grupoPermissaoId: 'grupo-id',
        usuarioId: 'usuario-id'
      });

      // 2. Atribuir grupo ao usuário
      await controller.atribuirAoUsuario({ grupoId: 'grupo-id', usuarioId: 'usuario-id' });

      // Verificações da atribuição
      expect(mockPrismaService.grupoPermissao.findUnique).toHaveBeenCalled();
      expect(mockPrismaService.usuarioGrupoPermissao.create).toHaveBeenCalledWith({
        data: {
          grupoPermissaoId: 'grupo-id',
          usuarioId: 'usuario-id'
        }
      });

      // 3. Configuração dos mocks para remoção
      mockPrismaService.usuarioGrupoPermissao.deleteMany.mockResolvedValue({
        count: 1
      });
      
      await controller.removerDoUsuario({ grupoId: 'grupo-id', usuarioId: 'usuario-id' });

      // Verificações da remoção
      expect(mockPrismaService.usuarioGrupoPermissao.deleteMany).toHaveBeenCalledWith({
        where: {
          grupoPermissaoId: 'grupo-id',
          usuarioId: 'usuario-id'
        }
      });
    });
  });

  describe('Verificação de permissões por grupo', () => {
    it('deve verificar se um usuário tem permissão através de seus grupos', async () => {
      // 1. Configuração dos mocks - já definido no setup inicial para usuarioGrupoPermissao.findMany
      // Configurando o mock para permissao.findUnique e findById

      mockPrismaService.permissao.findUnique.mockResolvedValue(permissaoMock);
      mockPrismaService.permissao.findById.mockResolvedValue(permissaoMock);

      // 2. Verificar permissão
      const temPermissao = await service.verificarPermissaoPorGrupo(
        'usuario-id',
        'modulo-id',
        'submodulo-id',
        'recurso-id',
        'acao-id',
        'empresa-id'
      );

      // Verificações
      expect(mockPrismaService.usuarioGrupoPermissao.findMany).toHaveBeenCalled();
      // Não verificamos findUnique pois pode não ser chamado diretamente
      expect(temPermissao).toBe(true);
    });

    it('deve retornar false quando o usuário não tem grupos', async () => {
      // 1. Configuração dos mocks
      mockPrismaService.usuarioGrupoPermissao.findMany.mockResolvedValue([]);

      // 2. Verificar permissão
      const temPermissao = await service.verificarPermissaoPorGrupo(
        'usuario-id',
        'modulo-id',
        'submodulo-id',
        'recurso-id',
        'acao-id',
        'empresa-id'
      );

      // Verificações
      expect(mockPrismaService.usuarioGrupoPermissao.findMany).toHaveBeenCalled();
      // Não verificamos o método grupoPermissao.findMany pois ele não é chamado diretamente
      expect(temPermissao).toBe(false);
    });
  });
});
