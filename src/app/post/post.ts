import {UserDto} from "../shared/models/user-dto";
import {SharedContent} from "./shared-content";

export interface Post {
  id: number;
  type: string;
  pageName: string;
  user: UserDto;
  pageId: number;
  pageType: string;
  privacy: string;
  createdAt: string;
  isReacted: boolean;
  hasShare: boolean;
  isFollowPage: boolean;
  photos: any[];
  photoCount: number;
  text: string;
  isFollow: boolean;
  reactionCount: number;
  sharedContent: SharedContent;
  commentCount: number;
  shareCount: number
  photoSetId: number;
}
