import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function criarTenantEAdmin() {
  console.log('Iniciando criação do tenant license e super admin...');
  
  // Criando o tenant padrão (license)
  const tenantLicense = await prisma.tenant.upsert({
    where: { dominio: 'license.finance-ai.com' },
    update: {},
    create: {
      nome: 'Finance AI License',
      dominio: 'license.finance-ai.com',
      ativo: true
    }
  });
  
  console.log(`Tenant License criado: ${tenantLicense.id}`);
  
  // Criando o usuário super admin
  const senhaCriptografada = await bcrypt.hash('SuperAdmin@2025', 10);
  
  const superAdmin = await prisma.usuario.upsert({
    where: { email: 'admin@finance-ai.com' },
    update: {},
    create: {
      nome: 'Super Administrador',
      email: 'admin@finance-ai.com',
      senha: senhaCriptografada,
      tipo: 'SUPER_ADMIN',
      ativo: true,
      tenantId: tenantLicense.id
    }
  });
  
  console.log(`Super Admin criado: ${superAdmin.id}`);
  
  // Criando uma empresa padrão para o tenant license
  const empresaPadrao = await prisma.empresa.upsert({
    where: { 
      cnpj: '00000000000000' 
    },
    update: {},
    create: {
      nome: 'Finance AI Administração',
      cnpj: '00000000000000',
      ativa: true,
      tenantId: tenantLicense.id
    }
  });
  
  console.log(`Empresa padrão criada: ${empresaPadrao.id}`);
  
  // Vinculando o super admin à empresa padrão
  const usuarioEmpresa = await prisma.usuarioEmpresa.upsert({
    where: {
      usuarioId_empresaId: {
        usuarioId: superAdmin.id,
        empresaId: empresaPadrao.id
      }
    },
    update: {},
    create: {
      usuarioId: superAdmin.id,
      empresaId: empresaPadrao.id,
      principal: true
    }
  });
  
  console.log(`Usuário vinculado à empresa: ${usuarioEmpresa.id}`);
  
  console.log('Criação de tenant e super admin concluída com sucesso!');
}

criarTenantEAdmin()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
