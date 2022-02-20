import { PhotoViewResponse } from "../share/photo/photo-view-response";

export interface PageHeader {
  id: number;
  userId: number;
  blocked: boolean;
  coverPhoto: string;
  friendshipStatus: string;
  avatar: PhotoViewResponse;
  name: string;
}