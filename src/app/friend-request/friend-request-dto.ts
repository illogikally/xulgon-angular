export interface FriendRequestDto {
  id: number;
  requesterId: number;
  requesterProfileId: number;
  requesterAvatarUrl: string;
  requesterName: string;
  createdAgo: string;
  commonFriendCount: number;
}