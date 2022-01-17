import {UserDto} from "../../common/user-dto";

export interface CommentResponse {
  id: number;
  postId: number;
  parentId: number;
  parentType: string;
  body: string;
  isReacted: boolean;
  user: UserDto;
  photo: any;
  createdAgo: string;
  replyCount: number;
  reactionCount: number;
}
