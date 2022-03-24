import {UserBasic} from "../../share/user-basic";

export interface NotificationContent {
  id: number;
  text: string;
  type: string;
  user: UserBasic
}
