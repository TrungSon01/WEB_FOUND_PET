import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { GetConversationDto } from './dto/create-message.dto';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
})
export class MessageGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  // Map để track users online: userId -> socketId
  private onlineUsers = new Map<number, string>();

  constructor(private readonly messageService: MessageService) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    // Xóa user khỏi danh sách online
    for (const [userId, socketId] of this.onlineUsers.entries()) {
      if (socketId === client.id) {
        this.onlineUsers.delete(userId);
        this.server.emit('userOffline', { userId });
        console.log(`User ${userId} disconnected`);
        break;
      }
    }
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('userOnline')
  handleUserOnline(
    @MessageBody() data: { userId: number },
    @ConnectedSocket() client: Socket,
  ) {
    this.onlineUsers.set(data.userId, client.id);
    this.server.emit('userOnline', { userId: data.userId });
    console.log(`User ${data.userId} is online`);
    return { success: true, userId: data.userId };
  }

  @SubscribeMessage('createMessage')
  async handleCreateMessage(@MessageBody() createMessageDto: CreateMessageDto) {
    try {
      const message = await this.messageService.create(createMessageDto);

      // Gửi tin nhắn đến receiver nếu họ online
      const receiverSocketId = this.onlineUsers.get(
        createMessageDto.receiverId,
      );
      if (receiverSocketId) {
        this.server.to(receiverSocketId).emit('newMessage', message);
      }

      // Gửi lại cho sender để confirm
      const senderSocketId = this.onlineUsers.get(createMessageDto.senderId);
      if (senderSocketId) {
        this.server.to(senderSocketId).emit('messageSent', message);
      }

      return message;
    } catch (error) {
      console.error('Error creating message:', error);
      return { error: 'Failed to create message' };
    }
  }

  @SubscribeMessage('findAllMessage')
  async handleFindAll() {
    try {
      return await this.messageService.findAll();
    } catch (error) {
      console.error('Error finding all messages:', error);
      return { error: 'Failed to find messages' };
    }
  }

  @SubscribeMessage('findOneMessage')
  async handleFindOne(@MessageBody() id: number) {
    try {
      return await this.messageService.findOne(id);
    } catch (error) {
      console.error('Error finding message:', error);
      return { error: 'Failed to find message' };
    }
  }

  @SubscribeMessage('getConversation')
  async handleGetConversation(@MessageBody() data: GetConversationDto) {
    try {
      const messages = await this.messageService.findConversation(
        data.userId1,
        data.userId2,
      );
      return messages;
    } catch (error) {
      console.error('Error getting conversation:', error);
      return { error: 'Failed to get conversation' };
    }
  }

  @SubscribeMessage('getUserConversations')
  async handleGetUserConversations(@MessageBody() data: { userId: number }) {
    try {
      return await this.messageService.getUserConversations(data.userId);
    } catch (error) {
      console.error('Error getting user conversations:', error);
      return { error: 'Failed to get conversations' };
    }
  }

  @SubscribeMessage('updateMessage')
  async handleUpdateMessage(@MessageBody() updateMessageDto: UpdateMessageDto) {
    try {
      const updatedMessage = await this.messageService.update(
        updateMessageDto.id,
        updateMessageDto,
      );

      if (updatedMessage) {
        // Kiểm tra userIdSender không null
        if (updatedMessage.userIdSender) {
          // Lấy thông tin chat group từ message
          const chatGroupId = updatedMessage.chatGroupId;

          // Lấy tất cả members trong chat group
          const chatGroup = await this.messageService[
            'prisma'
          ].chatGroups.findUnique({
            where: { id: chatGroupId },
            include: {
              ChatGroupMembers: {
                where: { isDeleted: false },
              },
            },
          });

          if (chatGroup) {
            // Broadcast update đến tất cả members trong chat group
            chatGroup.ChatGroupMembers.forEach((member) => {
              if (member.user_id) {
                const socketId = this.onlineUsers.get(member.user_id);
                if (socketId) {
                  this.server
                    .to(socketId)
                    .emit('messageUpdated', updatedMessage);
                }
              }
            });
          }
        }
      }

      return updatedMessage;
    } catch (error) {
      console.error('Error updating message:', error);
      return { error: 'Failed to update message' };
    }
  }

  @SubscribeMessage('typing')
  handleTyping(@MessageBody() data: { senderId: number; receiverId: number }) {
    const receiverSocketId = this.onlineUsers.get(data.receiverId);
    if (receiverSocketId) {
      this.server.to(receiverSocketId).emit('userTyping', {
        userId: data.senderId,
      });
    }
  }

  @SubscribeMessage('stopTyping')
  handleStopTyping(
    @MessageBody() data: { senderId: number; receiverId: number },
  ) {
    const receiverSocketId = this.onlineUsers.get(data.receiverId);
    if (receiverSocketId) {
      this.server.to(receiverSocketId).emit('userStopTyping', {
        userId: data.senderId,
      });
    }
  }

  @SubscribeMessage('removeMessage')
  async handleRemove(@MessageBody() data: { id: number; userId: number }) {
    try {
      const removed = await this.messageService.remove(data.id, data.userId);
      if (removed) {
        this.server.emit('messageRemoved', { id: data.id });
      }
      return { success: true, data: removed };
    } catch (error) {
      console.error('Error removing message:', error);
      return { error: 'Failed to remove message' };
    }
  }

  @SubscribeMessage('getOnlineUsers')
  handleGetOnlineUsers() {
    return Array.from(this.onlineUsers.keys());
  }

  @SubscribeMessage('getChatGroup')
  async handleGetChatGroup(
    @MessageBody() data: { userId1: number; userId2: number },
  ) {
    try {
      const chatGroup = await this.messageService.findChatGroupBetweenUsers(
        data.userId1,
        data.userId2,
      );
      return chatGroup;
    } catch (error) {
      console.error('Error getting chat group:', error);
      return { error: 'Failed to get chat group' };
    }
  }

  @SubscribeMessage('getUnreadCount')
  async handleGetUnreadCount(
    @MessageBody() data: { userId: number; chatGroupId: number },
  ) {
    try {
      const count = await this.messageService.countUnreadMessages(
        data.userId,
        data.chatGroupId,
      );
      return { count };
    } catch (error) {
      console.error('Error getting unread count:', error);
      return { error: 'Failed to get unread count' };
    }
  }
}
