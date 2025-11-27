import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { MessageService } from './message.service';

@Controller('messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get('conversations/:userId')
  async getUserConversations(@Param('userId', ParseIntPipe) userId: number) {
    const conversations =
      await this.messageService.getUserConversations(userId);
    return conversations;
  }
}
