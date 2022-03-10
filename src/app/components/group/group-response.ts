
export interface GroupResponse {
  id: number;
  coverPhotoUrl: string;
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