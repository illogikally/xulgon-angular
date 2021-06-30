export interface LoginResponse {
  token: string;
  refreshToken: string;
  expiresAt: Date;
  userFullName: string;
  username: string;
  userId: number;
  profileId: number;
  avatarUrl: string;
}