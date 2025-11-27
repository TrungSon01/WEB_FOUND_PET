import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MessageModule } from './modules/module-api/message/message.module';
import { PrismaModule } from './modules/module-system/prisma/prisma.module';
import { AuthenticationModule } from './modules/module-api/authentication/authentication.module';
import { TokenModule } from './modules/module-system/token/token.module';
import { FunctionSystemModule } from './modules/module-system/function-system/function-system.module';
import { UserModule } from './modules/module-api/user/user.module';

@Module({
  imports: [
    MessageModule,
    PrismaModule,
    AuthenticationModule,
    TokenModule,
    FunctionSystemModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
