import { PhotoResponse } from "../share/photo/photo-response";
import {PhotoViewResponse} from "../share/photo/photo-view-response";

export interface UserPage {
  id: number;
  userId: number;
  workplace: string;
  fullName: string;
  school: string;
  hometown: string;
  isBlocked: boolean;
  blocked: boolean;
  friends: any[];
  photos: PhotoResponse[];
}
