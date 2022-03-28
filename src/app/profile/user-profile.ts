import {PhotoResponse} from "../shared/components/photo/photo-response";

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
