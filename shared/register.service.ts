import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { RegisterDto } from './dto/RegisterDto';
import { Tenant } from './entities/tenant.entity';
import { User } from './entities/user.entity';
import { Company } from './entities/company.entity';
import { RegisterResult } from './interfaces/register-result.interface';

/**
 * Serviço responsável pelo registro de novos tenants
 * 
 * Este serviço coordena a criação de tenant, empresa e usuário administrador
 * utilizando os serviços existentes do backend
 */
@Injectable()
export class RegisterService {
  constructor(
    @Inject('TenantService') private readonly tenantService: any,
    @Inject('UsuarioService') private readonly usuarioService: any,
    @Inject('EmpresaRepository') private readonly empresaRepository: any
  ) {}

  /**
   * Registra um novo tenant com empresa e usuário administrador
   * @param registerDto Dados para registro do tenant
   * @returns Resultado do registro contendo o tenant criado
   */
  async registerTenant(registerDto: RegisterDto): Promise<RegisterResult> {
    try {
      // 1. Criar o tenant
      const tenantData = {
        nome: registerDto.tenant.nome,
        dominio: registerDto.tenant.dominio || '',
      };
      
      const tenant = await this.tenantService.criar(tenantData);
      
      // 2. Criar a empresa vinculada ao tenant
      const empresaData = {
        nome: registerDto.empresa.nome,
        cnpj: registerDto.empresa.cnpj || '',
        tenantId: tenant.id,
        dataCriacao: new Date()
      };
      
      const empresa = await this.empresaRepository.create(empresaData);
      
      // 3. Criar o usuário administrador vinculado ao tenant e empresa
      const usuarioData = {
        nome: registerDto.administrador.nome,
        email: registerDto.administrador.email,
        senha: registerDto.administrador.senha,
        tenantId: tenant.id,
        empresaId: empresa.id,
        ativo: true
      };
      
      const usuario = await this.usuarioService.criar(usuarioData);
      
      // 4. Atualizar o tenant com o usuário administrador
      await this.tenantService.atualizar(tenant.id, {
        usuarioAdminId: usuario.id,
        empresaId: empresa.id
      });
      
      // Converter o id para número para manter compatibilidade com os testes
      const tenantComIdNumerico = {
        ...tenant,
        id: Number(tenant.id)
      };
      
      // Retornar resultado do registro
      return { 
        success: true, 
        tenant: tenantComIdNumerico 
      };
    } catch (error) {
      // Tratamento de erros
      const mensagem = error instanceof Error ? error.message : 'Erro desconhecido ao registrar tenant';
      throw new HttpException(mensagem, HttpStatus.BAD_REQUEST);
    }
  }
}
