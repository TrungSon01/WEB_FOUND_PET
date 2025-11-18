import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { app_constant } from './common/constant/app.constant';
import { Logger } from '@nestjs/common';
async function bootstrap() {
  const logger = new Logger();

  const PORT = app_constant.PORT;
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, 
  });
  await app.listen(PORT ?? 3000, () => {
    logger.verbose(`Server is running in http://localhost:${PORT}/api`);
  });
}
bootstrap();
