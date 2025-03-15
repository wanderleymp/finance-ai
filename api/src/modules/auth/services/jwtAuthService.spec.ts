import { Test, TestingModule } from '@nestjs/testing';
import { JwtAuthService } from './jwtAuthService';
import { UsuarioRepository } from '../../usuario/repositories/usuarioRepository';
import { JwtService } from '@nestjs/jwt';

// Mock do bcrypt para evitar problemas com o spyOn
jest.mock('bcrypt', () => ({
  compare: jest.fn(),
  genSalt: jest.fn(),
  hash: jest.fn()
}));

import * as bcrypt from 'bcrypt';

const mockUsuarioRepository = {
  buscarPorEmail: jest.fn(),
  findById: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn(),
  verify: jest.fn(),
};

describe('JwtAuthService', () => {
  let service: JwtAuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtAuthService,
        { provide: UsuarioRepository, useValue: mockUsuarioRepository },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<JwtAuthService>(JwtAuthService);
    
    // Garantir que os mocks estejam corretamente injetados
    Object.defineProperty(service, 'usuarioRepository', {
      value: mockUsuarioRepository,
      writable: true
    });
    
    Object.defineProperty(service, 'jwtService', {
      value: mockJwtService,
      writable: true
    });
  });

  describe('login', () => {
    it('should throw an error if user not found', async () => {
      mockUsuarioRepository.buscarPorEmail.mockResolvedValue(null);
      await expect(service.login('test@example.com', 'senha')).rejects.toThrow('Usuário não encontrado');
    });

    it('should throw an error if user is inactive', async () => {
      mockUsuarioRepository.buscarPorEmail.mockResolvedValue({ ativo: false });
      await expect(service.login('test@example.com', 'senha')).rejects.toThrow('Usuário inativo');
    });

    it('should throw an error if password is invalid', async () => {
      mockUsuarioRepository.buscarPorEmail.mockResolvedValue({ ativo: true, senha: 'hashedPassword' });
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);
      await expect(service.login('test@example.com', 'senha')).rejects.toThrow('Senha inválida');
    });

    it('should return access and refresh tokens on successful login', async () => {
      const user = { id: '1', email: 'test@example.com', tenantId: 'tenantId', ativo: true, senha: 'hashedPassword' };
      mockUsuarioRepository.buscarPorEmail.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockJwtService.sign.mockReturnValue('token');

      const tokens = await service.login('test@example.com', 'senha');
      expect(tokens).toEqual({ accessToken: 'token', refreshToken: 'token' });
    });
  });

  describe('validarToken', () => {
    it('should return payload if token is valid', async () => {
      const payload = { sub: '1', email: 'test@example.com' };
      mockJwtService.verify.mockReturnValue(payload);
      const result = await service.validarToken('validToken');
      expect(result).toEqual(payload);
    });

    it('should return null if token is invalid', async () => {
      mockJwtService.verify.mockImplementation(() => { throw new Error('Invalid token'); });
      const result = await service.validarToken('invalidToken');
      expect(result).toBeNull();
    });
  });

  describe('atualizarToken', () => {
    it('should throw an error if refresh token is invalid', async () => {
      mockJwtService.verify.mockImplementation(() => { throw new Error('Invalid token'); });
      await expect(service.atualizarToken('invalidRefreshToken')).rejects.toThrow('Token de atualização inválido');
    });

    it('should return new access and refresh tokens on successful update', async () => {
      const payload = { sub: '1', email: 'test@example.com' };
      const user = { id: '1', email: 'test@example.com', tenantId: 'tenantId', ativo: true };
      mockJwtService.verify.mockReturnValue(payload);
      mockUsuarioRepository.findById.mockResolvedValue(user);
      mockJwtService.sign.mockReturnValue('newToken');

      const tokens = await service.atualizarToken('validRefreshToken');
      expect(tokens).toEqual({ accessToken: 'newToken', refreshToken: 'newToken' });
    });
  });
});
