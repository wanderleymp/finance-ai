# Módulo de Registro de Tenants

## Visão Geral

Este módulo implementa a funcionalidade de registro de novos tenants na plataforma SaaS. Ele permite a criação de:

- Um novo tenant (organização)
- Uma empresa associada ao tenant
- Um usuário administrador para gerenciar o tenant

## Estrutura do Módulo

O módulo é composto pelos seguintes arquivos:

- `register.controller.ts` - Controlador que expõe o endpoint de registro
- `register.service.ts` - Serviço que implementa a lógica de negócio para o registro
- `register.module.ts` - Módulo que configura as dependências e exporta os componentes
- `dto/RegisterDtoValidation.ts` - DTO para validação dos dados de entrada
- `interfaces/register-result.interface.ts` - Interface para o resultado do registro

## Como Integrar

Para integrar este módulo na sua aplicação, siga os passos abaixo:

1. Importe o `RegisterModule` no seu módulo principal (`app.module.ts`):

```typescript
import { RegisterModule } from './modules/register/register.module';
import { TenantModule } from './modules/tenant/tenant.module';
import { UsuarioModule } from './modules/usuario/usuario.module';
import { EmpresaRepository } from './modules/empresa/repositories/empresaRepository';

@Module({
  imports: [
    // Outros módulos...
    RegisterModule.forRoot(
      TenantModule,
      UsuarioModule,
      EmpresaRepository
    ),
    // Outros módulos...
  ],
  // Resto do módulo...
})
export class AppModule {}
```

2. Configure o middleware de tenant para excluir o endpoint de registro:

```typescript
configure(consumer: MiddlewareConsumer) {
  consumer
    .apply(TenantMiddleware)
    .exclude({ path: 'api/register', method: RequestMethod.POST })
    .forRoutes({ path: '*', method: RequestMethod.ALL });
}
```

## Endpoint de Registro

- **URL**: `/api/register`
- **Método**: POST
- **Corpo da Requisição**:

```json
{
  "tenant": {
    "nome": "Nome da Organização",
    "dominio": "dominio.finance-ai.com",
    "plano": "basic"
  },
  "empresa": {
    "nome": "Nome da Empresa",
    "cnpj": "00000000000000"
  },
  "administrador": {
    "nome": "Nome do Administrador",
    "email": "admin@dominio.com",
    "senha": "senha_segura"
  }
}
```

- **Resposta de Sucesso**:

```json
{
  "success": true,
  "tenant": {
    "id": 1,
    "nome": "Nome da Organização",
    "dominio": "dominio.finance-ai.com",
    "plano": "basic"
  }
}
```

## Testes

Para executar os testes do módulo, use o comando:

```bash
cd shared
npm test
```

## Considerações de Segurança

- As senhas são armazenadas de forma segura utilizando hash bcrypt
- O endpoint de registro não requer autenticação, mas implementa validações rigorosas
- Todas as entradas são validadas usando pipes de validação do NestJS
