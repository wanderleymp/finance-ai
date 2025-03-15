import { Test, TestingModule } from '@nestjs/testing';
import { AuthModule } from '../auth.module';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthService } from '../services/jwtAuthService';
import { UsuarioService } from '../../usuario/services/usuarioService';
import { ConfigService } from '@nestjs/config';

/**
 * Testes para o módulo de autenticação
 * 
 * Este arquivo contém testes unitários para o AuthModule,
 * verificando se as dependências circulares estão resolvidas corretamente.
 */
describe('AuthModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    // Mock do JwtService
    const mockJwtService = {
      sign: jest.fn(),
      verify: jest.fn(),
    };

    // Mock do ConfigService
    const mockConfigService = {
      get: jest.fn(),
    };

    // Mock do UsuarioService
    const mockUsuarioService = {
      findById: jest.fn(),
      findByEmail: jest.fn(),
    };

    // Cria um módulo de teste com os mocks necessários
    module = await Test.createTestingModule({
      imports: [AuthModule],
    })
      .overrideProvider(JwtService)
      .useValue(mockJwtService)
      .overrideProvider(ConfigService)
      .useValue(mockConfigService)
      .overrideProvider(UsuarioService)
      .useValue(mockUsuarioService)
      .compile();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve ser definido', () => {
    expect(module).toBeDefined();
  });

  it('deve fornecer o JwtAuthService', () => {
    const jwtAuthService = module.get<JwtAuthService>(JwtAuthService);
    expect(jwtAuthService).toBeDefined();
  });

  it('deve fornecer o JwtService', () => {
    const jwtService = module.get<JwtService>(JwtService);
    expect(jwtService).toBeDefined();
  });

  it('deve fornecer o UsuarioService através da dependência circular resolvida', () => {
    // Verifica se o UsuarioService está disponível no contexto do módulo
    const usuarioService = module.get<UsuarioService>(UsuarioService);
    expect(usuarioService).toBeDefined();
  });
});
