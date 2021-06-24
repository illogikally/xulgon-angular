export interface PhotoViewResponse {
  id: number;
  userId: number;
  username: string;
  sizeRatio: number;
  createdAt: string;
  body: string;
  url: string;
  isReacted: boolean;
  reactionCount: number;
  commentCount: number;
  shareCount: number;
}