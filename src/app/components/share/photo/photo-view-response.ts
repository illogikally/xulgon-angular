import { UserDto } from "../user-dto";

export interface PhotoViewResponse {
  pageName: string;
  pageType: string;
  pageId: number;
  photos: any[];
  photoCount: number;

  user: UserDto;
  privacy: string;
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
  hasPrevious?: boolean;
}