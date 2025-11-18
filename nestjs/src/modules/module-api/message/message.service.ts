import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { PrismaService } from 'src/modules/module-system/prisma/prisma.service';

@Injectable()
export class MessageService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Tạo hoặc lấy chat group cho 2 users (chat 1-1)
   */
  private async getOrCreateChatGroup(userId1: number, userId2: number) {
    // Tạo key duy nhất cho chat 1-1 (sắp xếp userId để đảm bảo key luôn giống nhau)
    const sortedIds = [userId1, userId2].sort((a, b) => a - b);
    const keyForChatOne = `chat_${sortedIds[0]}_${sortedIds[1]}`;

    // Kiểm tra xem chat group đã tồn tại chưa
    let chatGroup = await this.prisma.chatGroups.findUnique({
      where: { keyForChatOne },
    });

    // Nếu chưa tồn tại, tạo mới
    if (!chatGroup) {
      chatGroup = await this.prisma.chatGroups.create({
        data: {
          keyForChatOne,
          type: 'private',
          ownerId: userId1,
        },
      });

      // Thêm 2 members vào group
      await this.prisma.chatGroupMembers.createMany({
        data: [
          { chatGroupId: chatGroup.id, user_id: userId1 },
          { chatGroupId: chatGroup.id, user_id: userId2 },
        ],
      });
    }

    return chatGroup;
  }

  /**
   * Tạo tin nhắn mới
   */
  async create(createMessageDto: CreateMessageDto) {
    const { senderId, receiverId, content } = createMessageDto;

    // Lấy hoặc tạo chat group
    const chatGroup = await this.getOrCreateChatGroup(senderId, receiverId);

    // Tạo tin nhắn
    const message = await this.prisma.chatMessages.create({
      data: {
        chatGroupId: chatGroup.id,
        userIdSender: senderId,
        messageText: content,
      },
      include: {
        Users: {
          select: {
            user_id: true,
            username: true,
            avatar: true,
          },
        },
        ChatGroups: {
          select: {
            id: true,
            keyForChatOne: true,
            type: true,
          },
        },
      },
    });

    return message;
  }

  /**
   * Lấy tất cả tin nhắn
   */
  async findAll() {
    return await this.prisma.chatMessages.findMany({
      where: { isDeleted: false },
      include: {
        Users: {
          select: {
            user_id: true,
            username: true,
            avatar: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Lấy 1 tin nhắn theo ID
   */
  async findOne(id: number) {
    return await this.prisma.chatMessages.findUnique({
      where: { id, isDeleted: false },
      include: {
        Users: {
          select: {
            user_id: true,
            username: true,
            avatar: true,
          },
        },
        ChatGroups: true,
      },
    });
  }

  /**
   * Lấy tất cả tin nhắn giữa 2 users
   */
  async findConversation(userId1: number, userId2: number) {
    const sortedIds = [userId1, userId2].sort((a, b) => a - b);
    const keyForChatOne = `chat_${sortedIds[0]}_${sortedIds[1]}`;

    // Tìm chat group
    const chatGroup = await this.prisma.chatGroups.findUnique({
      where: { keyForChatOne },
    });

    if (!chatGroup) {
      return [];
    }

    // Lấy tất cả tin nhắn trong group
    const messages = await this.prisma.chatMessages.findMany({
      where: {
        chatGroupId: chatGroup.id,
        isDeleted: false,
      },
      include: {
        Users: {
          select: {
            user_id: true,
            username: true,
            avatar: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    return messages;
  }

  /**
   * Lấy danh sách conversations của user
   */
  async getUserConversations(userId: number) {
    // Lấy tất cả chat groups mà user tham gia
    const chatGroupMembers = await this.prisma.chatGroupMembers.findMany({
      where: {
        user_id: userId,
        isDeleted: false,
      },
      include: {
        ChatGroups: {
          include: {
            ChatGroupMembers: {
              where: { isDeleted: false },
              include: {
                Users: {
                  select: {
                    user_id: true,
                    username: true,
                    avatar: true,
                  },
                },
              },
            },
            ChatMessages: {
              where: { isDeleted: false },
              orderBy: { createdAt: 'desc' },
              take: 1,
              include: {
                Users: {
                  select: {
                    user_id: true,
                    username: true,
                    avatar: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    // Format kết quả
    const conversations = await Promise.all(
      chatGroupMembers
        .filter((member) => member.ChatGroups !== null) // Lọc bỏ các chatGroup null
        .map(async (member) => {
          const chatGroup = member.ChatGroups!; // Sử dụng ! vì đã filter null ở trên
          const lastMessage = chatGroup.ChatMessages[0];

          // Lấy thông tin user khác (trong chat 1-1)
          const otherUser = chatGroup.ChatGroupMembers.find(
            (m) => m.user_id !== userId,
          )?.Users;

          // Đếm tin nhắn chưa đọc (tin nhắn từ người khác gửi đến)
          const unreadCount = await this.prisma.chatMessages.count({
            where: {
              chatGroupId: chatGroup.id,
              userIdSender: { not: userId },
              isDeleted: false,
              createdAt: {
                gte: member.createdAt, // Chỉ đếm tin nhắn sau khi user join
              },
            },
          });

          return {
            chatGroupId: chatGroup.id,
            type: chatGroup.type,
            otherUser: otherUser || null,
            lastMessage: lastMessage || null,
            unreadCount,
            updatedAt: lastMessage?.createdAt || chatGroup.updatedAt,
          };
        }),
    );

    // Sắp xếp theo tin nhắn mới nhất
    return conversations.sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );
  }
  async update(id: number, updateMessageDto: UpdateMessageDto) {
    const { content } = updateMessageDto;

    return await this.prisma.chatMessages.update({
      where: { id },
      data: {
        messageText: content,
        updatedAt: new Date(),
      },
      include: {
        Users: {
          select: {
            user_id: true,
            username: true,
            avatar: true,
          },
        },
      },
    });
  }

  /**
   * Xóa tin nhắn (soft delete)
   */
  async remove(id: number, userId: number) {
    return await this.prisma.chatMessages.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedBy: userId,
        deletedAt: new Date(),
      },
    });
  }

  /**
   * Tìm chat group giữa 2 users
   */
  async findChatGroupBetweenUsers(userId1: number, userId2: number) {
    const sortedIds = [userId1, userId2].sort((a, b) => a - b);
    const keyForChatOne = `chat_${sortedIds[0]}_${sortedIds[1]}`;

    return await this.prisma.chatGroups.findUnique({
      where: { keyForChatOne },
      include: {
        ChatGroupMembers: {
          where: { isDeleted: false },
          include: {
            Users: {
              select: {
                user_id: true,
                username: true,
                avatar: true,
              },
            },
          },
        },
      },
    });
  }

  /**
   * Đếm tin nhắn chưa đọc trong conversation
   */
  async countUnreadMessages(userId: number, chatGroupId: number) {
    // Lấy thời điểm user join group
    const member = await this.prisma.chatGroupMembers.findFirst({
      where: {
        user_id: userId,
        chatGroupId: chatGroupId,
        isDeleted: false,
      },
    });

    if (!member) return 0;

    return await this.prisma.chatMessages.count({
      where: {
        chatGroupId: chatGroupId,
        userIdSender: { not: userId },
        isDeleted: false,
        createdAt: {
          gte: member.createdAt,
        },
      },
    });
  }
}
