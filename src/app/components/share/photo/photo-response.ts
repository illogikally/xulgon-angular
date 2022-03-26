export interface PhotoResponse {
  id: number;
  userId: number;
  url: string;
  dominantColor?: string;
  thumbnails: {[key: string]: any};
}
