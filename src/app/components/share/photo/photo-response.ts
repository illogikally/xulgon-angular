export interface PhotoResponse {
  id: number;
  userId: number;
  url: string;
  thumbnails: {[key: string]: any};
}
