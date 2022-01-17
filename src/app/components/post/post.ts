import {UserDto} from "../common/user-dto";

export interface Post {
  id: number;
  pageName: string;
  user: UserDto;
  pageId: number;
  pageType: string;
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
