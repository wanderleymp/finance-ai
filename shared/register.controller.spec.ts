import { Test, TestingModule } from '@nestjs/testing';
import { RegisterController } from './register.controller';
import { RegisterService } from './register.service';
import { RegisterDtoValidation } from './dto/RegisterDtoValidation';
import { RegisterResult } from './interfaces/register-result.interface';

describe('RegisterController', () => {
  let controller: RegisterController; 
  let service: RegisterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RegisterController],
      providers: [{ provide: RegisterService, useValue: { registerTenant: jest.fn() } }],
    }).compile();

    controller = module.get<RegisterController>(RegisterController);
    service = module.get<RegisterService>(RegisterService);
  });

  it('should register a tenant', async () => {
    const registerDto: RegisterDtoValidation = { 
      tenant: { nome: 'Organização Teste', dominio: 'organizacao.finance-ai.com', plano: 'basic' },
      empresa: { nome: 'Empresa Teste', cnpj: '00000000000000' },
      administrador: { nome: 'Admin Teste', email: 'admin@organizacao.com', senha: 'senha_segura' }
    };

    const expectedResult: RegisterResult = {
      success: true,
      tenant: {
        id: 1, // ID como número, não como string
        nome: 'Organização Teste',
        dominio: 'organizacao.finance-ai.com',
        plano: 'basic'
      }
    };

    jest.spyOn(service, 'registerTenant').mockResolvedValue(expectedResult);

    const result = await controller.register(registerDto);
    expect(result).toEqual(expectedResult);
    expect(service.registerTenant).toHaveBeenCalledWith(registerDto);
    expect(result.success).toBe(true);
    expect(result.tenant.nome).toBe('Organização Teste');
    expect(result.tenant.dominio).toBe('organizacao.finance-ai.com');
    expect(result.tenant.plano).toBe('basic');
  });
});
