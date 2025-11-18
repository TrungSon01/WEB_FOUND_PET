import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageGateway } from './message.gateway';
import { PrismaModule } from 'src/modules/module-system/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [MessageGateway, MessageService],
  exports: [MessageService],
})
export class MessageModule {}
