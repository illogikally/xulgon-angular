export interface FriendRequestDto {
  id: number;
  requesterId: number;
  requesterAvatarUrl: string;
  requesterName: string;
  createdAgo: string;
  commonFriendCount: number;
}