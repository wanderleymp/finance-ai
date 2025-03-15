import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { TenantService } from '../src/modules/tenant/services/tenantService';
import { UsuarioService } from '../src/modules/usuario/services/usuarioService';
import { JwtService } from '@nestjs/jwt';
import { PerfilService } from '../src/modules/perfil/services/perfilService';

/**
 * Testes de integração (e2e) para o módulo de tenant
 * 
 * Este arquivo contém testes que verificam o fluxo completo de gerenciamento de tenants,
 * incluindo criação, busca, atualização, alteração de status e exclusão.
 */
describe('Tenant (e2e)', () => {
  let app: INestApplication;
  let tenantService: TenantService;
  let usuarioService: UsuarioService;
  let perfilService: PerfilService;
  let jwtService: JwtService;
  
  // Dados de teste
  const timestamp = Date.now();
  
  // Dados para o tenant de teste
  const tenantTeste = {
    nome: `Tenant Teste E2E ${timestamp}`,
    dominio: `tenant-teste-${timestamp}.com`
  };
  
  // Dados para o usuário administrador
  const usuarioAdminTeste = {
    nome: 'Admin Teste E2E',
    email: `admin-e2e-${timestamp}@exemplo.com`,
    senha: 'Senha@123',
  };
  
  // Variáveis para armazenar IDs e tokens
  let tenantId: string;
  let usuarioAdminId: string;
  let accessToken: string;
  
  // Configuração inicial
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    
    // Obter serviços necessários
    tenantService = app.get<TenantService>(TenantService);
    usuarioService = app.get<UsuarioService>(UsuarioService);
    perfilService = app.get<PerfilService>(PerfilService);
    jwtService = app.get<JwtService>(JwtService);
    
    // Criar um usuário administrador para os testes
    try {
      // Criar o usuário sem perfil
      const usuario = await usuarioService.criar({
        ...usuarioAdminTeste
      });
      usuarioAdminId = usuario.id;
      
      // Criar um perfil de admin e atribuir ao usuário
      // Nota: Esta parte depende da implementação real do sistema
      // Pode ser necessário ajustar conforme a implementação específica
      
      // Gerar token de acesso para o usuário admin
      const payload = { 
        sub: usuarioAdminId, 
        email: usuarioAdminTeste.email
      };
      accessToken = jwtService.sign(payload);
    } catch (error) {
      console.error('Erro ao criar usuário admin para testes:', error);
    }
  });

  // Limpeza após todos os testes
  afterAll(async () => {
    // Limpar tenant de teste se foi criado
    if (tenantId) {
      try {
        await tenantService.excluir(tenantId);
      } catch (error) {
        console.error('Erro ao excluir tenant de teste:', error);
      }
    }
    
    // Limpar usuário admin de teste se foi criado
    if (usuarioAdminId) {
      try {
        await usuarioService.excluir(usuarioAdminId);
      } catch (error) {
        console.error('Erro ao excluir usuário admin de teste:', error);
      }
    }
    
    await app.close();
  });

  /**
   * Testes para a criação de tenant
   */
  describe('POST /tenants', () => {
    it('deve criar um novo tenant com sucesso', async () => {
      const response = await request(app.getHttpServer())
        .post('/tenants')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          ...tenantTeste,
          usuarioAdminId: usuarioAdminId
        })
        .expect(201);

      // Verificar a resposta
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('nome', tenantTeste.nome);
      expect(response.body).toHaveProperty('dominio', tenantTeste.dominio);
      expect(response.body).toHaveProperty('ativo', true);
      
      // Armazenar ID para testes subsequentes
      tenantId = response.body.id;
    });

    it('deve retornar erro ao tentar criar um tenant com domínio já existente', async () => {
      await request(app.getHttpServer())
        .post('/tenants')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          nome: `Tenant Duplicado ${timestamp}`,
          dominio: tenantTeste.dominio,
          usuarioAdminId: usuarioAdminId
        })
        .expect(400);
    });
  });

  /**
   * Testes para busca de todos os tenants
   */
  describe('GET /tenants', () => {
    it('deve retornar a lista de tenants', async () => {
      const response = await request(app.getHttpServer())
        .get('/tenants')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      // Verificar a resposta
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      
      // Verificar se o tenant criado está na lista
      const tenantCriado = response.body.find(t => t.id === tenantId);
      expect(tenantCriado).toBeDefined();
      expect(tenantCriado.nome).toBe(tenantTeste.nome);
    });
  });

  /**
   * Testes para busca de tenant por ID
   */
  describe('GET /tenants/:id', () => {
    it('deve retornar um tenant pelo ID', async () => {
      const response = await request(app.getHttpServer())
        .get(`/tenants/${tenantId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      // Verificar a resposta
      expect(response.body).toHaveProperty('id', tenantId);
      expect(response.body).toHaveProperty('nome', tenantTeste.nome);
      expect(response.body).toHaveProperty('dominio', tenantTeste.dominio);
    });

    it('deve retornar erro ao buscar um tenant com ID inexistente', async () => {
      await request(app.getHttpServer())
        .get('/tenants/id-inexistente')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });
  });

  /**
   * Testes para busca de tenant por domínio
   */
  describe('GET /tenants/dominio/:dominio', () => {
    it('deve retornar um tenant pelo domínio', async () => {
      const response = await request(app.getHttpServer())
        .get(`/tenants/dominio/${tenantTeste.dominio}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      // Verificar a resposta
      expect(response.body).toHaveProperty('id', tenantId);
      expect(response.body).toHaveProperty('nome', tenantTeste.nome);
      expect(response.body).toHaveProperty('dominio', tenantTeste.dominio);
    });

    it('deve retornar erro ao buscar um tenant com domínio inexistente', async () => {
      await request(app.getHttpServer())
        .get('/tenants/dominio/dominio-inexistente.com')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });
  });

  /**
   * Testes para atualização de tenant
   */
  describe('PUT /tenants/:id', () => {
    it('deve atualizar um tenant com sucesso', async () => {
      const dadosAtualizacao = {
        nome: `${tenantTeste.nome} Atualizado`
      };

      const response = await request(app.getHttpServer())
        .put(`/tenants/${tenantId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(dadosAtualizacao)
        .expect(200);

      // Verificar a resposta
      expect(response.body).toHaveProperty('id', tenantId);
      expect(response.body).toHaveProperty('nome', dadosAtualizacao.nome);
      expect(response.body).toHaveProperty('dominio', tenantTeste.dominio);
    });

    it('deve retornar erro ao atualizar um tenant com ID inexistente', async () => {
      await request(app.getHttpServer())
        .put('/tenants/id-inexistente')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ nome: 'Tenant Inexistente' })
        .expect(404);
    });
  });

  /**
   * Testes para alteração de status do tenant
   */
  describe('PUT /tenants/:id/status', () => {
    it('deve desativar um tenant com sucesso', async () => {
      const response = await request(app.getHttpServer())
        .put(`/tenants/${tenantId}/status`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ ativo: false })
        .expect(200);

      // Verificar a resposta
      expect(response.body).toHaveProperty('id', tenantId);
      expect(response.body).toHaveProperty('ativo', false);
    });

    it('deve ativar um tenant com sucesso', async () => {
      const response = await request(app.getHttpServer())
        .put(`/tenants/${tenantId}/status`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ ativo: true })
        .expect(200);

      // Verificar a resposta
      expect(response.body).toHaveProperty('id', tenantId);
      expect(response.body).toHaveProperty('ativo', true);
    });

    it('deve retornar erro ao alterar status de um tenant com ID inexistente', async () => {
      await request(app.getHttpServer())
        .put('/tenants/id-inexistente/status')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ ativo: false })
        .expect(404);
    });
  });

  /**
   * Testes para exclusão de tenant
   */
  describe('DELETE /tenants/:id', () => {
    it('deve excluir um tenant com sucesso', async () => {
      await request(app.getHttpServer())
        .delete(`/tenants/${tenantId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      // Verificar se o tenant foi realmente excluído
      await request(app.getHttpServer())
        .get(`/tenants/${tenantId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
      
      // Limpar o ID para evitar tentativa de exclusão no afterAll
      tenantId = null;
    });

    it('deve retornar erro ao excluir um tenant com ID inexistente', async () => {
      await request(app.getHttpServer())
        .delete('/tenants/id-inexistente')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });
  });
});
