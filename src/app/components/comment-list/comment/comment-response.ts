export interface CommentResponse {
  id: number;
  userId: number;
  parentId: number;
  parentType: string;
  body: string;
  username: string;
  avatarUrl: string;
  createdAgo: string;
  replyCount: number;
  reactionCount: number;
}