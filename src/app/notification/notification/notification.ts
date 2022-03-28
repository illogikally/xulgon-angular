import {UserBasic} from "../../shared/models/user-basic";
import {NotificationContent} from "./notification-content";
import {NotificationType} from "./notification-type";

export interface Notification {
  id: number;
  createdAgo: string;
  type: NotificationType;
  isRead: boolean;
  isPreviousRead: boolean;
  actorCount: number;

  pageId: number;
  pageType: string;
  pageName: string;

  actor: UserBasic;
  actorContent: NotificationContent;
  targetContent: NotificationContent;
  targetContetParent: NotificationContent
  rootContent: NotificationContent;

}
