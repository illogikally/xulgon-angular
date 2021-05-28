export interface Post {
  id: number;
  pageId: number;
  userId: number;
  username: string;
  createdAt: string;
  posted: string;
  isReacted: boolean;
  body: string;
  reactionCount: number;
  commentCount: number;
  shareCount: number
}