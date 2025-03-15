#!/bin/bash

# Script para executar os testes do projeto
# Este script configura o ambiente de teste e executa os testes

# Carrega as variáveis de ambiente do arquivo .env.test
set -a
source .env.test
set +a

echo "Configurando ambiente de teste..."

# Verifica se o banco de dados de teste existe
# Se não existir, executa o script de configuração do banco de dados de teste
if [ ! -f .test-db-setup ]; then
  echo "Configurando banco de dados de teste..."
  ./scripts/setup-test-db.sh
  touch .test-db-setup
fi

# Executa os testes
echo "Executando testes..."

# Se foram passados argumentos, executa apenas os testes especificados
if [ $# -gt 0 ]; then
  npx jest $@
else
  # Caso contrário, executa todos os testes
  npx jest
fi

# Verifica o resultado dos testes
if [ $? -eq 0 ]; then
  echo "Testes executados com sucesso!"
else
  echo "Falha na execução dos testes!"
  exit 1
fi
