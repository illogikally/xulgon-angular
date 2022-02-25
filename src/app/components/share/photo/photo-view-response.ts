import { UserDto } from "../user-dto";

export interface PhotoViewResponse {
  user: UserDto;
  privacy: string;
  pageName: string;
  pageType: string;
  pageId: number;
  photos: any[];
  photoCount: number;

  id: number;
  createdAt: string;
  body: string;
  url: string;
  isReacted: boolean;
  reactionCount: number;
  commentCount: number;
  photoSetId?: number;
  shareCount: number;

  hasNext?: boolean;
  index?: number;
}