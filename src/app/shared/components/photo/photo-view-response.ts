import {SharedContent} from "../../../post/shared-content";
import {UserDto} from "../../models/user-dto";
import {PhotoResponse} from "./photo-response";

export interface PhotoViewResponse {
  pageName: string;
  pageType: string;
  pageId: number;
  photoCount: number;
  sharedContent: SharedContent;
  isFollowPage: boolean;
  hasShare: boolean;

  id: number;
  type: string;
  photos: PhotoResponse[];
  user: UserDto;
  privacy: string;
  createdAt: string;
  text: string;
  isReacted: boolean;
  isFollow: boolean;
  reactionCount: number;
  commentCount: number;
  photoSetId: number;
  shareCount: number;

  hasNext?: boolean;
  hasPrevious?: boolean;
}
