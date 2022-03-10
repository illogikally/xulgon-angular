import { PhotoResponse } from "../share/photo/photo-response";

export interface PageHeader {
  id: number;
  userId: number;
  blocked: boolean;
  coverPhoto: PhotoResponse;
  isFollow: boolean;
  friendshipStatus: string;
  avatar: PhotoResponse;
  name: string;

  avatarPhotoSetId: number;
}