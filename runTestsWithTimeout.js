const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Tempo limite em milissegundos (2 minutos)
const TIMEOUT = 120000;

// Verificar se o arquivo .env.test existe
function verificarArquivoEnvTest() {
  const envTestPath = path.join(__dirname, '.env.test');
  if (!fs.existsSync(envTestPath)) {
    console.error('Arquivo .env.test não encontrado. Por favor, crie o arquivo com as configurações de teste.');
    process.exit(1);
  }
  
  // Ler o arquivo .env.test para obter a URL do banco de dados
  const envContent = fs.readFileSync(envTestPath, 'utf8');
  const databaseUrlMatch = envContent.match(/DATABASE_URL=(.+)/);
  
  if (!databaseUrlMatch) {
    console.error('DATABASE_URL não encontrada no arquivo .env.test.');
    process.exit(1);
  }
  
  return databaseUrlMatch[1];
}

// Verificar conexão com o banco de dados usando pg_isready
function verificarConexaoBancoDados(databaseUrl) {
  try {
    // Extrair host, porta e nome do banco de dados da URL
    const urlRegex = /postgresql:\/\/[^:]+:[^@]+@([^:]+):(\d+)\/([^?]+)/;
    const match = databaseUrl.match(urlRegex);
    
    if (!match) {
      console.error('Formato da DATABASE_URL inválido.');
      process.exit(1);
    }
    
    const [, host, port, dbname] = match;
    
    // Executar pg_isready para verificar a conexão
    execSync(`pg_isready -h ${host} -p ${port} -d ${dbname}`);
    console.log(`Conexão com o banco de dados '${dbname}' estabelecida com sucesso!`);
  } catch (error) {
    console.error(`Erro ao conectar ao banco de dados: ${error.message}`);
    process.exit(1);
  }
}

// Verificar erros de TypeScript
function verificarErrosTypeScript() {
  try {
    console.log('Verificando erros de TypeScript...');
    execSync('npx tsc --noEmit', { stdio: 'pipe' });
    console.log('Nenhum erro de TypeScript encontrado!');
  } catch (error) {
    console.warn('Erros de TypeScript encontrados, mas continuando com os testes:');
    console.warn(error.stdout.toString());
    // Não encerramos o processo para permitir que os testes sejam executados
    // mesmo com erros de TypeScript
  }
}

// Função principal
function main() {
  console.log('Verificando conexão com o banco de dados...');
  console.log('Arquivo .env.test encontrado, verificando configurações...');
  
  const databaseUrl = verificarArquivoEnvTest();
  console.log(`URL do banco de dados: ${databaseUrl}`);
  
  verificarConexaoBancoDados(databaseUrl);
  verificarErrosTypeScript();
  
  console.log('Executando testes...');
  
  // Executar os testes na pasta da API para usar a configuração correta
  const testProcess = spawn('cd', ['api', '&&', 'npm', 'test'], {
    stdio: 'inherit',
    shell: true,
    cwd: __dirname
  });
  
  // Configurar o tempo limite
  const timeoutId = setTimeout(() => {
    console.log('O teste excedeu o tempo limite e será finalizado.');
    testProcess.kill();
    process.exit(1);
  }, TIMEOUT);
  
  // Lidar com o término do processo de teste
  testProcess.on('close', (code) => {
    clearTimeout(timeoutId);
    process.exit(code);
  });
}

// Executar a função principal
main();
