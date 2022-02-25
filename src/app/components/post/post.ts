import {UserDto} from "../share/user-dto";

export interface Post {
  id: number;
  pageName: string;
  user: UserDto;
  pageId: number;
  pageType: string;
  privacy: string;
  createdAt: string;
  isReacted: boolean;
  photos: any[];
  photoCount: number;
  body: string;
  reactionCount: number;
  commentCount: number;
  shareCount: number
  photoSetId: number;
}
