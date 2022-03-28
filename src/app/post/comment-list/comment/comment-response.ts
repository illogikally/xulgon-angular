import {UserDto} from "../../../shared/models/user-dto";

export interface CommentResponse {
  id: number;

  rootContentId: number;
  rootContentType: string;

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
