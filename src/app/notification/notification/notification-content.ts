import {UserBasic} from "../../shared/models/user-basic";

export interface NotificationContent {
  id: number;
  text: string;
  type: string;
  user: UserBasic
}
