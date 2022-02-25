export interface OffsetResponse<T> {
  hasNext: boolean;
  size: number;
  offset: number;
  data: T[];
}