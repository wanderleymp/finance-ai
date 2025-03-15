import { Test, TestingModule } from '@nestjs/testing';
import { GrupoPermissaoRepository } from '../repositories/grupoPermissaoRepository';
import { PrismaService } from '../../../core/database/providers/prisma/prisma.service';

describe('GrupoPermissaoRepository', () => {
  let grupoPermissaoRepository: GrupoPermissaoRepository;
  
  // Mock do serviço Prisma
  const mockPrismaService = {
    usuarioGrupoPermissao: {
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
      }])
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GrupoPermissaoRepository,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    grupoPermissaoRepository = module.get<GrupoPermissaoRepository>(GrupoPermissaoRepository);
  });

  describe('listarPorUsuario', () => {
    it('deve listar grupos de um usuário', async () => {
      // Execução do método
      const resultado = await grupoPermissaoRepository.listarPorUsuario('usuario-id');

      // Verificações
      expect(mockPrismaService.usuarioGrupoPermissao.findMany).toHaveBeenCalledWith({
        where: { usuarioId: 'usuario-id' },
        include: {
          grupoPermissao: {
            include: {
              permissoesGrupo: true
            }
          }
        }
      });
      
      // Verificamos apenas os campos mais importantes
      expect(resultado.length).toBe(1);
      expect(resultado[0].id).toBe('grupo-id');
      expect(resultado[0].nome).toBe('Grupo de Teste');
      expect(resultado[0].permissoes).toEqual(expect.arrayContaining(['permissao-id-1', 'permissao-id-2']));
    });
  });
});
