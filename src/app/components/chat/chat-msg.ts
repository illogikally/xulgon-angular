export interface ChatMessage {
  id: number;
  createdAgo: String;
  message: string;
  createdAt: number;
  userId: number;
  isRead: boolean;
  username: string;
  userAvatarUrl: string;
  conversationId: number;
}
