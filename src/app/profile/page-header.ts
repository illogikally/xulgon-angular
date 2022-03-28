import {PhotoResponse} from "../shared/components/photo/photo-response";

export interface PageHeader {
  id: number;
  userId: number;
  blocked: boolean;
  coverPhoto: PhotoResponse | null;
  isFollow: boolean;
  friendshipStatus: string;
  avatar: PhotoResponse | null;
  name: string;

  avatarPhotoSetId: number;
}
