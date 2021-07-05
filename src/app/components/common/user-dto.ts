export interface UserDto {
  id: number;
  profileId: number;
  isFollow: boolean;
  friendshipStatus: string;
  avatarUrl: string;
  workplace: string;
  hometown: string;
  school: string;
  username: string;
  commonFriendCount: number;
}