export interface LoginResponse {
  token: string;
  refreshToken: string;
  expiresAt: Date;
  username: string;
  userId: number;
  profileId: number;
  avatarUrl: string;
}