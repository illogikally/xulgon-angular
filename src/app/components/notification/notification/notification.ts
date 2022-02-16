import { NotificationType } from "./notification-type";

export interface Notification {
  id: number;
  createdAgo: string;
  type: string;
  actorId: number;
  actorFullName: string;
  actorAvatarUrl: string;
  actorCount: number;
  actorContentId: number;
  actorContentBody: string;
  isRead: boolean;
  recipientContentId: number;
  recipientContentBody: string;
  pageId: number;
  pageType: string;
}
