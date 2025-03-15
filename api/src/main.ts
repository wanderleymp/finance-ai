import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Configurando CORS para permitir acesso de qualquer origem
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  
  // Configurando o prefixo global da API
  // app.setGlobalPrefix('api'); // Removido para permitir acesso direto às rotas
  
  // Log da porta em que a aplicação está rodando
  const port = process.env.PORT ?? 3000;
  console.log(`Aplicação rodando na porta: ${port}`);
  
  await app.listen(port, '0.0.0.0'); // Escutando em todas as interfaces de rede
}
bootstrap();
