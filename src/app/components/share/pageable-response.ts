export interface PageableResponse<T> {
  hasNext: boolean;
  size: number;
  offset: number;
  data: T[];
}