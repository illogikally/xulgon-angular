export interface PhotoResponse {
  id: number;
  userId: number;
  username: string;
  createdAt: string;
  body: string;
  url: string;
  isReacted: boolean;
  reactionCount: number;
  commentCount: number;
  shareCount: number;
}