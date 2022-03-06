import { PhotoResponse } from "../share/photo/photo-response";

export interface PageHeader {
  id: number;
  userId: number;
  blocked: boolean;
  coverPhotoUrl: string;
  friendshipStatus: string;
  avatar: PhotoResponse;
  name: string;

  avatarPhotoSetId: number;
}