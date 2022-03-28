export interface PhotoResponse {
  id: number;
  userId: number;
  url: string;
  dominantColorLeft?: string;
  dominantColorRight?: string;
  thumbnails: {[key: string]: any};
}
