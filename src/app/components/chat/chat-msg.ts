export interface ChatMessage {
	id: number;
	createdAgo: String;
	message: string;
	userId: number;
	isRead: boolean;
	username: string;
	userAvatarUrl: string;
	conversationId: number;
}