#!/bin/bash

# Script para configurar o banco de dados de teste
# Este script cria o banco de dados de teste e executa as migrações do Prisma

# Carrega as variáveis de ambiente do arquivo .env.test
set -a
source .env.test
set +a

echo "Configurando banco de dados de teste..."

# Nome do banco de dados de teste
DB_NAME="finance_ai_test"

echo "Verificando se o banco de dados $DB_NAME existe..."

# Verifica se o banco de dados já existe
DB_EXISTS=$(psql -l | grep $DB_NAME)

# Se o banco de dados não existir, cria-o
if [ -z "$DB_EXISTS" ]; then
  echo "Criando banco de dados $DB_NAME..."
  createdb $DB_NAME
else
  echo "Banco de dados $DB_NAME já existe."
fi

# Executa as migrações do Prisma
echo "Executando migrações do Prisma..."
npx prisma migrate deploy

echo "Banco de dados de teste configurado com sucesso!"
