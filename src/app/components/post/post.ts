import { CommentResponse } from "../comment-list/comment/comment-response";
import { UserDto } from "../common/user-dto";

export interface Post {
  id: number;
  user: UserDto;
  pageId: number;
  privacy: string;
  createdAt: string;
  posted: string;
  isReacted: boolean;
  photos: any[];
  body: string;
  reactionCount: number;
  commentCount: number;
  shareCount: number
}