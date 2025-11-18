export class Message {
  id: number;
  senderId: number;
  receiverId: number;
  content: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}
