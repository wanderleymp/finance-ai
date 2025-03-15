import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './authController';
import { JwtAuthService } from '../services/jwtAuthService';
import { UsuarioService } from '../../usuario/services/usuarioService';
import { HttpException } from '@nestjs/common';

// Mock dos serviços
const mockJwtAuthService = {
  login: jest.fn(),
  atualizarToken: jest.fn(),
  logout: jest.fn(),
};

const mockUsuarioService = {
  criar: jest.fn(),
};

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    // Resetar os mocks antes de cada teste
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: JwtAuthService, useValue: mockJwtAuthService },
        { provide: UsuarioService, useValue: mockUsuarioService },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  describe('login', () => {
    it('deve retornar tokens quando o login for bem-sucedido', async () => {
      // Arrange
      const dadosLogin = { email: 'teste@exemplo.com', senha: 'senha123' };
      const tokensEsperados = { accessToken: 'access-token', refreshToken: 'refresh-token' };
      mockJwtAuthService.login.mockResolvedValue(tokensEsperados);

      // Act
      const resultado = await controller.login(dadosLogin);

      // Assert
      expect(mockJwtAuthService.login).toHaveBeenCalledWith(dadosLogin.email, dadosLogin.senha);
      expect(resultado).toEqual(tokensEsperados);
    });

    it('deve lançar uma exceção quando o login falhar', async () => {
      // Arrange
      const dadosLogin = { email: 'teste@exemplo.com', senha: 'senha-incorreta' };
      mockJwtAuthService.login.mockRejectedValue(new Error('Senha inválida'));

      // Act & Assert
      await expect(controller.login(dadosLogin)).rejects.toThrow();
      expect(mockJwtAuthService.login).toHaveBeenCalledWith(dadosLogin.email, dadosLogin.senha);
    });
  });

  describe('refresh', () => {
    it('deve retornar novos tokens quando o refresh for bem-sucedido', async () => {
      // Arrange
      const dadosRefresh = { refreshToken: 'refresh-token-valido' };
      const novosTokens = { accessToken: 'novo-access-token', refreshToken: 'novo-refresh-token' };
      mockJwtAuthService.atualizarToken.mockResolvedValue(novosTokens);

      // Act
      const resultado = await controller.refresh(dadosRefresh);

      // Assert
      expect(mockJwtAuthService.atualizarToken).toHaveBeenCalledWith(dadosRefresh.refreshToken);
      expect(resultado).toEqual(novosTokens);
    });

    it('deve lançar uma exceção quando o refresh falhar', async () => {
      // Arrange
      const dadosRefresh = { refreshToken: 'refresh-token-invalido' };
      mockJwtAuthService.atualizarToken.mockRejectedValue(new Error('Token de atualização inválido'));

      // Act & Assert
      await expect(controller.refresh(dadosRefresh)).rejects.toThrow();
      expect(mockJwtAuthService.atualizarToken).toHaveBeenCalledWith(dadosRefresh.refreshToken);
    });
  });

  describe('getPerfil', () => {
    it('deve retornar o perfil do usuário autenticado', () => {
      // Arrange
      const req = { user: { id: '1', email: 'teste@exemplo.com', nome: 'Usuário Teste' } };

      // Act
      const resultado = controller.getPerfil(req);

      // Assert
      expect(resultado).toEqual(req.user);
    });
  });

  describe('registro', () => {
    it('deve registrar um novo usuário e retornar os dados com tokens', async () => {
      // Arrange
      const dadosRegistro = {
        nome: 'Usuário Teste',
        email: 'teste@exemplo.com',
        senha: 'senha123',
        tenantId: 'tenant-id',
      };
      
      const usuarioCriado = {
        id: '1',
        nome: dadosRegistro.nome,
        email: dadosRegistro.email,
        tenantId: dadosRegistro.tenantId,
        ativo: true,
      };
      
      const tokens = {
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      };

      // Configurar os mocks para simular a criação do usuário e o login subsequente
      mockUsuarioService.criar.mockResolvedValue(usuarioCriado);
      mockJwtAuthService.login.mockResolvedValue(tokens);

      // Act
      const resultado = await controller.registro(dadosRegistro);

      // Assert
      expect(mockUsuarioService.criar).toHaveBeenCalledWith({
        nome: dadosRegistro.nome,
        email: dadosRegistro.email,
        senha: dadosRegistro.senha,
        tenantId: dadosRegistro.tenantId,
        empresaId: undefined,
      });
      
      expect(mockJwtAuthService.login).toHaveBeenCalledWith(dadosRegistro.email, dadosRegistro.senha);
      
      expect(resultado).toEqual({
        usuario: usuarioCriado,
        ...tokens,
      });
    });

    it('deve lançar uma exceção quando o registro falhar', async () => {
      // Arrange
      const dadosRegistro = {
        nome: 'Usuário Teste',
        email: 'teste@exemplo.com',
        senha: 'senha123',
        tenantId: 'tenant-id',
      };
      
      mockUsuarioService.criar.mockRejectedValue(new Error('Já existe um usuário com este email'));

      // Act & Assert
      await expect(controller.registro(dadosRegistro)).rejects.toThrow();
      expect(mockUsuarioService.criar).toHaveBeenCalledWith({
        nome: dadosRegistro.nome,
        email: dadosRegistro.email,
        senha: dadosRegistro.senha,
        tenantId: dadosRegistro.tenantId,
        empresaId: undefined,
      });
    });
  });

  describe('logout', () => {
    it('deve realizar logout com sucesso', async () => {
      // Arrange
      const req = { user: { id: '1' } };
      mockJwtAuthService.logout.mockResolvedValue(undefined);

      // Act
      const resultado = await controller.logout(req);

      // Assert
      expect(mockJwtAuthService.logout).toHaveBeenCalledWith(req.user.id);
      expect(resultado).toEqual({ mensagem: 'Logout realizado com sucesso' });
    });

    it('deve lançar uma exceção quando o logout falhar', async () => {
      // Arrange
      const req = { user: { id: '1' } };
      mockJwtAuthService.logout.mockRejectedValue(new Error('Erro ao realizar logout'));

      // Act & Assert
      await expect(controller.logout(req)).rejects.toThrow();
      expect(mockJwtAuthService.logout).toHaveBeenCalledWith(req.user.id);
    });
  });
});
