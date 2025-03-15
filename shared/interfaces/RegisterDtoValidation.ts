import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class RegisterDtoValidation {
  @IsNotEmpty()
  tenant: {
    @IsNotEmpty()
    nome: string;
    @IsOptional()
    dominio?: string;
    @IsNotEmpty()
    plano: string;
  };

  @IsNotEmpty()
  empresa: {
    @IsNotEmpty()
    nome: string;
    @IsOptional()
    cnpj?: string;
  };

  @IsNotEmpty()
  administrador: {
    @IsNotEmpty()
    nome: string;
    @IsEmail()
    email: string;
    @IsNotEmpty()
    senha: string;
  };
}
