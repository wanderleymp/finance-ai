-- CreateTable
CREATE TABLE "tenants" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "dominio" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "data_criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_atualizacao" TIMESTAMP(3),

    CONSTRAINT "tenants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "empresas" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "cnpj" TEXT,
    "ativa" BOOLEAN NOT NULL DEFAULT true,
    "data_criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_atualizacao" TIMESTAMP(3),
    "tenant_id" TEXT NOT NULL,

    CONSTRAINT "empresas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuarios" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "data_criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_atualizacao" TIMESTAMP(3),
    "ultimo_login" TIMESTAMP(3),
    "tenant_id" TEXT NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuarios_empresas" (
    "id" TEXT NOT NULL,
    "data_criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usuario_id" TEXT NOT NULL,
    "empresa_id" TEXT NOT NULL,

    CONSTRAINT "usuarios_empresas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "modulos" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "descricao" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "modulos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "submodulos" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "descricao" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "modulo_id" TEXT NOT NULL,

    CONSTRAINT "submodulos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recursos" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "descricao" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "submodulo_id" TEXT NOT NULL,

    CONSTRAINT "recursos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "acoes" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "descricao" TEXT,

    CONSTRAINT "acoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permissoes" (
    "id" TEXT NOT NULL,
    "permitido" BOOLEAN NOT NULL DEFAULT true,
    "data_criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usuario_id" TEXT,
    "empresa_id" TEXT NOT NULL,
    "modulo_id" TEXT NOT NULL,
    "submodulo_id" TEXT,
    "recurso_id" TEXT,
    "acao_id" TEXT NOT NULL,

    CONSTRAINT "permissoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "refresh_tokens" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "revogado" BOOLEAN NOT NULL DEFAULT false,
    "data_criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_atualizacao" TIMESTAMP(3),
    "usuario_id" TEXT NOT NULL,

    CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "perfis" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "data_criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_atualizacao" TIMESTAMP(3),
    "tenant_id" TEXT NOT NULL,
    "empresa_id" TEXT,

    CONSTRAINT "perfis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "perfis_usuarios" (
    "id" TEXT NOT NULL,
    "data_criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "perfil_id" TEXT NOT NULL,
    "usuario_id" TEXT NOT NULL,

    CONSTRAINT "perfis_usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "perfis_permissoes" (
    "id" TEXT NOT NULL,
    "data_criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "perfil_id" TEXT NOT NULL,
    "permissao_id" TEXT NOT NULL,

    CONSTRAINT "perfis_permissoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "grupos_permissoes" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "empresa_id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "data_criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_atualizacao" TIMESTAMP(3),

    CONSTRAINT "grupos_permissoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permissoes_grupos" (
    "id" TEXT NOT NULL,
    "grupo_permissao_id" TEXT NOT NULL,
    "permissao_id" TEXT NOT NULL,

    CONSTRAINT "permissoes_grupos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuarios_grupos_permissoes" (
    "id" TEXT NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "grupo_permissao_id" TEXT NOT NULL,

    CONSTRAINT "usuarios_grupos_permissoes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tenants_dominio_key" ON "tenants"("dominio");

-- CreateIndex
CREATE UNIQUE INDEX "empresas_cnpj_key" ON "empresas"("cnpj");

-- CreateIndex
CREATE INDEX "empresas_tenant_id_idx" ON "empresas"("tenant_id");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE INDEX "usuarios_tenant_id_idx" ON "usuarios"("tenant_id");

-- CreateIndex
CREATE INDEX "usuarios_empresas_usuario_id_idx" ON "usuarios_empresas"("usuario_id");

-- CreateIndex
CREATE INDEX "usuarios_empresas_empresa_id_idx" ON "usuarios_empresas"("empresa_id");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_empresas_usuario_id_empresa_id_key" ON "usuarios_empresas"("usuario_id", "empresa_id");

-- CreateIndex
CREATE UNIQUE INDEX "modulos_codigo_key" ON "modulos"("codigo");

-- CreateIndex
CREATE INDEX "submodulos_modulo_id_idx" ON "submodulos"("modulo_id");

-- CreateIndex
CREATE UNIQUE INDEX "submodulos_modulo_id_codigo_key" ON "submodulos"("modulo_id", "codigo");

-- CreateIndex
CREATE INDEX "recursos_submodulo_id_idx" ON "recursos"("submodulo_id");

-- CreateIndex
CREATE UNIQUE INDEX "recursos_submodulo_id_codigo_key" ON "recursos"("submodulo_id", "codigo");

-- CreateIndex
CREATE UNIQUE INDEX "acoes_codigo_key" ON "acoes"("codigo");

-- CreateIndex
CREATE INDEX "permissoes_usuario_id_idx" ON "permissoes"("usuario_id");

-- CreateIndex
CREATE INDEX "permissoes_empresa_id_idx" ON "permissoes"("empresa_id");

-- CreateIndex
CREATE INDEX "permissoes_modulo_id_idx" ON "permissoes"("modulo_id");

-- CreateIndex
CREATE INDEX "permissoes_submodulo_id_idx" ON "permissoes"("submodulo_id");

-- CreateIndex
CREATE INDEX "permissoes_recurso_id_idx" ON "permissoes"("recurso_id");

-- CreateIndex
CREATE INDEX "permissoes_acao_id_idx" ON "permissoes"("acao_id");

-- CreateIndex
CREATE UNIQUE INDEX "permissoes_usuario_id_empresa_id_modulo_id_submodulo_id_rec_key" ON "permissoes"("usuario_id", "empresa_id", "modulo_id", "submodulo_id", "recurso_id", "acao_id");

-- CreateIndex
CREATE UNIQUE INDEX "refresh_tokens_token_key" ON "refresh_tokens"("token");

-- CreateIndex
CREATE INDEX "refresh_tokens_usuario_id_idx" ON "refresh_tokens"("usuario_id");

-- CreateIndex
CREATE INDEX "refresh_tokens_token_idx" ON "refresh_tokens"("token");

-- CreateIndex
CREATE INDEX "perfis_tenant_id_idx" ON "perfis"("tenant_id");

-- CreateIndex
CREATE INDEX "perfis_empresa_id_idx" ON "perfis"("empresa_id");

-- CreateIndex
CREATE UNIQUE INDEX "perfis_tenant_id_nome_empresa_id_key" ON "perfis"("tenant_id", "nome", "empresa_id");

-- CreateIndex
CREATE INDEX "perfis_usuarios_perfil_id_idx" ON "perfis_usuarios"("perfil_id");

-- CreateIndex
CREATE INDEX "perfis_usuarios_usuario_id_idx" ON "perfis_usuarios"("usuario_id");

-- CreateIndex
CREATE UNIQUE INDEX "perfis_usuarios_perfil_id_usuario_id_key" ON "perfis_usuarios"("perfil_id", "usuario_id");

-- CreateIndex
CREATE INDEX "perfis_permissoes_perfil_id_idx" ON "perfis_permissoes"("perfil_id");

-- CreateIndex
CREATE INDEX "perfis_permissoes_permissao_id_idx" ON "perfis_permissoes"("permissao_id");

-- CreateIndex
CREATE UNIQUE INDEX "perfis_permissoes_perfil_id_permissao_id_key" ON "perfis_permissoes"("perfil_id", "permissao_id");

-- CreateIndex
CREATE INDEX "grupos_permissoes_empresa_id_idx" ON "grupos_permissoes"("empresa_id");

-- CreateIndex
CREATE INDEX "grupos_permissoes_tenant_id_idx" ON "grupos_permissoes"("tenant_id");

-- CreateIndex
CREATE INDEX "permissoes_grupos_grupo_permissao_id_idx" ON "permissoes_grupos"("grupo_permissao_id");

-- CreateIndex
CREATE INDEX "permissoes_grupos_permissao_id_idx" ON "permissoes_grupos"("permissao_id");

-- CreateIndex
CREATE UNIQUE INDEX "permissoes_grupos_grupo_permissao_id_permissao_id_key" ON "permissoes_grupos"("grupo_permissao_id", "permissao_id");

-- CreateIndex
CREATE INDEX "usuarios_grupos_permissoes_usuario_id_idx" ON "usuarios_grupos_permissoes"("usuario_id");

-- CreateIndex
CREATE INDEX "usuarios_grupos_permissoes_grupo_permissao_id_idx" ON "usuarios_grupos_permissoes"("grupo_permissao_id");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_grupos_permissoes_usuario_id_grupo_permissao_id_key" ON "usuarios_grupos_permissoes"("usuario_id", "grupo_permissao_id");

-- AddForeignKey
ALTER TABLE "empresas" ADD CONSTRAINT "empresas_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuarios_empresas" ADD CONSTRAINT "usuarios_empresas_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuarios_empresas" ADD CONSTRAINT "usuarios_empresas_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submodulos" ADD CONSTRAINT "submodulos_modulo_id_fkey" FOREIGN KEY ("modulo_id") REFERENCES "modulos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recursos" ADD CONSTRAINT "recursos_submodulo_id_fkey" FOREIGN KEY ("submodulo_id") REFERENCES "submodulos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permissoes" ADD CONSTRAINT "permissoes_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permissoes" ADD CONSTRAINT "permissoes_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permissoes" ADD CONSTRAINT "permissoes_modulo_id_fkey" FOREIGN KEY ("modulo_id") REFERENCES "modulos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permissoes" ADD CONSTRAINT "permissoes_submodulo_id_fkey" FOREIGN KEY ("submodulo_id") REFERENCES "submodulos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permissoes" ADD CONSTRAINT "permissoes_recurso_id_fkey" FOREIGN KEY ("recurso_id") REFERENCES "recursos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permissoes" ADD CONSTRAINT "permissoes_acao_id_fkey" FOREIGN KEY ("acao_id") REFERENCES "acoes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "perfis_usuarios" ADD CONSTRAINT "perfis_usuarios_perfil_id_fkey" FOREIGN KEY ("perfil_id") REFERENCES "perfis"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "perfis_usuarios" ADD CONSTRAINT "perfis_usuarios_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "perfis_permissoes" ADD CONSTRAINT "perfis_permissoes_perfil_id_fkey" FOREIGN KEY ("perfil_id") REFERENCES "perfis"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "perfis_permissoes" ADD CONSTRAINT "perfis_permissoes_permissao_id_fkey" FOREIGN KEY ("permissao_id") REFERENCES "permissoes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grupos_permissoes" ADD CONSTRAINT "grupos_permissoes_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grupos_permissoes" ADD CONSTRAINT "grupos_permissoes_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permissoes_grupos" ADD CONSTRAINT "permissoes_grupos_grupo_permissao_id_fkey" FOREIGN KEY ("grupo_permissao_id") REFERENCES "grupos_permissoes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permissoes_grupos" ADD CONSTRAINT "permissoes_grupos_permissao_id_fkey" FOREIGN KEY ("permissao_id") REFERENCES "permissoes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuarios_grupos_permissoes" ADD CONSTRAINT "usuarios_grupos_permissoes_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuarios_grupos_permissoes" ADD CONSTRAINT "usuarios_grupos_permissoes_grupo_permissao_id_fkey" FOREIGN KEY ("grupo_permissao_id") REFERENCES "grupos_permissoes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
