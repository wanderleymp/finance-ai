import { ConfigModule } from '@nestjs/config';
import * as path from 'path';

/**
 * Configuração do módulo de configuração para ambiente de testes
 * Carrega as variáveis de ambiente do arquivo .env.test
 */
export const TestConfigModule = ConfigModule.forRoot({
  envFilePath: path.resolve(process.cwd(), '.env.test'),
  isGlobal: true,
});
