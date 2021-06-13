import { PhotoResponse } from "../common/photo/photo-response";

export interface UserProfile {
  id: number;
  userId: number;
  avatar: PhotoResponse;
  coverPhotoUrl: string;
  workplace: string;
  firstName: string;
  lastName: string;
  school: string;
  hometown: string;
  friendshipStatus: string;
  isBlocked: boolean;
  friends: any[];
  photos: PhotoResponse[];
}