import {UserBasic} from "../share/user-basic";

export interface ChatMessage {
  id: number;
  createdAgo: String;
  message: string;
  createdAt: number;
  isRead: boolean;
  user: UserBasic;
  conversationId: number;
}
