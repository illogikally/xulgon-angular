import { PhotoResponse } from "../shared/components/photo/photo-response";

export interface GroupResponse {
  id: number;
  coverPhotoUrl: string;
  coverLeftColor: string;
  coverRightColor: string;
  name: string;
  isHidden: boolean;
  isPrivate: boolean;
  isRequestSent: boolean;
  memberCount: number;
  role: string;
  isMember: boolean;
  isFollow: boolean;
  about: string;
}