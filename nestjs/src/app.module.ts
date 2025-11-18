import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MessageModule } from './modules/module-api/message/message.module';
import { PrismaModule } from './modules/module-system/prisma/prisma.module';
import { AuthenticationModule } from './modules/module-api/authentication/authentication.module';
import { TokenModule } from './modules/module-system/token/token.module';

@Module({
  imports: [MessageModule, PrismaModule, AuthenticationModule, TokenModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
