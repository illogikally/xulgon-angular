import {PhotoViewResponse} from "../common/photo/photo-view-response";

export interface UserProfile {
  id: number;
  userId: number;
  avatar: PhotoViewResponse;
  coverPhotoUrl: string;
  workplace: string;
  fullName: string;
  school: string;
  hometown: string;
  friendshipStatus: string;
  isBlocked: boolean;
  blocked: boolean;
  friends: any[];
  photos: PhotoViewResponse[];
}
