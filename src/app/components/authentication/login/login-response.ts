export interface LoginResponse {
  token: string;
  refreshToken: string;
  expiresAt: number;
  userFullName: string;
  username: string;
  userId: number;
  profileId: number;
  avatarUrl: string;
}