import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

// Interface para o tenant
interface TenantDto {
  nome: string;
  dominio?: string;
  plano: string;
}

// Interface para a empresa
interface EmpresaDto {
  nome: string;
  cnpj?: string;
}

// Interface para o administrador
interface AdministradorDto {
  nome: string;
  email: string;
  senha: string;
}

// DTO principal para o registro com validação
export class RegisterDtoValidation {
  @IsNotEmpty()
  tenant: TenantDto;

  @IsNotEmpty()
  empresa: EmpresaDto;

  @IsNotEmpty()
  administrador: AdministradorDto;
}
