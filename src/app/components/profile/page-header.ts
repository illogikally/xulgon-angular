import { PhotoResponse } from "../share/photo/photo-response";
import { PhotoViewResponse } from "../share/photo/photo-view-response";

export interface PageHeader {
  id: number;
  userId: number;
  blocked: boolean;
  coverPhotoUrl: string;
  friendshipStatus: string;
  avatar: PhotoResponse;
  name: string;
}