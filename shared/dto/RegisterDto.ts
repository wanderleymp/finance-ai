import { IsNotEmpty, IsOptional, IsString, IsEmail } from 'class-validator';

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

// DTO principal para o registro
export class RegisterDto {
  @IsNotEmpty()
  tenant: TenantDto;

  @IsNotEmpty()
  empresa: EmpresaDto;

  @IsNotEmpty()
  administrador: AdministradorDto;
}
