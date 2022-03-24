import {PhotoResponse} from "../share/photo/photo-response";
import {UserDto} from "../share/user-dto";

export interface SharedContent {
  id: number;
  type: string;
  text: string;
  createdAt: string;
  user: UserDto;
  pageId: number;
  pageName: string;
  privacy: string;
  pageType: string;
  photoSetId: number;
  photos: PhotoResponse[];
  photoCount: number;
}
