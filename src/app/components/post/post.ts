import { CommentResponse } from "../comment-list/comment/comment-response";

export interface Post {
  id: number;
  pageId: number;
  userId: number;
  username: string;
  createdAt: string;
  posted: string;
  isReacted: boolean;
  avatarUrl: string;
  photos: any[];
  body: string;
  reactionCount: number;
  commentCount: number;
  shareCount: number
}