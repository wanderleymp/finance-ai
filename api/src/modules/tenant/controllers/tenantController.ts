import { Controller, Get, Post, Put, Delete, Body, Param, HttpException, HttpStatus } from '@nestjs/common';
import { TenantService } from '../services/tenantService';
import { Tenant } from '../services/tenantService';

/**
 * Interface para criação de tenant
 */
interface ICriarTenantDTO {
  nome: string;
  dominio?: string;
  usuarioAdminId?: string;
  empresaId?: string;
}

/**
 * Interface para atualização de tenant
 */
interface IAtualizarTenantDTO {
  nome?: string;
  dominio?: string;
  ativo?: boolean;
}

/**
 * Controlador para operações de tenant
 * 
 * Este controlador expõe endpoints REST para gerenciamento
 * de tenants no sistema SaaS.
 */
@Controller('tenants')
export class TenantController {
  /**
   * Construtor do controlador de tenant
   * @param tenantService Serviço de tenant injetado
   */
  constructor(private readonly tenantService: TenantService) {}

  /**
   * Busca todos os tenants
   * @returns Lista de tenants
   */
  @Get()
  async buscarTodos(): Promise<Tenant[]> {
    try {
      return await this.tenantService.buscarTodos();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Busca um tenant pelo ID
   * @param id Identificador do tenant
   * @returns Tenant encontrado
   */
  @Get(':id')
  async buscarPorId(@Param('id') id: string): Promise<Tenant> {
    try {
      const tenant = await this.tenantService.buscarPorId(id);
      if (!tenant) {
        throw new HttpException('Tenant não encontrado', HttpStatus.NOT_FOUND);
      }
      return tenant;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Busca um tenant pelo domínio
   * @param dominio Domínio do tenant
   * @returns Tenant encontrado
   */
  @Get('dominio/:dominio')
  async buscarPorDominio(@Param('dominio') dominio: string): Promise<Tenant> {
    try {
      const tenant = await this.tenantService.buscarPorDominio(dominio);
      if (!tenant) {
        throw new HttpException('Tenant não encontrado', HttpStatus.NOT_FOUND);
      }
      return tenant;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Cria um novo tenant
   * @param dados Dados para criação do tenant
   * @returns Tenant criado
   */
  @Post()
  async criar(@Body() dados: ICriarTenantDTO): Promise<Tenant> {
    try {
      return await this.tenantService.criar(dados);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Atualiza um tenant existente
   * @param id Identificador do tenant
   * @param dados Dados para atualização do tenant
   * @returns Tenant atualizado
   */
  @Put(':id')
  async atualizar(
    @Param('id') id: string,
    @Body() dados: IAtualizarTenantDTO,
  ): Promise<Tenant> {
    try {
      return await this.tenantService.atualizar(id, dados);
    } catch (error) {
      if (error.message.includes('não encontrado')) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Altera o status de um tenant (ativo/inativo)
   * @param id Identificador do tenant
   * @param ativo Status de ativação
   * @returns Tenant atualizado
   */
  @Put(':id/status')
  async alterarStatus(
    @Param('id') id: string,
    @Body('ativo') ativo: boolean,
  ): Promise<Tenant> {
    try {
      return await this.tenantService.alterarStatus(id, ativo);
    } catch (error) {
      if (error.message.includes('não encontrado')) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Exclui um tenant
   * @param id Identificador do tenant
   */
  @Delete(':id')
  async excluir(@Param('id') id: string): Promise<void> {
    try {
      await this.tenantService.excluir(id);
    } catch (error) {
      if (error.message.includes('não encontrado')) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
