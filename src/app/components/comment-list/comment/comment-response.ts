export interface CommentResponse {
  id: number;
  userId: number;
  parentId: number;
  parentType: string;
  body: string;
  isReacted: boolean;
  username: string;
  avatarUrl: string;
  createdAgo: string;
  replyCount: number;
  reactionCount: number;
}