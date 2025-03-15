import { Test, TestingModule } from '@nestjs/testing';
import { PermissoesController } from './permissoesController';
import { PermissaoService } from '../../permissao/services/permissaoService';
import { PerfilService } from '../../perfil/services/perfilService';

// Interface para tipar o resultado do método verificarPermissoes
interface IPermissoesOrganizadas {
  [modulo: string]: {
    [submodulo: string]: {
      [recurso: string]: string[];
    };
  };
}

interface IResultadoPermissoes {
  perfis: string[];
  permissoes: IPermissoesOrganizadas;
}

// Mock dos serviços
const mockPermissaoService = {
  listarPermissoesPorUsuario: jest.fn(),
};

const mockPerfilService = {
  listarPerfisPorUsuario: jest.fn(),
  listarPermissoesPorPerfil: jest.fn(),
};

describe('PermissoesController', () => {
  let controller: PermissoesController;

  beforeEach(async () => {
    // Resetar os mocks antes de cada teste
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PermissoesController],
      providers: [
        { provide: PermissaoService, useValue: mockPermissaoService },
        { provide: PerfilService, useValue: mockPerfilService },
      ],
    }).compile();

    controller = module.get<PermissoesController>(PermissoesController);
  });

  describe('verificarPermissoes', () => {
    it('deve retornar as permissões organizadas e perfis do usuário', async () => {
      // Arrange
      const req = { 
        user: { 
          id: '1', 
          empresaId: 'empresa-1' 
        } 
      };

      // Configurar os mocks para retornar dados de teste
      const permissoesUsuario = [
        {
          id: 'perm-1',
          modulo: { codigo: 'financeiro' },
          submodulo: { codigo: 'contas' },
          recurso: { codigo: 'pagamentos' },
          acao: { codigo: 'criar' },
          permitido: true
        },
        {
          id: 'perm-2',
          modulo: { codigo: 'financeiro' },
          submodulo: { codigo: 'contas' },
          recurso: { codigo: 'pagamentos' },
          acao: { codigo: 'editar' },
          permitido: true
        },
        {
          id: 'perm-3',
          modulo: { codigo: 'financeiro' },
          submodulo: { codigo: 'contas' },
          recurso: { codigo: 'pagamentos' },
          acao: { codigo: 'excluir' },
          permitido: false // Esta permissão não deve aparecer no resultado
        }
      ];

      const perfisUsuario = [
        { id: 'perfil-1', nome: 'Administrador' },
        { id: 'perfil-2', nome: 'Financeiro' }
      ];

      const permissoesPerfil1 = [
        {
          id: 'perm-perfil-1',
          modulo: { codigo: 'admin' },
          submodulo: { codigo: 'usuarios' },
          recurso: { codigo: 'gerenciar' },
          acao: { codigo: 'acessar' },
          permitido: true
        }
      ];

      const permissoesPerfil2 = [
        {
          id: 'perm-perfil-2',
          modulo: { codigo: 'financeiro' },
          submodulo: { codigo: 'relatorios' },
          recurso: { codigo: 'visualizar' },
          acao: { codigo: 'acessar' },
          permitido: true
        }
      ];

      mockPermissaoService.listarPermissoesPorUsuario.mockResolvedValue(permissoesUsuario);
      mockPerfilService.listarPerfisPorUsuario.mockResolvedValue(perfisUsuario);
      mockPerfilService.listarPermissoesPorPerfil
        .mockResolvedValueOnce(permissoesPerfil1)
        .mockResolvedValueOnce(permissoesPerfil2);

      // Act
      const resultado = await controller.verificarPermissoes(req);

      // Assert
      expect(mockPermissaoService.listarPermissoesPorUsuario).toHaveBeenCalledWith('1');
      expect(mockPerfilService.listarPerfisPorUsuario).toHaveBeenCalledWith('1');
      expect(mockPerfilService.listarPermissoesPorPerfil).toHaveBeenCalledWith('perfil-1');
      expect(mockPerfilService.listarPermissoesPorPerfil).toHaveBeenCalledWith('perfil-2');

      // Verificar a estrutura do resultado
      expect(resultado).toHaveProperty('perfis');
      expect(resultado).toHaveProperty('permissoes');
      
      // Verificar os perfis retornados
      expect(resultado.perfis).toEqual(['Administrador', 'Financeiro']);
      
      // Verificar as permissões organizadas
      expect(resultado.permissoes).toHaveProperty('financeiro');
      expect((resultado.permissoes as IPermissoesOrganizadas).financeiro).toHaveProperty('contas');
      expect((resultado.permissoes as IPermissoesOrganizadas).financeiro.contas).toHaveProperty('pagamentos');
      expect((resultado.permissoes as IPermissoesOrganizadas).financeiro.contas.pagamentos).toContain('criar');
      expect((resultado.permissoes as IPermissoesOrganizadas).financeiro.contas.pagamentos).toContain('editar');
      expect((resultado.permissoes as IPermissoesOrganizadas).financeiro.contas.pagamentos).not.toContain('excluir'); // Não permitido
      
      // Verificar permissões do perfil
      expect(resultado.permissoes).toHaveProperty('admin');
      expect((resultado.permissoes as IPermissoesOrganizadas).admin).toHaveProperty('usuarios');
      expect((resultado.permissoes as IPermissoesOrganizadas).admin.usuarios).toHaveProperty('gerenciar');
      expect((resultado.permissoes as IPermissoesOrganizadas).admin.usuarios.gerenciar).toContain('acessar');
      
      expect((resultado.permissoes as IPermissoesOrganizadas).financeiro).toHaveProperty('relatorios');
      expect((resultado.permissoes as IPermissoesOrganizadas).financeiro.relatorios).toHaveProperty('visualizar');
      expect((resultado.permissoes as IPermissoesOrganizadas).financeiro.relatorios.visualizar).toContain('acessar');
    });

    it('deve lidar com o caso em que o usuário não tem permissões ou perfis', async () => {
      // Arrange
      const req = { 
        user: { 
          id: '1', 
          empresaId: 'empresa-1' 
        } 
      };

      // Configurar os mocks para retornar arrays vazios
      mockPermissaoService.listarPermissoesPorUsuario.mockResolvedValue([]);
      mockPerfilService.listarPerfisPorUsuario.mockResolvedValue([]);

      // Act
      const resultado = await controller.verificarPermissoes(req);

      // Assert
      expect(mockPermissaoService.listarPermissoesPorUsuario).toHaveBeenCalledWith('1');
      expect(mockPerfilService.listarPerfisPorUsuario).toHaveBeenCalledWith('1');
      
      // Verificar a estrutura do resultado
      expect(resultado).toHaveProperty('perfis');
      expect(resultado).toHaveProperty('permissoes');
      
      // Verificar que os arrays estão vazios
      expect(resultado.perfis).toEqual([]);
      expect(resultado.permissoes).toEqual({});
    });

    it('deve ignorar permissões não permitidas', async () => {
      // Arrange
      const req = { 
        user: { 
          id: '1', 
          empresaId: 'empresa-1' 
        } 
      };

      // Configurar os mocks para retornar apenas permissões não permitidas
      const permissoesUsuario = [
        {
          id: 'perm-1',
          modulo: { codigo: 'financeiro' },
          submodulo: { codigo: 'contas' },
          recurso: { codigo: 'pagamentos' },
          acao: { codigo: 'criar' },
          permitido: false
        },
        {
          id: 'perm-2',
          modulo: { codigo: 'financeiro' },
          submodulo: { codigo: 'contas' },
          recurso: { codigo: 'pagamentos' },
          acao: { codigo: 'editar' },
          permitido: false
        }
      ];

      mockPermissaoService.listarPermissoesPorUsuario.mockResolvedValue(permissoesUsuario);
      mockPerfilService.listarPerfisPorUsuario.mockResolvedValue([]);

      // Act
      const resultado = await controller.verificarPermissoes(req);

      // Assert
      expect(mockPermissaoService.listarPermissoesPorUsuario).toHaveBeenCalledWith('1');
      expect(mockPerfilService.listarPerfisPorUsuario).toHaveBeenCalledWith('1');
      
      // Verificar que não há permissões no resultado
      expect(resultado.permissoes).toEqual({});
    });

    it('deve lidar com permissões sem todos os campos preenchidos', async () => {
      // Arrange
      const req = { 
        user: { 
          id: '1', 
          empresaId: 'empresa-1' 
        } 
      };

      // Configurar os mocks para retornar permissões com campos faltando
      const permissoesUsuario = [
        {
          id: 'perm-1',
          modulo: { codigo: 'financeiro' },
          // Sem submodulo
          // Sem recurso
          acao: { codigo: 'acessar' },
          permitido: true
        },
        {
          id: 'perm-2',
          modulo: { codigo: 'admin' },
          submodulo: { codigo: 'usuarios' },
          // Sem recurso
          // Sem acao
          permitido: true
        }
      ];

      mockPermissaoService.listarPermissoesPorUsuario.mockResolvedValue(permissoesUsuario);
      mockPerfilService.listarPerfisPorUsuario.mockResolvedValue([]);

      // Act
      const resultado = await controller.verificarPermissoes(req);

      // Assert
      expect(mockPermissaoService.listarPermissoesPorUsuario).toHaveBeenCalledWith('1');
      
      // Verificar que as permissões foram organizadas corretamente com valores padrão
      expect(resultado.permissoes).toHaveProperty('financeiro');
      expect((resultado.permissoes as IPermissoesOrganizadas).financeiro).toHaveProperty('geral'); // valor padrão para submodulo
      expect((resultado.permissoes as IPermissoesOrganizadas).financeiro.geral).toHaveProperty('geral'); // valor padrão para recurso
      expect((resultado.permissoes as IPermissoesOrganizadas).financeiro.geral.geral).toContain('acessar');
      
      expect(resultado.permissoes).toHaveProperty('admin');
      expect((resultado.permissoes as IPermissoesOrganizadas).admin).toHaveProperty('usuarios');
      expect((resultado.permissoes as IPermissoesOrganizadas).admin.usuarios).toHaveProperty('geral'); // valor padrão para recurso
      expect((resultado.permissoes as IPermissoesOrganizadas).admin.usuarios.geral).toContain('acessar'); // valor padrão para acao
    });
  });
});
