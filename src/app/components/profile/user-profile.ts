import { PhotoResponse } from "../share/photo/photo-response";
import {PhotoViewResponse} from "../share/photo/photo-view-response";

export interface UserPage {
  id: number;
  userId: number;
  avatar: PhotoResponse;
  coverPhotoUrl: string;
  workplace: string;
  fullName: string;
  school: string;
  hometown: string;
  friendshipStatus: string;
  isBlocked: boolean;
  blocked: boolean;
  friends: any[];
  photos: PhotoResponse[];
}
