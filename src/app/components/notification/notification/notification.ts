export interface Notification {
	id: number;
	type: string;
	actorAvatar: string;
	createdAgo: string;
	postId: number;
	isRead: boolean;
	contentId: number;
	page: string;
	contentBody: string;
	contentType: string;
	actor: string;
}