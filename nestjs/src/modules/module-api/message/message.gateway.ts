import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessageService } from './message.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class MessageGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  // Lưu mapping userId -> socketId để biết ai đang online
  private userSockets = new Map<number, string>();

  constructor(private readonly messageService: MessageService) {}

  // Khi user connect
  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;
    if (userId) {
      this.userSockets.set(+userId, client.id);
      console.log(`User ${userId} connected với socket ${client.id}`);
    }
  }

  // Khi user disconnect
  handleDisconnect(client: Socket) {
    const userId = Array.from(this.userSockets.entries()).find(
      ([_, socketId]) => socketId === client.id,
    )?.[0];

    if (userId) {
      this.userSockets.delete(userId);
      console.log(`User ${userId} disconnected`);
    }
  }

  // Xử lý khi user gửi tin nhắn
  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @MessageBody()
    data: { senderId: number; receiverId: number; content: string },
    @ConnectedSocket() client: Socket,
  ) {
    console.log('📩 Nhận tin nhắn:', data);

    try {
      const message = await this.messageService.create({
        senderId: data.senderId,
        receiverId: data.receiverId,
        content: data.content,
      });

      console.log('💾 Đã lưu tin nhắn:', message);

      client.emit('newMessage', message);

      const receiverSocketId = this.userSockets.get(data.receiverId);
      if (receiverSocketId) {
        this.server.to(receiverSocketId).emit('newMessage', message);
        console.log(` Đã gửi tin nhắn cho user ${data.receiverId}`);
      } else {
        console.log(`User ${data.receiverId} đang offline`);
      }

      return { success: true, message };
    } catch (error) {
      console.error('Lỗi khi gửi tin nhắn:', error);
      return { success: false, error: error.message };
    }
  }

  // Lấy lịch sử tin nhắn giữa 2 users
  @SubscribeMessage('getConversation')
  async handleGetConversation(
    @MessageBody() data: { userId1: number; userId2: number },
    @ConnectedSocket() client: Socket,
  ) {
    console.log('Lấy lịch sử chat:', data);

    try {
      const messages = await this.messageService.findConversation(
        data.userId1,
        data.userId2,
      );

      console.log(`Tìm thấy ${messages.length} tin nhắn`);

      client.emit('conversationMessages', messages);
      return messages;
    } catch (error) {
      console.error('Lỗi khi lấy lịch sử:', error);
      return [];
    }
  }
}
